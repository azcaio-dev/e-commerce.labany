import logo from '../assets/logo-labany.jpeg'
import { useCart } from '../context/CartContext'
import { useEffect, useState } from 'react'
import CartDrawer from '../components/CartDrawer'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'

function Home() {
  const { cart, addToCart } = useCart()
  const [openCart, setOpenCart] = useState(false)
  const [products, setProducts] = useState([])

  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    async function loadProducts() {
      const querySnapshot = await getDocs(collection(db, 'products'))

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setProducts(data)
    }

    loadProducts()
  }, [])

  return (
    <div>
      <header className="header">
        <img src={logo} alt="Logo Labany" className="logo" />

        <button className="cart-button" onClick={() => setOpenCart(true)}>
          🛒
          {cartQuantity > 0 && (
            <span className="cart-badge">{cartQuantity}</span>
          )}
        </button>
      </header>

      <main className="container">
        <section className="products-grid">
          {products.map((product) => (
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
    </div>
  )
}

export default Home