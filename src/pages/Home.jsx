import logo from '../assets/logo-labany.jpeg'
import { useCart } from '../context/CartContext'
import { useEffect, useState } from 'react'
import CartDrawer from '../components/CartDrawer'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'
import cartIcon from '../assets/cart.png'
import menuIcon from '../assets/menu.png'

function Home() {
  const { cart, addToCart } = useCart()
  const [openCart, setOpenCart] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])

  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)

 useEffect(() => {
    async function loadProducts() {
      const snapshot = await getDocs(collection(db, 'products'))

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setProducts(data)
      setFilteredProducts(data)
    }

    loadProducts()
  }, [])

  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))]
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  return (
    <div>
      <header className="header">
        <button className="menu-button" onClick={() => setOpenMenu(true)}>
          <img src={menuIcon} alt="Menu" className="menu-icon" />
        </button>

        <img src={logo} alt="Logo Labany" className="logo" />

        <button className="cart-button" onClick={() => setOpenCart(true)}>
          <img src={cartIcon} alt="Carrinho" className="cart-icon" />
          {cartQuantity > 0 && (
            <span className="cart-badge">{cartQuantity}</span>
          )}
        </button>
      </header>

      <main className="container">
        <section className="products-grid">
          {filteredProducts.map((product) => (
            <article
              className={`product-card ${!product.available ? 'unavailable' : ''}`}
              key={product.id}
              onClick={() => window.location.href = `/produto/${product.id}`}
            >
              <div className="product-image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />

                {!product.available && (
                  <span className="unavailable-badge">Indisponível</span>
                )}
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>

                <p>
                  {Number(product.price).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
              </div>

              <button
                className="add-cart-button"
                disabled={product.available === false}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!product.available) return
                  addToCart(product)
                }}
              >
                {product.available ? '+ Carrinho' : 'Indisponível'}
              </button>
            </article>
          ))}
        </section>
      </main>

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
        {openMenu && (
          <>
            <div className="side-menu">
              <button className="close-menu" onClick={() => setOpenMenu(false)}>
                ✕
              </button>

              <h2>Filtros</h2>

              <div className="menu-section">
                <h3>Marcas</h3>
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => {
                      setFilteredProducts(products.filter(p => p.brand === brand))
                      setOpenMenu(false)
                    }}
                  >
                    {brand}
                  </button>
                ))}
              </div>

              <div className="menu-section">
                <h3>Tipo de roupa</h3>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setFilteredProducts(products.filter(p => p.category === cat))
                      setOpenMenu(false)
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="menu-overlay" onClick={() => setOpenMenu(false)}></div>
          </>
        )}
    </div>
  )
}

export default Home