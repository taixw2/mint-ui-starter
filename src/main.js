import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App.vue'
import routes from './routes'
import Store from './store'

Vue.use(VueResource)
Vue.use(MintUI)
Vue.use(VueRouter)
Vue.use(Store)

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes,
  scrollBehavior(to, from, savePosition) {
    return savePosition || {
      x: 0,
      y: 0,
    }
  },
})

Object.assign(Vue.http.options, {
  root: '/api',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
  emulateJSON: true,
})

Vue.http.interceptors.push((request, next) => {
  next((response) => {
    if (!response.body) return true
    return false
  })
})

function app() {
  return new Vue({
    el: '#app',
    router,
    // store,
    render: h => h(App),
  })
}

app()
