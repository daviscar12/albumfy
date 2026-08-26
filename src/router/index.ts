import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { authService } from '@/services/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue'),
  },
  {
    path: '/register',
    component: () => import('@/views/RegisterPage.vue'),
  },
  {
    path: '/home',
    component: () => import('@/views/HomePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    component: () => import('@/views/AboutPage.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (!requiresAuth) {
    next();
    return;
  }

  if (authService.isAuthenticated()) {
    next();
    return;
  }

  next('/login');
});

export default router
