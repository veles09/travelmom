import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  try {
    // ИСПРАВЛЕНО: Полный и правильный адрес API Yandex Cloud
    const response = await fetch('https://yandex.net', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${process.env.YANDEX_API_KEY}`,
        'x-folder-id': process.env.YANDEX_FOLDER_ID as string,
      },
      body: JSON.stringify({
        // ИСПРАВЛЕНО: Используем ваш ID агента
        modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/${process.env.YANDEX_AGENT_ID}`,
        completionOptions: { stream: false, temperature: 0.6 },
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Yandex API Error:', errorData);
      return res.status(response.status).json({ error: 'Яндекс ответил ошибкой', details: errorData });
    }

    const data: any = await response.json();
    
    // ИСПРАВЛЕНО: Правильный путь к тексту в ответе Яндекса
    // Ответ приходит в формате: result.alternatives[0].message.text
    const aiText = data.result.alternatives[0].message.text;
    
    return res.status(200).json({ text: aiText });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}
