import logo from '../assets/logo-labany.jpeg'
import cartIcon from '../assets/cart.png'
import menuIcon from '../assets/menu.png'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'
import CartDrawer from '../components/CartDrawer'
import { useCart } from '../context/CartContext'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'

function Products() {
  const { cart, addToCart } = useCart()

  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [addedId,setAddedId] = useState(null)

  const [openCart, setOpenCart] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [openBrands, setOpenBrands] = useState(false)
  const [openCategories, setOpenCategories] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [filterLabel, setFilterLabel] = useState('')
  const navigate = useNavigate()

  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    document.body.style.overflow = openMenu || openCart ? 'hidden' : 'auto'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [openMenu, openCart])

  useEffect(() => {
    async function loadProducts() {
      try {
        const snapshot = await getDocs(collection(db, 'products'))

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))]
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))]

  return (
    <div>
      <header className="header">
        <button className="menu-button" onClick={() => setOpenMenu(true)}>
          <img src={menuIcon} alt="Menu" className="menu-icon" />
        </button>

        <img
          src={logo}
          alt="Logo Labany"
          className="logo"
          onClick={() => (window.location.href = '/')}
        />

        <button className="cart-button" onClick={() => setOpenCart(true)}>
          <img src={cartIcon} alt="Carrinho" className="cart-icon" />

          {cartQuantity > 0 && (
            <span className="cart-badge">{cartQuantity}</span>
          )}
        </button>
      </header>

      <main className="container fade-in">
        <h2 className="section-title">
          {activeFilter ? filterLabel : 'Todos os produtos'}
        </h2>

        <section className="products-grid">
          {loading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <article
                className={`product-card ${!product.available ? 'unavailable' : ''}`}
                key={product.id}
                onClick={() => (window.location.href = `/produto/${product.id}`)}
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
                  className={`add-cart-button ${
                    addedId === product.id ? 'added' : ''
                  }`}
                  disabled={product.available === false}
                  onClick={(e) => {
                    e.stopPropagation()

                    if (!product.available) return

                    setSelectedProduct(product)
                    setSelectedSize('')
                    }}
                >
                  {!product.available
                    ? 'Indisponível'
                    : addedId === product.id
                    ? '✔ Adicionado'
                    : '+ Carrinho'}
                </button>
              </article>
            ))
          ) : (
            <div className="empty-products">
              <p>Nenhum produto encontrado.</p>
            </div>
          )}
          {selectedProduct &&
            createPortal(
                <div
                className="size-modal-overlay"
                onClick={() => setSelectedProduct(null)}
                >
                <div
                    className="size-modal"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                    className="size-modal-close"
                    onClick={() => setSelectedProduct(null)}
                    >
                    ✕
                    </button>

                    <h3>Escolha o tamanho</h3>
                    <p>{selectedProduct.name}</p>

                    <div className="size-modal-options">
                    {selectedProduct.sizes?.map((size) => (
                        <button
                        key={size}
                        className={selectedSize === size ? 'selected' : ''}
                        onClick={() => setSelectedSize(size)}
                        >
                        {size}
                        </button>
                    ))}
                    </div>

                    <button
                    className={`size-modal-confirm ${
                        addedId === selectedProduct?.id ? 'added' : ''
                    }`}
                    disabled={!selectedSize}
                    onClick={() => {
                        addToCart({
                        ...selectedProduct,
                        selectedSize,
                        })

                        setAddedId(selectedProduct.id)

                        setTimeout(() => {
                        setAddedId(null)
                        setSelectedProduct(null)
                        setSelectedSize('')
                        }, 800)
                    }}
                    >
                    {addedId === selectedProduct?.id
                        ? '✔ Adicionado'
                        : 'Adicionar ao carrinho'}
                    </button>
                </div>
                </div>,
                document.body
            )}
        </section>
      </main>

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />

      <div className={`side-menu ${openMenu ? 'open' : ''}`}>
        <button className="close-menu" onClick={() => setOpenMenu(false)}>
          ✕
        </button>

        <nav className="menu-list">
            <button
            className="menu-link"
            onClick={() => {
                window.location.href = '/'
            }}
            >
            Home
            </button>

            <button
                className="menu-link"
                onClick={() => {
                setOpenMenu(false)
                setTimeout(() => {
                    navigate('/produtos')
                }, 150)
                }}
            >
                Todos os produtos
            </button>

            <button
                className="menu-link"
                onClick={() => {
                const filtered = products.filter(
                    (p) => p.productSection === 'launch'
                )

                setFilteredProducts(filtered)
                setActiveFilter('launch')
                setFilterLabel('Lançamentos')
                setOpenMenu(false)
                }}
            >
                Lançamentos
            </button>

            <button
                className="menu-link"
                onClick={() => {
                const filtered = products.filter(
                    (p) => p.productSection === 'bestseller'
                )

                setFilteredProducts(filtered)
                setActiveFilter('bestseller')
                setFilterLabel('Mais vendidos')
                setOpenMenu(false)
                }}
            >
                Mais vendidos
            </button>

            <button
                className="menu-link"
                onClick={() => {
                const filtered = products.filter(
                    (p) => p.productSection === 'outlet'
                )

                setFilteredProducts(filtered)
                setActiveFilter('outlet')
                setFilterLabel('Outlet')
                setOpenMenu(false)
                }}
            >
                Outlet
            </button>

            <button
                className="menu-link"
                onClick={() => setOpenBrands(!openBrands)}
            >
                <span>Marcas</span>
                <span>›</span>
            </button>

            {openBrands && (
                <div className="submenu">
                {brands.map((brand) => (
                    <button
                    key={brand}
                    onClick={() => {
                        const filtered = products.filter(
                        (p) => p.brand === brand
                        )

                        setFilteredProducts(filtered)
                        setActiveFilter('brand')
                        setFilterLabel(`Marca > ${brand}`)
                        setOpenMenu(false)
                    }}
                    >
                    {brand}
                    </button>
                ))}
                </div>
            )}

            <button
                className="menu-link"
                onClick={() => setOpenCategories(!openCategories)}
            >
                <span>Peças</span>
                <span>›</span>
            </button>

            {openCategories && (
                <div className="submenu">
                {categories.map((cat) => (
                    <button
                    key={cat}
                    onClick={() => {
                        const filtered = products.filter(
                        (p) => p.category === cat
                        )

                        setFilteredProducts(filtered)
                        setActiveFilter('category')
                        setFilterLabel(`Peças > ${cat}`)
                        setOpenMenu(false)
                    }}
                    >
                    {cat}
                    </button>
                ))}
                </div>
            )}
            </nav>
      </div>

      {openMenu && (
        <div className="menu-overlay" onClick={() => setOpenMenu(false)}></div>
      )}
    </div>
  )
}

export default Products