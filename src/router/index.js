import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/components/LandingPage'
import Navigator from '@/components/Navigator'
import QueryBuilder from '@/components/QueryBuilder'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: LandingPage
    },
    {
      path: '/navigator',
      name: 'Navigator',
      component: Navigator
    },
    {
      path: '/queryBuilder',
      name: 'QueryBuilder',
      component: QueryBuilder
    }
  ]
})
