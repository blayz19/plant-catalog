import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/admin/login');
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/admin" className="text-xl font-bold">🌲 Админка</Link>
              <Link to="/admin/categories" className="hover:text-gray-300">Категории</Link>
              <Link to="/admin/products" className="hover:text-gray-300">Товары</Link>
              <Link to="/admin/banners" className="hover:text-gray-300">Баннеры</Link>
              <Link to="/admin/pages" className="hover:text-gray-300">Страницы</Link>
              <Link to="/admin/page-content" className="hover:text-gray-300">Контент страниц</Link>
              <Link to="/admin/gallery" className="hover:text-gray-300">Галерея</Link>
            </div>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
              Выйти
            </button>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}