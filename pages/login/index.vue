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
				if (this.scene != null && this.scene.startsWith('evaluate,')) {
					let posCode = this.scene.split(",")[1]
					uni.reLaunch({
						url: '/pages/evaluate/do_evaluate?posCode=' + posCode
					})
					return
				}
				//获取推荐参数
				if (this.scene != null && this.scene != '' && this.scene.trim().startsWith("recommend,")) {
					let recommend = this.scene.replace("recommend,", "").trim()
					wx.setStorageSync('recommend', recommend)
					if (!data.isRegister) {
						uni.reLaunch({
							url: '/pages/register/register'
						})
						return
					}
				}
				if (this.scene != null && this.scene != '' && this.scene.trim().startsWith("recommendC,")) {
					let recommendC = this.scene.replace("recommendC,", "").trim()
					wx.setStorageSync('recommendC', recommendC)
					if (!data.isRegister) {
						uni.reLaunch({
							url: '/pages/register/register'
						})
						return
					}
				}
				if (this.scene != null && this.scene != '' && this.scene.trim().startsWith("recommendD,")) {
					let recommendD = this.scene.replace("recommendD,", "").trim()
					wx.setStorageSync('recommendD', recommendD)
					if (!data.isRegister) {
						uni.reLaunch({
							url: '/pages/register/register'
						})
						return
					}
				}
				//是否员工扫码进入
				if (this.scene == 'employ,register') {
					//判断是否已经注册为员工
					if (data.isEmploy) {
						wx.setStorageSync('powerKeyList', data.powerKeyList)
						//调转员工首页
						uni.reLaunch({
							url: '/pages/employ/index'
						})
						return
					} else {
						//跳转注册/绑定员工页面
						uni.reLaunch({
							url: '/pages/employ/register'
						})
						return
					}
				} else {
					if (data.isRegister) {
						//判断是否注册了公众号的openId
						if (data.platformOpenId == null) {
							uni.reLaunch({
								url: '/pages/bind_vip/authorization'
							})
							return
						}
						if (data.isEmploy) {
							wx.setStorageSync('powerKeyList', data.powerKeyList)
							if (this.scene != null && this.scene.startsWith('nursing,')) {
								let id = this.scene.split(",")[1]
								uni.reLaunch({
									url: '/pages/nursing/detail?id=' + id
								})
								return
							}
							if (this.scene != null && this.scene.startsWith('nursing_evaluate,')) {
								let id = this.scene.split(",")[1]
								uni.reLaunch({
									url: '/pages/nursing/do_evaluate?id=' + id
								})
								return
							}
							if (this.scene != null && this.scene.startsWith('ti,')) {
								let code = this.scene.split(",")[1]
								uni.reLaunch({
									url: '/pages/ticket/shelf/detail?code=' + code
								})
								return
							}
							//判断是否员工
							uni.redirectTo({
								url: '/pages/employ/index'
							})
							return
						} else {
							//判断是否已经绑定卡
							if (data.cardList.length == 0) {
								uni.reLaunch({
									url: '/pages/bind_vip/bind_vip'
								})
								return
							} else {
								if (this.scene != null && this.scene.startsWith('ti,')) {
									let code = this.scene.split(",")[1]
									uni.reLaunch({
										url: '/pages/ticket/shelf/detail?code=' + code
									})
									return
								}
								if (this.scene != null && this.scene.startsWith('channel,')) {
									uni.reLaunch({
										url: '/pages/channel/nearby'
									})
									return
								}
								if (this.scene != null && this.scene.startsWith('nursing,')) {
									let id = this.scene.split(",")[1]
									uni.reLaunch({
										url: '/pages/nursing/detail?id=' + id
									})
									return
								}
								if (this.scene != null && this.scene.startsWith('nursing_evaluate,')) {
									let id = this.scene.split(",")[1]
									uni.reLaunch({
										url: '/pages/nursing/do_evaluate?id=' + id
									})
									return
								}
								if (this.scene != null && this.scene.startsWith('evaluate_page,')) {
									let code = this.scene.split(",")[1]
									if (code == null) {
										uni.reLaunch({
											url: '/pages/evaluate/complaint'
										})
										return
									}
									uni.reLaunch({
										url: '/pages/evaluate/complaint?code=' + code
									})
									return
								} else if (this.scene != null && this.scene.startsWith('share,ticket_shelf_list,')) {
									uni.reLaunch({
										url: '/pages/ticket/shelf/list'
									})
									return
								} else if (this.scene != null && this.scene.startsWith('share,info_index,')) {}
								uni.reLaunch({
									url: '/pages/info/index'
								})
								return
							}
						}
					} else {
						if (this.scene != null && this.scene.startsWith('channel,')) {
							wx.setStorageSync('registerGoPage', '/pages/channel/nearby')
						} else if (this.scene != null && this.scene.startsWith('evaluate_page,')) {
							let code = this.scene.split(",")[1]
							if (code == null) {
								wx.setStorageSync('registerGoPage', '/pages/evaluate/complaint')
							} else {
								wx.setStorageSync('registerGoPage', '/pages/evaluate/complaint?code=' + code)
							}
						} else if (this.scene != null && this.scene.startsWith('share,ticket_shelf_list,')) {
							wx.setStorageSync('registerGoPage', '/pages/ticket/shelf/list')
							wx.setStorageSync('recommend', this.scene.replace("share,ticket_shelf_list,", "").trim())
							wx.setStorageSync('registerFrom', "share,ticket_shelf_list")
						} else if (this.scene != null && this.scene.startsWith('share,info_index,')) {
							wx.setStorageSync('recommend', this.scene.replace("share,info_index,", "").trim())
							wx.setStorageSync('registerFrom', "share,info_index")
						} else if (this.scene != null && this.scene.startsWith('ti,')) {
							let code = this.scene.replace("ti,", "").trim()
							wx.setStorageSync('registerGoPage', '/pages/ticket/shelf/detail?code=' + code)
						} else {
							wx.removeStorageSync('registerGoPage')
						}
						let registerGoPage = wx.getStorageSync('registerGoPage')
						if (registerGoPage == null || registerGoPage == '') {
							uni.reLaunch({
								url: '/pages/info/index'
							})
						} else {
							uni.reLaunch({
								url: '/pages/register/register'
							})
						}
						return
					}
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
