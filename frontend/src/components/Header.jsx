import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = {
    about: {
      label: 'О компании',
      items: [
        { label: 'Коллекция растений', link: '/about/collection' },
        { label: 'Научная работа', link: '/about/science' },
        { label: 'Селекция', link: '/about/selection' },
        { label: 'Интродукция', link: '/about/introduction' },
        { label: 'Экскурсии', link: '/about/tours' },
        { label: 'СМИ о нас', link: '/about/media' },
        { label: 'Вакансии', link: '/about/vacancies' },
        { label: 'Наши публикации', link: '/about/publications' },
        { label: 'Выставка дендроарта', link: '/about/exhibition' },
      ]
    },
    useful: {
      label: 'Полезная информация',
      items: [
        { label: 'Посадка', link: '/useful/planting' },
        { label: 'Уход', link: '/useful/care' },
        { label: 'Защита', link: '/useful/protection' },
      ]
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Логотип */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="САДиК" 
              className="h-12 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <span className="text-xl font-bold text-green-700 hidden sm:block">САДиК</span>
            <span className="text-xl font-bold text-green-700 block sm:hidden">🌿</span>
          </Link>

          {/* Десктопное меню */}
          <nav className="hidden xl:flex items-center gap-6">
            <Link to="/catalog" className="text-gray-700 hover:text-green-600 font-medium transition whitespace-nowrap">
              Каталог
            </Link>

            {/* О компании */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenMenu('about')}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button className="text-gray-700 hover:text-green-600 font-medium transition flex items-center gap-1 whitespace-nowrap">
                О компании
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {openMenu === 'about' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100"
                  >
                    {menuItems.about.items.map((item) => (
                      <Link
                        key={item.link}
                        to={item.link}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/gallery" className="text-gray-700 hover:text-green-600 font-medium transition whitespace-nowrap">
              Галерея
            </Link>

            <Link to="/contacts" className="text-gray-700 hover:text-green-600 font-medium transition whitespace-nowrap">
              Как добраться
            </Link>

            {/* Полезная информация */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenMenu('useful')}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button className="text-gray-700 hover:text-green-600 font-medium transition flex items-center gap-1 whitespace-nowrap">
                Полезная информация
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {openMenu === 'useful' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100"
                  >
                    {menuItems.useful.items.map((item) => (
                      <Link
                        key={item.link}
                        to={item.link}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/price-list" className="text-gray-700 hover:text-green-600 font-medium transition whitespace-nowrap">
              Прайс
            </Link>
          </nav>

          {/* Телефон и админка */}
          <div className="hidden xl:flex items-center gap-4 flex-shrink-0">
            <a href="tel:+74951234567" className="text-gray-700 hover:text-green-600 font-medium whitespace-nowrap">
              +7 (495) 123-45-67
            </a>
            <Link to="/admin" className="text-sm text-gray-400 hover:text-green-600 transition">
              Админка
            </Link>
          </div>

          {/* Мобильное меню */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden text-gray-700 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Мобильное меню */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden pb-4 overflow-hidden border-t border-gray-200"
            >
              <div className="flex flex-col space-y-3 pt-4">
                <Link to="/catalog" className="text-gray-700 hover:text-green-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Каталог
                </Link>
                
                <div className="text-gray-700 font-medium">О компании</div>
                <div className="pl-4 flex flex-col space-y-2">
                  {menuItems.about.items.map((item) => (
                    <Link
                      key={item.link}
                      to={item.link}
                      className="text-sm text-gray-600 hover:text-green-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <Link to="/gallery" className="text-gray-700 hover:text-green-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Галерея
                </Link>

                <Link to="/contacts" className="text-gray-700 hover:text-green-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Как добраться
                </Link>

                <div className="text-gray-700 font-medium">Полезная информация</div>
                <div className="pl-4 flex flex-col space-y-2">
                  {menuItems.useful.items.map((item) => (
                    <Link
                      key={item.link}
                      to={item.link}
                      className="text-sm text-gray-600 hover:text-green-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <Link to="/price-list" className="text-gray-700 hover:text-green-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Прайс
                </Link>

                <div className="pt-4 border-t border-gray-200">
                  <a href="tel:+74951234567" className="text-gray-700 font-medium block">
                    +7 (495) 123-45-67
                  </a>
                  <Link to="/admin" className="text-sm text-gray-400 hover:text-green-600 transition block mt-2" onClick={() => setMobileMenuOpen(false)}>
                    Админка
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}