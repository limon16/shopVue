<template>
  <Teleport to="body">
    <TransitionGroup name="notification-list">
      <div
        v-if="visible"
        :key="message"
        :class="[type, { 'with-progress': autoClose }]"
        class="notification"
        @mouseenter="pauseTimer"
        @mouseleave="resumeTimer"
      >
        <div class="notification-content">
          <div class="notification-icon">
            <svg v-if="type === 'success'" fill="none" height="24"
                 stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <svg v-else-if="type === 'error'" fill="none" height="24"
                 stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m15 9-6 6M9 9l6 6" />
            </svg>
            <svg v-else-if="type === 'info'" fill="none" height="24"
                 stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="24"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>

          <div class="notification-message">{{ message }}</div>

          <button class="close-btn" @click="closeNotification">
            <svg fill="none" height="16" stroke="currentColor" stroke-width="2"
                 viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="autoClose" :style="{ '--progress-duration': `${duration}ms` }"
             class="progress-bar"></div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
  import { defineEmits, defineProps, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  const props = defineProps({
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'success'
    },
    duration: {
      type: Number,
      default: 3000
    },
    visible: {
      type: Boolean,
      default: false
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  })

  const emit = defineEmits(['hide'])

  let timer = null
  let remainingTime = ref(props.duration)
  let startTime = null

  const closeNotification = () => {
    emit('hide')
    clearTimer()
  }

  const startTimer = () => {
    if (props.autoClose && props.visible) {
      startTime = Date.now()
      timer = setTimeout(() => {
        closeNotification()
      }, remainingTime.value)
    }
  }

  const pauseTimer = () => {
    if (timer) {
      clearTimeout(timer)
      const elapsedTime = Date.now() - startTime
      remainingTime.value = Math.max(0, remainingTime.value - elapsedTime)
    }
  }

  const resumeTimer = () => {
    if (props.autoClose && props.visible) {
      startTimer()
    }
  }

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  watch(() => props.duration, (newDuration) => {
    remainingTime.value = newDuration
    clearTimer()
    if (props.visible) {
      startTimer()
    }
  })

  watch(() => props.visible, (isVisible) => {
    if (isVisible) {
      remainingTime.value = props.duration
      startTimer()
    } else {
      clearTimer()
    }
  })

  onMounted(() => {
    if (props.visible && props.autoClose) {
      startTimer()
    }
  })

  onBeforeUnmount(() => {
    clearTimer()
  })
</script>

<style lang="scss" scoped>
  .notification {
    position: fixed;
    top: 20px;
    left: 20px;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    min-width: 320px;
    max-width: 450px;
    overflow: hidden;
    cursor: default;
    transform: translateY(0);
    z-index: 10000;
    border: 1px solid rgba(255, 255, 255, 0.2);

    &-content {
      display: flex;
      align-items: center;
    }

    &-icon {
      margin-right: 12px;
      @include flex-center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    &-message {
      font-size: 0.95rem;
      flex-grow: 1;
      margin-right: 8px;
      font-weight: 500;
      line-height: 1.4;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: inherit;
      opacity: 0.6;
      cursor: pointer;
      width: 28px;
      height: 28px;
      @include flex-center;
      border-radius: 50%;
      transition: all $transition-duration;

      &:hover {
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.08);
        transform: rotate(90deg);
      }
    }

    &.success {
      background-color: rgba(255, 255, 255, 0.95);
      border-left: 4px solid $success-color;
      box-shadow: 0 8px 20px rgba($success-color, 0.3);
      color: #25a25a;

      .notification-icon {
        color: $success-color;
        background-color: rgba($success-color, 0.15);
        padding: 8px;
      }
    }

    &.error {
      background-color: rgba(255, 255, 255, 0.95);
      border-left: 4px solid $danger-color;
      box-shadow: 0 8px 20px rgba($danger-color, 0.3);
      color: #d44235;

      .notification-icon {
        color: $danger-color;
        background-color: rgba($danger-color, 0.15);
        padding: 8px;
      }
    }

    &.info {
      background-color: rgba(255, 255, 255, 0.95);
      border-left: 4px solid $primary-color;
      box-shadow: 0 8px 20px rgba($primary-color, 0.3);
      color: $primary-color;

      .notification-icon {
        color: $primary-color;
        background-color: rgba($primary-color, 0.15);
        padding: 8px;
      }
    }

    &.with-progress {
      padding-bottom: 24px;
    }

    .progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4px;
      background-color: currentColor;
      opacity: 0.4;
      width: 100%;
      transform-origin: left;
      animation: progress var(--progress-duration) linear forwards;
      border-radius: 0 0 2px 2px;
    }
  }

  @keyframes progress {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }

  .notification-list-enter-active {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .notification-list-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .notification-list-enter-from {
    opacity: 0;
    transform: translateX(20px) translateY(-10px);
  }

  .notification-list-leave-to {
    opacity: 0;
    transform: translateX(20px) translateY(10px);
  }

  @include responsive(mobile) {
    .notification {
      right: 16px;
      left: 16px;
      min-width: auto;
      max-width: none;
      border-radius: 10px;
    }
  }
</style>
