import { useState, useCallback } from 'react';
import type { ChatMessage, ChatSession } from '@/types';
import { useLocalStorage } from './useLocalStorage';
import { generateId } from '@/lib/utils';



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
      const newSession: ChatSession = {
        id: generateId(),
        title: 'Новый разговор',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setSessions(prev => [newSession, ...prev]);
      sessionId = newSession.id;
      setCurrentSessionId(newSession.id);
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
          // Передаем сообщения в правильном формате для Yandex API
          messages: [{ role: 'user', text: content }] 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.details || 'Ошибка сервера');
      }
      
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
      // Добавляем сообщение об ошибке в чат
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: "Произошла ошибка при подключении к AI. Пожалуйста, попробуйте позже.",
        timestamp: Date.now()
      };
      setSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, errorMessage],
            updatedAt: Date.now()
          };
        }
        return session;
      }));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [setSessions, setCurrentSessionId]);

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
