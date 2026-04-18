import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

try {
    const response = await fetch('https://yandex.net', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${process.env.YANDEX_API_KEY}`,
        'x-folder-id': process.env.YANDEX_FOLDER_ID as string,
      },
      body: JSON.stringify({
        modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/${process.env.YANDEX_AGENT_ID}`,
        completionOptions: { stream: false, temperature: 0.6 },
        messages: messages,
      }),
    });

    const data: any = await response.json();
    const aiText = data.result.alternatives[0].message.text;
    
    return res.status(200).json({ text: aiText });
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}
