import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { name: 'index', path: '/', redirect: '/index' },
  { name: 'home', path: '/index', component: () => import('@/views/index.vue') },
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


