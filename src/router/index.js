import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Navigator from '@/components/Navigator'
import QueryBuilder from '@/components/QueryBuilder'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
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
