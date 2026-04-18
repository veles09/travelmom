import { useState, useRef } from 'react';
import { 
  Send, 
  Plus, 
  Trash2, 
  MessageSquare, 
  MapPin, 
  Star, 
  ArrowRight,
  Sparkles,
  Loader2,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/useChat';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import type { TourOption, ChatSession } from '@/types';
import { generateId } from '@/lib/utils';

// Mock AI response generator
const { sendMessage, sessions, currentSessionId, isLoading } = useChat();


interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Session extends ChatSession {
  messages: Message[];
}

export function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('travelmom-chat-sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTours, setCurrentTours] = useState<TourOption[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  // Helper functions defined first to avoid hoisting issues
  const createNewSession = () => {
    const newSession: Session = {
      id: generateId(),
      title: 'Новый разговор',
      messages: [{
        id: generateId(),
        role: 'assistant',
        content: 'Привет! Я AI-консультант TravelMom.ai. Расскажите мне о вашей семье, куда хотите поехать, возраст детей и бюджет — я подберу идеальные варианты отдыха! 🌴',
        timestamp: Date.now()
      }],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setCurrentTours([]);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId);
      setCurrentSessionId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim()) return;

    // Очищаем поле ввода
    if (!messageText) setInput('');

    // Вызываем sendMessage из хука useChat (тот самый, что идет в Яндекс)
    // Он сам обновит сессии и добавит сообщения на экран
    await sendMessage(text);
  };



  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gray-50 pt-16 lg:pt-20">
      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="flex flex-col h-full">
        <div className="p-4">
          <Button 
            onClick={createNewSession}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Новый чат
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  setCurrentSessionId(session.id);
                  setIsSidebarOpen(false);
                }}
                className={`group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${
                  currentSessionId === session.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{session.title}</div>
                  <div className="text-xs opacity-70">{formatDate(session.updatedAt)}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
        <div className="p-4">
          <Button 
            onClick={createNewSession}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Новый чат
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  setCurrentSessionId(session.id);
                  setIsSidebarOpen(false);
                }}
                className={`group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${
                  currentSessionId === session.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{session.title}</div>
                  <div className="text-xs opacity-70">{formatDate(session.updatedAt)}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 p-4 bg-white border-b">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-semibold">AI-консультант</span>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {currentSession?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-green-500 text-white'
                      : 'bg-white shadow-sm border border-gray-100'
                  }`}
                >
                  <div className={`text-sm ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI думает...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 bg-white border-t">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Расскажите о вашей поездке..."
              className="flex-1 h-12 rounded-xl"
              disabled={isLoading}
            />
            <Button 
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="h-12 w-12 bg-green-500 hover:bg-green-600 rounded-xl p-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            AI может допускать ошибки. Проверяйте важную информацию.
          </p>
        </div>
      </div>

      {/* Tours Sidebar */}
      <div className="hidden xl:block w-96 bg-white border-l border-gray-200 overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-500" />
            Подобранные варианты
          </h3>
        </div>
        
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-4 space-y-4">
            {currentTours.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">Начните диалог с AI, чтобы получить подборку отелей</p>
              </div>
            ) : (
              currentTours.map((tour) => (
                <Card key={tour.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{tour.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      {tour.location}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{tour.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-gray-400">({tour.reviews} отзывов)</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {tour.features.slice(0, 3).map((feature, i) => (
                        <span 
                          key={i}
                          className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tour.description}</p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-green-500">
                          {tour.price.toLocaleString()} {tour.currency}
                        </span>
                        <span className="text-sm text-gray-400">/неделя</span>
                      </div>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600 rounded-lg">
                        Подробнее
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
