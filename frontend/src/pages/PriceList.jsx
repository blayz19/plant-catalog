import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/config';

export default function PriceList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    API.get('/products')
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(p => 
    p.nameRu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.nameLat && p.nameLat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Наличие и цены</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Поиск по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none w-64 bg-white/80 backdrop-blur-sm"
          />
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left rounded-tl-2xl">Название</th>
                <th className="px-6 py-4 text-left">Латинское</th>
                <th className="px-6 py-4 text-left">Цена</th>
                <th className="px-6 py-4 text-left rounded-tr-2xl">Наличие</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    🌲 Товары не найдены
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, i) => (
                  <motion.tr 
                    key={product.id} 
                    className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-green-50 transition-colors group`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <td className="px-6 py-4">
                      <Link 
                        to={`/product/${product.id}`} 
                        className="font-medium text-gray-800 group-hover:text-green-600 transition-colors hover:underline"
                      >
                        {product.nameRu}
                      </Link>
                    </td>
                    <td className="px-6 py-4 italic text-gray-500">{product.nameLat || '—'}</td>
                    <td className="px-6 py-4 font-semibold text-green-700">
                      {product.variations && product.variations.length > 0
                        ? `от ${Math.min(...product.variations.map(v => v.priceMin || 0))} ₽`
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {product.variations && product.variations.length > 0
                        ? (
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            {product.variations.reduce((sum, v) => sum + (v.stock || 0), 0)} шт.
                          </span>
                        )
                        : '—'}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}