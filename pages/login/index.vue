<template>
	<view style="padding-left: 10rpx;padding-right: 10rpx;background-color: #FFFFFF;">
	</view>
</template>

<script>
	import '@/static/css/style.css'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import {isResponseOk} from '@/utils/http.js'

	export default {
		components: {

		},
		data() {
			return {
				scene: '',
				showMembershipCode: false,
				showMyInfo: false
			}
		},
		onLoad(query) {
			console.log(this.$uniRequest.defaults)
			let this_ = this
			if (query.scene) {
				this.scene = decodeURIComponent(query.scene)
			}
			wx.checkSession({
				success() {
					let token = wx.getStorageSync('token')
					if (token == null || token.token == null) {
						this_.login()
					} else {
						this_.$uniRequest.get('/api/small_procedures/login/is_login').then(res => {
							if(res.data.code === 50008){
								  uni.redirectTo({
								  	url: '@pages/login/index'
								  })
							}
							if(res.data.code != 0){
								 Toast(res.data.msg)
							}
						}).catch(error => {
							this_.login()
						})
					}
				},
				fail() {
					this_.login()
				}
			})
		},
		methods: {
			login() {
				let this_ = this
				wx.login({
					success(res) {
						if (res.code) {
							this_.$uniRequest.get('/api/small_procedures/login/login', {
								data: {
									code: res.code
								}
							}).then(res => {
								if(isResponseOk(res)){
									this_.loginOk(res.data)
								}else{
									Toast(res.data.msg)
								}
							}).catch(error => {
								Toast('服务器错误，请稍清理缓存重新进入')
							})
						}
					}
				})
			},
			loginOk(data) {
				wx.setStorage({
					key: 'token',
					data: data
				})
				console.log(this.$uniRequest.beforeRequestFilter)
				console.log(data.token)
				console.log(this.$uniRequest)
				this.$uniRequest.defaults.headers.common['X-Token'] = data.token
				//登录成功后，判断参数内容
				//是否为员工注册，员工获取头像就可以，手机号使用epr中的
				if (this.scene.trim() == 'employ|register') {
					//跳转到绑定页面
					uni.redirectTo({
						url: '../employ/register'
					})
				}
				//如果没有注册，取注册，注册使用手机号
				if(!data.isRegister){
					//注册成新的会员
					uni.redirectTo({
						url: '@pages/register/register'
					})
				}else{
					//
					uni.redirectTo({
						url: '@pages/info/index'
					})
				}
			}
		}
	}
</script>

<style scoped>
	image {
		will-change: transform
	}
</style>
