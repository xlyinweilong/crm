<template>
	<view style="content">
		<view>
			<div style="padding-top: 15rpx;padding-left: 30rpx;padding-right: 30rpx;">
				<van-cell-group>
					<van-field @input="inputUserPhone" :maxlength="11" :value="userPhone" required clearable label="手机号" placeholder="请输入会员卡对应的手机号码" />
				</van-cell-group>
			</div>
			<div style="padding-top: 30rpx;padding-left: 30rpx;padding-right: 30rpx;">
				<van-cell-group>
					<van-button :loading="loading" loading-text="绑定中..." :disabled="userPhone == '' || !isPoneAvailable" type="primary"
					 size="large" @click="sendSms">绑定会员卡</van-button>
				</van-cell-group>
			</div>
			<van-toast id="van-toast" />
		</view>
		<lausirCodeDialog :show="showCodeDialog" :len="4" :autoCountdown="true" :phone="userPhone" v-on:change="change" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import lausirCodeDialog from '@/components/lausir-codedialog/lausir-codedialog.vue'
	import {
		isResponseOk
	} from '@/utils/http.js'

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
				console.log(myreg.test(this.userPhone))
				return myreg.test(this.userPhone)
			}
		},
		onLoad() {},
		methods: {
			inputUserPhone(e) {
				this.userPhone = e.detail
			},
			sendSms() {
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
					this.code = "请输入验证码";
					this.showCodeDialog = false
				} else {
					this.sendSms()
					res.resendCall()
				}
			},
			bindVip() {
				this.loading = true
				this.$uniRequest.post('/api/small_procedures/login/bind_vip', {
					msgCode: this.code
				}).then(res => {
					let user = wx.getStorageSync('token')
					user.cardList = res.data
					wx.setStorageSync('token', user)
					this.showCodeDialog = false
				}).finally(() => this.loading = false)
			}

		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
