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
                path: '/event',
                name: 'event',
                meta: {
                    title: '稿件管理',
                    permiss: '1',
                },
                component: () => import('../views/event/Event.vue'),
            },
            {
                path: '/manuscript',
                name: 'manuscript',
                meta: {
                    title: '稿件管理',
                    permiss: '1',
                },
                component: () => import('../views/manuscript/manuscript.vue'),
            },
            {
                path: '/participant',
                name: 'participant',
                meta: {
                    title: '选手管理',
                    permiss: '1',
                },
                component: () => import('../views/commonUser/participant.vue'),
            },
            {
                path: '/voting',
                name: 'voting',
                meta: {
                    title: '投票管理',
                    permiss: '1',
                },
                component: () => import('../views/vote/vote.vue'),
            },
            {
                path: '/blacklist',
                name: 'blacklist',
                meta: {
                    title: '黑名单',
                    permiss: '1',
                },
                component: () => import('../views/blacklist/blacklist.vue'),
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
                path: '/qa',
                name: 'qa',
                meta: {
                    title: 'Q&A',
                    permiss: '1',
                },
                component: () => import('../views/question/question.vue'),
            },
            {
                path: '/partner',
                name: 'partner',
                meta: {
                    title: '合作伙伴',
                    permiss: '1',
                },
                component: () => import('../views/partner/Partner.vue'),
            },
            {
                path: '/worldview',
                name: 'worldview',
                meta: {
                    title: '世界观',
                    permiss: '1',
                },
                component: () => import('../views/worldview/Worldview.vue'),
            },
            {
                path: '/pv',
                name: 'pv',
                meta: {
                    title: 'PV',
                    permiss: '1',
                },
                component: () => import('../views/pv/PV.vue'),
            },
            {
                path: '/special_guest',
                name: 'specialGuest',
                meta: {
                    title: '特邀嘉宾',
                    permiss: '1',
                },
                component: () => import('../views/specialGuest/SpecialGuest.vue'),
            },
            {
                path: '/sponsor',
                name: 'sponsor',
                meta: {
                    title: '主办方',
                    permiss: '1',
                },
                component: () => import('../views/sponsor/Sponsor.vue'),
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

    if (!token && !['/login'].includes(to.path)) {
        console.log(to.path);
        next('/login');
    } else {
        next()
    }
});

export default router;


