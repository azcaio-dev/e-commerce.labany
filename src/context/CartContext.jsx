import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('@loja-labany:cart')

    if (savedCart) {
      return JSON.parse(savedCart)
    }

    return []
  })

  useEffect(() => {
    localStorage.setItem('@loja-labany:cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(product) {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id)

      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prev, { ...product, quantity: 1 }]
    })
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  function clearCart() {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}