/**
 * Multi-Provider AI Service
 * Calls Groq (Llama 3.3 70B) or Gemini Flash directly with fallback to robust deterministic NLP
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
      console.warn("[callFastLlm] Groq failed, falling back to Gemini:", err.message);
    }
  }

  // Provider 2: Gemini Flash
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

      const contents: any[] = [];
      if (systemInstruction) {
        contents.push({ role: "user", parts: [{ text: `System: ${systemInstruction}\n\nTask:\n${prompt}` }] });
      } else {
        contents.push({ role: "user", parts: [{ text: prompt }] });
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature,
            maxOutputTokens: 1500,
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      }
    } catch (err: any) {
      console.warn("[callFastLlm] Gemini failed, falling back to deterministic:", err.message);
    }
  }

  return "";
}
