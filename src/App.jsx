import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import AdminLogin from './pages/AdminLogin'
import AdminProducts from './pages/AdminProducts'
import AdminBanners from './pages/AdminBanners'
import AdminDashboard from './pages/AdminDashboard'
import Footer from "./components/footer.jsx";
import Products from './pages/Products'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produto/:id" element={<ProductDetails />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/produtos" element={<AdminProducts />} />
        <Route path="/admin/banners" element={<AdminBanners />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/produtos" element={<Products />} />
      </Routes>

      <Footer/>
    </BrowserRouter>
  )
}

export default App