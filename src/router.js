import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/navFrame',
            name: 'navFrame',
            component: () => import('./components/NavFrame.vue')
        }, {
            path: '/serverManage',
            name: 'serverManage',
            meta: {
                name: '监听管理'
            },
            component: () => import('./views/nginx/ServerList.vue')
        },
        {
            path: '/upstreamManage',
            name: 'upstreamManage',
            meta: {
                name: '负载管理'
            },
            component: () => import('./views/nginx/UpstreamList.vue')
        }
    ]
})
