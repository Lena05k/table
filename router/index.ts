import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import DocumentPage from '@/views/documents/DocumentPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/do/do2',
  },
  {
    path: '/do/:configId',
    name: 'document-list',
    component: DocumentPage,
    props: true,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
