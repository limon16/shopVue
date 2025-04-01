<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="modal-overlay" @click="closeOnOutsideClick && close()">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close-btn" @click="close">
              <svg fill="none"
                   height="20"
                   stroke="currentColor"
                   stroke-linecap="round"
                   stroke-linejoin="round"
                   stroke-width="2"
                   viewBox="0 0 24 24"
                   width="20"
                   xmlns="http://www.w3.org/2000/svg">
                <line x1="18"
                      x2="6"
                      y1="6"
                      y2="18" />
                <line x1="6"
                      x2="18"
                      y1="6"
                      y2="18" />
              </svg>
            </button>
          </div>

          <div class="modal-content">
            <p class="modal-message">{{ message }}</p>
          </div>

          <div class="modal-footer">
            <button
              :class="{ 'single-btn': !showConfirmBtn }"
              class="modal-btn cancel-btn"
              @click="close"
            >
              {{ cancelText }}
            </button>
            <button
              v-if="showConfirmBtn"
              :class="confirmButtonClass"
              class="modal-btn confirm-btn"
              @click="confirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
  import { defineEmits, defineProps } from 'vue'

  defineProps({
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Підтвердження'
    },
    message: {
      type: String,
      default: 'Ви впевнені?'
    },
    confirmText: {
      type: String,
      default: 'Підтвердити'
    },
    cancelText: {
      type: String,
      default: 'Скасувати'
    },
    showConfirmBtn: {
      type: Boolean,
      default: true
    },
    confirmButtonClass: {
      type: String,
      default: ''
    },
    closeOnOutsideClick: {
      type: Boolean,
      default: true
    }
  })

  const emit = defineEmits(['confirm', 'cancel', 'update:show'])

  const confirm = () => {
    emit('confirm')
    emit('update:show', false)
  }

  const close = () => {
    emit('cancel')
    emit('update:show', false)
  }
</script>

<style lang="scss" scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    @include flex-center;
    z-index: 1000;
    backdrop-filter: blur(3px);
  }

  .modal-container {
    background-color: white;
    width: 95%;
    max-width: 400px;
    border-radius: $border-radius + 4px;
    box-shadow: $dropdown-shadow;
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid $border-color;
  }

  .modal-title {
    margin: 0;
    color: $text-dark;
    font-size: 1.2rem;
  }

  .modal-close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: $text-secondary;
    padding: 4px;
    border-radius: 50%;
    transition: background-color $transition-duration;
    @include flex-center;

    &:hover {
      background-color: $background-hover;
    }
  }

  .modal-content {
    padding: $standard-padding;
  }

  .modal-message {
    margin: 0;
    font-size: 1.05rem;
    color: $text-dark;
    line-height: 1.5;
  }

  .modal-footer {
    padding: 16px 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid $border-color;
  }

  .modal-btn {
    @include button-base;
    padding: 8px 16px;
    font-size: 0.95rem;
  }

  .cancel-btn {
    background-color: $background-light;
    color: $text-dark;
    border: 1px solid $border-color;

    &:hover {
      background-color: $background-hover;
    }

    &.single-btn {
      margin-left: auto;
    }
  }

  .confirm-btn {
    background-color: $primary-color;
    color: white;

    &:hover {
      background-color: $primary-dark;
    }

    &.danger {
      background-color: $danger-color;

      &:hover {
        background-color: #c0392b;
      }
    }

    &.warning {
      background-color: $warning-color;

      &:hover {
        background-color: #d68910;
      }
    }

    &.success {
      background-color: $success-color;

      &:hover {
        background-color: $success-dark;
      }
    }
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: all $transition-duration;
  }

  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;

    .modal-container {
      transform: scale(0.9);
    }
  }
</style>
