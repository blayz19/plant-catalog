import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import API from '../api/config';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ProductDetail() {
  const { id } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await API.get(`/products/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500 text-lg">🌲 Товар не найден</p>
        <Link to="/catalog" className="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Каталог', link: '/catalog' },
    ...(product.category ? [
      { label: product.category.nameRu, link: `/catalog/${product.category.id}` }
    ] : []),
    { label: product.nameRu },
  ];

  // ⭐ Функция для получения полного URL фото
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:5001${path}`;
  };

  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Фотографии */}
        <div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
  {product.media && product.media.length > 0 ? (
    <img
      src={getImageUrl(product.media[0].url)}
      alt={product.nameRu}
      className="w-full h-[400px] object-contain bg-white"
      onError={(e) => {
        console.error('❌ Ошибка загрузки фото:', getImageUrl(product.media[0].url));
        e.target.src = '';
        e.target.alt = '❌ Фото не загружено';
      }}
    />
  ) : (
    <div className="h-[400px] flex items-center justify-center bg-gray-100">
      <span className="text-8xl text-gray-300">🌲</span>
    </div>
  )}
</div>
          {product.media && product.media.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {product.media.slice(1).map((media) => (
                <img
                  key={media.id}
                  src={getImageUrl(media.url)}
                  alt={media.caption || product.nameRu}
                  className="w-full h-24 object-cover rounded-xl cursor-pointer hover:opacity-80 transition border-2 border-transparent hover:border-green-500"
                  onError={(e) => {
                    console.error('❌ Ошибка загрузки превью:', getImageUrl(media.url));
                    e.target.src = '';
                    e.target.alt = '❌';
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Информация о товаре */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.nameRu}</h1>
            {product.nameLat && (
              <p className="text-xl text-gray-500 italic mb-4">{product.nameLat}</p>
            )}

            {product.description && (
              <div className="prose prose-green max-w-none mb-6 bg-gray-50 p-4 rounded-xl">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {/* Характеристики */}
            {product.characteristics && Object.keys(product.characteristics).length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">📋 Характеристики</h3>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100 space-y-2">
                  {Object.entries(product.characteristics).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-gray-100 py-2 last:border-0">
                      <span className="text-gray-600">{key}</span>
                      <span className="font-medium text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Вариации */}
            {product.variations && product.variations.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">💰 Наличие и цены</h3>
                <div className="overflow-x-auto bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left rounded-tl-xl">Размер</th>
                        <th className="px-4 py-3 text-left">Цена (руб.)</th>
                        <th className="px-4 py-3 text-left rounded-tr-xl">Наличие (шт.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variations.map((variation, index) => (
                        <tr key={variation.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                          <td className="px-4 py-3 font-medium">{variation.size}</td>
                          <td className="px-4 py-3 text-green-700 font-semibold">
                            {variation.priceMin !== null && variation.priceMax !== null
                              ? `${variation.priceMin} - ${variation.priceMax}`
                              : variation.priceMin || variation.priceMax || 'по запросу'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              variation.stock > 0 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {variation.stock > 0 ? `${variation.stock} шт.` : '❌ нет'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <Link
              to="/price-list"
              className="inline-block px-8 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
            >
              📊 Полная таблица наличия и цен
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}