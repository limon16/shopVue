<template>
  <div class="app-layout">
    <header class="header">
      <div class="container">
        <div class="header-content">
          <router-link class="logo" to="/">
            <h1>ShopVue</h1>
          </router-link>

          <nav class="navigation">
            <ul class="nav-links">
              <li>
                <router-link to="/">Товари</router-link>
              </li>
            </ul>
          </nav>

          <div class="header-actions">
            <button class="cart-button" @click="openCartModal">
              <svg fill="none" height="24" stroke="currentColor" stroke-linecap="round"
                   stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
                   xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span v-if="cartStore.totalItems > 0" class="cart-count">
                {{ cartStore.totalItems }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <router-view v-slot="{ Component, route }">
          <transition :name="route.meta.transition || 'fade'" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <CartModal v-model:show="isCartModalOpen" />

    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 ShopVue. Тестове завдання.</p>
      </div>
    </footer>

    <Notification
      :message="notificationMessage"
      :type="notificationType"
      :visible="isNotificationVisible"
      @hide="hideNotification"
    />

    <transition name="fade">
      <button v-if="showBackToTop" aria-label="Вгору" class="back-to-top-btn" @click="scrollToTop">
        <svg fill="none" height="24" stroke="currentColor" stroke-linecap="round"
             stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24"
             xmlns="http://www.w3.org/2000/svg">
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </transition>
  </div>
</template>

<script setup>
  import { onMounted, onUnmounted, provide, ref } from 'vue'
  import { useCartStore } from '../stores/cartStore'
  import Notification from '../components/Notification.vue'
  import CartModal from '../components/CartModal.vue'

  const cartStore = useCartStore()
  const isCartModalOpen = ref(false)

  const notificationMessage = ref('')
  const notificationType = ref('success')
  const isNotificationVisible = ref(false)
  let notificationTimeout = null

  const showBackToTop = ref(false)

  const openCartModal = () => {
    isCartModalOpen.value = true
  }

  const showNotification = (message, type = 'success', duration = 3000) => {
    if (notificationTimeout) {
      clearTimeout(notificationTimeout)
    }

    notificationMessage.value = message
    notificationType.value = type
    isNotificationVisible.value = true

    notificationTimeout = setTimeout(() => {
      hideNotification()
    }, duration)
  }

  const hideNotification = () => {
    isNotificationVisible.value = false
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const checkScrollPosition = () => {
    if (window.scrollY > 500) {
      showBackToTop.value = true
    } else {
      showBackToTop.value = false
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', checkScrollPosition)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', checkScrollPosition)
  })

  provide('showNotification', showNotification)
</script>

<style lang="scss" scoped>
  .cart-button {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    color: $text-color;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all $transition-duration;

    &:hover {
      color: $primary-color;
      background-color: rgba($primary-color, 0.1);
    }

    .cart-count {
      position: absolute;
      top: 0;
      right: 0;
      background-color: $danger-color;
      color: white;
      font-size: 0.75rem;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
  }

  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .header {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
  }

  .logo {
    text-decoration: none;
    color: $primary-color;

    h1 {
      font-size: 1.5rem;
      margin: 0;
    }
  }

  .navigation {
    margin: 0 16px;
  }

  .nav-links {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin: 0 12px;
    }

    a {
      text-decoration: none;
      color: $text-color;
      font-weight: 500;
      transition: color $transition-duration;

      &:hover,
      &.router-link-active {
        color: $primary-color;
      }
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
  }

  .main-content {
    flex-grow: 1;
    padding: 24px 0;
  }

  .footer {
    background-color: $background-light;
    padding: 20px 0;
    margin-top: auto;
    text-align: center;
    color: $text-secondary;
  }

  .back-to-top-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: $primary-color;
    color: white;
    border: none;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    z-index: 40;

    &:hover {
      transform: translateY(-3px);
      background-color: $primary-dark;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
    }

    &:active {
      transform: translateY(-1px);
    }

    svg {
      transform: translateY(-1px);
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }

  @include responsive(tablet) {
    .header-content {
      flex-wrap: wrap;
    }

    .navigation {
      order: 3;
      width: 100%;
      margin: 16px 0 0 0;
    }

    .nav-links {
      justify-content: center;
    }

    .back-to-top-btn {
      width: 45px;
      height: 45px;
      bottom: 20px;
      right: 20px;
    }
  }

  @include responsive(mobile) {
    .back-to-top-btn {
      width: 40px;
      height: 40px;
      bottom: 15px;
      right: 15px;
    }
  }
</style>
