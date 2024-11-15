import 'virtual:uno.css'
import 'virtual:svg-icons-register'
import './styles/theme/index.scss'

// import.meta.glob('../node_modules/element-plus/es/components/{message,dialog,message-box,dropdown,loading}/style/css',{ eager: true })

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { basePlugin } from './utils/plugins/base-plugin'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)

app.use(basePlugin)

app.mount('#app')

if (import.meta.env.PROD) {
  import('disable-devtool').then(({ default: disableDevtool }) => {
    disableDevtool()
  })
}
