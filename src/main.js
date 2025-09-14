import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/tailwind.css'
import router from '@/routes/route'
// main.ts 或 main.js
import '@fortawesome/fontawesome-free/css/all.min.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css'; // 默认样式
import 'tippy.js/themes/light.css'; // 可选主题
const app = createApp(App)

app.use(router) // 确保路由已注入
app.use(ElementPlus)
app.use(VueTippy, {
  directive: 'tippy', // 自定义指令名称
  component: 'tippy', // 自定义组件名称
});
app.mount('#app')
// createApp(App).use(router).mount('#app')
