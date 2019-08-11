<template>
	<div class="bind">
		<div class="iconfont-div">
			<image style="height: 200rpx;" mode="aspectFit" src="../../static/images/mobile.png" />
		</div>
		<div class="user-phone">
			<van-field type="number" custom-style="border-bottom:1px solid #000" :border="false" title-width="30px" @input="inputUserPhone"
			 :maxlength="11" :value="userPhone" clearable label="+86" placeholder="请输入手机号" />
		</div>
		<div>
			<button :loading="loading" type="primary" class="submit" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">一键自动获取手机号</button>
			<button :loading="loading" type="primary" class="next" @click="sendSms">下一步</button>
			<p class="tips">手机号可以绑定已经有的会员或注册新的会员卡</p>
		</div>
		<lausirCodeDialog ref="lausirCodeDialog" :show="showCodeDialog" :len="4" :phone="userPhone" @change="change" />
	</div>
</template>

<script>
	import lausirCodeDialog from '@/components/lausir-codedialog/lausir-codedialog.vue'

	export default {
		components: {
			lausirCodeDialog
		},
		data() {
			return {
				showCodeDialog: false,
				userPhone: '',
				loading: false,
				code: ''
			}
		},
		computed: {
			isPoneAvailable() {
				let myreg = /^[1][0-9]{10}$/
				return myreg.test(this.userPhone)
			}
		},
		onLoad() {},
		methods: {
			getPhoneNumber(e) {
				if(e.detail.iv != null && e.detail.encryptedData != null){
					wx.showLoading({
						title: '绑定中',
					})
					this.$uniRequest.post('/api/small_procedures/login/bind_vip_call_wechat', {
						iv: e.detail.iv,encryptedData:e.detail.encryptedData
					}).then(res => {
						let user = wx.getStorageSync('token')
						user.cardList = res.data
						wx.setStorageSync('token', user)
						this.showCodeDialog = false
						//跳转到首页
						uni.redirectTo({
							url: '/pages/info/index'
						})
					}).finally(() => wx.hideLoading())
				}
			},
			inputUserPhone(e) {
				this.userPhone = e.detail
			},
			sendSms() {
				if (this.userPhone == null || this.userPhone.length != 11 || !this.isPoneAvailable) {
					wx.showToast({
						title: '请输入合法的手机号',
						icon: 'none'
					})
					return
				}
				this.loading = true
				this.$uniRequest.post('/api/small_procedures/sms/send_sms', {
					userPhone: this.userPhone
				}).then(res => {
					this.showCodeDialog = true
				}).finally(() => this.loading = false)
			},
			change(res) {
				if (res.type == 1) {
					//TODO注册
					this.code = res.code
					this.bindVip()
				} else if (res.type == -1) {
					this.code = ""
					this.showCodeDialog = false
				} else if (res.type == 0) {
					wx.showLoading({
						title: '发送中',
					})
					this.$uniRequest.post('/api/small_procedures/sms/send_sms', {
						userPhone: this.userPhone
					}).then(res => {
						res.resendCall()
					}).finally(() => wx.hideLoading())
				}
			},
			bindVip() {
				wx.showLoading({
					title: '绑定中',
				})
				this.$uniRequest.post('/api/small_procedures/login/bind_vip', {
					msgCode: this.code
				}).then(res => {
					wx.hideLoading()
					let user = wx.getStorageSync('token')
					user.cardList = res.data
					wx.setStorageSync('token', user)
					this.showCodeDialog = false
					//跳转到首页
					uni.redirectTo({
						url: '/pages/info/index'
					})
				}).finally(() => this.loading = false)
			}

		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>

<style scoped>
	.bind .iconfont-div {
		padding-left: 20rpx;
		padding-top: 70rpx;
		text-align: center;
	}

	.bind .iconfont {
		padding-top: 75rpx;
		font-size: 200rpx;
	}

	.bind .user-phone {
		padding: 70rpx 50rpx 0rpx 50rpx;
	}

	.bind .submit {
		font-size: 28rpx;
		border: 3px solid #AE0000;
		border-radius: 2em;
		margin: 45rpx 60rpx 0 60rpx;
		background: #AE0000;
	}

	.bind .next {
		font-size: 28rpx;
		border: 1px solid #000000;
		border-radius: 2em;
		margin: 20rpx 60rpx 0 60rpx;
		background: #FFFFFF;
		color: #AE0000;
	}

	.bind .tips {
		margin-top: 5rpx;
		color: #909399;
		font-size: 22rpx;
		text-align: center;
	}
</style>
