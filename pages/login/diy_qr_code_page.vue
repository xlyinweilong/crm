<template>
	<view style="">
	</view>
</template>

<script>
	import '@/static/css/style.css'
	import Toast from '@/wxcomponents/vant/toast/toast'

	export default {
		components: {

		},
		data() {
			return {
				scene: ''
			}
		},
		onLoad(query) {
			let _this = this
			// 查看是否授权
			wx.getSetting({
				success(res) {
					if (res.authSetting['scope.userInfo']) {
						wx.getUserInfo({
							withCredentials: true,
							success: function(res) {
								console.log(res)
							}
						})
					}
				}
			})
			this.onload(query)
			this.loadConfig()
		},
		methods: {
			//加载系统配置
			loadConfig() {

			},
			onload(query) {
				let that = this
				this.scene = query.scene
				if (query.scene) {
					this.scene = decodeURIComponent(query.scene)
					wx.setStorageSync('scene', this.scene)
				}
				this.login()
			},
			login() {
				let that = this
				wx.showLoading({
					title: '加载中',
				})
				wx.login({
					success(res) {
						if (res.code) {
							that.$uniRequest.get('/api/small_procedures/login/login', {
								data: {
									code: res.code
								}
							}).then(res => {
								that.loginOk(res.data)
							}).catch(error => {
								wx.showToast({
									title: '服务器错误，请稍清理缓存重新进入',
									icon: 'none'
								})
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
				if (this.scene != null && this.scene == '') {
					uni.reLaunch({
						url: '/pages/login/index'
					})
					return
				}
				wx.showLoading({
					title: '加载中',
				})
				this.$uniRequest.get('/api/small_procedures/qr_code/get', {
					data: {
						id: this.scene
					}
				}).then(res => {
					let d = res.data
					if (d.disabled) {
						wx.showToast({
							title: '小程序码已经失效',
							duration: 2000
						})
						uni.reLaunch({
							url: '/pages/login/index'
						})
						return
					}
					if (data.isRegister) {
						//判断是否注册了公众号的openId
						if (data.platformOpenId == null) {
							wx.setStorageSync('registerGoPage', d.toPage)
							uni.reLaunch({
								url: '/pages/bind_vip/authorization'
							})
							return
						}
						//判断是否已经绑定卡
						if (data.cardList.length == 0) {
							wx.setStorageSync('registerGoPage', d.toPage)
							uni.reLaunch({
								url: '/pages/bind_vip/bind_vip'
							})
							return
						}
						uni.reLaunch({
							url: d.toPage
						})
						return
					} else {
						wx.setStorageSync('registerGoPage', d.toPage)
						uni.reLaunch({
							url: '/pages/register/register'
						})
						return
					}
				}).catch(error => {
					uni.reLaunch({
						url: '/pages/login/index'
					})
					return
				})
			}
		}
	}
</script>

<style scoped>
	image {
		will-change: transform
	}
</style>
