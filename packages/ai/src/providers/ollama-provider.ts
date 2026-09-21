export async function callOllamaProvider(
  prompt: string,
  model = process.env.OLLAMA_MODEL || "llama3.2:3b"
): Promise<{ success: boolean; text: string; modelUsed: string; latencyMs: number }> {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const startTime = Date.now();

  // Fast-fail timeout (4 seconds) if Ollama is unreachable on VM
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        prompt: `System: You are an ATS resume improvement engine. Return only the revised, high-impact STAR bullet.\nUser: ${prompt}`,
        stream: false,
        options: {
          temperature: 0.2,
          num_predict: 500,
        },
      }),
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Ollama Error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const text = data.response?.trim() || "";
    if (!text) {
      throw new Error("Ollama returned empty response");
    }

    return {
      success: true,
      text,
      modelUsed: `OCI-Ollama-${model}`,
      latencyMs,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw new Error(`Ollama unreachable on ${baseUrl}: ${err.message}`);
  }
}