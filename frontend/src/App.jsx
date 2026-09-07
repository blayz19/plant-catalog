import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import PriceList from './pages/PriceList';
import ContentPage from './pages/ContentPage';
import Gallery from './pages/Gallery';
import Contacts from './pages/Contacts';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminCategories from './admin/AdminCategories';
import AdminProducts from './admin/AdminProducts';
import AdminBanners from './admin/AdminBanners';
import AdminPages from './admin/AdminPages';
import AdminPageContent from './admin/AdminPageContent';
import AdminGallery from './admin/AdminGallery';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Клиентская часть */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="catalog/:categoryId" element={<Catalog />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="price-list" element={<PriceList />} />
            
            {/* Страницы с контентом из БД */}
            <Route path="/about/:section" element={<ContentPage />} />
            <Route path="/useful/:section" element={<ContentPage />} />
            <Route path="/business" element={<ContentPage />} />
            
            {/* Статические страницы */}
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contacts" element={<Contacts />} />
          </Route>
          
          {/* Админка */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="pages" element={<AdminPages />} />
            <Route path="page-content" element={<AdminPageContent />} />
            <Route path="gallery" element={<AdminGallery />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;