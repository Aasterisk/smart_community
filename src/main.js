// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store';

import animated from 'animate.css'
import 'iview/dist/styles/iview.css'
import iView from 'iview'
/* echarts */
import echarts from 'echarts'
import service from '@/public/js/service.js'

Vue.use(animated)

Vue.config.productionTip = false

Vue.use(iView)

// import 'echarts-gl'
// import 'echarts-wordcloud/dist/echarts-wordcloud'
// import 'echarts-wordcloud/dist/echarts-wordcloud.min'
Vue.use(echarts)
Vue.prototype.$echarts = echarts


Vue.prototype.$service = service
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
