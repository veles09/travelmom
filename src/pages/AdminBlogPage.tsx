import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { blogPosts } from '@/data/blog';
import type { BlogPost } from '@/types';

const categories = ['Советы', 'Подборки', 'Рейтинги', 'Чек-листы'];

export function AdminBlogPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: 'Советы',
    readTime: '5 мин',
    tags: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Заголовок обязателен';
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Краткое описание обязательно';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Содержимое статьи обязательно';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'URL изображения обязателен';
    } else {
      try {
        new URL(formData.image);
      } catch {
        newErrors.image = 'Некорректный URL изображения';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Создаем новую статью
    const newPost: BlogPost = {
      id: String(Date.now()),
      slug: formData.title
        .toLowerCase()
        .replace(/[^a-zа-яё0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-'),
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      image: formData.image,
      category: formData.category,
      readTime: formData.readTime,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    // Сохраняем в localStorage (в реальном приложении был бы API)
    const savedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    savedPosts.push(newPost);
    localStorage.setItem('blogPosts', JSON.stringify(savedPosts));
    
    console.log('Новая статья:', newPost);
    console.log('Всего статей в localStorage:', savedPosts.length);
    
    // Имитация задержки отправки
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    
    // Перенаправляем на страницу блога
    navigate('/blog');
  };

  const handleCancel = () => {
    navigate('/blog');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 lg:pt-28 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Добавить статью
              </h1>
              <p className="text-gray-300">
                Создайте новую статью для блога TravelMom.ai
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Информация о статье</CardTitle>
            <CardDescription>
              Заполните все поля для создания новой статьи
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Заголовок статьи *
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Например: Что взять в самолет с ребенком"
                  className={`h-12 ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  Краткое описание *
                </label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Краткое описание статьи для превью..."
                  rows={3}
                  className={`${errors.excerpt ? 'border-red-500' : ''}`}
                />
                {errors.excerpt && (
                  <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
                )}
              </div>

              {/* Category & Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Категория *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Время чтения *
                  </label>
                  <Input
                    id="readTime"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    placeholder="5 мин"
                    className="h-12"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  URL изображения *
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/photo-..."
                    className={`pl-10 h-12 ${errors.image ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
                {formData.image && !errors.image && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-2">Предпросмотр:</p>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden border">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '';
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Теги (через запятую)
                </label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="самолет, ребенок, чек-лист, советы"
                  className="h-12"
                />
                {formData.tags && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="bg-green-100 text-gray-900">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Содержимое статьи (Markdown) *
                </label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder={`## Заголовок раздела\n\nТекст статьи...\n\n### Подзаголовок\n\n- Пункт 1\n- Пункт 2`}
                  rows={15}
                  className={`font-mono text-sm ${errors.content ? 'border-red-500' : ''}`}
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Поддерживается Markdown синтаксис: ## заголовки, - списки, **жирный текст**
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4 mr-2" />
                  Отмена
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Опубликовать
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{blogPosts.length}</p>
                <p className="text-sm text-gray-500">Статей в блоге</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {new Set(blogPosts.map(p => p.category)).size}
                </p>
                <p className="text-sm text-gray-500">Категорий</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <Plus className="w-8 h-8 mx-auto text-green-500 mb-2" />
                <p className="text-sm text-gray-500">Создание новой статьи</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
