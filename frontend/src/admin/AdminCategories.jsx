import { useState, useEffect } from 'react';
import API from '../api/config';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nameRu: '',
    nameLat: '',
    parentId: '',
    description: '',
    isFinal: false
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/categories', {
        ...formData,
        parentId: formData.parentId ? parseInt(formData.parentId) : null
      });
      setFormData({ nameRu: '', nameLat: '', parentId: '', description: '', isFinal: false });
      fetchCategories();
    } catch (error) {
      console.error('Ошибка создания категории:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Удалить категорию?')) {
      try {
        await API.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  if (loading) return <div className="text-center py-12">Загрузка...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Управление категориями</h1>

      {/* Форма создания */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Создать категорию</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название (рус.)</label>
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
            <label className="block text-sm font-medium mb-1">Родительская категория</label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            >
              <option value="">Нет (корневая)</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nameRu}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Описание</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="col-span-2 flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFinal}
                onChange={(e) => setFormData({ ...formData, isFinal: e.target.checked })}
                className="w-4 h-4"
              />
              Конечная категория (товар)
            </label>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Создать
            </button>
          </div>
        </form>
      </div>

      {/* Список категорий */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Название</th>
              <th className="px-4 py-2 text-left">Латинское</th>
              <th className="px-4 py-2 text-left">Тип</th>
              <th className="px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b">
                <td className="px-4 py-2">{cat.nameRu}</td>
                <td className="px-4 py-2 text-gray-600">{cat.nameLat || '—'}</td>
                <td className="px-4 py-2">
                  {cat.isFinal ? '🔸 Товар' : '📁 Категория'}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(cat.id)}
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