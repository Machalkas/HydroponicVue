import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import Notifications from 'vue-notification'
import VueCookies from 'vue-cookies'
import VueApexCharts from 'vue-apexcharts'
import VCalendar from 'v-calendar';
import VueMeta from 'vue-meta'

Vue.config.productionTip = false

// Vue.prototype.$hostname = '127.0.0.1:8000'
Vue.prototype.$hostname = '192.168.1.254:8000'

Vue.use(axios)
Vue.prototype.axios=axios.create({baseURL:"http://"+Vue.prototype.$hostname, timeout:3000})

Vue.use(VueMeta)
Vue.use(Notifications)

Vue.use(VueCookies)
Vue.$cookies.config('30d');

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

// Vue.use(VCalendar, {
//   componentPrefix: 'v-calendar' //не работает
// })

import Calendar from 'v-calendar/lib/components/calendar.umd'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
Vue.component('calendar', Calendar)
Vue.component('date-picker', DatePicker)

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

