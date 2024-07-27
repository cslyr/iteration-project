import { createApp } from 'vue'
import App from '../src/testGroup.vue'
// import App from '../src/testChat/index.vue'
// import App from '../src/testChat/rtcCombat/index.vue'
// import App from '../src/SKU.vue'
  
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import mavonEditor from 'mavon-editor'
import VueLatex from 'vatex'
import 'mavon-editor/dist/css/index.css'
import * as VTable from '@visactor/vtable';


createApp(App).use(VTable).use(Antd).use(VueLatex).use(mavonEditor).mount('#app')
