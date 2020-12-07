import Vue from 'vue'
import App from './App'

import uniRequest from 'uni-request'
Vue.prototype.$recommender = {uid:'',sourceScene:''}
// Vue.prototype.$baseURL = 'http://192.168.1.109:9090/crm'
Vue.prototype.$baseURL = 'http://192.168.0.113:9080'
// Vue.prototype.$baseURL = 'http://192.168.43.63:9090/crm'
// Vue.prototype.$baseImageURL = 'http://192.168.1.113:8086/images/'
// Vue.prototype.$baseURL = 'https://crm.wisdomyy.com/crm'
// Vue.prototype.$baseImageURL = 'https://crm.wisdomyy.com/images/'
// Vue.prototype.$baseURL = 'https://erp.wisdomyy.com/'
Vue.prototype.$baseImageURL = 'https://erp.wisdomyy.com/images/'
uniRequest.defaults.baseURL = Vue.prototype.$baseURL
// Vue.prototype.$tnId='11'
Vue.prototype.$tnId = 'jljy'
// Vue.prototype.$tnId = 'bona'
uniRequest.defaults.headers['tn_id'] = Vue.prototype.$tnId
uniRequest.defaults.headers.post['Content-Type'] = 'application/json'
Vue.prototype.$uniRequest = uniRequest
// import basics from './pages/basics/home.vue'
// Vue.component('basics', basics)


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
		return request
	},
	err => {
		console.log('请求失败')
		return Promise.reject(err);
	});

// 响应拦截
uniRequest.interceptors.response.use(function(res) { 
	wx.hideLoading()
	if (res.data.code === 50008) {
		wx.login({
			success(res) {
				if (res.code) {
					Vue.prototype.$uniRequest.get('/api/small_procedures/login/login', {
						data: {
							code: res.code
						}
					}).then(res => {
						wx.setStorage({
							key: 'token',
							data: res.data
						})
						Vue.prototype.$uniRequest.defaults.headers.common['X-Token'] = res.data.token
						//重新发送请求
					}).catch(error => {
						console.log(error)
					})
				}
			}
		})
		return Promise.reject()
	}
	if (res.data.code != 0) {
		wx.showToast({
			title: res.data.message,
			icon: 'none',
			duration: 2000
		})
		return Promise.reject()
	}
	return Promise.resolve(res.data)
}, function(error) {
	console.log('返回进入拦截失败')
	return Promise.reject(error);
})

var reLogin = function() {

}
console.log("注册main.js")