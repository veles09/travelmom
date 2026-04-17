import { Link } from 'react-router-dom';
import { Instagram, Send, Mail } from 'lucide-react';

const footerLinks = {
  navigation: [
    { path: '/', label: 'Главная' },
    { path: '/chat', label: 'AI-чат' },
    { path: '/routes', label: 'Маршруты' },
    { path: '/blog', label: 'Блог' },
  ],
  popularRoutes: [
    { path: '/routes/marshrut-po-sochi-s-rebenkom-2-goda', label: 'Сочи с ребенком' },
    { path: '/routes/kuda-poehat-v-turciyu-s-mladencem', label: 'Турция с младенцем' },
    { path: '/routes/praga-s-detmi-3-dnya', label: 'Прага с детьми' },
  ],
  blogPosts: [
    { path: '/blog/chto-vzyat-v-samolet-s-rebenkom-1-god', label: 'Что взять в самолет' },
    { path: '/blog/top-5-oteley-antalii-detskoy-animaciey', label: 'Отели Антальи' },
    { path: '/blog/kak-otdohnut-s-detmi-ne-vyrodnitsya', label: 'Отдых без стресса' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl">
                TravelMom<span className="text-green-400">.ai</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              AI поможет спланировать идеальное путешествие с детьми. 
              Быстро, удобно, с учетом всех потребностей вашей семьи.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-500 transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@travelmom.ai"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-500 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Навигация</h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Популярные маршруты</h3>
            <ul className="space-y-3">
              {footerLinks.popularRoutes.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Полезные статьи</h3>
            <ul className="space-y-3">
              {footerLinks.blogPosts.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 TravelMom.ai. Все права защищены.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-gray-500 hover:text-gray-400 transition-colors">
              Политика конфиденциальности
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-gray-400 transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
