/**
 * Non-Google AI Service
 * Calls Groq (Llama 3.3 70B / Qwen) directly with fallback to self-hosted Ollama (Llama 3.2 3B)
 */

interface CallLlmOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
}

export async function callFastLlm({
  prompt,
  systemInstruction,
  temperature = 0.3,
}: CallLlmOptions): Promise<string> {
  // Provider 1: Groq (Ultra-fast 300+ tokens/sec)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
      const messages: any[] = [];
      if (systemInstruction) {
        messages.push({ role: "system", content: systemInstruction });
      }
      messages.push({ role: "user", content: prompt });

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
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
        if (text) return text.trim();
      }
    } catch (err: any) {
      console.warn("[callFastLlm] Groq failed, falling back to Ollama:", err.message);
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
