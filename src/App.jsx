import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import AdminLogin from './pages/AdminLogin'
import AdminProducts from './pages/AdminProducts'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produto/:id" element={<ProductDetails />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/produtos" element={<AdminProducts />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App