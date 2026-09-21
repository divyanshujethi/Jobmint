export async function callCloudflareWorkersAI(
  prompt: string,
  model = "@cf/meta/llama-3.2-3b-instruct"
): Promise<{ success: boolean; text: string; modelUsed: string; latencyMs: number }> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.R2_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required for Workers AI");
  }

  const startTime = Date.now();
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are an expert ATS optimization engine. Output direct, high-impact resume improvements.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 800,
        temperature: 0.2,
      }),
    }
  );

  const latencyMs = Date.now() - startTime;

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudflare Workers AI Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.result?.response?.trim() || "";
  if (!text) {
    throw new Error("Cloudflare Workers AI returned empty text");
  }

  return {
    success: true,
    text,
    modelUsed: model,
    latencyMs,
  };
}