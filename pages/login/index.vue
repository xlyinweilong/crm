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
							wx.showLoading({
								title: '加载中',
							})
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
				wx.setStorageSync('token',data)
				wx.setStorageSync('isOpenShop',data.isOpenShop)
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
						if (data.isRegister) {
							uni.reLaunch({
								url: '/pages/employ/register'
							})
						} else {
							wx.setStorageSync('registerGoPage', '/pages/employ/register')
							uni.reLaunch({
								url: '/pages/register/register'
							})
						}
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
								this.$recommender.sourceScene = 'WE_CHAT_QR'
								uni.reLaunch({
									url: '/pages/ticket/shelf/detail?code=' + code
								})
								return
							} else if (this.scene != null && this.scene.startsWith('share,ticket_shelf_list,')) {
								this.$recommender.uid = this.scene.replace("share,ticket_shelf_list,", "").trim()
								this.$recommender.sourceScene = 'SHELF_BY_SHARE'
								uni.reLaunch({
									url: '/pages/ticket/shelf/list'
								})
								return
							} else if (this.scene != null && this.scene.startsWith('share,ticket_detail,')) {
								let code = this.scene.replace("share,ticket_detail,", "").trim().split(',')[0]
								this.$recommender.uid = this.scene.replace("share,ticket_detail,", "").trim().split(',')[1]
								this.$recommender.sourceScene = 'DETAIL_BY_SHARE'
								uni.reLaunch({
									url: '/pages/ticket/shelf/detail?code=' + code
								})
								return
							} else if (this.scene != null && this.scene.startsWith('tic,')) {
								let code = this.scene.replace("tic,", "").trim()
								//加载数据
								this.$recommender.sourceScene = 'DETAIL_BY_QR'
								this.loadTicketEmployCode(code, '/pages/ticket/shelf/detail?code=', true)
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
									this.$recommender.sourceScene = 'WE_CHAT_QR'
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
									this.$recommender.uid = this.scene.replace("share,ticket_shelf_list,", "").trim()
									this.$recommender.sourceScene = 'SHELF_BY_SHARE'
									uni.reLaunch({
										url: '/pages/ticket/shelf/list'
									})
									return
								} else if (this.scene != null && this.scene.startsWith('share,info_index,')) {
									this.$recommender.uid = this.scene.replace("share,info_index,", "").trim()
									this.$recommender.sourceScene = 'SHELF_BY_INDEX'
								} else if (this.scene != null && this.scene.startsWith('share,ticket_detail,')) {
									let code = this.scene.replace("share,ticket_detail,", "").trim().split(',')[0]
									this.$recommender.uid = this.scene.replace("share,ticket_detail,", "").trim().split(',')[1]
									this.$recommender.sourceScene = 'DETAIL_BY_SHARE'
									uni.reLaunch({
										url: '/pages/ticket/shelf/detail?code=' + code
									})
									return
								} else if (this.scene != null && this.scene.startsWith('tic,')) {
									let code = this.scene.replace("tic,", "").trim()
									//加载数据
									this.$recommender.sourceScene = 'DETAIL_BY_QR'
									this.loadTicketEmployCode(code, '/pages/ticket/shelf/detail?code=', true)
									return
								}
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
							this.$recommender.uid = this.scene.replace("share,ticket_shelf_list,", "").trim()
							this.$recommender.sourceScene = 'SHELF_BY_SHARE'
							wx.setStorageSync('registerGoPage', '/pages/ticket/shelf/list')
							wx.setStorageSync('recommend', this.scene.replace("share,ticket_shelf_list,", "").trim())
							wx.setStorageSync('registerFrom', "share,ticket_shelf_list")
						} else if (this.scene != null && this.scene.startsWith('share,info_index,')) {
							this.$recommender.uid = this.scene.replace("share,info_index,", "").trim()
							this.$recommender.sourceScene = 'SHELF_BY_INDEX'
							wx.setStorageSync('recommend', this.scene.replace("share,info_index,", "").trim())
							wx.setStorageSync('registerFrom', "share,info_index")
						} else if (this.scene != null && this.scene.startsWith('share,ticket_detail,')) {
							let code = this.scene.replace("share,ticket_detail,", "").trim().split(',')[0]
							this.$recommender.uid = this.scene.replace("share,ticket_detail,", "").trim().split(',')[1]
							this.$recommender.sourceScene = 'DETAIL_BY_SHARE'
							wx.setStorageSync('recommend', this.$recommender.uid)
							wx.setStorageSync('registerFrom', "share,ticket_detail")
							wx.setStorageSync('registerGoPage', '/pages/ticket/shelf/detail?code=' + code)
						} else if (this.scene != null && this.scene.startsWith('tic,')) {
							let code = this.scene.replace("tic,", "").trim()
							//加载数据
							this.$recommender.sourceScene = 'DETAIL_BY_QR'
							this.loadTicketEmployCode(code, '/pages/info/index', false)
							return
						} else if (this.scene != null && this.scene.startsWith('ti,')) {
							let code = this.scene.replace("ti,", "").trim()
							this.$recommender.sourceScene = 'WE_CHAT_QR'
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
			},
			loadTicketEmployCode(code, page, isGoPage) {
				this.$uniRequest.get('/api/small_ticket/ticket_employ_by_code', {
					data: {
						code: code
					}
				}).then(res => {
					let ele = res.data
					if (ele != null) {
						this.$recommender.uid = ele.uid
						wx.setStorageSync('recommend', this.$recommender.uid)
						wx.setStorageSync('registerFrom', "qr,ticket_detail")
						wx.setStorageSync('registerGoPage', '/pages/ticket/shelf/detail?code=' + ele.ticketCode)
						if (isGoPage) {
							uni.reLaunch({
								url: page + ele.ticketCode
							})
						}
					} else {
						uni.reLaunch({
							url: '/pages/info/index'
						})
					}
				}).catch(e => {
					uni.reLaunch({
						url: '/pages/info/index'
					})
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
