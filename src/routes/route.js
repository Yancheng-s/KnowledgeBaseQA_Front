import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/vue/index.vue'),
    children: [
      {
        path: '',
        redirect: '/chat'
      },
      {
        path: 'chat',
        name: 'chat',
        component: () => import('@/vue/components/FAQ.vue'),
      },
      {
        path: 'knowledge',
        name: 'knowledge',
        component: () => import('@/vue/components/KBSconstruction.vue')
      },
      {
        path: 'upload',
        name: 'upload',
        component: () => import('@/vue/components/FileUpload.vue')
      },
      {
        path: 'models',
        name: 'models',
        component: () => import('@/vue/components/ModelSelect.vue')
      },
      // {
      //   path: 'tools',
      //   name: 'tools',
      //   component: () => import('@/vue/ToolsPage.vue')
      // }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router