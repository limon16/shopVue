import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Decimal } from 'decimal.js'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([])

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      cartItems.value = JSON.parse(savedCart)
    }
  }

  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cartItems.value))
  }

  const addToCart = product => {
    const existingItem = cartItems.value.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      const price = product.discount ? product.discountPrice : product.price
      cartItems.value.push({
        id: product.id,
        title: product.title,
        price: price,
        originalPrice: product.price,
        image: product.image,
        quantity: 1,
        discount: product.discount || false
      })
    }

    saveCart()
  }

  const removeFromCart = productId => {
    cartItems.value = cartItems.value.filter(item => item.id !== productId)
    saveCart()
  }

  const updateQuantity = (productId, quantity) => {
    const item = cartItems.value.find(item => item.id === productId)

    if (item) {
      item.quantity = Math.max(1, Math.min(99, quantity))
      saveCart()
    }
  }

  const incrementQuantity = productId => {
    const item = cartItems.value.find(item => item.id === productId)
    if (item && item.quantity < 99) {
      item.quantity += 1
      saveCart()
    }
  }

  const decrementQuantity = productId => {
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1
      } else {
        removeFromCart(productId)
        return
      }
      saveCart()
    }
  }

  const clearCart = () => {
    cartItems.value = []
    saveCart()
  }

  const totalItems = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return cartItems.value.reduce((sum, item) => {
      const itemPrice = new Decimal(item.price)
      const quantity = new Decimal(item.quantity)
      const itemTotal = itemPrice.times(quantity)

      return new Decimal(sum).plus(itemTotal).toNumber()
    }, 0)
  })

  const formatPrice = price => {
    return new Decimal(price).toFixed(2)
  }

  const isInCart = productId => {
    return cartItems.value.some(item => item.id === productId)
  }

  const getItemQuantity = productId => {
    const item = cartItems.value.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const totalDiscount = computed(() => {
    return cartItems.value.reduce((sum, item) => {
      if (item.discount) {
        const originalPrice = new Decimal(item.originalPrice)
        const discountPrice = new Decimal(item.price)
        const quantity = new Decimal(item.quantity)
        const itemDiscount = originalPrice.minus(discountPrice).times(quantity)
        return new Decimal(sum).plus(itemDiscount).toNumber()
      }
      return sum
    }, 0)
  })

  loadCart()

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    totalItems,
    totalPrice,
    formatPrice,
    isInCart,
    getItemQuantity,
    totalDiscount
  }
})
