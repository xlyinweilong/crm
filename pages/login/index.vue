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
				this.login()
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
								// if (isResponseOk(res)) {
									that.loginOk(res.data)
								// } else {
								// 	Toast(res.message)
								// }
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
