import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { routes } from '@/data/routes';

const destinations = ['Все', 'Россия', 'Турция', 'Чехия', 'ОАЭ', 'Таиланд'];
const ageGroups = ['Все', '0-1 год', '1-3 года', '3-6 лет', '6-12 лет'];

export function RoutesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('Все');
  const [selectedAge, setSelectedAge] = useState('Все');

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDestination = selectedDestination === 'Все' || 
                              route.destination.includes(selectedDestination);
    
    const matchesAge = selectedAge === 'Все' || 
                      route.childAge.includes(selectedAge.split('-')[0]) ||
                      route.childAge.includes(selectedAge.split('-')[1]?.replace(' лет', ''));

    return matchesSearch && matchesDestination && matchesAge;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 lg:pt-28">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-500 to-rose-600 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Готовые маршруты с детьми
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Проверенные планы путешествий, составленные с учетом потребностей семей с детьми
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Поиск маршрутов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>

            {/* Destination Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {destinations.map((dest) => (
                <button
                  key={dest}
                  onClick={() => setSelectedDestination(dest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedDestination === dest
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          {/* Age Filter */}
          <div className="flex gap-2 overflow-x-auto mt-4">
            <span className="text-sm text-gray-500 py-2">Возраст:</span>
            {ageGroups.map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedAge === age
                    ? 'bg-rose-100 text-rose-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredRoutes.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Маршруты не найдены</h3>
            <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRoutes.map((route) => (
              <Link key={route.id} to={`/routes/${route.slug}`}>
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 h-full group">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={route.image}
                      alt={route.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                        {route.duration}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      {route.destination}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-500 transition-colors">
                      {route.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{route.excerpt}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {route.childAge}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {route.tags.slice(0, 3).map((tag, i) => (
                        <span 
                          key={i}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-12 text-center text-white">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Не нашли подходящий маршрут?
          </h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            AI-консультант поможет составить индивидуальный план путешествия под вашу семью
          </p>
          <Link to="/chat">
            <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white rounded-full">
              Подобрать индивидуально
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
