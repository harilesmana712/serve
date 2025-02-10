import { createRouter, createWebHistory } from 'vue-router'

import BotSettings from '../views/BotSettings.vue'
import dashboard from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'BotSettings',
      component: BotSettings,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: dashboard,
    },
 
  ],
})

export default router
