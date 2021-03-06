import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {postRequest, getRequest, putRequest, deleteRequest} from './utils/api'
import {initMenu} from './utils/menus'
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.postRequest = postRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest
router.beforeEach((to, from, next) => {
  if (window.sessionStorage.getItem('tokenStr')) {
    initMenu(router, store)
    if (!window.sessionStorage.getItem('user')) {
      return getRequest('/user/info').then(resp => {
        if (resp) {
          // 存入sessionStorage
          window.sessionStorage.setItem('user', JSON.stringify(resp))
          next()
        }
      })
    }
    next()
  } else {
    if (to.path === '/') {
      next()
    } else if(to.path === '/order'){
      next()
    }
    else {
      next('/?redirect=' + to.path)
    }
  }
})
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
