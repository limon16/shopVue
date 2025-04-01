<template>
  <div :class="{ 'fullscreen': fullscreen }" class="loader-overlay">
    <div class="loader">
      <div class="spinner"></div>
      <div class="text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    text: {
      type: String,
      default: 'Завантаження...'
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  })
</script>

<style lang="scss" scoped>
  .loader-overlay {
    @include flex-center;
    padding: 24px 0;
    width: 100%;

    &.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(4px);
      z-index: 9999;
      padding: 0;
    }

    .loader {
      @include flex-column;
      align-items: center;

      .spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba($primary-color, 0.2);
        border-top-color: $primary-color;
        border-radius: 50%;
        animation: spin 1s cubic-bezier(0.17, 0.67, 0.83, 0.67) infinite;
        margin-bottom: 16px;

        .fullscreen & {
          width: 60px;
          height: 60px;
          border-width: 4px;
        }
      }

      .text {
        color: $primary-color;
        font-size: 0.95rem;
        font-weight: 500;

        .fullscreen & {
          font-size: 1.1rem;
          margin-top: 8px;
        }
      }
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
