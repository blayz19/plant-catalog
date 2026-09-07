import { useState, useEffect } from 'react';
import API from '../api/config';

export default function AdminPageContent() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    pageKey: '',
    title: '',
    content: '',
    image: '',
    metaTitle: '',
    metaDesc: ''
  });

  // Список доступных страниц (ключи)
  const pageKeys = [
    { key: 'about_collection', label: 'О компании → Коллекция растений' },
    { key: 'about_science', label: 'О компании → Научная работа' },
    { key: 'about_selection', label: 'О компании → Селекция' },
    { key: 'about_introduction', label: 'О компании → Интродукция' },
    { key: 'about_tours', label: 'О компании → Экскурсии' },
    { key: 'about_media', label: 'О компании → СМИ о нас' },
    { key: 'about_vacancies', label: 'О компании → Вакансии' },
    { key: 'about_publications', label: 'О компании → Наши публикации' },
    { key: 'about_exhibition', label: 'О компании → Выставка дендроарта' },
    { key: 'useful_planting', label: 'Полезная информация → Посадка' },
    { key: 'useful_care', label: 'Полезная информация → Уход' },
    { key: 'useful_protection', label: 'Полезная информация → Защита' },
    { key: 'business', label: 'Для бизнеса' },
  ];

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await API.get('/page-content');
      setPages(response.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/page-content', formData);
      setEditingPage(null);
      setFormData({
        pageKey: '',
        title: '',
        content: '',
        image: '',
        metaTitle: '',
        metaDesc: ''
      });
      fetchPages();
      alert('✅ Контент сохранён!');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('❌ Ошибка сохранения контента');
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      pageKey: page.pageKey,
      title: page.title,
      content: page.content,
      image: page.image || '',
      metaTitle: page.metaTitle || '',
      metaDesc: page.metaDesc || ''
    });
  };

  const handleDelete = async (pageKey) => {
    if (confirm(`Удалить контент для "${pageKey}"?`)) {
      try {
        await API.delete(`/page-content/${pageKey}`);
        fetchPages();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  if (loading) return <div className="text-center py-12">Загрузка...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📝 Управление контентом страниц</h1>

      {/* Форма */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingPage ? 'Редактировать страницу' : 'Создать контент для страницы'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Страница *</label>
            <select
              value={formData.pageKey}
              onChange={(e) => setFormData({ ...formData, pageKey: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              required
              disabled={!!editingPage}
            >
              <option value="">Выберите страницу</option>
              {pageKeys.map((p) => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Заголовок *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Иконка/Эмодзи</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="🌲"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Содержание *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              rows="10"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Можно использовать HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt; и т.д.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">SEO Заголовок</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SEO Описание</label>
              <input
                type="text"
                value={formData.metaDesc}
                onChange={(e) => setFormData({ ...formData, metaDesc: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editingPage ? 'Сохранить' : 'Создать'}
            </button>
            {editingPage && (
              <button
                type="button"
                onClick={() => {
                  setEditingPage(null);
                  setFormData({
                    pageKey: '',
                    title: '',
                    content: '',
                    image: '',
                    metaTitle: '',
                    metaDesc: ''
                  });
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Список страниц */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Страница</th>
              <th className="px-4 py-2 text-left">Заголовок</th>
              <th className="px-4 py-2 text-left">Обновлено</th>
              <th className="px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  Контент для страниц пока не добавлен
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={page.pageKey} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-sm">{page.pageKey}</td>
                  <td className="px-4 py-2">{page.title}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(page)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(page.pageKey)}
                      className="text-red-600 hover:underline"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}