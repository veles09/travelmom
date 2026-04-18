import { useState, useCallback } from 'react';
import type { ChatMessage, ChatSession, TourOption } from '@/types';
import { useLocalStorage } from './useLocalStorage';
import { generateId } from '@/lib/utils';

const generateMockResponse = (): { message: string; tours: TourOption[] } => {
  const responses = [
    {
      message: `Отлично! Я подобрал для вас несколько вариантов отдыха с детьми. Все отели имеют хорошие отзывы от семей с детьми аналогичного возраста.`,
      tours: [
        {
          id: generateId(),
          name: 'Family Resort & Spa',
          location: 'Анталья, Турция',
          price: 85000,
          currency: '₽',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
          rating: 4.8,
          reviews: 324,
          features: ['Детский клуб', 'Аквапарк', 'Няни'],
          description: 'Семейный курорт с собственным пляжем и развлечениями для детей всех возрастов.'
        },
        {
          id: generateId(),
          name: 'Kids Paradise Hotel',
          location: 'Белек, Турция',
          price: 92000,
          currency: '₽',
          image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400',
          rating: 4.9,
          reviews: 512,
          features: ['Мини-зоопарк', 'Детские бассейны', 'Анимация'],
          description: 'Идеальный выбор для семей с маленькими детьми. Есть детское меню и круглосуточная няня.'
        },
        {
          id: generateId(),
          name: 'Sun & Fun Resort',
          location: 'Сиде, Турция',
          price: 78000,
          currency: '₽',
          image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
          rating: 4.6,
          reviews: 189,
          features: ['Песчаный пляж', 'Игровые площадки', 'Семейные номера'],
          description: 'Уютный отель с пологим входом в море и большой территорией для прогулок.'
        }
      ]
    }
  ];
  return responses[0];
};

export function useChat() {
  const [sessions, setSessions] = useLocalStorage<ChatSession[]>('travelmom-chat-sessions', []);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'Новый разговор',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  }, [setSessions]);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  }, [setSessions, currentSessionId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentSessionId) {
      createNewSession();
    }

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        return {
          ...session,
          messages: [...session.messages, userMessage],
          title: session.title === 'Новый разговор' ? content.slice(0, 30) + '...' : session.title,
          updatedAt: Date.now()
        };
      }
      return session;
    }));

    setIsLoading(true);

    try {
      // Форматируем сообщения для Yandex API
      const yandexMessages = sessions
        .find(s => s.id === currentSessionId)?.messages
        .concat(userMessage)
        .map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          text: msg.content
        })) || [];

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: yandexMessages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      
      // Извлекаем текст ответа из формата Yandex
      let assistantContent = '';
      if (data.result?.alternatives?.[0]?.message?.role === 'assistant') {
        assistantContent = data.result.alternatives[0].message.text || '';
      } else if (data.result?.alternatives?.[0]?.text) {
        assistantContent = data.result.alternatives[0].text;
      } else {
        assistantContent = 'Извините, не удалось получить ответ.';
      }

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: assistantContent,
        timestamp: Date.now()
      };

      setSessions(prev => prev.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, userMessage, assistantMessage],
            updatedAt: Date.now()
          };
        }
        return session;
      }));

      // Возвращаем пустой массив туров (можно доработать парсинг ответов Yandex)
      return [];
    } catch (error) {
      console.error('Chat error:', error);
      
      // При ошибке добавляем сообщение об ошибке
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Произошла ошибка при получении ответа. Пожалуйста, попробуйте позже.',
        timestamp: Date.now()
      };

      setSessions(prev => prev.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, userMessage, errorMessage],
            updatedAt: Date.now()
          };
        }
        return session;
      }));

      return [];
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, setSessions, createNewSession, sessions]);

  return {
    sessions,
    currentSession,
    currentSessionId,
    setCurrentSessionId,
    createNewSession,
    deleteSession,
    sendMessage,
    isLoading
  };
}
