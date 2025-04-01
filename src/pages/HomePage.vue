<template>
  <div class="home-page">
    <h1 class="page-title">Наші товари</h1>

    <div v-if="productStore.loading && productStore.products.length === 0" class="loading">
      <LoaderSpinner text="Завантаження товарів..." />
    </div>

    <div v-else-if="productStore.error && productStore.products.length === 0" class="error">
      <p>На жаль, сталася помилка при завантаженні товарів:</p>
      <p>{{ productStore.error }}</p>
      <button class="retry-btn" @click="productStore.fetchProducts">
        Спробувати знову
      </button>
    </div>

    <div v-else-if="productStore.products.length === 0" class="no-products">
      <p>Наразі немає доступних товарів.</p>
    </div>

    <template v-else>
      <div class="products-grid">
        <ProductCard
          v-for="(product, index) in productStore.products"
          :key="product.id"
          v-scroll-animation="{ delay: index % 8 * 100 }"
          :product="product"
        />
      </div>

      <div ref="scrollObserver" class="scroll-observer"></div>

      <div v-if="productStore.loadingMore" class="loading-more">
        <LoaderSpinner fullscreen text="Завантажуємо товари..." />
      </div>

      <NoMoreProducts
        :hide-delay="2200"
        :visible="productStore.showEndMessage"
        @hide="productStore.hideEndMessage"
      />
    </template>
  </div>
</template>

<script setup>
  import { onMounted, onUnmounted, ref } from 'vue'
  import { useProductStore } from '../stores/productStore'
  import ProductCard from '../components/ProductCard.vue'
  import LoaderSpinner from '../components/LoaderSpinner.vue'
  import NoMoreProducts from '@/components/NoMoreProducts.vue'
  import { useRoute } from 'vue-router'

  const productStore = useProductStore()
  const route = useRoute()

  const scrollObserver = ref(null)
  let observer = null

  const setupInfiniteScroll = () => {
    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!productStore.isAllProductsLoaded && !productStore.loadingMore && !productStore.showEndMessage) {
          productStore.loadMoreProducts()
        } else if (productStore.isAllProductsLoaded && !productStore.showEndMessage) {
          productStore.forceShowEndMessage()
        }
      }
    }, {
      rootMargin: '100px',
      threshold: 0.1
    })

    if (scrollObserver.value) {
      observer.observe(scrollObserver.value)
    }
  }

  const handleScroll = () => {
    if (window.scrollY < 200) {
      productStore.resetHasMoreStatus()
    }
  }

  onUnmounted(() => {
    if (observer && scrollObserver.value) {
      observer.unobserve(scrollObserver.value)
      observer = null
    }
    window.removeEventListener('scroll', handleScroll)
  })

  onMounted(async () => {
    await productStore.fetchProducts()

    setupInfiniteScroll()

    window.addEventListener('scroll', handleScroll)
  })
</script>

<style lang="scss" scoped>
  .home-page {
    padding: $standard-padding 0;

    .page-title {
      margin-bottom: $standard-margin;
      color: $text-color;
    }

    .products-grid {
      @include responsive-grid(250px, $standard-margin);

      @include responsive(tablet) {
        @include responsive-grid(200px, 16px);
      }

      @include responsive(mobile) {
        @include responsive-grid(150px, 12px);
      }
    }

    .loading, .error, .no-products {
      @include flex-center;
    }

    .error {
      color: $danger-color;
    }

    .retry-btn {
      @include primary-button;
      padding: 8px 16px;
      margin-top: 16px;
      font-weight: bold;
    }

    .scroll-observer {
      width: 100%;
    }

    .loading-more {
      margin: $card-padding 0;
    }
  }
</style>
