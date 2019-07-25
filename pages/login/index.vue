<template>
	<view style="">
	</view>
</template>

<script>
	import '@/static/css/style.css'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import {
		isResponseOk
	} from '@/utils/http.js'

	export default {
		components: {

		},
		data() {
			return {
				scene: ''
			}
		},
		onLoad(query) {
			this.onload(query)
		},
		methods: {
			onload(query) {
				let that = this
				this.scene = query.scene
				if (query.scene) {
					this.scene = decodeURIComponent(query.scene)
				}
				wx.checkSession({
					success() {
						let token = wx.getStorageSync('token')
						if (token == null || token.token == null) {
							that.login()
						} else {
							that.$uniRequest.get('/api/small_procedures/login/is_login').then(res => {
								if (res.data.code === 50008) {
									wx.setStorageSync('token', null)
									uni.redirectTo({
										url: '/pages/login/index?scene=' + that.scene
									})
								}
								if (res.data.code != 0) {
									Toast(res.data.message)
								}
							}).catch(error => {
								that.login()
							})
						}
					},
					fail() {
						that.login()
					}
				})
			},
			login() {
				let that = this
				wx.login({
					success(res) {
						if (res.code) {
							that.$uniRequest.get('/api/small_procedures/login/login', {
								data: {
									code: res.code
								}
							}).then(res => {
								if (isResponseOk(res)) {
									that.loginOk(res.data.data)
								} else {
									Toast(res.data.message)
								}
							}).catch(error => {
								uni.showToast({
									title: '服务器错误，请稍清理缓存重新进入'
								})
								setTimeout(() => {
									uni.hideToast()
								}, 2000)
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
				this.$uniRequest.defaults.headers.common['X-Token'] = data.token
				if (data.isRegister) {
					if (data.isEmploy) {
						//判断是否员工
						uni.redirectTo({
							url: '/pages/employ/index'
						})
					} else {
						uni.redirectTo({
							url: '/pages/info/index'
						})
					}
				} else {
					//是否为员工注册，员工获取头像就可以，手机号使用epr中的
					if (this.scene == 'employ,register') {
						//跳转到绑定页面
						uni.redirectTo({
							url: '/pages/employ/register'
						})
						return
					}
					let parameter = ''
					if (this.scene != null && this.scene != '' && this.scene.trim().startsWith("recommend,")) {
						parameter = this.scene.replace("recommend,", "").trim()
					}
					//注册成新的会员
					uni.redirectTo({
						url: '/pages/register/register?scene=' + parameter
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
