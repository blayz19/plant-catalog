import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API, { getImageUrl } from '../api/config';

export default function Gallery() {
  const [photosByYear, setPhotosByYear] = useState({});
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await API.get('/gallery/years');
        setYears(response.data);
        if (response.data.length > 0) {
          setSelectedYear(response.data[0]);
        }
      } catch (error) {
        console.error('Ошибка загрузки годов:', error);
      }
    };
    fetchYears();
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    const fetchPhotos = async () => {
      try {
        const response = await API.get(`/gallery/year/${selectedYear}`);
        setPhotosByYear(prev => ({ ...prev, [selectedYear]: response.data }));
      } catch (error) {
        console.error('Ошибка загрузки фото:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [selectedYear]);


  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Галерея</h1>

      {/* Фильтр по годам */}
      {years.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-6 py-2 rounded-full transition ${
                selectedYear === year
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {/* Фото */}
      {selectedYear && photosByYear[selectedYear]?.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {photosByYear[selectedYear].map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg bg-gray-100 aspect-square"
            >
              <img
  src={getImageUrl(photo.imageUrl)}  // ← ИСПОЛЬЗУЕМ getImageUrl
  alt={photo.title}
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  onError={(e) => {
    e.target.src = '';
    e.target.alt = 'Фото недоступно';
  }}
/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="text-white font-medium">{photo.title}</p>
                  {photo.description && (
                    <p className="text-white/80 text-sm">{photo.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-lg">
          <p className="text-lg">Фото за этот год пока нет</p>
        </div>
      )}
    </div>
  );
}