import { createApp } from 'vue'
// import App from '../src/wsChat/index.vue'
// import App from '../src/rtctest/index.vue'
// import App from '../src/App16.vue'
import App from '../src/virital.vue'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import mavonEditor from 'mavon-editor'
import VueLatex from 'vatex'
import 'mavon-editor/dist/css/index.css'



createApp(App).use(Antd).use(VueLatex).use(mavonEditor).mount('#app')
