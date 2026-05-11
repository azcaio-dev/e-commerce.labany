import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import AdminLogin from './pages/AdminLogin'
import AdminProducts from './pages/AdminProducts'
import AdminBanners from './pages/AdminBanners'
import AdminDashboard from './pages/AdminDashboard'
import Footer from "./components/footer.jsx";
import Products from './pages/Products'
import OrbyAdminDashboard from './pages/OrbyAdminDashboard'
import OrbyCreateStore from './pages/OrbyCreateStore'
import OrbyEditStore from './pages/OrbyEditStore'
import Landing from './pages/Landing'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/orby-admin/dashboard" element={<OrbyAdminDashboard />} />
        <Route path="/orby-admin/criar-loja" element={<OrbyCreateStore />} />
        <Route path="/orby-admin/editar-loja/:storeSlug" element={<OrbyEditStore />} />

        <Route path="/" element={<Landing />} />
        <Route path="/:storeSlug" element={<Home />} />

        <Route path="/produtos" element={<Products />} />
        <Route path="/:storeSlug/produtos" element={<Products />} />

        <Route path="/produto/:id" element={<ProductDetails />} />
        <Route path="/:storeSlug/produto/:id" element={<ProductDetails />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLogin />} />

        <Route path="/admin/:storeSlug/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/:storeSlug/produtos" element={<AdminProducts />} />
        <Route path="/admin/:storeSlug/banners" element={<AdminBanners />} />
      </Routes>

      {!window.location.pathname.startsWith('/admin') &&
      !window.location.pathname.startsWith('/admin') && window.location.pathname !== '/' && <Footer />}
     </BrowserRouter>
  )
}

export default App