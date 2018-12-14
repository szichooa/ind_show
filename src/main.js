// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/icon/iconfont.css';
import './assets/icon1/iconfont.css';
import 'babel-polyfill'
import 'url-search-params-polyfill'; 

import promise from 'es6-promise';
promise.polyfill();


import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$axios = axios;


Vue.config.productionTip = false

router.beforeEach((to,from,next) => {   
  if(to.matched.some( m => m.meta.auth)){        
    if(window.localStorage.isLogin=='1') { // 已经登陆       
      next()   // 正常跳转到你设置好的页面     
    }else if(window.sessionStorage.isLogin=='1') { // 已经登陆       
      next()   // 正常跳转到你设置好的页面     
    }else{
      next({path:'/login'})
      Vue.prototype.$message.warning('检测到您还未登录,请登录后操作！')
     } 
  }else{ 
  　next() 
  } 
})

Vue.prototype.getConfigJson=function(){
  Vue.prototype.$axios.get("serverconfig.json").then((result)=>{
      //用一个全局字段保存ApiUrl  也可以用sessionStorage存储
      Vue.prototype.ApiUrl=result.data.ApiUrl;
      Vue.prototype.DownLoadUrlH=result.data.DownLoadUrlH;
      window.sessionStorage.setItem('ApiUrl',result.data.ApiUrl);
      window.sessionStorage.setItem('DownLoadUrlH',result.data.DownLoadUrlH);
  }).catch((error)=>{
    window.sessionStorage.setItem('ApiUrl','http://192.168.1.193');
		window.sessionStorage.setItem('DownLoadUrlH','http://192.168.1.192');
  });
}
/* eslint-disable no-new */
Vue.use(ElementUI);
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})