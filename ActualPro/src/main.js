// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iview from 'iview'
import locale from 'iview/dist/locale/en-US'
import 'iview/dist/styles/iview.css'
//  import axios from 'axios'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.use(iview, { locale })
Vue.config.productionTip = false
//  Vue.prototype.$ajax = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
Vue.use(iview, {
  transfer: true,
  size: 'large'
})
