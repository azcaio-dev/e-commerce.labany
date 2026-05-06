import { useCart } from '../context/CartContext'
import { useParams } from 'react-router-dom'
import stores from '../config/stores'

function CartDrawer({ open, onClose }) {
  const { storeSlug = 'labany' } = useParams()
  const store = stores[storeSlug] || stores.labany

  const {
    cart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart()

  const total = cart.reduce((acc, item) => {
    let price = item.price

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

    return acc + item.quantity * price
  }, 0)

  const message = cart
    .map(
      (item) => `• ${item.quantity}x ${item.name}
Tam: ${item.selectedSize || '-'}
R$: ${Number(item.price).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}`
    )
    .join('\n\n')

  const whatsappLink = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
    `${store.checkout?.messageIntro || 'Olá! Quero finalizar meu pedido:'}

*Itens:*
${message}

*Total:* ${total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })}

Pode me ajudar com o pagamento e entrega?`
  )}`

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
              key={`${item.id}-${item.selectedSize || 'sem-tamanho'}-${index}`}
              className="cart-item"
            >
              <img src={item.image} alt={item.name} className="cart-item-image" />

              <div className="cart-info">
                <strong className="cart-product-name">{item.name}</strong>

                <div className="cart-middle-row">
                  <span>Tam: {item.selectedSize || '-'}</span>

                  <div className="cart-quantity">
                    <button onClick={() => decreaseQuantity(item.id, item.selectedSize)}>
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQuantity(item.id, item.selectedSize)}>
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-price-box">
                  {item.productSection === 'outlet' && item.oldPrice && (
                    <span className="cart-old-price">
                      {Number(item.oldPrice).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  )}

                  <strong className="cart-current-price">
                    {Number(item.price).toLocaleString('pt-BR', {
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

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="whatsapp-button"
              >
                Finalizar no WhatsApp
              </a>

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