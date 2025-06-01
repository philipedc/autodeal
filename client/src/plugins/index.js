// Toast
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'


// router
import router from '../router'

// vuex store
import store from '../store'

export function registerPlugins (app) {
  app.use(router)
  app.use(ToastPlugin)
  // app.use(VueMask)
  app.use(store)
}
