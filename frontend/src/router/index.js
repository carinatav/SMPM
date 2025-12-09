import { createRouter, createWebHistory } from 'vue-router'

const MainLayout = () => import('../layouts/MainLayout.vue')
const DashboardView = () => import('../views/DashboardView.vue')
const CalendarView = () => import('../views/CalendarView.vue')
const MaintenanceList = () => import('../views/MaintenanceList.vue')
const MaintenanceDetails = () => import('../views/MaintenanceDetails.vue')
const MachinesView = () => import('../views/MachinesView.vue')
const LoginView = () => import('../views/Login.vue')
const RegisterView = () => import('../views/Register.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 🔓 PÚBLICAS
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },

    // 🔒 ÁREA LOGADA
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'dashboard', component: DashboardView },
        { path: 'calendar', name: 'calendar', component: CalendarView },
        { path: 'maintenances', name: 'maintenances', component: MaintenanceList },
        {
          path: 'maintenances/:id',
          name: 'maintenance-details',
          component: MaintenanceDetails,
          props: true,
        },
        { path: 'machines', name: 'machines', component: MachinesView },
      ],
    },

    // qualquer rota inválida → login
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

// ✅ Guard global
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // rota protegida sem token → manda pro login
  if (to.matched.some((r) => r.meta.requiresAuth) && !token) {
    return next({ name: 'login' })
  }

  // já logado tentando ir pra login/register → manda pro dashboard
  if (token && (to.name === 'login' || to.name === 'register')) {
    return next({ name: 'dashboard' })
  }

  next()
})

export default router