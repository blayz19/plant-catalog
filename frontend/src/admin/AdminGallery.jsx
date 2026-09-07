import { useState, useEffect } from 'react';
import API from '../api/config';

export default function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    title: '',
    imageUrl: '',
    description: '',
    sortOrder: 0
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await API.get('/gallery');
      setPhotos(response.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/gallery', formData);
      setFormData({
        year: new Date().getFullYear(),
        title: '',
        imageUrl: '',
        description: '',
        sortOrder: 0
      });
      fetchPhotos();
      alert('✅ Фото добавлено!');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('❌ Ошибка добавления фото');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Удалить фото?')) {
      try {
        await API.delete(`/gallery/${id}`);
        fetchPhotos();
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
      formDataUpload.append('entityType', 'gallery');
      formDataUpload.append('entityId', '0');

      const response = await API.post('/upload/single', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData({ ...formData, imageUrl: response.data.url });
      alert('✅ Фото загружено!');
    } catch (error) {
      console.error('Ошибка загрузки фото:', error);
      alert('❌ Ошибка загрузки фото');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Группируем фото по годам
  const photosByYear = photos.reduce((acc, photo) => {
    if (!acc[photo.year]) acc[photo.year] = [];
    acc[photo.year].push(photo);
    return acc;
  }, {});

  const years = Object.keys(photosByYear).sort((a, b) => b - a);

  if (loading) return <div className="text-center py-12">Загрузка...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🖼️ Управление галереей</h1>

      {/* Форма добавления */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Добавить фото</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Год *</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Название *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">URL изображения *</label>
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
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              rows="2"
            />
          </div>
          <div className="col-span-2 flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Добавить фото
            </button>
          </div>
        </form>
      </div>

      {/* Список фото по годам */}
      {years.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">Фото пока нет</p>
        </div>
      ) : (
        years.map((year) => (
          <div key={year} className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{year}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {photosByYear[year].map((photo) => (
                <div key={photo.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={`http://localhost:5001${photo.imageUrl}`}
                    alt={photo.title}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.target.src = '';
                      e.target.alt = '❌';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Удалить
                    </button>
                  </div>
                  <div className="p-2 text-sm">
                    <p className="font-medium truncate">{photo.title}</p>
                    {photo.description && (
                      <p className="text-gray-500 text-xs truncate">{photo.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}