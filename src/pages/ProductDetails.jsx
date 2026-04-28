import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useCart } from '../context/CartContext'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState('')

  useEffect(() => {
    async function loadProduct() {
      const productRef = doc(db, 'products', id)
      const productSnap = await getDoc(productRef)

      if (productSnap.exists()) {
        const data = {
          id: productSnap.id,
          ...productSnap.data(),
        }

        setProduct(data)
        setSelectedImage(data.image)
      }

      setLoading(false)
    }

    loadProduct()
  }, [id])

  if (loading) {
    return <p className="product-details">Carregando...</p>
  }

  if (!product) {
    return <p className="product-details">Produto não encontrado</p>
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
    <main className="product-details">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Voltar
      </button>

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

        <div className="product-actions">
          <button
            className="add-cart-button"
            disabled={!product.available}
            onClick={() => {
              if (!product.available) return

              addToCart({
                ...product,
                price: formattedPrice,
              })
            }}
          >
            {product.available ? 'Adicionar' : 'Indisponível'}
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
    </main>
  )
}

export default ProductDetails