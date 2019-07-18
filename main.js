import Vue from 'vue'
import App from './App'

import uniRequest from 'uni-request'
uniRequest.defaults.baseURL = 'http://172.18.1.109:9090/crm'
// uniRequest.defaults.headers.common['Authorization'] = AUTH_TOKEN
// uniRequest.defaults.headers.post['Content-Type'] = 'application/json'
// Vue.prototype.$HOST='http://172.18.1.109:9090/crm'
Vue.prototype.$uniRequest = uniRequest
import basics from './pages/basics/home.vue'
Vue.component('basics',basics)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
