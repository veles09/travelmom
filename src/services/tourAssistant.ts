// Сервис для работы с OpenRouter API
// Использует бесплатные модели для подбора туров

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Системный промпт для помощника по турам
const SYSTEM_PROMPT = `Ты - полезный и дружелюбный AI-помощник сервиса TravelMom.ai, специализирующийся на подборе семейных туров с детьми.
Твоя задача:
1. Помогать пользователям подбирать направления для отдыха с учетом возраста детей, бюджета, предпочтений и сезона.
2. Давать конкретные рекомендации по странам, курортам, отелям и активностям для семей.
3. Учитывать безопасность, детскую инфраструктуру и удобство перелета.
4. Отвечать кратко, структурированно и доброжелательно.
5. Если информации недостаточно, задавай уточняющие вопросы (бюджет, возраст детей, желаемые даты, тип отдыха).

Не выдумывай несуществующие отели или цены, давай общие рекомендации и советы.`;

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface TourAssistantResponse {
  content: string;
  error?: string;
}

/**
 * Отправляет запрос к OpenRouter API для подбора тура
 * @param messages - История сообщений чата
 * @returns Ответ от ИИ
 */
export async function getTourRecommendation(messages: Message[]): Promise<TourAssistantResponse> {
  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key не настроен. Проверьте переменную окружения VITE_OPENROUTER_API_KEY');
    return {
      content: 'Извините, сервис временно недоступен. Пожалуйста, попробуйте позже.',
      error: 'API key не настроен'
    };
  }

  try {
    const allMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...messages
    ];

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'TravelMom.ai Tour Assistant'
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free', // Бесплатная модель от Google
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      
      if (response.status === 401) {
        return {
          content: 'Ошибка авторизации. Пожалуйста, проверьте настройки API ключа.',
          error: 'Unauthorized'
        };
      }
      
      if (response.status === 429) {
        return {
          content: 'Слишком много запросов. Пожалуйста, подождите немного и попробуйте снова.',
          error: 'Rate limit exceeded'
        };
      }

      return {
        content: 'Произошла ошибка при подключении к сервису. Попробуйте еще раз.',
        error: errorData.error?.message || 'Unknown error'
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'Извините, я не смог сформировать ответ.';

    return { content };
  } catch (error) {
    console.error('Network error:', error);
    return {
      content: 'Ошибка соединения. Проверьте подключение к интернету и попробуйте снова.',
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

/**
 * Альтернативные бесплатные модели на OpenRouter
 * Можно использовать вместо 'google/gemma-2-9b-it:free':
 * - 'meta-llama/llama-3-8b-instruct:free'
 * - 'mistralai/mistral-7b-instruct:free'
 * - 'google/gemma-7b-it:free'
 */
export const FREE_MODELS = [
  'google/gemma-2-9b-it:free',
  'meta-llama/llama-3-8b-instruct:free',
  'mistralai/mistral-7b-instruct:free'
];
