export async function callGroqProvider(
  prompt: string,
  model = "llama-3.3-70b-versatile"
): Promise<{ success: boolean; text: string; modelUsed: string; latencyMs: number }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const startTime = Date.now();
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "You are an expert tech recruiter and ATS resume optimization engine. Return concise, professional responses following STAR principles without unnecessary conversational filler.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 800,
    }),
  });

  const latencyMs = Date.now() - startTime;

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim() || "";
  if (!text) {
    throw new Error("Groq returned empty response");
  }

  return {
    success: true,
    text,
    modelUsed: model,
    latencyMs,
  };
}