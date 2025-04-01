import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const allProducts = ref([])
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref(null)

  const currentPage = ref(1)
  const limit = ref(8)
  const hasMore = ref(true)

  const showEndMessage = ref(false)

  const fetchProducts = async () => {
    if (products.value.length > 0) return

    loading.value = true
    error.value = null

    try {
      const response = await fetch('https://fakestoreapi.com/products')
      if (!response.ok) throw new Error('Не вдалося завантажити товари')

      const data = await response.json()

      allProducts.value = data.map(product => {
        const hasDiscount = Math.random() > 0.7
        if (hasDiscount) {
          const discountPercent = Math.floor(Math.random() * 30) + 10
          const discountPrice = +(product.price * (1 - discountPercent / 100)).toFixed(2)
          return { ...product, discount: true, discountPercent, discountPrice }
        }
        return { ...product, discount: false }
      })

      products.value = allProducts.value.slice(0, limit.value)
      hasMore.value = allProducts.value.length > products.value.length
    } catch (err) {
      console.error('Помилка при отриманні товарів:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchProductById = async id => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`)
      if (!response.ok) throw new Error('Не вдалося завантажити товар')

      const data = await response.json()

      const hasDiscount = Math.random() > 0.7
      if (hasDiscount) {
        const discountPercent = Math.floor(Math.random() * 30) + 10
        const discountPrice = +(data.price * (1 - discountPercent / 100)).toFixed(2)
        return { ...data, discount: true, discountPercent, discountPrice }
      }
      return { ...data, discount: false }
    } catch (err) {
      throw err
    }
  }

  const loadMoreProducts = async () => {
    if (products.value.length >= allProducts.value.length) {
      showEndMessage.value = true
      return
    }

    if (loadingMore.value) return
    loadingMore.value = true

    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      const nextPage = currentPage.value + 1
      const startIndex = currentPage.value * limit.value
      const endIndex = nextPage * limit.value

      const nextProducts = allProducts.value.slice(startIndex, endIndex)
      products.value = [...products.value, ...nextProducts]
      currentPage.value = nextPage

      hasMore.value = products.value.length < allProducts.value.length

      if (!hasMore.value) {
        showEndMessage.value = true
      }
    } catch (err) {
      console.error('Помилка при завантаженні додаткових товарів:', err)
      error.value = err.message
    } finally {
      loadingMore.value = false
    }
  }

  const getProductById = computed(() => {
    return id => allProducts.value.find(product => product.id === parseInt(id))
  })

  const hideEndMessage = () => {
    showEndMessage.value = false
  }

  const forceShowEndMessage = () => {
    if (products.value.length >= allProducts.value.length) {
      showEndMessage.value = true
    }
  }

  const resetHasMoreStatus = () => {
    if (products.value.length >= allProducts.value.length) {
      showEndMessage.value = false
    }
  }

  const isAllProductsLoaded = computed(() => {
    return products.value.length >= allProducts.value.length
  })

  return {
    products,
    loading,
    loadingMore,
    error,
    hasMore,
    showEndMessage,
    isAllProductsLoaded,
    fetchProducts,
    loadMoreProducts,
    getProductById,
    hideEndMessage,
    forceShowEndMessage,
    resetHasMoreStatus,
    fetchProductById
  }
})
