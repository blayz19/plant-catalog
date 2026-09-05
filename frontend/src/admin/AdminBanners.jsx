import { useState, useEffect } from 'react';
import API from '../api/config';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',        // ← ВАЖНО: title, а не name!
    imageUrl: '',
    link: '',
    isActive: true,
    sortOrder: 0
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await API.get('/banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      imageUrl: '',
      link: '',
      isActive: true,
      sortOrder: 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка: title обязателен
    if (!formData.title.trim()) {
      alert('❌ Поле "Название" обязательно для заполнения!');
      return;
    }

    // Проверка: imageUrl обязателен
    if (!formData.imageUrl.trim()) {
      alert('❌ Поле "URL изображения" обязательно для заполнения!');
      return;
    }

    try {
      const dataToSend = {
        title: formData.title.trim(),
        imageUrl: formData.imageUrl.trim(),
        link: formData.link?.trim() || '',
        isActive: formData.isActive,
        sortOrder: formData.sortOrder || 0
      };

      console.log('📤 Отправляем баннер:', dataToSend); // Для отладки

      if (editingBanner) {
        await API.put(`/banners/${editingBanner.id}`, dataToSend);
      } else {
        await API.post('/banners', dataToSend);
      }
      
      resetForm();
      fetchBanners();
      alert('✅ Баннер успешно сохранен!');
    } catch (error) {
      console.error('❌ Ошибка сохранения баннера:', error);
      const errorMsg = error.response?.data?.error || 'Не удалось сохранить баннер';
      alert(`❌ Ошибка: ${errorMsg}`);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      imageUrl: banner.imageUrl,
      link: banner.link || '',
      isActive: banner.isActive,
      sortOrder: banner.sortOrder || 0
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Удалить баннер?')) {
      try {
        await API.delete(`/banners/${id}`);
        fetchBanners();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await API.post('/upload/banner', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData(prev => ({ ...prev, imageUrl: response.data.url }));
      alert('✅ Фото загружено!');
    } catch (error) {
      console.error('Ошибка загрузки фото:', error);
      alert('❌ Ошибка загрузки фото: ' + (error.response?.data?.error || 'Неизвестная ошибка'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (loading) return <div className="text-center py-12">Загрузка...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🖼️ Управление баннерами</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingBanner ? 'Редактировать баннер' : 'Создать баннер'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Название <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Напр. Весенняя распродажа"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ссылка (куда ведет баннер)</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="Напр. /catalog или https://site.ru"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              URL изображения <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="/uploads/ваше-фото.jpg"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                required
              />
              <label className={`cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition whitespace-nowrap ${uploading ? 'opacity-50' : ''}`}>
                {uploading ? '⏳ Загрузка...' : '📤 Загрузить фото'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadPhoto}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              💡 Нажми "Загрузить фото" — путь вставится автоматически
            </p>
          </div>
          <div className="col-span-2 flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-green-600"
              />
              Активен (показывать на сайте)
            </label>
          </div>
          <div className="col-span-2 flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              {editingBanner ? 'Сохранить' : 'Создать баннер'}
            </button>
            {editingBanner && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Название</th>
              <th className="px-4 py-2 text-left">Изображение</th>
              <th className="px-4 py-2 text-left">Ссылка</th>
              <th className="px-4 py-2 text-left">Статус</th>
              <th className="px-4 py-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  Пока нет баннеров. Создайте первый!
                </td>
              </tr>
            ) : (
              banners.map((banner) => (
                <tr key={banner.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{banner.title}</td>
                  <td className="px-4 py-2">
                    {banner.imageUrl ? (
                      <img
                        src={`http://localhost:5001${banner.imageUrl}`}
                        alt={banner.title}
                        className="w-20 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src = '';
                          e.target.alt = '❌';
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Нет фото</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-600 text-sm">{banner.link || '—'}</td>
                  <td className="px-4 py-2">
                    <span className={banner.isActive ? 'text-green-600' : 'text-red-600'}>
                      {banner.isActive ? '✅ Активен' : '❌ Неактивен'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
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