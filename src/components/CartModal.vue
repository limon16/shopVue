<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">Мій кошик <span
              v-if="cartStore.totalItems > 0">({{ cartStore.totalItems }})</span></h3>
            <button class="modal-close-btn" @click="closeModal">
              <svg fill="none"
                   height="20"
                   stroke="currentColor"
                   stroke-linecap="round"
                   stroke-linejoin="round"
                   stroke-width="2"
                   viewBox="0 0 24 24"
                   width="20"
                   xmlns="http://www.w3.org/2000/svg">
                <line x1="18" x2="6" y1="6" y2="18" />
                <line x1="6" x2="18" y1="6" y2="18" />
              </svg>
            </button>
          </div>

          <div class="modal-content">
            <div v-if="cartStore.cartItems.length === 0" class="empty-cart">
              <div class="empty-cart-message">
                <div class="empty-cart-icon">
                  <svg fill="none" height="80" stroke="currentColor" stroke-linecap="round"
                       stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24" width="80"
                       xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path
                      d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </div>
                <h4>Ваш кошик порожній</h4>
                <p>Перегляньте наші товари та додайте щось до кошика</p>
                <button class="continue-shopping-btn" @click="closeModal">
                  <span>Продовжити покупки</span>
                  <svg fill="none" height="16" stroke="currentColor" stroke-linecap="round"
                       stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16">
                    <line x1="5" x2="19" y1="12" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <div v-else class="cart-content">
              <div class="cart-items">
                <CartItem
                  v-for="item in cartStore.cartItems"
                  :key="item.id"
                  :item="item"
                  @navigate-to-product="navigateToProduct(item)"
                />
              </div>

              <div class="cart-summary">
                <div class="summary-row shipping">
                  <span>Доставка:</span>
                  <span>Безкоштовно</span>
                </div>

                <div class="summary-row discount">
                  <span>Знижка:</span>
                  <span>{{ formatPrice(cartStore.totalDiscount) }}</span>
                </div>

                <div class="summary-row total">
                  <span>Загалом:</span>
                  <span>{{ formatPrice(cartStore.totalPrice) }}</span>
                </div>

                <div class="summary-actions">
                  <button class="checkout-btn" @click="showCheckoutModal = true">
                    Оформити замовлення
                    <svg fill="none" height="16" stroke="currentColor" stroke-linecap="round"
                         stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16">
                      <line x1="5" x2="19" y1="12" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>

                  <button class="clear-cart-btn" @click="showClearCartModal = true">
                    <svg fill="none" height="16" stroke="currentColor" stroke-linecap="round"
                         stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Очистити кошик
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <ConfirmationModal
    v-model:show="showClearCartModal"
    cancel-text="Скасувати"
    confirm-button-class="danger"
    confirm-text="Очистити"
    message="Ви впевнені, що хочете видалити всі товари з кошика?"
    title="Очистити кошик"
    @confirm="confirmClearCart"
  />

  <ConfirmationModal
    v-model:show="showCheckoutModal"
    :show-confirm-btn="false"
    cancel-text="Закрити"
    confirm-text="Зрозуміло"
    message="Функція оформлення замовлення знаходиться в розробці. Дякуємо за розуміння!"
    title="Оформлення замовлення"
  />
</template>

<script setup>
  import { defineEmits, defineProps, inject, ref, watch } from 'vue'
  import { useCartStore } from '../stores/cartStore'
  import CartItem from './CartItem.vue'
  import ConfirmationModal from './ConfirmationModal.vue'
  import router from '@/router/index.js'

  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['update:show'])
  const cartStore = useCartStore()
  const showNotification = inject('showNotification')

  watch(() => props.show, (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  })

  const showClearCartModal = ref(false)
  const showCheckoutModal = ref(false)

  const navigateToProduct = (id) => {
    closeModal()
    router.push({
      name: 'product',
      params: { id }
    })
  }

  const closeModal = () => {
    emit('update:show', false)
    document.body.style.overflow = 'auto'
  }

  const confirmClearCart = () => {
    cartStore.clearCart()
    showNotification('Кошик очищено', 'success')
  }

  const formatPrice = (price) => {
    return cartStore.formatPrice(price) + ' грн'
  }
</script>

<style lang="scss" scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
  }

  .modal-container {
    background-color: white;
    width: 95%;
    max-width: 1200px;
    max-height: 700px;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid $border-color;
  }

  .modal-title {
    margin: 0;
    color: $text-dark;
    font-size: 1.4rem;
    font-weight: 600;

    span {
      font-size: 1.1rem;
      opacity: 0.7;
      font-weight: normal;
    }
  }

  .modal-close-btn {
    background: rgba($primary-color, 0.08);
    border: none;
    cursor: pointer;
    color: $primary-color;
    padding: 8px;
    border-radius: 50%;
    transition: all $transition-duration;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: rgba($primary-color, 0.15);
      transform: rotate(90deg);
    }
  }

  .modal-content {
    padding: 0;
    overflow-y: auto;
    max-height: calc(700px - 80px);
  }

  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    text-align: center;

    &-message {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      color: $text-secondary;
      max-width: 400px;

      h4 {
        font-size: 1.5rem;
        margin: 24px 0 12px;
        color: $text-dark;
      }

      p {
        font-size: 1.1rem;
        margin-bottom: 32px;
        color: $text-secondary;
        line-height: 1.5;
      }
    }

    &-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 120px;
      background-color: rgba($primary-color, 0.1);
      border-radius: 50%;
      margin: 0 auto;

      svg {
        color: $primary-color;
      }
    }
  }

  .continue-shopping-btn {
    background-color: $primary-color;
    color: white;
    border: none;
    border-radius: 30px;
    padding: 14px 28px;
    font-weight: 600;
    cursor: pointer;
    transition: all $transition-duration;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 1.05rem;

    &:hover {
      background-color: $primary-dark;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba($primary-color, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .cart-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 0;

    @include responsive(tablet) {
      grid-template-columns: 1fr;
    }
  }

  .cart-items {
    padding: $standard-padding;
    max-height: 540px;
    overflow-y: auto;
    border-right: 1px solid $border-color;

    @include responsive(tablet) {
      border-right: none;
      border-bottom: 1px solid $border-color;
      max-height: 360px;
    }
  }

  .cart-summary {
    padding: $standard-padding;
    background-color: rgba($background-light, 0.5);
    display: flex;
    flex-direction: column;

    .summary {
      &-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        color: $text-secondary;
        font-size: 1.05rem;

        &.shipping {
          border-bottom: 1px dashed rgba($border-color, 0.8);
        }

        &.discount {
          border-bottom: 1px dashed rgba($border-color, 0.8);
        }

        &.total {
          font-weight: 600;
          font-size: 1.3rem;
          color: $text-dark;
          margin-top: 10px;
          padding-top: 20px;
          border-top: 2px solid $border-color;
        }
      }

      &-actions {
        margin-top: 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    }
  }

  .checkout-btn, .clear-cart-btn {
    border: none;
    border-radius: 30px;
    font-weight: 600;
    cursor: pointer;
    transition: all $transition-duration;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 15px 24px;
    font-size: 1.05rem;
  }

  .checkout-btn {
    background-color: $success-color;
    color: white;

    &:hover {
      background-color: $success-dark;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba($success-color, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .clear-cart-btn {
    background-color: transparent;
    color: $danger-color;
    border: 1px solid $danger-color;

    &:hover {
      background-color: rgba($danger-color, 0.08);
    }
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: all 0.4s cubic-bezier(0.33, 1, 0.68, 1);
  }

  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;

    .modal-container {
      transform: scale(0.9) translateY(20px);
    }
  }

  @include responsive(mobile) {
    .cart-content {
      display: flex;
      flex-direction: column;
    }

    .cart-items {
      max-height: none;
      overflow-y: visible;
    }

    .checkout-btn, .clear-cart-btn {
      padding: 12px 20px;
    }
  }
</style>
