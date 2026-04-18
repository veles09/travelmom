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
    // Определяем ID сессии (берем текущую или создаем новую)
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = createNewSession();
    }

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    // 1. Сразу отображаем сообщение пользователя в чате
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
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
      // 2. Отправляем запрос к нашему API роуту (папка /api/chat)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Передаем текущее сообщение
          messages: [{ role: 'user', text: content }] 
        }),
      });

      if (!response.ok) throw new Error('Ошибка сервера');
      
      const data = await response.json();

      // 3. Формируем ответ ассистента
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.text || "Извините, я не смог получить ответ.",
        timestamp: Date.now()
      };

      // 4. Добавляем ответ ИИ в историю сообщений
      setSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, assistantMessage],
            updatedAt: Date.now()
          };
        }
        return session;
      }));

      // Пока возвращаем пустой массив туров (реальный поиск настроим позже)
      return []; 

    } catch (error) {
      console.error("Ошибка при запросе к ИИ:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, setSessions, createNewSession]);

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
