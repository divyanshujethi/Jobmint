let currentKeyIndex = 0;

function getGroqKeys(): string[] {
  const multi = process.env.GROQ_API_KEYS
    ? process.env.GROQ_API_KEYS.split(",").map((k) => k.trim()).filter(Boolean)
    : [];
  const single = process.env.GROQ_API_KEY ? [process.env.GROQ_API_KEY.trim()] : [];
  return Array.from(new Set([...multi, ...single]));
}

export async function callGroqProvider(
  prompt: string,
  model = process.env.GROQ_MODEL || "qwen/qwen3.8-27b"
): Promise<{ success: boolean; text: string; modelUsed: string; latencyMs: number }> {
  const keys = getGroqKeys();
  if (keys.length === 0) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const startTime = Date.now();
  let lastError: Error | null = null;

  // Round-robin with automatic failover across all configured accounts
  for (let attempt = 0; attempt < keys.length; attempt++) {
    const idx = (currentKeyIndex + attempt) % keys.length;
    const apiKey = keys[idx]!;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "RoleNest/1.0",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                "You are an expert tech recruiter and ATS resume optimization engine. Return concise, professional responses following STAR principles without unnecessary conversational filler.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 1200,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[Groq Pool] Key ${idx + 1}/${keys.length} error (${response.status}): ${errorText.substring(0, 100)}`);
        lastError = new Error(`Groq API Error (${response.status}): ${errorText}`);
        continue;
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content?.trim() || "";
      if (!text) {
        lastError = new Error("Groq returned empty response");
        continue;
      }

      // Rotate to next key on success to distribute load evenly
      currentKeyIndex = (idx + 1) % keys.length;

      return {
        success: true,
        text,
        modelUsed: model,
        latencyMs: Date.now() - startTime,
      };
    } catch (err: any) {
      lastError = err;
      console.warn(`[Groq Pool] Key ${idx + 1}/${keys.length} network error: ${err.message}`);
    }
  }

  throw lastError || new Error("All Groq API keys in pool failed or are rate limited");
}