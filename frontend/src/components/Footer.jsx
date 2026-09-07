import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold mb-3">🌿 САДиК</h3>
            <p className="text-gray-400">Коллекционные сорта кедров и сосен</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-300">Навигация</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/catalog" className="hover:text-white transition">Каталог</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition">Галерея</Link></li>
              <li><Link to="/contacts" className="hover:text-white transition">Как добраться</Link></li>
              <li><Link to="/price-list" className="hover:text-white transition">Прайс</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-300">Контакты</h4>
            <p className="text-gray-400">+7 (495) 123-45-67</p>
            <p className="text-gray-400">info@sadik.ru</p>
            <div className="flex justify-center md:justify-start gap-4 mt-3">
              <a href="#" className="text-gray-400 hover:text-white transition text-2xl">📱</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-2xl">📺</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-2xl">✈️</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-300">Информация</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/privacy" className="hover:text-white transition">Политика конфиденциальности</Link></li>
              <li><span className="text-gray-500">© 2026 Все права защищены</span></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}