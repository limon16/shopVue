<template>
  <div class="cart-item">
    <div class="item-image-container" @click="$emit('click')">
      <img :alt="item.title" :src="item.image" class="item-image">
    </div>

    <div class="item-details">
      <div class="item-info">
        <h3 class="item-title">{{ item.title }}</h3>

        <div class="item-price">
          <div class="price-container">
            <span :class="{ 'discount': item.discount }" class="current-price">
              {{ formatPrice(item.price) }} грн
            </span>
            <span v-if="item.discount" class="original-price">
              {{ formatPrice(item.originalPrice) }} грн
            </span>
          </div>
        </div>
      </div>

      <div class="item-actions">
        <div class="quantity-controls">
          <button
            aria-label="Зменшити кількість"
            class="quantity-btn"
            @click="decrementQuantity"
          >
            <svg fill="none" height="16" stroke="currentColor" stroke-linecap="round"
                 stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16"
                 xmlns="http://www.w3.org/2000/svg">
              <line x1="5" x2="19" y1="12" y2="12"></line>
            </svg>
          </button>

          <input
            v-model.number="quantity"
            class="quantity-input"
            max="99"
            min="1"
            type="number"
            @blur="updateQuantity"
            @keyup.enter="updateQuantity"
          />

          <button
            aria-label="Збільшити кількість"
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

        <div class="item-total">
          <span>Сума: {{ formatPrice(getItemTotal()) }} грн</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useCartStore } from '../stores/cartStore'
  import { Decimal } from 'decimal.js'

  const props = defineProps({
    item: {
      type: Object,
      required: true
    }
  })

  const cartStore = useCartStore()
  const quantity = ref(props.item.quantity)

  watch(() => props.item.quantity, (newQuantity) => {
    quantity.value = newQuantity
  })

  const updateQuantity = () => {
    if (quantity.value < 1) {
      quantity.value = 1
    } else if (quantity.value > 99) {
      quantity.value = 99
    }

    cartStore.updateQuantity(props.item.id, quantity.value)
  }

  const incrementQuantity = () => {
    cartStore.incrementQuantity(props.item.id)
  }

  const decrementQuantity = () => {
    cartStore.decrementQuantity(props.item.id)
  }

  const getItemTotal = () => {
    return new Decimal(props.item.price).times(props.item.quantity).toNumber()
  }

  const formatPrice = (price) => {
    return cartStore.formatPrice(price)
  }
</script>

<style lang="scss" scoped>
  .cart-item {
    display: flex;
    background-color: white;
    border-radius: $border-radius;
    padding: $card-padding;
    margin-bottom: 16px;
    box-shadow: $card-shadow;

    @include responsive(tablet) {
      flex-direction: column;
    }
  }

  .item-image-container {
    cursor: pointer;
    width: 120px;
    height: 120px;
    @include flex-center;
    margin-right: 16px;

    @include responsive(tablet) {
      width: 100%;
      margin-right: 0;
      margin-bottom: 16px;
    }
  }

  .item-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .item-details {
    flex-grow: 1;
    @include flex-column;
    justify-content: space-between;
  }

  .item-info {
    margin-bottom: 12px;
  }

  .item-title {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
    color: $text-dark;
  }

  .price-container {
    @include flex-column;
  }

  .current-price {
    font-weight: 500;
    color: $text-dark;

    &.discount {
      color: $danger-color;
    }
  }

  .original-price {
    text-decoration: line-through;
    color: $text-secondary;
    font-size: 0.9rem;
    margin-top: 4px;
  }

  .item-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;

    @include responsive(tablet) {
      flex-wrap: wrap;
      gap: 12px;
    }
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    border-radius: 4px;
    overflow: hidden;
  }

  .quantity-btn {
    background-color: $background-light;
    border: none;
    padding: 8px 12px;
    @include flex-center;
    cursor: pointer;
    color: $primary-color;
    transition: background-color $transition-duration;

    &:hover {
      background-color: $background-hover;
    }
  }

  .quantity-input {
    width: 40px;
    text-align: center;
    border: none;
    -moz-appearance: textfield;
    appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .item-total {
    height: 100%;
    display: flex;
    align-items: center;
    font-weight: bold;
    margin: 0 16px;
    min-width: 120px;

    @include responsive(tablet) {
      width: 100%;
      margin: 12px 0;
      text-align: right;
    }
  }
</style>
