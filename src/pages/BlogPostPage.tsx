import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MessageCircle, Share2, Bookmark, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { blogPosts } from '@/data/blog';
import { routes } from '@/data/routes';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 lg:pt-28 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Статья не найдена</h1>
          <Link to="/blog">
            <Button variant="outline">Вернуться в блог</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedRoutes = routes.filter(route => 
    route.tags.some(tag => post.tags.includes(tag))
  ).slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20">
      {/* Hero Image */}
      <div className="relative h-[50vh] lg:h-[60vh]">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Back Button */}
        <Link 
          to="/blog"
          className="absolute top-20 lg:top-24 left-4 lg:left-8 z-10 flex items-center gap-2 text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-black/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад в блог
        </Link>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-green-500 text-white">{post.category}</Badge>
              <Badge className="bg-white/20 text-white backdrop-blur-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </Badge>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, i) => (
                <span key={i} className="text-white/70 text-sm">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 lg:p-8">
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="prose prose-lg max-w-none">
                  {post.content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                    }
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
                    }
                    if (paragraph.startsWith('#### ')) {
                      return <h4 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">{paragraph.replace('#### ', '')}</h4>;
                    }
                    if (paragraph.startsWith('- [ ]') || paragraph.startsWith('- [x]')) {
                      return (
                        <div key={index} className="flex items-start gap-2 my-2">
                          <input type="checkbox" checked={paragraph.startsWith('- [x]')} readOnly className="mt-1" />
                          <span>{paragraph.replace('- [ ] ', '').replace('- [x] ', '')}</span>
                        </div>
                      );
                    }
                    if (paragraph.startsWith('- ')) {
                      return <li key={index} className="ml-4 my-1">{paragraph.replace('- ', '')}</li>;
                    }
                    if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ')) {
                      return <li key={index} className="ml-4 my-1 list-decimal">{paragraph.replace(/^\d\. /, '')}</li>;
                    }
                    if (paragraph.startsWith('|')) {
                      if (paragraph.includes('---')) return null;
                      const cells = paragraph.split('|').filter(Boolean).map(c => c.trim());
                      if (cells.length > 0 && !cells[0].includes('Расход') && !cells[0].includes('Страна')) {
                        return (
                          <div key={index} className="grid gap-4 py-2 border-b" style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}>
                            {cells.map((cell, i) => (
                              <div key={i} className={i === 0 ? 'font-medium' : ''}>{cell}</div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }
                    if (paragraph.trim() === '') {
                      return null;
                    }
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return <p key={index} className="font-bold text-gray-900 my-2">{paragraph.replace(/\*\*/g, '')}</p>;
                    }
                    return <p key={index} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>;
                  })}
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="mt-8 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 lg:p-8 text-white text-center">
              <h3 className="text-xl font-bold mb-2">
                Нужна помощь с планированием?
              </h3>
              <p className="text-white/80 mb-4">
                AI-консультант ответит на ваши вопросы и подберет идеальный вариант
              </p>
              <Link to="/chat">
                <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Задать вопрос AI
                </Button>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">О статье</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-gray-900" />
                    <div>
                      <div className="text-sm text-gray-500">Категория</div>
                      <div className="font-medium">{post.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-900" />
                    <div>
                      <div className="text-sm text-gray-500">Время чтения</div>
                      <div className="font-medium">{post.readTime}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500 mb-2">Теги:</div>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Routes */}
            {relatedRoutes.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Похожие маршруты</h3>
                  <div className="space-y-4">
                    {relatedRoutes.map((route) => (
                      <Link key={route.id} to={`/routes/${route.slug}`} className="block group">
                        <div className="aspect-video rounded-lg overflow-hidden mb-2">
                          <img
                            src={route.image}
                            alt={route.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h4 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                          {route.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-xl">
                    <Share2 className="w-4 h-4 mr-2" />
                    Поделиться
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-xl">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Сохранить
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
