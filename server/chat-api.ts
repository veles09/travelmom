import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const folderId = process.env.YANDEX_FOLDER_ID;
    const apiKey = process.env.YANDEX_API_KEY;

    if (!folderId || !apiKey) {
      console.error('Missing Yandex credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const modelUri = `gpt://${folderId}/fvtasconocg1sp5qq25p`;

    const response = await fetch('https://yandex.net', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${apiKey}`,
        'x-folder-id': folderId,
      },
      body: JSON.stringify({
        modelUri,
        completionOptions: {
          stream: false,
          temperature: 0.6,
        },
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Yandex API error:', errorText);
      return res.status(response.status).json({ 
        error: 'Failed to get response from Yandex',
        details: errorText 
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Chat API server running on port ${PORT}`);
});
