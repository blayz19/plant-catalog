import { useState, useEffect } from 'react';
import API from '../api/config';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [variations, setVariations] = useState([]);
  const [productMedia, setProductMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [variationForm, setVariationForm] = useState({
    size: '',
    priceMin: '',
    priceMax: '',
    stock: ''
  });
  const [formData, setFormData] = useState({
    categoryId: '',
    nameRu: '',
    nameLat: '',
    description: '',
    characteristics: '',
    isPopular: false,
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      fetchVariations(selectedProductId);
      fetchMedia(selectedProductId);
    }
  }, [selectedProductId]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        API.get('/products'),
        API.get('/categories')
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVariations = async (productId) => {
    try {
      const response = await API.get(`/products/${productId}`);
      setVariations(response.data.variations || []);
    } catch (error) {
      console.error('Ошибка загрузки вариаций:', error);
    }
  };

  const fetchMedia = async (productId) => {
    try {
      const response = await API.get(`/products/${productId}`);
      setProductMedia(response.data.media || []);
    } catch (error) {
      console.error('Ошибка загрузки фото:', error);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setSelectedProductId(null);
    setVariations([]);
    setProductMedia([]);
    setFormData({
      categoryId: '',
      nameRu: '',
      nameLat: '',
      description: '',
      characteristics: '',
      isPopular: false,
      isActive: true
    });
    setVariationForm({
      size: '',
      priceMin: '',
      priceMax: '',
      stock: ''
    });
  };

  const buildCategorySelect = (items, parentId = null, depth = 0) => {
    let result = [];
    const filtered = items.filter(item => item.parentId === parentId);
    for (const item of filtered) {
      result.push({ ...item, depth });
      result = [...result, ...buildCategorySelect(items, item.id, depth + 1)];
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        characteristics: formData.characteristics ? JSON.parse(formData.characteristics) : {}
      };

      let response;
      if (editingProduct) {
        response = await API.put(`/products/${editingProduct.id}`, data);
      } else {
        response = await API.post('/products', data);
      }
      
      resetForm();
      fetchData();
      if (!editingProduct) {
        setSelectedProductId(response.data.id);
        fetchVariations(response.data.id);
        fetchMedia(response.data.id);
      }
    } catch (error) {
      console.error('Ошибка сохранения товара:', error);
      alert('Ошибка: ' + (error.response?.data?.error || 'Не удалось сохранить товар'));
    }
  };

  const handleAddVariation = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      alert('Сначала создайте товар!');
      return;
    }
    try {
      await API.post(`/products/${selectedProductId}/variations`, {
        size: variationForm.size,
        priceMin: parseFloat(variationForm.priceMin),
        priceMax: parseFloat(variationForm.priceMax),
        stock: parseInt(variationForm.stock)
      });
      setVariationForm({ size: '', priceMin: '', priceMax: '', stock: '' });
      fetchVariations(selectedProductId);
    } catch (error) {
      console.error('Ошибка добавления вариации:', error);
      alert('Ошибка добавления цены');
    }
  };

  const handleDeleteVariation = async (variationId) => {
    if (confirm('Удалить эту цену?')) {
      try {
        await API.delete(`/products/variations/${variationId}`);
        fetchVariations(selectedProductId);
      } catch (error) {
        console.error('Ошибка удаления вариации:', error);
      }
    }
  };

  // ========== ЗАГРУЗКА ФОТО ==========
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!selectedProductId) {
      alert('Сначала создайте товар!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', 'product');
    formData.append('entityId', selectedProductId);

    setUploading(true);
    try {
      const response = await API.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchMedia(selectedProductId);
      alert('✅ Фото загружено!');
    } catch (error) {
      console.error('Ошибка загрузки фото:', error);
      alert('❌ Ошибка загрузки фото');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeletePhoto = async (mediaId) => {
    if (confirm('Удалить это фото?')) {
      try {
        await API.delete(`/upload/${mediaId}`);
        fetchMedia(selectedProductId);
      } catch (error) {
        console.error('Ошибка удаления фото:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setSelectedProductId(product.id);
    setFormData({
      categoryId: product.categoryId,
      nameRu: product.nameRu,
      nameLat: product.nameLat || '',
      description: product.description || '',
      characteristics: product.characteristics ? JSON.stringify(product.characteristics) : '',
      isPopular: product.isPopular || false,
      isActive: product.isActive
    });
    fetchVariations(product.id);
    fetchMedia(product.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Удалить товар?')) {
      try {
        await API.delete(`/products/${id}`);
        if (selectedProductId === id) resetForm();
        fetchData();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  const handleTogglePopular = async (id, currentStatus) => {
    try {
      await API.patch(`/products/${id}/toggle-popular`, { isPopular: !currentStatus });
      fetchData();
    } catch (error) {
      console.error('Ошибка переключения популярности:', error);
    }
  };

  const flatCategories = buildCategorySelect(categories);

  if (loading) return <div className="text-center py-12">Загрузка...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Управление товарами</h1>

      {/* Форма создания/редактирования товара */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? 'Редактировать товар' : 'Создать товар'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название (рус.) *</label>
            <input
              type="text"
              value={formData.nameRu}
              onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Название (лат.)</label>
            <input
              type="text"
              value={formData.nameLat}
              onChange={(e) => setFormData({ ...formData, nameLat: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Категория *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Выберите категорию</option>
              {flatCategories.map(cat => (
                <option key={cat.id} value={cat.id} style={{ paddingLeft: `${cat.depth * 20}px` }}>
                  {cat.depth > 0 && '─ '.repeat(cat.depth)} {cat.nameRu}
                  {cat.isFinal ? ' (товар)' : ' (папка)'}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              💡 Выберите категорию с пометкой "(товар)"
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              rows="3"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Характеристики (JSON)</label>
            <input
              type="text"
              value={formData.characteristics}
              onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })}
              placeholder='{"высота": "2-3м", "морозостойкость": "-40°C"}'
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="col-span-2 flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="w-4 h-4 text-green-600"
              />
              ⭐ Популярный товар
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-green-600"
              />
              Активен
            </label>
          </div>
          <div className="col-span-2 flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editingProduct ? 'Сохранить товар' : 'Создать товар'}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ФОРМА ДОБАВЛЕНИЯ ЦЕН И ФОТО */}
      {selectedProductId && (
        <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-8 border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            💰 Цены и фото для: {products.find(p => p.id === selectedProductId)?.nameRu || '...'}
          </h2>

          {/* === ФОТО === */}
          <div className="mb-6 p-4 bg-white rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3 text-gray-700">📸 Фотографии</h3>
            
            {/* Кнопка загрузки */}
            <div className="flex items-center gap-4 mb-4">
              <label className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                {uploading ? '⏳ Загрузка...' : '📤 Выбрать фото'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadPhoto}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">Максимум 5MB, JPG/PNG/WebP</span>
            </div>

            {/* Список загруженных фото */}
            {productMedia.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {productMedia.map((media) => (
                  <div key={media.id} className="relative group bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={media.url}
                      alt="фото"
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => handleDeletePhoto(media.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-sm hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Фото пока нет</p>
            )}
          </div>

          {/* === ЦЕНЫ === */}
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3 text-gray-700">💰 Цены и наличие</h3>
            <form onSubmit={handleAddVariation} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Размер</label>
                <input
                  type="text"
                  value={variationForm.size}
                  onChange={(e) => setVariationForm({ ...variationForm, size: e.target.value })}
                  placeholder="Напр. 50-70 см"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Цена от (₽)</label>
                <input
                  type="number"
                  value={variationForm.priceMin}
                  onChange={(e) => setVariationForm({ ...variationForm, priceMin: e.target.value })}
                  placeholder="1500"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Цена до (₽)</label>
                <input
                  type="number"
                  value={variationForm.priceMax}
                  onChange={(e) => setVariationForm({ ...variationForm, priceMax: e.target.value })}
                  placeholder="2000"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Наличие (шт.)</label>
                <input
                  type="number"
                  value={variationForm.stock}
                  onChange={(e) => setVariationForm({ ...variationForm, stock: e.target.value })}
                  placeholder="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  + Добавить цену
                </button>
              </div>
            </form>

            {variations.length > 0 && (
              <div className="mt-4">
                <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Размер</th>
                        <th className="px-4 py-2 text-left">Цена от</th>
                        <th className="px-4 py-2 text-left">Цена до</th>
                        <th className="px-4 py-2 text-left">Наличие</th>
                        <th className="px-4 py-2 text-left">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variations.map((v) => (
                        <tr key={v.id} className="border-t">
                          <td className="px-4 py-2">{v.size}</td>
                          <td className="px-4 py-2">{v.priceMin} ₽</td>
                          <td className="px-4 py-2">{v.priceMax || '—'} ₽</td>
                          <td className="px-4 py-2">{v.stock} шт.</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleDeleteVariation(v.id)}
                              className="text-red-600 hover:underline text-sm"
                            >
                              Удалить
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Список товаров */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Название</th>
              <th className="px-4 py-2 text-left">Категория</th>
              <th className="px-4 py-2 text-left">⭐ Популярный</th>
              <th className="px-4 py-2 text-left">Статус</th>
              <th className="px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{product.nameRu}</td>
                <td className="px-4 py-2 text-gray-600">
                  {product.category?.nameRu || '—'}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleTogglePopular(product.id, product.isPopular)}
                    className={`px-3 py-1 rounded text-sm transition ${
                      product.isPopular 
                        ? 'bg-yellow-400 text-yellow-800 hover:bg-yellow-500' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {product.isPopular ? '⭐ Убрать' : '☆ Добавить'}
                  </button>
                </td>
                <td className="px-4 py-2">
                  <span className={product.isActive ? 'text-green-600' : 'text-red-600'}>
                    {product.isActive ? 'Активен' : 'Неактивен'}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}