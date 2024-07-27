import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue';
import 'ant-design-vue/dist/reset.css';
import router from './router';
import setupStore from '@/store/setup.js'
import "./themeCss/dark.css"
import "./themeCss/light.css"
const app = createApp(App)


setupStore(app)

app.use(Antd).use(router).mount('#app')
