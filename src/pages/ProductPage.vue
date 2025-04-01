<template>
  <div class="product-page">
    <div v-if="loading" class="loading">
      <div class="loader"></div>
      <span>Завантаження товару...</span>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <router-link class="back-link" to="/">
        Повернутися до списку товарів
      </router-link>
    </div>

    <template v-else-if="product">
      <div class="product-nav">
        <router-link class="back-link" to="/">
          &larr; Назад до списку товарів
        </router-link>
      </div>

      <div class="product-details">
        <div v-scroll-animation="{ delay: 100 }" class="product-image-container">
          <img :alt="product.title" :src="product.image" class="product-image">
          <span v-if="product.discount" class="discount-badge">
            -{{ product.discountPercent }}%
          </span>
        </div>

        <div v-scroll-animation="{ delay: 300 }" class="product-info">
          <h1 class="product-title">{{ product.title }}</h1>

          <div class="product-category">
            Категорія: <span>{{ product.category }}</span>
          </div>

          <div class="product-rating">
            <div :style="{ '--rating': product.rating.rate }" class="stars">
              <span>★★★★★</span>
            </div>
            <span class="rating-count">({{ product.rating.count }} відгуків)</span>
          </div>

          <div class="product-price">
            <template v-if="product.discount">
              <span class="discount-price">{{ formatPrice(product.discountPrice) }}</span>
              <span class="original-price">{{ formatPrice(product.price) }}</span>
              <span class="discount-percent">-{{ product.discountPercent }}%</span>
            </template>
            <template v-else>
              <span class="regular-price">{{ formatPrice(product.price) }}</span>
            </template>
          </div>

          <div class="product-description">
            <h3>Опис:</h3>
            <p>{{ product.description }}</p>
          </div>

          <div class="product-actions">
            <div v-if="isInCart" class="quantity-controls">
              <button
                class="quantity-btn"
                @click="decrementQuantity"
              >
                <svg fill="none" height="16" stroke="currentColor" stroke-linecap="round"
                     stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16"
                     xmlns="http://www.w3.org/2000/svg">
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
              </button>

              <span class="quantity">{{ cartItemQuantity }}</span>

              <button
                class="quantity-btn"
                @click="incrementQuantity"
              >
                <svg fill="none" height="16" stroke="currentColor" stroke-linecap="round"
                     stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16"
                     xmlns="http://www.w3.org/2000/svg">
                  <line x1="12" x2="12" y1="5" y2="19"></line>
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
              </button>
            </div>
            <button v-else class="add-to-cart-btn" @click="addToCart">
              Додати до кошика
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
  import { computed, inject, onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useProductStore } from '../stores/productStore'
  import { useCartStore } from '../stores/cartStore'

  const route = useRoute()
  const productStore = useProductStore()
  const cartStore = useCartStore()
  const showNotification = inject('showNotification')

  const loading = ref(true)
  const error = ref(null)
  const product = ref(null)

  const loadProduct = async (id) => {
    loading.value = true
    error.value = null

    try {
      const productId = parseInt(id)
      const existingProduct = productStore.getProductById(productId)

      if (existingProduct) {
        product.value = existingProduct
      } else {
        product.value = await productStore.fetchProductById(productId)
      }

      if (!product.value) {
        error.value = 'Товар не знайдено'
      }
    } catch (err) {
      error.value = 'Помилка при завантаженні товару'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadProduct(route.params.id)
  })

  watch(() => route.params.id, (newId) => {
    if (newId) {
      loadProduct(newId)
    }
  })

  const addToCart = () => {
    if (product.value) {
      cartStore.addToCart(product.value)
      showNotification(`"${product.value.title.substring(0, 20)}${product.value.title.length > 20 ? '...' : ''}" додано до кошика`, 'success')
    }
  }

  const isInCart = computed(() => {
    if (!product.value) return false
    return cartStore.isInCart(product.value.id)
  })

  const cartItemQuantity = computed(() => {
    if (!product.value) return 0
    return cartStore.getItemQuantity(product.value.id)
  })

  const incrementQuantity = () => {
    if (product.value) {
      cartStore.incrementQuantity(product.value.id)
    }
  }

  const decrementQuantity = () => {
    if (product.value) {
      cartStore.decrementQuantity(product.value.id)
    }
  }

  const formatPrice = (price) => {
    return `${price} грн`
  }
</script>

<style lang="scss" scoped>
  .product-page {
    padding: 20px 0;
  }

  .loading, .error {
    text-align: center;
    padding: 40px 0;
  }

  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid $primary-dark;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  .error {
    color: $danger-color;
  }

  .back-link {
    display: inline-block;
    margin: 16px 0;
    color: $primary-color;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: $primary-dark;
    }
  }

  .product-details {
    display: flex;
    gap: 32px;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);;

    @include responsive(mobile) {
      flex-direction: column;
    }
  }

  .product-image-container {
    flex: 0 0 40%;
    position: relative;
    padding: 24px;
    @include flex-center;
    background-color: $background-light;

    @include responsive(mobile) {
      padding: 16px;
    }

    .product-image {
      max-width: 100%;
      max-height: 400px;
      object-fit: contain;
    }

    .discount-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background-color: $danger-color;
      color: white;
      padding: 4px 8px;
      border-radius: $border-radius;
      font-weight: bold;
    }
  }

  .product-info {
    flex: 1;
    padding: 24px;

    @include responsive(mobile) {
      padding: 16px;
    }

    .product-title {
      margin: 0 0 16px 0;
      color: $text-color;
    }

    .product-category {
      margin-bottom: 16px;
      color: $text-secondary;

      span {
        color: $primary-color;
        text-transform: capitalize;
      }
    }

    .product-rating {
      display: flex;
      align-items: center;
      margin-bottom: 16px;

      .stars {
        position: relative;
        color: $star-color;
        font-size: 1.2rem;
        display: inline-block;
        overflow: hidden;

        &::before {
          content: "★★★★★";
          position: absolute;
          left: 0;
          top: 0;
          width: calc(var(--rating) * 20%);
          overflow: hidden;
          color: $star-color;
        }

        span {
          color: $star-empty;
        }
      }

      .rating-count {
        margin-left: 8px;
        color: $text-secondary;
        font-size: 0.9rem;
      }
    }

    .product-price {
      margin: 16px 0;
      display: flex;
      align-items: center;

      .discount-price {
        font-size: 1.5rem;
        font-weight: bold;
        color: $danger-color;
        margin-right: 12px;
      }

      .original-price {
        color: $text-secondary;
        text-decoration: line-through;
      }

      .discount-percent {
        margin-left: 8px;
        background-color: $danger-color;
        color: white;
        padding: 2px 6px;
        border-radius: $border-radius;
        font-size: 0.8rem;
        font-weight: bold;
      }

      .regular-price {
        font-size: 1.5rem;
        font-weight: bold;
        color: $text-color;
      }
    }

    .product-description {
      margin: 24px 0;

      h3 {
        margin-bottom: 8px;
        color: $text-color;
      }

      p {
        line-height: 1.6;
        color: $text-color;
      }
    }

    .product-actions {
      margin-top: 24px;

      .add-to-cart-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        @include button-base;
        background-color: $primary-color;
        color: white;
        padding: 12px 24px;
        height: 34px;

        &:hover {
          background-color: $primary-dark;
        }
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        border: 1px solid $border-color;
        border-radius: $border-radius;
        overflow: hidden;
        width: 100%;
        max-width: 200px;
        height: 34px;

        .quantity-btn {
          border: none;
          height: 100%;
          background-color: $background-light;
          padding: 10px 16px;
          cursor: pointer;
          transition: background-color 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          color: $primary-color;

          &:hover:not(:disabled) {
            background-color: #e9ecef;
          }

          &:disabled {
            color: #bdc3c7;
            cursor: not-allowed;
          }
        }

        .quantity {
          flex-grow: 1;
          text-align: center;
          font-weight: bold;
          color: $text-color;
          padding: 4px 0;
          font-size: 1.1rem;
        }
      }
    }
  }
</style>
