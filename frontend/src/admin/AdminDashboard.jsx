import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Панель управления</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Категории</h3>
          <p className="text-2xl font-bold mb-2">📁 Управление</p>
          <Link to="/admin/categories" className="text-green-600 hover:underline text-sm">
            Редактировать →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Товары</h3>
          <p className="text-2xl font-bold mb-2">🌱 Управление</p>
          <Link to="/admin/products" className="text-green-600 hover:underline text-sm">
            Редактировать →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Баннеры</h3>
          <p className="text-2xl font-bold mb-2">🖼️ Управление</p>
          <Link to="/admin/banners" className="text-green-600 hover:underline text-sm">
            Редактировать →
          </Link>
        </div>
      </div>
    </div>
  );
}