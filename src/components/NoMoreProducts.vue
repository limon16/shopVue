<template>
  <Transition name="slide-up">
    <div v-if="isVisible" class="no-more-products">
      <p>Це всі доступні товари</p>
    </div>
  </Transition>
</template>

<script setup>
  import { defineEmits, defineProps, ref, watch } from 'vue'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    hideDelay: {
      type: Number,
      default: 1600
    }
  })

  const emit = defineEmits(['hide'])
  const isVisible = ref(false)

  watch(() => props.visible, (newValue) => {
    if (newValue) {
      isVisible.value = true
      setTimeout(() => {
        emit('hide')
        isVisible.value = false
      }, props.hideDelay)
    }
  }, { immediate: true })
</script>

<style lang="scss" scoped>
  @include keyframes-slide('slideIn', $slide-distance, 0, 0, 1);
  @include keyframes-slide('slideOut', 0, -$slide-distance, 1, 0);

  .no-more-products {
    text-align: center;
    padding: 20px 0;
    color: $text-secondary;
    font-style: italic;
    background-color: rgba($background-light, 0.8);
    border-radius: $border-radius;
    margin: 20px auto 20px;
    max-width: 320px;
    overflow: hidden;
  }

  .slide-up-enter-active {
    @include slide-animation('In', $animation-easing-out);
  }

  .slide-up-leave-active {
    @include slide-animation('Out', $animation-easing-in);
  }
</style>
