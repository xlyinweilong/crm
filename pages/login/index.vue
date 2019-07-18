<template>
	<view style="padding-left: 10rpx;padding-right: 10rpx;background-color: #FFFFFF;">

	</view>
</template>

<script>
	import '@/static/css/style.css'


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
			let this_ = this
			if (query.scene) {
				this.scene = decodeURIComponent(query.scene)
			}
			wx.checkSession({
				success() {
					let token = wx.getStorageSync('token')
					if (token == null || token.openid == null) {
						this_.login()
					} else {
						this_.$uniRequest.get('/api/small_procedures/login/login_by_openid', {
							data: {
								openid: token.openid
							}
						}).then(res => {
							this_.loginOk(res.data)
						}).catch(error => {

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
							this_.$uniRequest.get('/api/small_procedures/login/login_by_code', {
								data: {
									code: res.code
								}
							}).then(res => {
								this_.loginOk(res.data)
								console.log(res)
							}).catch(error => {
								console.log(error)
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
				//登录成功后，判断参数内容
				//是否为员工注册
				if (this.scene.trim() == 'employ|register') {
					//跳转到绑定页面
					uni.redirectTo({
						url: '../employ/register'
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
