// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueApollo from 'vue-apollo'
import Vuex from 'vuex'

//Configure Vue
Vue.config.productionTip = false
Vue.use(VueApollo)
Vue.use(Vuex)

// Create a store to hold the target graphql schema
const store = new Vuex.Store({
  state: {
    graphlSchema: ''
  },
  mutations: {
    setSchema(state, newSchema) {
      state.graphqlSchema = newSchema
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
