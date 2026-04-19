import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Save, X, Eye, LogOut } from 'lucide-react';
import type { BlogPost } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const STORAGE_KEY = 'blog_posts';

// Начальные данные из blog.ts
const initialPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'chto-vzyat-v-samolet-s-rebenkom-1-god',
    title: 'Что взять в самолет с ребенком 1 год',
    excerpt: 'Полный чек-лист вещей для перелета с малышом: от подгузников до развлечений, чтобы полет прошел спокойно.',
    content: '## Чек-лист в ручную кладь\n\n### Подгузники и гигиена\n- [ ] Подгузники на 24 часа (запас +50%)\n- [ ] Влажные салфетки (большая пачка)\n- [ ] Пеленки одноразовые (5-7 шт)\n- [ ] Крем под подгузник\n- [ ] Муслиновая пеленка (накрыть при кормлении)',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    category: 'Советы',
    readTime: '5 мин',
    tags: ['самолет', 'что взять', 'малыш', 'чек-лист'],
    createdAt: '2024-01-20'
  },
  {
    id: '2',
    slug: 'top-5-oteley-antalii-detskoy-animaciey',
    title: 'Топ-5 отелей Антальи с детской анимацией',
    excerpt: 'Лучшие отели Турции, где ваши дети будут заняты целый день, а вы сможете отдохнуть.',
    content: '## 1. Maxx Royal Belek Golf Resort\n\n**⭐ 5* | Собственный пляж | Все включено**\n\n### Для детей:\n- Baby club с 0 месяцев (няни included!)\n- Mini club (4-7 лет) — игры, творчество\n- Junior club (8-12 лет) — спорт, квесты\n- Teen club (13-17 лет) — дискотеки, активности',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    category: 'Подборки',
    readTime: '7 мин',
    tags: ['Турция', 'отели', 'анимация', 'дети'],
    createdAt: '2024-02-15'
  },
  {
    id: '3',
    slug: 'kak-otdohnut-s-detmi-ne-vyrodnitsya',
    title: 'Как отдохнуть с детьми и не выгореть',
    excerpt: 'Практические советы для родителей: как совместить заботу о детях с полноценным отдыхом.',
    content: '## Проблема: отдых с детьми ≠ отдых\n\nВы приехали на море, а через 3 дня устали больше, чем на работе? Это нормально! Но можно исправить.\n\n## 1. Выбирайте правильный отель\n\n### Что важно:\n- **Детский клуб** — дети заняты, вы отдыхаете\n- **Няня в отеле** — хотя бы несколько часов\n- **Все включено** — не думайте о готовке',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800',
    category: 'Советы',
    readTime: '6 мин',
    tags: ['родители', 'отдых', 'советы', 'психология'],
    createdAt: '2024-03-10'
  },
  {
    id: '4',
    slug: 'luchshie-strany-dlya-otdyha-s-detmi',
    title: 'Лучшие страны для отдыха с детьми: рейтинг 2024',
    excerpt: 'Топ-10 направлений для семейного отдыха: безопасность, инфраструктура, цены и впечатления.',
    content: '## Методология рейтинга\n\nОценивали по критериям:\n- Безопасность (25%)\n- Детская инфраструктура (25%)\n- Доступность (20%)\n- Развлечения (15%)\n- Погода (15%)\n\n## Топ-10 стран для отдыха с детьми\n\n### 1. Турция 🇹🇷\n**Рейтинг: 9.5/10**\n\n**Плюсы:**\n- Все включено — не готовить!\n- Детские клубы в каждом отеле\n- Положий вход в море\n- Недорого\n- Короткий перелет',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',
    category: 'Рейтинги',
    readTime: '8 мин',
    tags: ['рейтинг', 'страны', 'сравнение', 'куда поехать'],
    createdAt: '2024-04-05'
  }
];

const categories = ['Советы', 'Подборки', 'Рейтинги', 'Обзоры', 'Новости'];

export function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Загрузка постов при монтировании
  useEffect(() => {
    const checkAuth = sessionStorage.getItem('admin_auth');
    if (checkAuth === 'true') {
      setIsAuthenticated(true);
    }
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPosts(JSON.parse(stored));
    } else {
      setPosts(initialPosts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPosts));
    }
  }, []);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      toast.success('Вход выполнен!');
    } else {
      toast.error('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    toast.info('Вы вышли из системы');
  };

  const handleSavePost = () => {
    if (!editingPost.title || !editingPost.slug) {
      toast.error('Заполните обязательные поля');
      return;
    }

    const newPost: BlogPost = {
      id: editingPost.id || Date.now().toString(),
      slug: editingPost.slug || '',
      title: editingPost.title || '',
      excerpt: editingPost.excerpt || '',
      content: editingPost.content || '',
      image: editingPost.image || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
      category: editingPost.category || 'Советы',
      readTime: editingPost.readTime || '5 мин',
      tags: editingPost.tags || [],
      createdAt: editingPost.createdAt || new Date().toISOString().split('T')[0]
    };

    let updatedPosts;
    if (editingPost.id) {
      updatedPosts = posts.map(p => p.id === editingPost.id ? newPost : p);
      toast.success('Пост обновлен');
    } else {
      updatedPosts = [newPost, ...posts];
      toast.success('Пост создан');
    }

    setPosts(updatedPosts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
    setIsDialogOpen(false);
    setEditingPost({});
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот пост?')) {
      const updatedPosts = posts.filter(p => p.id !== id);
      setPosts(updatedPosts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
      toast.success('Пост удален');
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost({ ...post });
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setEditingPost({
      category: 'Советы',
      readTime: '5 мин',
      tags: []
    });
    setIsDialogOpen(true);
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!editingPost.tags?.includes(newTag)) {
        setEditingPost({
          ...editingPost,
          tags: [...(editingPost.tags || []), newTag]
        });
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditingPost({
      ...editingPost,
      tags: editingPost.tags?.filter(tag => tag !== tagToRemove)
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Админ-панель</CardTitle>
            <CardDescription>Введите пароль для доступа к управлению блогом</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Введите пароль"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Войти
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')} className="w-full">
              На главную
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
              <p className="text-sm text-gray-500">Управление записями блога</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate('/blog')}>
                <Eye className="w-4 h-4 mr-2" />
                Смотреть блог
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Всего постов</CardDescription>
              <CardTitle className="text-3xl">{posts.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Категорий</CardDescription>
              <CardTitle className="text-3xl">{new Set(posts.map(p => p.category)).size}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Последний пост</CardDescription>
              <CardTitle className="text-lg">{posts[0]?.createdAt || '-'}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Input
              placeholder="Поиск по названию..."
              onChange={(e) => {
                // Поиск можно реализовать дополнительно
              }}
            />
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Новый пост
          </Button>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">{post.createdAt}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.tags?.slice(0, 5).map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPost(post)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost.id ? 'Редактировать пост' : 'Новый пост'}
            </DialogTitle>
            <DialogDescription>
              Заполните информацию о записи блога
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Заголовок *</Label>
                <Input
                  id="title"
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  placeholder="Введите заголовок"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={editingPost.slug || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                  placeholder="transliterirovannyj-zagolovok"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Краткое описание</Label>
              <Textarea
                id="excerpt"
                value={editingPost.excerpt || ''}
                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                placeholder="Краткое описание для превью"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Select
                  value={editingPost.category}
                  onValueChange={(value) => setEditingPost({ ...editingPost, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="readTime">Время чтения</Label>
                <Input
                  id="readTime"
                  value={editingPost.readTime || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                  placeholder="5 мин"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL изображения</Label>
              <Input
                id="image"
                value={editingPost.image || ''}
                onChange={(e) => setEditingPost({ ...editingPost, image: e.target.value })}
                placeholder="https://..."
              />
              {editingPost.image && (
                <div className="mt-2">
                  <img 
                    src={editingPost.image} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=No+Image';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Теги (нажмите Enter для добавления)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editingPost.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <Input
                id="tags"
                onKeyDown={handleTagInput}
                placeholder="Добавить тег и нажать Enter"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Контент (Markdown)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  {previewMode ? 'Редактировать' : 'Предпросмотр'}
                </Button>
              </div>
              {previewMode ? (
                <div className="border rounded-lg p-4 min-h-[300px] bg-gray-50 prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap">{editingPost.content}</div>
                </div>
              ) : (
                <Textarea
                  id="content"
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  placeholder="Используйте Markdown для форматирования"
                  rows={12}
                  className="font-mono text-sm"
                />
              )}
              <p className="text-xs text-gray-500">
                Поддерживается Markdown: ## Заголовок, - список, **жирный**, *курсив*
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSavePost}>
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
