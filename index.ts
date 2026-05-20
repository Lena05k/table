import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import App from './App.vue'
import { router } from './router/index'
import './scss/main.scss'

ModuleRegistry.registerModules([AllCommunityModule])

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
