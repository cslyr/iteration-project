import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue';
import 'ant-design-vue/dist/reset.css';
import router from './router';
import setupStore from '@/store/setup.js'
const app = createApp(App)

setupStore(app)

app.use(Antd).use(router).mount('#app')
