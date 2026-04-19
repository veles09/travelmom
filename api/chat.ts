import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Разрешаем CORS для локальной разработки
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  const { messages } = req.body;
  
  try {
    // ПРАВИЛЬНЫЙ URL для Yandex Foundation Models API
    const response = await fetch("https://llm.api.cloud.yandex.net/foundationModels/v1/completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Api-Key ${process.env.YANDEX_API_KEY}`,
        "x-folder-id": process.env.YANDEX_FOLDER_ID as string,
      },
      body: JSON.stringify({
        modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/yandexgpt/latest`,
        completionOptions: { stream: false, temperature: 0.6, maxTokens: 2000 },
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Yandex API Error:", errorData);
      return res.status(response.status).json({ error: "Яндекс ответил ошибкой", details: errorData });
    }

    const data: any = await response.json();
    
    // Правильный путь к тексту в ответе Яндекса
    const aiText = data.result?.alternatives?.[0]?.message?.text || "Извините, я не смог сгенерировать ответ.";
    
    return res.status(200).json({ text: aiText });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Внутренняя ошибка сервера", details: String(error) });
  }
}
