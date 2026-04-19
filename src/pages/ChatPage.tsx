import { useState, useRef, useEffect } from 'react';
import { 
  Send, Plus, Trash2, MessageSquare, 
  Sparkles, Loader2, Menu 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/useChat';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
//import type { TourOption } from '@/types';

export function ChatPage() {
  // 1. Подключаем наш умный хук (теперь внутри компонента)
  const { 
    sendMessage, 
    sessions, 
    currentSession, 
    currentSessionId, 
    setCurrentSessionId, 
    createNewSession, 
    deleteSession, 
    isLoading 
  } = useChat();

  // 2. Оставляем только те стейты, которых нет в хуке
  const [input, setInput] = useState('');
  //const [currentTours, setCurrentTours] = useState<TourOption[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Автопрокрутка вниз при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  // 3. Исправленная функция отправки
  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim()) return;

    if (!messageText) setInput('');

    // Вызываем реальный запрос к Яндексу
    await sendMessage(text);
    
    // Если ИИ когда-нибудь вернет туры, мы их отобразим
    //if (tours && tours.length > 0) {
    //  setCurrentTours(tours);
    //}
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="flex h-screen pt-16 bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white">
        <div className="p-4">
          <Button 
            onClick={createNewSession}
            className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" /> Новый чат
          </Button>
        </div>
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer ${
                  currentSessionId === session.id ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => setCurrentSessionId(session.id)}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate">{session.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white md:m-4 md:rounded-2xl md:shadow-sm border md:h-[calc(100vh-8rem)] h-[calc(100vh-4rem)]">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Menu 
              className="h-6 w-6 text-slate-600 cursor-pointer" 
              onClick={() => setIsSidebarOpen(true)}
            />
            <span className="font-semibold text-slate-900">AI-консультант</span>
          </div>
          <Button variant="ghost" size="icon" onClick={createNewSession}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {!currentSessionId ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Ваш персональный тревел-эксперт</h2>
              <p className="text-slate-500">Начните новый чат, чтобы подобрать идеальный тур для вашей семьи</p>
              <Button onClick={createNewSession} className="bg-emerald-600 hover:bg-emerald-700">
                Создать первый чат
              </Button>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {currentSession?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 ${
                    message.role === 'user' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 text-slate-900'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <span className={`text-[10px] mt-2 block opacity-70 ${
                      message.role === 'user' ? 'text-emerald-50' : 'text-slate-500'
                    }`}>
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-2xl p-4 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    <span className="text-sm text-slate-500">Анализирую варианты...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-slate-50/50 md:rounded-b-2xl">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-3xl mx-auto relative"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Расскажите о вашей поездке..."
              className="pr-12 py-6 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
              disabled={!currentSessionId || isLoading}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || !currentSessionId || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 rounded-lg h-9 w-9"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            AI может допускать ошибки. Проверяйте важную информацию.
          </p>
        </div>
      </main>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <aside className="flex h-full flex-col bg-white">
            <div className="p-4 border-b">
              <Button 
                onClick={() => {
                  createNewSession();
                  setIsSidebarOpen(false);
                }}
                className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" /> Новый чат
              </Button>
            </div>
            <ScrollArea className="flex-1 px-2 py-4">
              <div className="space-y-1">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      currentSessionId === session.id ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
                    }`}
                    onClick={() => {
                      setCurrentSessionId(session.id);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <span className="truncate">{session.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </aside>
        </SheetContent>
      </Sheet>
    </div>
  );
}
