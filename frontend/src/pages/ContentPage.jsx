import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/config';

export default function ContentPage() {
  const { section } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Формируем pageKey из пути: /about/collection → about_collection
        const path = window.location.pathname;
        const parts = path.split('/').filter(Boolean);
        const pageKey = parts.join('_');
        
        console.log('📄 pageKey:', pageKey); // Для отладки
        
        const response = await API.get(`/page-content/${pageKey}`);
        setContent(response.data);
      } catch (error) {
        console.error('Ошибка загрузки контента:', error);
        setContent({
          title: 'Страница не найдена',
          content: '<p>Контент для этой страницы пока не добавлен.</p>'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [section]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
        ← Назад
      </Link>
      
      {content.image && (
        <div className="text-6xl mb-6">{content.image}</div>
      )}
      
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{content.title}</h1>
      
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div 
          className="prose prose-green max-w-none"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      </div>
    </motion.div>
  );
}