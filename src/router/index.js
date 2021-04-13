import Vue from 'vue'
import Router from 'vue-router'

import routersAll from '@/public/js/pub_auto_router.js'
import store from '../store';

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/Home',
    },
    ...routersAll,
    {
      path: '/*',
      name: 'Home',
      redirect: '/Home',
    },
  ]
})
router.beforeEach((to, from, next) => {
  if(to.name!='Login' && (!store.getters.getUser.PID || store.getters.getUser.PID.length <　1)) {
    next('/Login');
  } else {
    next();
  }
})

export default router
