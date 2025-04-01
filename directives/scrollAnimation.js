export const vScrollAnimation = {
  mounted(el, binding) {
    el.classList.add('fade-in')

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.classList.add('appear')
            }, binding.value?.delay || 0)

            if (binding.value?.once !== false) {
              observer.unobserve(el)
            }
          } else if (binding.value?.once === false) {
            el.classList.remove('appear')
          }
        })
      },
      {
        root: null,
        threshold: binding.value?.threshold || 0.1,
        rootMargin: binding.value?.margin || '0px'
      }
    )

    observer.observe(el)

    el._scrollAnimation = observer
  },

  beforeUnmount(el) {
    if (el._scrollAnimation) {
      el._scrollAnimation.unobserve(el)
      el._scrollAnimation = null
    }
  }
}
