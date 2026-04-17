import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Users, 
  Wallet, 
  ArrowRight,
  Star,
  CheckCircle2,
  Sparkles,
  Clock,
  Shield,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { routes } from '@/data/routes';
import { blogPosts } from '@/data/blog';

const testimonials = [
  {
    id: '1',
    name: 'Анна М.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    text: 'AI подобрал идеальный отель в Турции для нашей семьи с двумя детьми. Все учел — от возраста до бюджета. Отдых был волшебным!',
    location: 'Москва',
    rating: 5
  },
  {
    id: '2',
    name: 'Елена К.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    text: 'Никогда не думала, что планирование отпуска может быть таким простым. За 5 минут получила готовый маршрут по Сочи с ребенком 3 лет.',
    location: 'Санкт-Петербург',
    rating: 5
  },
  {
    id: '3',
    name: 'Марина П.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    text: 'Благодаря TravelMom.ai нашли отель с няней в комплекте. Наконец-то смогла отдохнуть на отдыхе!',
    location: 'Казань',
    rating: 5
  }
];

const features = [
  {
    icon: Sparkles,
    title: 'AI-подбор',
    description: 'Искусственный интеллект анализирует ваши предпочтения и находит идеальные варианты'
  },
  {
    icon: Clock,
    title: 'Экономия времени',
    description: 'Получите готовый план путешествия за 2 минуты вместо нескольких дней поиска'
  },
  {
    icon: Shield,
    title: 'Проверенные отели',
    description: 'Все варианты проверены на наличие детской инфраструктуры и безопасности'
  },
  {
    icon: Heart,
    title: 'С учетом детей',
    description: 'Подбор с учетом возраста детей, их интересов и потребностей'
  }
];

export function HomePage() {
  const [formData, setFormData] = useState({
    destination: '',
    dates: '',
    childrenCount: '',
    childrenAges: '',
    budget: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store form data and redirect to chat
    localStorage.setItem('travelmom-quick-start', JSON.stringify(formData));
    window.location.href = '/chat';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920"
            alt="Family vacation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">AI-планирование путешествий</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                AI подберет идеальное путешествие{' '}
                <span className="text-green-400">с детьми</span> за 2 минуты
              </h1>
              
              <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl">
                Расскажите о вашей семье, а мы найдем лучшие отели, составим маршрут 
                и учтем все потребности ваших детей.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Бесплатно</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Без регистрации</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Мгновенный результат</span>
                </div>
              </div>

              <Link to="/chat">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8 text-lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Начать подбор
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Right: Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Быстрый старт</h2>
              <p className="text-gray-500 mb-6">Заполните форму — AI сделает все остальное</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Куда хотите поехать?
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Например: Турция, Сочи, Прага..."
                      className="pl-10 h-12 rounded-xl"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Когда планируете поездку?
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Например: Июль 2024, или точные даты"
                      className="pl-10 h-12 rounded-xl"
                      value={formData.dates}
                      onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Сколько детей?
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="1, 2..."
                        className="pl-10 h-12 rounded-xl"
                        value={formData.childrenCount}
                        onChange={(e) => setFormData({ ...formData, childrenCount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Возраст
                    </label>
                    <Input
                      placeholder="2, 5 лет"
                      className="h-12 rounded-xl"
                      value={formData.childrenAges}
                      onChange={(e) => setFormData({ ...formData, childrenAges: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Примерный бюджет
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Например: до 100 000 ₽"
                      className="pl-10 h-12 rounded-xl"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-xl text-lg font-semibold"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Подобрать тур
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">500+</div>
              <div className="text-gray-600">Семей отдохнули</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">50+</div>
              <div className="text-gray-600">Направлений</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">2 мин</div>
              <div className="text-gray-600">На подбор</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">4.9</div>
              <div className="text-gray-600">Рейтинг сервиса</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Как работает TravelMom.ai
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Мы используем искусственный интеллект, чтобы сделать планирование 
              семейного отдыха простым и приятным
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Готовые маршруты
              </h2>
              <p className="text-gray-600">Проверенные планы путешествий для семей с детьми</p>
            </div>
            <Link to="/routes">
              <Button variant="outline" className="rounded-full">
                Все маршруты
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {routes.slice(0, 4).map((route) => (
              <Link key={route.id} to={`/routes/${route.slug}`}>
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={route.image}
                      alt={route.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      {route.destination}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{route.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{route.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Полезные советы
              </h2>
              <p className="text-gray-600">Статьи для родителей, планирующих путешествие с детьми</p>
            </div>
            <Link to="/blog">
              <Button variant="outline" className="rounded-full">
                Все статьи
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts.slice(0, 4).map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                        {post.category}
                      </span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-green-500 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Что говорят мамы
            </h2>
            <p className="text-lg text-white/80">
              Уже более 500 семей спланировали отдых с помощью TravelMom.ai
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Готовы спланировать идеальное путешествие?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Начните чат с AI прямо сейчас и получите персональные рекомендации 
            для вашей семьи за пару минут
          </p>
          <Link to="/chat">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8 text-lg">
              <MessageCircle className="w-5 h-5 mr-2" />
              Начать подбор
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
