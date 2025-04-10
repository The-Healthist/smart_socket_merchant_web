import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/index.vue';
import DeviceTypeManagement from '@/views/device/DeviceTypeManagement.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    permiss: '1',
                },
                component: () => import('../views/dashboard/dashboard.vue'),
            },
            {
                path: '/account_admin',
                name: 'accountAdmin',
                meta: {
                    title: '管理员账户',
                    permiss: '1',
                },
                component: () => import('../views/adminUser/accountAdmin.vue'),
            },

            {
                path: '/device_management',
                name: 'DeviceManagement',
                component: () => import('../views/device/DeviceManagement.vue'),
            },
            {
                path: '/device_type_management',
                name: 'DeviceTypeManagement',
                component: () => import('../views/device/DeviceTypeManagement.vue'),
            }
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/auth/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/error/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | Origin`
    let token = localStorage.getItem('token')

    if (!token && to.path !== '/login') {
        // 如果没有token且不是去登录页，则重定向到登录页
        next('/login');
    } else if (token && to.path === '/login') {
        // 如果已经有token且是去登录页，则重定向到首页
        next('/dashboard');
    } else {
        next();
    }
});

export default router;


