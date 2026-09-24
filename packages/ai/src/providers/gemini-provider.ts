export async function callGeminiProvider(
  prompt: string,
  model = process.env.GEMINI_MODEL || "gemini-3.6-flash"
): Promise<{ success: boolean; text: string; modelUsed: string; latencyMs: number }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const startTime = Date.now();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "JobMint/1.0" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
        },
      }),
    }
  );

  const latencyMs = Date.now() - startTime;

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const parts: any[] = data.candidates?.[0]?.content?.parts || [];
  const textPart = parts.find((p) => p.text && !p.thought);
  const text = (textPart ? textPart.text : parts[0]?.text || "").trim();
  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  return {
    success: true,
    text,
    modelUsed: model,
    latencyMs,
  };
}