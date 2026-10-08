/**
 * Non-Google AI Service
 * Calls Groq Multi-Key Pool (Qwen 27B / Llama 3.3) directly with fallback to self-hosted Ollama (Llama 3.2 3B)
 */

interface CallLlmOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
}

let currentKeyIndex = 0;

function getGroqKeys(): string[] {
  const multi = process.env.GROQ_API_KEYS
    ? process.env.GROQ_API_KEYS.split(",").map((k) => k.trim()).filter(Boolean)
    : [];
  const single = process.env.GROQ_API_KEY ? [process.env.GROQ_API_KEY.trim()] : [];
  return Array.from(new Set([...multi, ...single]));
}

export async function callFastLlm({
  prompt,
  systemInstruction,
  temperature = 0.3,
}: CallLlmOptions): Promise<string> {
  // Provider 1: Groq Key Pool
  const keys = getGroqKeys();
  const model = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

  if (keys.length > 0) {
    const messages: any[] = [];
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    for (let attempt = 0; attempt < keys.length; attempt++) {
      const idx = (currentKeyIndex + attempt) % keys.length;
      const apiKey = keys[idx]!;

      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "User-Agent": "RoleNest/1.0",
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens: 1500,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const text = json.choices?.[0]?.message?.content;
          if (text) {
            currentKeyIndex = (idx + 1) % keys.length;
            return text.trim();
          }
        } else {
          console.warn(`[callFastLlm] Groq key ${idx + 1}/${keys.length} returned status ${res.status}`);
        }
      } catch (err: any) {
        console.warn(`[callFastLlm] Groq key ${idx + 1}/${keys.length} network error: ${err.message}`);
      }
    }
  }

  // Provider 2: Self-Hosted Ollama (Llama 3.2 3B on OCI VM)
  const ollamaUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "llama3.2:3b";
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const fullPrompt = systemInstruction
      ? `System: ${systemInstruction}\n\nTask:\n${prompt}`
      : prompt;

    const res = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: ollamaModel,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature,
          num_predict: 1000,
        },
      }),
    });

    clearTimeout(timeoutId);
    if (res.ok) {
      const json = await res.json();
      const text = json.response?.trim();
      if (text) return text;
    }
  } catch (err: any) {
    console.warn("[callFastLlm] Ollama fallback failed:", err.message);
  }

  return "";
}
