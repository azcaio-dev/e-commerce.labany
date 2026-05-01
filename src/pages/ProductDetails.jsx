import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useCart } from '../context/CartContext'
import CartDrawer from '../components/CartDrawer'
import cartIcon from '../assets/cart.png'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cart, addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [openCart, setOpenCart] = useState(false)
  const [added, setAdded] = useState(false)

  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    async function loadProduct() {
      try {
        const productRef = doc(db, 'products', id)
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
        console.error(error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

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

  const whatsappMessage = `Olá! Tenho interesse nesse produto: ${product.name} - ${formattedPrice}`
  const whatsappLink = `https://wa.me/5581999999999?text=${encodeURIComponent(
    whatsappMessage
  )}`

  return (
    <main className="product-details fade-in">
      <header className="details-header">
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

      <section className="product-gallery">
        {/* IMAGEM PRINCIPAL */}
        <img
          src={selectedImage}
          alt={product.name}
          className="main-product-image"
        />

        {/* MINIATURAS */}
        <div className="thumbs">
          <img
            src={product.image}
            alt={product.name}
            onClick={() => setSelectedImage(product.image)}
          />

          {product.image2 && (
            <img
              src={product.image2}
              alt={product.name}
              onClick={() => setSelectedImage(product.image2)}
            />
          )}
        </div>
      </section>

      <section className="product-content">
        <h1>{product.name}</h1>
        <strong>{formattedPrice}</strong>

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
                alert('Selecione um tamanho')
                return
              }

              addToCart({
                ...product,
                selectedSize,
                price: formattedPrice,
              })

              setAdded(true)

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
            <a
              className="whatsapp-button"
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
            >
              Comprar
            </a>
          )}
        </div>
      </section>
      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </main>
  )
}

export default ProductDetails