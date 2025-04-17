// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 1. 导入所有图标
import router from '@/router/index'
import axios from 'axios';

const app = createApp(App)
const pinia = createPinia()

// 2. 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

const token = localStorage.getItem('token');
// if (token) {
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// }


app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.mount('#app')

