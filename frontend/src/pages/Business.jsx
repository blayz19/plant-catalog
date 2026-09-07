import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Business() {
  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
        ← Назад
      </Link>
      
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white mb-8">
        <h1 className="text-5xl font-bold mb-4">🌱 Для бизнеса</h1>
        <p className="text-xl text-white/90">Оптовые поставки, сотрудничество и партнерство</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="text-5xl mb-4">🌿</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Оптовые поставки</h3>
          <p className="text-gray-600">Крупные партии растений для ландшафтных проектов</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="text-5xl mb-4">🤝</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Партнерство</h3>
          <p className="text-gray-600">Сотрудничество с питомниками и садовыми центрами</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Индивидуальные условия</h3>
          <p className="text-gray-600">Гибкая система скидок и специальные предложения</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Свяжитесь с нами</h2>
        <p className="text-gray-600 mb-6">Для обсуждения условий сотрудничества</p>
        <a 
          href="mailto:business@sadik.ru" 
          className="inline-block px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium"
        >
          business@sadik.ru
        </a>
      </div>
    </motion.div>
  );
}