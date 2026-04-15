import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { routes } from '@/data/routes';
import { blogPosts } from '@/data/blog';

export function RouteDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const route = routes.find(r => r.slug === slug);

  if (!route) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 lg:pt-28 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Маршрут не найден</h1>
          <Link to="/routes">
            <Button variant="outline">Вернуться к маршрутам</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter(post => 
    post.tags.some(tag => route.tags.includes(tag))
  ).slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20">
      {/* Hero Image */}
      <div className="relative h-[50vh] lg:h-[60vh]">
        <img
          src={route.image}
          alt={route.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Back Button */}
        <Link 
          to="/routes"
          className="absolute top-20 lg:top-24 left-4 lg:left-8 z-10 flex items-center gap-2 text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-black/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к маршрутам
        </Link>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-rose-500 text-white">{route.duration}</Badge>
              {route.tags.map((tag, i) => (
                <Badge key={i} className="bg-white/20 text-white backdrop-blur-sm">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              {route.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <div className="flex items-center gap-1">
                <MapPin className="w-5 h-5" />
                {route.destination}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-5 h-5" />
                Для детей {route.childAge}
              </div>
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
                  {route.excerpt}
                </p>
                
                <div className="prose prose-lg max-w-none">
                  {route.content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                    }
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
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
                      return <li key={index} className="ml-4">{paragraph.replace('- ', '')}</li>;
                    }
                    if (paragraph.startsWith('|')) {
                      // Skip table separator lines
                      if (paragraph.includes('---')) return null;
                      const cells = paragraph.split('|').filter(Boolean).map(c => c.trim());
                      if (cells.length > 0 && !cells[0].includes('Расход')) {
                        return (
                          <div key={index} className="grid grid-cols-3 gap-4 py-2 border-b">
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
                    return <p key={index} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>;
                  })}
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="mt-8 bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-6 lg:p-8 text-white text-center">
              <h3 className="text-xl font-bold mb-2">
                Хотите похожий маршрут?
              </h3>
              <p className="text-white/80 mb-4">
                AI подберет варианты специально для вашей семьи
              </p>
              <Link to="/chat">
                <Button className="bg-white text-rose-500 hover:bg-gray-100 rounded-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Подобрать похожий тур
                </Button>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Краткая информация</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-rose-500" />
                    <div>
                      <div className="text-sm text-gray-500">Направление</div>
                      <div className="font-medium">{route.destination}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-rose-500" />
                    <div>
                      <div className="text-sm text-gray-500">Длительность</div>
                      <div className="font-medium">{route.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-rose-500" />
                    <div>
                      <div className="text-sm text-gray-500">Возраст детей</div>
                      <div className="font-medium">{route.childAge}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Полезные статьи</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((post) => (
                      <Link key={post.id} to={`/blog/${post.slug}`} className="block group">
                        <div className="aspect-video rounded-lg overflow-hidden mb-2">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h4 className="font-medium text-gray-900 group-hover:text-rose-500 transition-colors line-clamp-2">
                          {post.title}
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
