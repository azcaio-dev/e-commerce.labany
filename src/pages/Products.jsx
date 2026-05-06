import cartIcon from '../assets/cart.png'
import menuIcon from '../assets/menu.png'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'
import CartDrawer from '../components/CartDrawer'
import { useCart } from '../context/CartContext'
import { createPortal } from 'react-dom'
import { useNavigate, useParams } from 'react-router-dom'
import lupaIcon from '../assets/lupa.png'
import SearchPanel from '../components/SearchPanel'
import stores from '../config/stores'
import useStoreTheme from '../hooks/useStoreTheme'

function Products() {
  const { cart, addToCart } = useCart()
  const navigate = useNavigate()
  const { storeSlug = 'labany' } = useParams()

  const store = stores[storeSlug] || stores.labany
  const storePrefix = `/${storeSlug}`

  useStoreTheme(store)

  const [scrolled, setScrolled] = useState(false)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [addedId, setAddedId] = useState(null)

  const [openCart, setOpenCart] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [openBrands, setOpenBrands] = useState(false)
  const [openCategories, setOpenCategories] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [filterLabel, setFilterLabel] = useState('')
  const [visibleCount, setVisibleCount] = useState(10)
  const [openSearch, setOpenSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (openMenu || openCart) {
      document.body.classList.add('menu-open')
      document.documentElement.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
      document.documentElement.classList.remove('menu-open')
    }

    return () => {
      document.body.classList.remove('menu-open')
      document.documentElement.classList.remove('menu-open')
    }
  }, [openMenu, openCart])

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)

        const snapshot = await getDocs(
          collection(db, 'stores', storeSlug, 'products')
        )

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [storeSlug])

  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))]
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))]

  return (
    <div>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-left">
          <button className="menu-button" onClick={() => setOpenMenu(true)}>
            <img src={menuIcon} alt="Menu" className="menu-icon" />
          </button>

          <button
            className="search-button"
            onClick={() => setOpenSearch(!openSearch)}
          >
            <img src={lupaIcon} alt="Buscar" className="search-icon" />
          </button>
        </div>

        <div className="header-center">
          <img
            src={store.logo}
            alt={store.name}
            className="logo"
            onClick={() => navigate(storePrefix)}
          />
        </div>

        <div className="header-right">
          <button className="cart-button" onClick={() => setOpenCart(true)}>
            <img src={cartIcon} alt="Carrinho" className="cart-icon" />

            {cartQuantity > 0 && (
              <span className="cart-badge">{cartQuantity}</span>
            )}
          </button>
        </div>
      </header>

      <SearchPanel
        openSearch={openSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        products={products}
        setFilteredProducts={setFilteredProducts}
        setActiveFilter={setActiveFilter}
        setFilterLabel={setFilterLabel}
      />

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
            filteredProducts.slice(0, visibleCount).map((product) => (
              <article
                className={`product-card ${!product.available ? 'unavailable' : ''}`}
                key={product.id}
                onClick={() => navigate(`${storePrefix}/produto/${product.id}`)}
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

                  {product.productSection === 'outlet' && product.oldPrice ? (
                    <div className="price-box">
                      <span className="old-price">
                        {Number(product.oldPrice).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>

                      <strong className="current-price">
                        {Number(product.price).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </strong>
                    </div>
                  ) : (
                    <p>
                      {Number(product.price).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                  )}
                </div>

                {activeFilter !== 'search' && (
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
                )}
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

        {visibleCount < filteredProducts.length && (
          <div className="load-more">
            <button
              onClick={() => {
                setVisibleCount((prev) => prev + 10)

                setTimeout(() => {
                  window.scrollBy({
                    top: 300,
                    behavior: 'smooth',
                  })
                }, 100)
              }}
            >
              Ver mais
            </button>
          </div>
        )}
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
              navigate(storePrefix)
              setOpenMenu(false)
            }}
          >
            Home
          </button>

          <button
            className="menu-link"
            onClick={() => {
              setOpenMenu(false)
              setTimeout(() => {
                navigate(`${storePrefix}/produtos`)
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
              setVisibleCount(10)
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
              setVisibleCount(10)
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
              setVisibleCount(10)
              setFilteredProducts(filtered)
              setActiveFilter('outlet')
              setFilterLabel('Outlet')
              setOpenMenu(false)
            }}
          >
            Outlet
          </button>

          {store.menu?.showBrands && (
            <>
              <button
                className="menu-link"
                onClick={() => setOpenBrands(!openBrands)}
              >
                <span>{store.menu?.brandsLabel || 'Marcas'}</span>
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
                        setVisibleCount(10)
                        setFilteredProducts(filtered)
                        setActiveFilter('brand')
                        setFilterLabel(
                          `${store.menu?.brandsLabel || 'Marcas'} > ${brand}`
                        )
                        setOpenMenu(false)
                      }}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {store.menu?.showCategories !== false && (
            <>
              <button
                className="menu-link"
                onClick={() => setOpenCategories(!openCategories)}
              >
                <span>{store.menu?.categoriesLabel || 'Peças'}</span>
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
                        setVisibleCount(10)
                        setFilteredProducts(filtered)
                        setActiveFilter('category')
                        setFilterLabel(
                          `${store.menu?.categoriesLabel || 'Peças'} > ${cat}`
                        )
                        setOpenMenu(false)
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </>
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