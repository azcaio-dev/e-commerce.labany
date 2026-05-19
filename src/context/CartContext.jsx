import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

function getStoreSlugFromUrl() {
  const slug = window.location.pathname.split('/')[1]
  return slug || 'labany'
}

function getCartKey() {
  const storeSlug = getStoreSlugFromUrl()
  return `@orby:${storeSlug}:cart`
}

function getInitialCart() {
  const savedCart = localStorage.getItem(getCartKey())
  return savedCart ? JSON.parse(savedCart) : []
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(getInitialCart)

  function saveCart(newCart) {
    localStorage.setItem(getCartKey(), JSON.stringify(newCart))
    setCart(newCart)
  }

  function addToCart(product) {
    const storeSlug = getStoreSlugFromUrl()

    setCart((prev) => {
      const exists = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
      )

      let updatedCart

      if (exists) {
        updatedCart = prev.map((item) =>
          item.id === product.id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        updatedCart = [...prev, { ...product, storeSlug, quantity: 1 }]
      }

      localStorage.setItem(getCartKey(), JSON.stringify(updatedCart))
      return updatedCart
    })
  }

  function removeFromCart(id, selectedSize, selectedColor) {
    const updatedCart = cart.filter(
      (item) =>
        !(
          item.id === id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
        )
    )

    saveCart(updatedCart)
  }

  function increaseQuantity(id, selectedSize, selectedColor) {
    const updatedCart = cart.map((item) =>
      item.id === id &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )

    saveCart(updatedCart)
  }

  function decreaseQuantity(id, selectedSize, selectedColor) {
    const updatedCart = cart
      .map((item) =>
        item.id === id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0)

    saveCart(updatedCart)
  }

  function clearCart() {
    saveCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}