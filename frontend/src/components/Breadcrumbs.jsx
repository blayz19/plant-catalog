import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-500 mb-6">
      <Link to="/" className="hover:text-green-600 transition-colors flex items-center gap-1">
        <span>🏠</span> Главная
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <ChevronRight size={14} className="text-gray-300" />
          {item.link ? (
            <Link to={item.link} className="hover:text-green-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}