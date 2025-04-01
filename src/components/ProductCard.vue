<template>
  <div class="product-card" @click="$emit('click')">
    <router-link :to="{ name: 'product', params: { id: product.id } }" class="product-link">
      <div class="product-image">
        <img :alt="product.title" :src="product.image" />
        <span v-if="product.discount" class="discount-badge">
          -{{ product.discountPercent }}%
        </span>
      </div>
      <h3 class="product-title">{{ product.title }}</h3>
    </router-link>

    <div class="product-price">
      <template v-if="product.discount">
        <span class="discount-price">{{ formatPrice(product.discountPrice) }}</span>
        <span class="original-price">{{ formatPrice(product.price) }}</span>
      </template>
      <template v-else>
        <span class="regular-price">{{ formatPrice(product.price) }}</span>
      </template>
    </div>

    <div v-if="isInCart" class="quantity-controls">
      <button
        class="quantity-btn"
        @click="decrementQuantity($event)"
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
        @click="incrementQuantity($event)"
      >
        <svg fill="none" height="16" stroke="currentColor" stroke-linecap="round"
             stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16"
             xmlns="http://www.w3.org/2000/svg">
          <line x1="12" x2="12" y1="5" y2="19"></line>
          <line x1="5" x2="19" y1="12" y2="12"></line>
        </svg>
      </button>
    </div>
    <button v-else class="add-to-cart-btn" @click="addToCart($event)">
      Додати до кошика
    </button>
  </div>
</template>

<script setup>
  import { useCartStore } from '../stores/cartStore'
  import { computed, defineEmits, defineProps, inject } from 'vue'

  const props = defineProps({
    product: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits(['addToCart', 'click'])
  const cartStore = useCartStore()
  const showNotification = inject('showNotification')

  const isInCart = computed(() => {
    return cartStore.cartItems.some(item => item.id === props.product.id)
  })

  const cartItemQuantity = computed(() => {
    const cartItem = cartStore.cartItems.find(item => item.id === props.product.id)
    return cartItem ? cartItem.quantity : 0
  })

  const addToCart = (event) => {
    event.stopPropagation()

    cartStore.addToCart(props.product)
    emit('addToCart', props.product)
    showNotification(`"${props.product.title.substring(0, 20)}${props.product.title.length > 20 ? '...' : ''}" додано до кошика`, 'success')
  }

  const incrementQuantity = (event) => {
    event.stopPropagation()
    cartStore.incrementQuantity(props.product.id)
  }

  const decrementQuantity = (event) => {
    event.stopPropagation()
    const currentQuantity = cartItemQuantity.value
    if (currentQuantity === 1) {
      showNotification(`"${props.product.title.substring(0, 20)}${props.product.title.length > 20 ? '...' : ''}" видалено з кошика`, 'info')
    }

    cartStore.decrementQuantity(props.product.id)
  }

  const formatPrice = (price) => {
    return `${price} грн`
  }
</script>

<style lang="scss" scoped>
  .product-card {
    @include card-base;
    @include card-hover;
    padding: $card-padding;
    height: 100%;
    @include flex-column;

    .product-link {
      text-decoration: none;
      color: inherit;
      display: block;
      flex-grow: 1;

      .product-image {
        position: relative;
        height: 200px;
        @include flex-center;
        margin-bottom: 12px;

        img {
          max-width: 100%;
          max-height: 180px;
          object-fit: contain;
        }

        .discount-badge {
          position: absolute;
          top: 0;
          right: 0;
          background-color: $danger-color;
          color: white;
          padding: 4px 8px;
          border-radius: $border-radius;
          font-weight: bold;
          font-size: 0.8rem;
        }
      }

      .product-title {
        font-size: 1rem;
        margin: 8px 0;
        height: 3em;
        @include text-truncate(2);
        color: $text-color;
      }
    }

    .product-price {
      margin: 10px 0;
      font-weight: bold;

      .discount-price {
        color: $danger-color;
        font-size: 1.1rem;
        margin-right: 8px;
      }

      .original-price {
        color: $text-secondary;
        text-decoration: line-through;
        font-size: 0.9rem;
      }

      .regular-price {
        color: $text-dark;
        font-size: 1.1rem;
      }
    }

    .add-to-cart-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      @include primary-button;
      width: 100%;
      margin-top: auto;
      height: 34px;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      border: 1px solid $border-color;
      border-radius: $border-radius;
      overflow: hidden;

      .quantity-btn {
        border: none;
        background-color: $background-light;
        padding: 8px 12px;
        cursor: pointer;
        transition: background-color $transition-duration;
        @include flex-center;
        color: $primary-color;

        &:hover:not(:disabled) {
          background-color: $background-hover;
        }

        &:disabled {
          color: $disabled-color;
          cursor: not-allowed;
        }
      }

      .quantity {
        flex-grow: 1;
        text-align: center;
        font-weight: bold;
        color: $text-dark;
      }
    }
  }
</style>
