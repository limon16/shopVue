import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './assets/scss/main.css'
import { vScrollAnimation } from '../directives/scrollAnimation.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.directive('scroll-animation', vScrollAnimation)

app.mount('#app')
