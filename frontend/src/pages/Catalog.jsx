import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/config';

export default function Catalog() {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt_desc');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoriesRes = await API.get('/categories');
        const flatCategories = categoriesRes.data;
        setCategories(flatCategories);

        let targetCategoryId = categoryId;
        
        if (categoryId) {
          const currentCategory = flatCategories.find(c => c.id === parseInt(categoryId));
          
          if (currentCategory && !currentCategory.isFinal) {
            const getAllFinalChildren = (parentId) => {
              const children = flatCategories.filter(c => c.parentId === parentId);
              let result = [];
              for (const child of children) {
                if (child.isFinal) {
                  result.push(child.id);
                } else {
                  result = [...result, ...getAllFinalChildren(child.id)];
                }
              }
              return result;
            };
            const finalIds = getAllFinalChildren(parseInt(categoryId));
            if (finalIds.length > 0) {
              targetCategoryId = finalIds.join(',');
            } else {
              targetCategoryId = null;
            }
          }
        }

        let url = '/products';
        const params = new URLSearchParams();
        
        if (targetCategoryId) {
          params.append('categoryId', targetCategoryId);
        }
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const productsRes = await API.get(url);
        
        // Сортировка
        let sortedProducts = [...productsRes.data];
        switch (sortBy) {
          case 'price_asc':
            sortedProducts.sort((a, b) => {
              const minA = Math.min(...(a.variations?.map(v => v.priceMin) || [0]));
              const minB = Math.min(...(b.variations?.map(v => v.priceMin) || [0]));
              return minA - minB;
            });
            break;
          case 'price_desc':
            sortedProducts.sort((a, b) => {
              const minA = Math.min(...(a.variations?.map(v => v.priceMin) || [0]));
              const minB = Math.min(...(b.variations?.map(v => v.priceMin) || [0]));
              return minB - minA;
            });
            break;
          case 'name_asc':
            sortedProducts.sort((a, b) => a.nameRu.localeCompare(b.nameRu));
            break;
          case 'name_desc':
            sortedProducts.sort((a, b) => b.nameRu.localeCompare(a.nameRu));
            break;
          case 'createdAt_asc':
            sortedProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
          case 'createdAt_desc':
          default:
            sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        }
        setProducts(sortedProducts);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, searchQuery, sortBy]);

  const buildCategoryTree = (items, parentId = null) => {
    return items
      .filter(item => item.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(item => ({
        ...item,
        children: buildCategoryTree(items, item.id)
      }));
  };

  const renderCategoryTree = (items, level = 0) => {
    if (!items || items.length === 0) return null;
    
    return (
      <ul className={`space-y-1 ${level > 0 ? 'ml-4 border-l-2 border-gray-200 pl-4' : ''}`}>
        {items.map((category) => {
          const isActive = parseInt(categoryId) === category.id;
          const hasChildren = category.children && category.children.length > 0;
          
          return (
            <li key={category.id}>
              <Link
                to={`/catalog/${category.id}`}
                className={`block px-4 py-2.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200 font-semibold' 
                    : 'hover:bg-green-50 text-gray-700 hover:translate-x-1'
                }`}
              >
                <span>{category.isFinal ? '🌱' : '📁'} {category.nameRu}</span>
                {category.nameLat && (
                  <span className="text-xs opacity-70 ml-2 italic">{category.nameLat}</span>
                )}
                {category.isFinal && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    товар
                  </span>
                )}
              </Link>
              {hasChildren && (
                <div className="mt-1">
                  {renderCategoryTree(category.children, level + 1)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const categoryTree = buildCategoryTree(categories);

  const getCategoryName = () => {
    if (!categoryId) return 'Все товары';
    const findCategory = (items) => {
      for (const cat of items) {
        if (cat.id === parseInt(categoryId)) return cat.nameRu;
        if (cat.children) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return null;
    };
    const tree = buildCategoryTree(categories);
    return findCategory(tree) || 'Категория';
  };

  const isCurrentCategoryFinal = categoryId 
    ? categories.find(c => c.id === parseInt(categoryId))?.isFinal 
    : false;

  // ⭐ Функция для получения полного URL фото
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:5001${path}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-72 flex-shrink-0">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-100">
          <h3 className="font-bold text-xl mb-4 text-gray-800">📂 Каталог</h3>
          <Link 
            to="/catalog" 
            className={`block px-4 py-2.5 rounded-xl transition-all duration-300 ${
              !categoryId 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200 font-semibold' 
                : 'hover:bg-green-50 text-gray-700 hover:translate-x-1'
            }`}
          >
            📦 Все товары
          </Link>
          <div className="mt-3">
            {renderCategoryTree(categoryTree)}
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {searchQuery ? `🔍 Результаты: "${searchQuery}"` : getCategoryName()}
            </h2>
            {categoryId && !isCurrentCategoryFinal && (
              <p className="text-sm text-gray-500 mt-1">
                📁 Показаны товары из всех подкатегорий
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              Найдено товаров: {products.length}
            </p>
          </div>

          {/* Сортировка */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Сортировка:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              <option value="createdAt_desc">Сначала новые</option>
              <option value="createdAt_asc">Сначала старые</option>
              <option value="price_asc">По возрастанию цены</option>
              <option value="price_desc">По убыванию цены</option>
              <option value="name_asc">По названию (А→Я)</option>
              <option value="name_desc">По названию (Я→А)</option>
            </select>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100"
            >
              <p className="text-gray-500 text-lg">🌲 В этой категории пока нет товаров</p>
              {searchQuery && (
                <p className="text-gray-400 text-sm mt-2">Попробуйте изменить поисковый запрос</p>
              )}
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="h-full"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 h-full flex flex-col"
                  >
                    <div className="relative bg-white h-52 flex-shrink-0 flex items-center justify-center overflow-hidden">
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
    <span className="text-6xl text-gray-300">🌲</span>
  )}
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
        </AnimatePresence>
      </div>
    </div>
  );
}