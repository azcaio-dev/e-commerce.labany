import { useCart } from '../context/CartContext'
import { useEffect, useState } from 'react'
import CartDrawer from '../components/CartDrawer'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'
import cartIcon from '../assets/cart.png'
import menuIcon from '../assets/menu.png'
import lupaIcon from '../assets/lupa.png'
import SearchPanel from '../components/SearchPanel'
import { useNavigate } from "react-router-dom"
import { createPortal } from 'react-dom'

function Home() {
  const { cart, addToCart } = useCart()

  const [openCart, setOpenCart] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [addedId, setAddedId] = useState(null)
  const [banners, setBanners] = useState([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [openBrands, setOpenBrands] = useState(false)
  const [openCategories, setOpenCategories] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filterLabel, setFilterLabel] = useState('')
  const [openSearch, setOpenSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')

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

  useEffect(() => {
    async function loadBanners() {
      try {
        const snapshot = await getDocs(collection(db, 'banners'))

        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((banner) => banner.active)

        setBanners(data)
      } catch (error) {
        console.error(error)
      }
    }

    loadBanners()
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [banners])

  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))]
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))]

  const launchProducts = products.filter(
    (product) => product.productSection === 'launch' && product.available
  )

  const bestsellers = products.filter(
    (product) => product.productSection === 'bestseller' && product.available
  )

  const outlet = products.filter(
    (product) => product.productSection === 'outlet' && product.available
  )

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
            src="/logoo.png"
            alt="LABANY"
            className="logo"
            onClick={() => navigate('/')}
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

      <main className="container">
        <div className={openSearch ? "search-open" : ""}></div>
        {loading && (
          <section className="launch-section">
            <h2>Carregando produtos...</h2>

            <div className="launch-list">
              {[1, 2, 3].map((i) => (
                <div key={i} className="launch-card skeleton-card"></div>
              ))}
            </div>
          </section>
        )}

        {!activeFilter && banners.length > 0 && (
          <section className="banner-carousel fade-in">
            <img
              src={banners[currentBanner].image}
              alt="Banner Loja Labany"
              className="banner-image"
            />

            {banners.length > 1 && (
              <div className="banner-dots">
                {banners.map((banner, index) => (
                  <button
                    key={banner.id}
                    className={index === currentBanner ? 'active' : ''}
                    onClick={() => setCurrentBanner(index)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {!loading && !activeFilter && bestsellers.length > 0 && (
          <section className="launch-section fade-in">
            <h2>Mais vendidos</h2>

            <div className="horizontal-wrapper">
              <div className="launch-list">
                {bestsellers.slice(0, 6).map((product) => (
                  <article
                    key={product.id}
                    className="launch-card"
                    onClick={() => (window.location.href = `/produto/${product.id}`)}
                  >
                    <img src={product.image} alt={product.name} />

                    <div>
                      <h3>{product.name}</h3>
                      <p>
                        {Number(product.price).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                    </div>
                  </article>
                ))}

                {bestsellers.length > 6 && (
                  <article
                    className="see-more-card"
                    onClick={() => {
                      setFilteredProducts(
                        products.filter((p) => p.productSection === 'bestseller')
                      )
                      setActiveFilter('bestseller')
                      setFilterLabel('Mais vendidos')
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    <span className="see-more-arrow">›</span>
                  </article>
                )}
              </div>
            </div>
          </section>
        )}

        {!loading && !activeFilter && launchProducts.length > 0 && (
          <section className="launch-section fade-in">
            <h2>Lançamentos</h2>

            <div className="horizontal-wrapper">
              <div className="launch-list">
                {launchProducts.slice(0, 6).map((product) => (
                  <article
                    key={product.id}
                    className="launch-card"
                    onClick={() => (window.location.href = `/produto/${product.id}`)}
                  >
                    <img src={product.image} alt={product.name} />

                    <div>
                      <h3>{product.name}</h3>
                      <p>
                        {Number(product.price).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                    </div>
                  </article>
                ))}

                {launchProducts.length > 6 && (
                  <article
                    className="see-more-card"
                    onClick={() => {
                      setFilteredProducts(
                        products.filter((p) => p.productSection === 'launch')
                      )
                      setActiveFilter('launch')
                      setFilterLabel('Lançamentos')
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    <span className="see-more-arrow">›</span>
                  </article>
                )}
              </div>
            </div>
          </section>
        )}

        {!loading && !activeFilter && outlet.length > 0 && (
          <section className="launch-section fade-in">
            <h2>Outlet</h2>

            <div className="horizontal-wrapper">
              <div className="launch-list">
                {outlet.slice(0, 6).map((product) => (
                  <article
                    key={product.id}
                    className="launch-card"
                    onClick={() => (window.location.href = `/produto/${product.id}`)}
                  >
                    <img src={product.image} alt={product.name} />

                    <div>
                      <h3>{product.name}</h3>
                      <p>
                        {Number(product.price).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                    </div>
                  </article>
                ))}

                {outlet.length > 6 && (
                  <article
                    className="see-more-card"
                    onClick={() => {
                      setFilteredProducts(
                        products.filter((p) => p.productSection === 'outlet')
                      )
                      setActiveFilter('outlet')
                      setFilterLabel('Outlet')
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    <span className="see-more-arrow">›</span>
                  </article>
                )}
              </div>
            </div>
          </section>
        )}

        {activeFilter ? (
          <>
           <h2 className="section-title">
            {filterLabel || 'Resultados'}
          </h2>

            <section className="products-grid fade-in">
              {filteredProducts.length > 0 ? (
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
            </section>
          </>
        ) : (
            !loading && (
              <div className="view-all-wrapper fade-in">
                <button
                  className="view-all-products"
                  onClick={() => (window.location.href = '/produtos')}
                >
                  Ver todos os produtos
                </button>
              </div>
            )
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
              setFilteredProducts(products)
              setActiveFilter(null)
              setFilterLabel('')
              setOpenMenu(false)
            }}
          >
            Home
          </button>

          <button
            className="menu-link"
            onClick={() => {
              window.location.href = '/produtos'
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

export default Home