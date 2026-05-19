import { useCart } from '../context/CartContext'
import useStore from '../hooks/useStore'

function CartDrawer({ open, onClose }) {
  const { store, loading: storeLoading } = useStore()

  const {
    cart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart()

  if (storeLoading || !store) {
    return null
  }

  function formatPrice(value) {
    let price = value

    if (typeof price === 'string') {
      price = price
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim()
    }

    price = Number(price)

    if (Number.isNaN(price)) {
      price = 0
    }

    return price
  }

  const total = cart.reduce((acc, item) => {
    const price = formatPrice(item.price)
    return acc + item.quantity * price
  }, 0)

  const message = cart
    .map((item) => {
      const price = formatPrice(item.price)

      return `• ${item.quantity}x ${item.name}
${item.selectedColor ? `Cor: ${item.selectedColor}
` : ''}Tam: ${item.selectedSize || '-'}
Preço: ${price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}`
    })
    .join('\n\n')

  const phone = String(store.whatsapp || '').replace(/\D/g, '')

  const whatsappText = `${store.checkout?.messageIntro || 'Olá! Quero finalizar meu pedido:'}

*Itens:*
${message}

*Total:* ${total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })}

Pode me ajudar com o pagamento e entrega?`

  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappText)}`

  function handleWhatsappCheckout() {
    window.location.href = whatsappLink
  }

  return (
    <>
      <div className={`drawer ${open ? 'open' : ''}`}>
        <div className="drawer-content">
          <button className="close-drawer" onClick={onClose}>
            ✕
          </button>

          <h2>Carrinho</h2>

          {cart.length === 0 && <p>Seu carrinho está vazio</p>}

          {cart.map((item, index) => (
            <div
              key={`${item.id}-${item.selectedSize || 'sem-tamanho'}-${item.selectedColor || 'sem-cor'}-${index}`}
              className="cart-item"
            >
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
                loading="lazy"
              />

              <div className="cart-info">
                <strong className="cart-product-name">{item.name}</strong>

                <div className="cart-middle-row">
                  <div>
                    {item.selectedColor && (
                      <span>Cor: {item.selectedColor}</span>
                    )}

                    <span>Tam: {item.selectedSize || '-'}</span>
                  </div>

                  <div className="cart-quantity">
                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id,
                          item.selectedSize,
                          item.selectedColor
                        )
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id,
                          item.selectedSize,
                          item.selectedColor
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-price-box">
                  {item.productSection === 'outlet' && item.oldPrice && (
                    <span className="cart-old-price">
                      {formatPrice(item.oldPrice).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  )}

                  <strong className="cart-current-price">
                    {formatPrice(item.price).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </strong>
                </div>
              </div>
            </div>
          ))}

          {cart.length > 0 && (
            <>
              <h3 className="cart-total">
                Total:{' '}
                {total.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </h3>

              <button
                type="button"
                onClick={handleWhatsappCheckout}
                className="whatsapp-button"
              >
                Finalizar no WhatsApp
              </button>

              <button onClick={clearCart} className="clear-cart">
                Limpar carrinho
              </button>
            </>
          )}
        </div>
      </div>

      {open && <div className="overlay" onClick={onClose}></div>}
    </>
  )
}

export default CartDrawer