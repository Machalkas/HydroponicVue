import Vue from 'vue'
import App from './App.vue'
import router from './router' 
import axios from 'axios'

import Notifications from 'vue-notification'
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false

// Vue.prototype.$hostname = '127.0.0.1:8000'
Vue.prototype.$hostname = '192.168.1.254:8000'

Vue.use(axios)
Vue.prototype.axios=axios.create({baseURL:"http://"+Vue.prototype.$hostname, timeout:3000})

Vue.use(Notifications)

Vue.use(VueCookies)
Vue.$cookies.config('30d');

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

