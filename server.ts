import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint для чата с Yandex AI Studio
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Сообщение не предоставлено' });
    }

    // Проверка наличия API ключа
    const apiKey = process.env.YANDEX_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.warn('YANDEX_API_KEY не настроен. Используем mock-ответ.');
      // Возвращаем mock-ответ для разработки без API ключа
      return res.json({
        response: generateMockResponse(message),
        tours: generateMockTours(message)
      });
    }

    try {
      // Запрос к Yandex AI Studio через Fetch API
      const yandexResponse = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Api-Key ${apiKey}`,
          'x-folder-id': process.env.YANDEX_FOLDER_ID || ''
        },
        body: JSON.stringify({
          modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/yandexgpt/latest`,
          completionOptions: {
            stream: false,
            temperature: 0.7,
            maxTokens: 2000
          },
          messages: [
            {
              role: 'system',
              text: 'Ты AI-консультант сервиса TravelMom.ai, помогающий семьям подобрать идеальный отдых с детьми. Ты дружелюбный, заботливый и даешь практические советы. Отвечай на русском языке.'
            },
            {
              role: 'user',
              text: message
            }
          ]
        })
      });

      if (!yandexResponse.ok) {
        throw new Error(`Ошибка Yandex API: ${yandexResponse.status}`);
      }

      const data = await yandexResponse.json();
      const aiResponse = data.result?.alternatives?.[0]?.message?.text || 'Извините, я не смог обработать ваш запрос.';

      res.json({
        response: aiResponse,
        tours: generateMockTours(message)
      });
    } catch (apiError) {
      console.error('Ошибка при вызове Yandex API:', apiError);
      // При ошибке API возвращаем mock-ответ
      console.warn('Используем mock-ответ из-за ошибки API');
      res.json({
        response: generateMockResponse(message),
        tours: generateMockTours(message),
        warning: 'AI временно недоступен, показываем примерные ответы'
      });
    }

  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
});

// Mock-функция для генерации ответа (используется при отсутствии API ключа)
function generateMockResponse(userMessage: string): string {
  const destinations = ['Турция', 'Сочи', 'ОАЭ', 'Таиланд', 'Египет'];
  const foundDestination = destinations.find(d => userMessage.toLowerCase().includes(d.toLowerCase())) || 'Турция';
  
  return `Отлично! Я подобрал для вас несколько вариантов отдыха в ${foundDestination} с детьми. Все отели имеют хорошие отзывы от семей с детьми аналогичного возраста, детские клубы и безопасные пляжи.`;
}

// Mock-функция для генерации туров
function generateMockTours(userMessage: string) {
  const destinations = ['Турция', 'Сочи', 'ОАЭ', 'Таиланд', 'Египет'];
  const foundDestination = destinations.find(d => userMessage.toLowerCase().includes(d.toLowerCase())) || 'Турция';
  
  return [
    {
      id: Date.now().toString() + '-1',
      name: 'Family Paradise Resort',
      location: `${foundDestination}, побережье`,
      price: Math.floor(Math.random() * 50000) + 60000,
      currency: '₽',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
      rating: 4.7 + Math.random() * 0.3,
      reviews: Math.floor(Math.random() * 300) + 100,
      features: ['Детский клуб', 'Аквапарк', 'Няни', 'All Inclusive'],
      description: 'Семейный курорт с собственным пляжем и развлечениями для детей всех возрастов. Пологий вход в море.'
    },
    {
      id: Date.now().toString() + '-2',
      name: 'Kids Friendly Hotel',
      location: `${foundDestination}, центр`,
      price: Math.floor(Math.random() * 40000) + 50000,
      currency: '₽',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400',
      rating: 4.5 + Math.random() * 0.4,
      reviews: Math.floor(Math.random() * 400) + 150,
      features: ['Мини-зоопарк', 'Детские бассейны', 'Анимация', 'Family Room'],
      description: 'Идеальный выбор для семей с маленькими детьми. Есть детское меню и круглосуточная няня.'
    },
    {
      id: Date.now().toString() + '-3',
      name: 'Sun & Beach Resort',
      location: `${foundDestination}, курортная зона`,
      price: Math.floor(Math.random() * 35000) + 45000,
      currency: '₽',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
      rating: 4.4 + Math.random() * 0.4,
      reviews: Math.floor(Math.random() * 250) + 80,
      features: ['Песчаный пляж', 'Игровые площадки', 'Семейные номера', 'SPA'],
      description: 'Уютный отель с пологим входом в море и большой территорией для прогулок. Отличные отзывы от семей.'
    }
  ];
}

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/chat`);
});

export default app;
