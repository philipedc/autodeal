import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
// import store from '@/store'

// pages
import LoginView from '../views/LoginView.vue'
import ListView from '@/views/ListView.vue'

const routes = [
    {
      path: '/',
      name: 'home',
      component: ListView
    },
    {
      path: "/login",
      name: "login",
      meta: {
        title: "Login"
      },
      component: LoginView,
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.afterEach((to) => {
  nextTick(() => {
    document.title = to.meta.title || "AutoDeal";
  });
});

export default router