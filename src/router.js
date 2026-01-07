import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Exhibitions from './components/Exhibitions.vue';
import Tickets from './components/Tickets.vue';
import Login from './components/Login.vue';
import Users from './components/Users.vue';

const routes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/exhibitions',
        component: Exhibitions,
    },
    {
        path: '/tickets',
        component: Tickets,
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/users',
        component: Users,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
