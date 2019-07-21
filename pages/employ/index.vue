<template>
	<view style="">
		员工进入后的首页
		会员拉新使用自己的code生成小程序二维码
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import {
		isResponseOk
	} from '@/utils/http.js'

	export default {
		components: {

		},
		data() {
			return {
				employCode: '',
				loading: false
			}
		},
		onLoad() {

		},
		methods: {
			inputEmployCode(e) {
				this.employCode = e.detail
			},
			doBind() {
				let that = this
				// 查看是否授权
				wx.getSetting({
					success(res) {
						if (res.authSetting['scope.userInfo']) {
							wx.getUserInfo({
								success: function(res) {
									console.log(res.userInfo)
									that.updateUserInfo(res.userInfo)
								}
							})
						} else {
							wx.authorize({
								scope: 'scope.userInfo',
								success() {
									wx.getUserInfo({
										success: function(res) {
											that.updateUserInfo(res.userInfo)
										}
									})
								},
								fail() {
									Toast('授权后可以绑定')
								}
							})
						}
					}
				})
			},
			updateUserInfo(userInfo) {
				this.loading = true
				let form = {}
				if (userInfo != null) {
					form = userInfo
				}
				form.code = this.employCode
				this.$uniRequest.post('/api/small_procedures/employ/bind', form).then(res => {
					if (isResponseOk(res)) {
						Toast(res.data.message)
						//TODO 跳转到员工首页
					} else {
						Toast(res.data.message)
					}
				}).finally(() => this.loading = false)
			}
		}
	}
</script>

<style scoped>
	image {
		will-change: transform
	}
</style>

<style>

</style>
