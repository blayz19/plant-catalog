import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/config';

export default function Home() {
  const [popularProducts, setPopularProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, bannersRes] = await Promise.all([
          API.get('/products?isPopular=true&limit=6'),
          API.get('/banners')
        ]);
        setPopularProducts(productsRes.data);
        setBanners(bannersRes.data);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Автопрокрутка слайдера
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Функция для URL фото
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:5001${path}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div>
      {/* ========== СЛАЙДЕР / ЗАГЛУШКА ========== */}
      <div className="relative mb-16 rounded-3xl overflow-hidden shadow-2xl h-[400px] bg-gradient-to-r from-green-600 via-emerald-500 to-green-600">
        {banners.length > 0 ? (
          // === ЕСЛИ БАННЕРЫ ЕСТЬ — ПОКАЗЫВАЕМ СЛАЙДЕР ===
          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="relative w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {banners[currentSlide]?.link ? (
                  <a href={banners[currentSlide].link} className="block w-full h-full">
                    <img
                      src={getImageUrl(banners[currentSlide].imageUrl)}
                      alt={banners[currentSlide].title}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ) : (
                  <img
                    src={getImageUrl(banners[currentSlide].imageUrl)}
                    alt={banners[currentSlide].title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-12">
                  <h3 className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg text-center px-4">
                    {banners[currentSlide].title}
                  </h3>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Кнопки навигации */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition z-10"
                >
                  ◀
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition z-10"
                >
                  ▶
                </button>

                {/* Точки */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentSlide 
                          ? 'bg-white w-8' 
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          // === ЕСЛИ БАННЕРОВ НЕТ — ПОКАЗЫВАЕМ ЗАГЛУШКУ ===
          <div className="relative w-full h-full flex flex-col items-center justify-center text-white px-4">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            <div className="relative z-10 text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                🌿 Коллекционные кедры и сосны
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Уникальные сорта для вашего сада
              </p>
              <Link
                to="/catalog"
                className="inline-block bg-white text-green-700 px-10 py-4 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                🌲 Смотреть каталог →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ========== БАННЕР "ДЛЯ БИЗНЕСА" ========== */}
      <Link 
        to="/business" 
        className="block relative mb-16 rounded-2xl overflow-hidden shadow-xl group"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-12 text-center">
          <div className="absolute inset-0 bg-white/5"></div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 relative z-10">
            🌱 Для бизнеса
          </h3>
          <p className="text-white/90 text-lg mb-4 relative z-10">
            Оптовые поставки, сотрудничество и партнерство
          </p>
          <span className="inline-block px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:shadow-xl transition relative z-10">
            Подробнее →
          </span>
        </div>
      </Link>

      {/* ========== БЛОК ПОПУЛЯРНЫХ ТОВАРОВ ========== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            ⭐ Популярные сорта
          </h2>
          <Link to="/catalog" className="text-green-600 hover:text-green-700 font-medium hover:underline transition">
            Смотреть все →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg h-80 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-2xl"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : popularProducts.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100">
            <p className="text-gray-500 text-lg">
              Пока нет популярных товаров. 
              <br />
              <Link to="/admin/products" className="text-green-600 hover:underline font-medium">
                Добавьте их в админке
              </Link>
              , отметив галочкой "Популярный товар"
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {popularProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="h-full"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full flex flex-col"
                >
                  <div className="relative bg-white h-56 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {product.media && product.media.length > 0 ? (
                      <img
                        src={getImageUrl(product.media[0].url)}
                        alt={product.nameRu}
                        className="w-full h-full object-contain bg-white"
                        onError={(e) => {
                          e.target.src = '';
                          e.target.alt = '🌲';
                        }}
                      />
                    ) : (
                      <span className="text-6xl text-gray-400">🌲</span>
                    )}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      ⭐ Хит
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">
                      {product.nameRu}
                    </h3>
                    {product.nameLat && (
                      <p className="text-sm text-gray-500 italic line-clamp-1">{product.nameLat}</p>
                    )}
                    <div className="flex-grow"></div>
                    {product.variations && product.variations.length > 0 && (
                      <p className="text-green-700 font-bold text-lg mt-2">
                        от {Math.min(...product.variations.map(v => v.priceMin || 0))} ₽
                      </p>
                    )}
                    <div className="mt-3 w-full h-0.5 bg-gradient-to-r from-green-200 to-transparent group-hover:from-green-400 transition-all duration-300"></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}