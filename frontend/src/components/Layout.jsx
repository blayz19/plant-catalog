import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-green-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent hover:scale-105 transition-transform inline-block">
              🌿 САДиК
            </Link>
          </motion.div>
          
          <motion.nav 
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors font-medium relative group">
              Главная
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/catalog" className="text-gray-600 hover:text-green-600 transition-colors font-medium relative group">
              Каталог
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/price-list" className="text-gray-600 hover:text-green-600 transition-colors font-medium relative group">
              Наличие и цены
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </motion.nav>
        </div>
      </header>
      
      <motion.main 
        className="flex-grow container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Outlet />
      </motion.main>
      
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold mb-3">🌿 САДиК</h3>
              <p className="text-gray-400">Коллекционные сорта кедров и сосен</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-300">Контакты</h4>
              <p className="text-gray-400">+7 (XXX) XXX-XX-XX</p>
              <p className="text-gray-400">info@sadik.ru</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-300">Информация</h4>
              <p className="text-gray-400">© 2026 Все права защищены</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}