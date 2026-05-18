import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useCart } from '../context/CartContext'
import CartDrawer from '../components/CartDrawer'
import cartIcon from '../assets/cart.png'
import Toast from '../components/Toast'
import useStore from '../hooks/useStore'
import useStoreTheme from '../hooks/useStoreTheme'

function ProductDetails() {
  const navigate = useNavigate()
  const { cart, addToCart } = useCart()

  const { id } = useParams()

  const { store, loading: storeLoading, storeSlug } = useStore()

  useStoreTheme(store)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [openCart, setOpenCart] = useState(false)
  const [added, setAdded] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)

  function showToast(message, type = 'success') {
    setToast({ message, type })

    setTimeout(() => {
      setToast({ message: '', type: 'success' })
    }, 2500)
  }

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | ${store.name}`
    }
  }, [product, store])

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)

        const productRef = doc(db, 'stores', storeSlug, 'products', id)
        const productSnap = await getDoc(productRef)

        if (productSnap.exists()) {
          const data = {
            id: productSnap.id,
            ...productSnap.data(),
          }

          setProduct(data)
          setSelectedImage(data.image)
        } else {
          setProduct(null)
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [storeSlug, id])

  if (storeLoading || !store) {
    return null
  }

  if (store.active === false) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
          background: store.colors?.background || '#fff',
          color: store.colors?.text || '#111',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <img
          src={store.logo}
          alt={store.name}
          style={{
            width: '120px',
            objectFit: 'contain',
          }}
        />

        <h1
          style={{
            fontSize: '28px',
            margin: 0,
          }}
        >
          Loja temporariamente indisponível
        </h1>

        <p
          style={{
            maxWidth: '420px',
            opacity: 0.7,
            lineHeight: 1.6,
          }}
        >
          Esta loja está desativada no momento. Tente novamente mais tarde.
        </p>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="container product-loading">
        <p>Carregando produto...</p>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="container product-empty">
        <h2>Produto não encontrado</h2>
      </main>
    )
  }

  const formattedPrice = Number(product.price).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const phone = String(store.whatsapp || '').replace(/\D/g, '')

  const whatsappMessage = `${store.checkout?.messageIntro || 'Olá! Tenho interesse nesse produto:'}

Produto: ${product.name}
Preço: ${formattedPrice}
Tamanho: ${selectedSize || '-'}`

  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(
    whatsappMessage
  )}`

  return (
    <>
      <header className="details-header full-details-header">
        <button className="details-back-button" onClick={() => navigate(-1)}>
          ← Voltar
        </button>

        <button className="details-cart-button" onClick={() => setOpenCart(true)}>
          <img src={cartIcon} alt="Carrinho" className="cart-icon" />

          {cartQuantity > 0 && (
            <span className="cart-badge">{cartQuantity}</span>
          )}
        </button>
      </header>

      <main className="product-details fade-in">
        <section className="product-gallery">
          <div style={{ position: 'relative' }}>
            <img
              src={selectedImage}
              alt={product.name}
              className="main-product-image"
            />

            {product.productSection === 'outlet' && product.oldPrice && (
              <span className="discount-badge">
                {Math.round((1 - product.price / product.oldPrice) * 100)}%
              </span>
            )}
          </div>

          <div className="thumbs">
            <img
              src={product.image}
              alt={product.name}
              onClick={() => setSelectedImage(product.image)}
              loading="lazy"
            />

            {product.image2 && (
              <img
                src={product.image2}
                alt={product.name}
                onClick={() => setSelectedImage(product.image2)}
                loading="lazy"
              />
            )}
          </div>
        </section>

        <section className="product-content">
          <h1>{product.name}</h1>

          <div className="product-price-box">
            {product.productSection === 'outlet' && product.oldPrice && (
              <span className="product-old-price">
                {Number(product.oldPrice).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            )}

            <strong className="product-current-price">
              {formattedPrice}
            </strong>
          </div>

          <div className="product-description">
            <h3>Descrição</h3>
            <p>{product.description || 'Sem descrição cadastrada.'}</p>
          </div>

          <div className="product-sizes">
            <h3>Tamanhos disponíveis</h3>

            <div className="size-options">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  className={selectedSize === size ? 'selected' : ''}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-actions">
            <button
              className={`add-cart-button ${added ? 'added' : ''}`}
              disabled={!product.available}
              onClick={() => {
                if (!selectedSize) {
                  showToast('Selecione um tamanho', 'warning')
                  return
                }

                addToCart({
                  ...product,
                  selectedSize,
                  price: product.price,
                })

                setAdded(true)
                showToast('Produto adicionado ao carrinho', 'success')

                setTimeout(() => {
                  setAdded(false)
                }, 1000)
              }}
            >
              {!product.available
                ? 'Indisponível'
                : added
                ? '✔ Adicionado'
                : 'Adicionar'}
            </button>

            {product.available && (
              <button
                className="whatsapp-button"
                onClick={() => {
                  window.location.href = whatsappLink
                }}
              >
                Comprar pelo WhatsApp
              </button>
            )}
          </div>
        </section>
      </main>

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
      <Toast message={toast.message} type={toast.type} />
    </>
  )
}

export default ProductDetails