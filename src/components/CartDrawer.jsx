import { useCart } from '../context/CartContext'

function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, clearCart } = useCart()

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
    .map((item) => `${item.quantity}x ${item.name} - ${item.price}`)
    .join('\n')

  const whatsappLink = `https://wa.me/5581999999999?text=${encodeURIComponent(
    `Olá! Quero finalizar meu pedido:\n\n${message}\n\nTotal: ${total.toLocaleString(
      'pt-BR',
      { style: 'currency', currency: 'BRL' }
    )}`
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

          {cart.map((item) => (
           <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />

            <div className="cart-info">
              <strong>{item.name}</strong>
              <p>{item.quantity}x {item.price}</p>
            </div>

            <button
              className="remove-button"
              onClick={() => removeFromCart(item.id)}
            >
              Remover
            </button>
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