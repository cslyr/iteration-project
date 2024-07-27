import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    name: 'index',
    path: '/',
    redirect: '/customPdf'
  },
  {
    name: 'downloadPdf',
    path: '/downloadPdf/:resume_id',
    meta: { title: '下载pdf' },
    component: () => import('/src/views/downloadPdf.vue'),
  },

  {
    name: 'customPdf',
    path: '/customPdf',
    meta: { title: '编辑pdf' },
    component: () => import('/src/views/customPdf.vue'),
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 每次切换路由的时候滚动到页面顶部
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

export default router


