// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// import Excel from '../dist/excel.min.js'
// import {DesignTable, EditTable, ShowTable} from './lib'//按需引入
import Excel from './lib'//全部引入


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(Excel);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
