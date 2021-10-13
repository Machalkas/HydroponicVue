import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes:[{
        path:'/',
        component: Home
    },
    {
        path: '/user/auth',
        name:"auth",
        component:()=> import('./views/Auth.vue')
    },
    {
        path:'/farm',
        name:'farm',
        component:()=> import('./views/Farms.vue')
    },
    {
        path:'/farm/:id',
        name: 'daschboard',
        component:()=>import('./views/Dashboard.vue')
    },
]
})