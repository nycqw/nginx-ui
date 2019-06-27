import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/navFrame',
      name: 'navFrame',
      component: () => import('./components/NavFrame.vue')
    },
    {
      path: '/nginx',
      name: 'nginx',
      component: () => import('./views/nginx/ServerList.vue')
    }
  ]
})
