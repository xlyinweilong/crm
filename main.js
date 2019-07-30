import Vue from 'vue'
import App from './App'

import uniRequest from 'uni-request'
uniRequest.defaults.baseURL = 'http://172.18.1.109:9090/crm'
uniRequest.defaults.headers.post['Content-Type'] = 'application/json'
Vue.prototype.$uniRequest = uniRequest

import basics from './pages/basics/home.vue'
Vue.component('basics', basics)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

// 请求拦截
uniRequest.interceptors.request.use(
	request => {
		//配置基本信息    
		return request;
	},
	err => {
		console.log('请求失败');
		return Promise.reject(err);
	});

// 响应拦截
uniRequest.interceptors.response.use(function(response) {
	return Promise.resolve(response);
}, function(error) {
	console.log('返回进入拦截失败')
	return Promise.reject(error);
});
