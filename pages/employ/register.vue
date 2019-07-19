<template>
	<view style="">
		<div style="padding-top: 15rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-field @input="inputEmployCode" :value="employCode" required clearable label="员工编号" placeholder="请输入员工编号" />
			</van-cell-group>
		</div>
		<div style="padding-top: 30rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-button :loading="loading" loading-text="绑定中..." :disabled="employCode == ''" type="primary" size="large"
				 open-type="getUserInfo" @click="doBind">绑定</van-button>
				<van-button :loading="loading" loading-text="绑定中..." :disabled="employCode == ''" type="primary" size="large"
				 open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">绑定</van-button>
			</van-cell-group>
		</div>
	</view>
</template>

<script>
	import '@/static/css/style.css'
	import Toast from '@/wxcomponents/vant/toast/toast';

	export default {
		components: {

		},
		data() {
			return {
				employCode: '',
				loading: false,
				showMembershipCode: false,
				showMyInfo: false
			}
		},
		onLoad() {

		},
		methods: {
			getPhoneNumber(e) {
				console.log(e)
				console.log(e.detail.errMsg)
				console.log(e.detail.iv)
				console.log(e.detail.encryptedData)
			},
			inputEmployCode(e) {
				this.employCode = e.detail
			},
			doBind() {
				this.updateUserInfo()
				// 查看是否授权
				wx.getSetting({
					success(res) {
						if (res.authSetting['scope.userInfo']) {
							wx.getUserInfo({
								success: function(res) {
									console.log(res.userInfo)
								}
							})
						} else {
							wx.authorize({
								scope: 'scope.userInfo',
								success() {
									wx.getUserInfo({
										success: function(res) {
											console.log(res.userInfo)
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
			updateUserInfo() {
				this.loading = true
				this.$uniRequest.post('/api/small_procedures/employ/bind', {
					data: {
						code: this.employCode
					}
				}).then(res => {

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
