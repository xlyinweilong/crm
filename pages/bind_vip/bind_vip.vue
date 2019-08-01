<template>
	<view style="">
		<div style="padding-top: 15rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-field @input="inputUserPhone" :value="userPhone" required clearable label="手机号" placeholder="请输入会员卡对应的手机号码" />
			</van-cell-group>
		</div>
		<div style="padding-top: 30rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-button :loading="loading" loading-text="绑定中..." :disabled="userPhone == ''" type="primary" size="large" @click="bindVip">绑定会员卡</van-button>
			</van-cell-group>
		</div>

		<van-toast id="van-toast" />
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
				vipCode: '',
				loading: false
			}
		},
		onLoad() {},
		methods: {
			inputUserPhone(e) {
				this.userPhone = e.detail
			},
			bindVip() {
				this.loading = true
				this.$uniRequest.post('/api/small_procedures/sms/send_sms', {
					userPhone: this.userPhone
				}).then(res => {
					// let user = wx.getStorageSync('token')
					// user.cardList = res.data
					// wx.setStorageSync('token', user)
					Toast.success('请查收验证码')
					uni.navigateTo({
						url: '/pages/bind_vip/validCode'
					})
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
