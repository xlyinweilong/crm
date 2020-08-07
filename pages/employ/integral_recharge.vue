<template>
	<view style="">
		<div>
			<div style="margin-top: 10px;margin-bottom: 10px;margin-left: 5px;font-size: 12px;color: #606266;">
				提示：每1元可充值{{integralRate}}积分
			</div>
			<van-cell-group>
				<van-field :value="amount" required type="number" @change="changeAmount" clearable label="购买金额" placeholder="请输入要购买的金额" />
			</van-cell-group>
			<div style="margin-top: 10px;margin-bottom: 10px;margin-left: 5px;font-size: 12px;color: #606266;">
				预计获得积分：{{gotIntegral()}}
			</div>
			<van-cell-group>
				<van-button type="primary" block @click="createQrCode">生成二维码</van-button>
			</van-cell-group>
			<div class="tips" v-if="base64 != ''">
				请使用顾客微信扫码<br />
			</div>
			<div class="qrcode">
				<image v-if="base64 != ''" show-menu-by-longpress mode="widthFix" style="width: 100%;" :src="base64" />
			</div>
		</div>
		<van-dialog id="van-dialog" />
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import Dialog from '@/wxcomponents/vant/dialog/dialog'
	import {
		accMul,
		accSub,
		accAdd
	} from '@/utils/mathUtils'

	export default {
		components: {},
		data() {
			return {
				amount: '',
				loading: false,
				integralRate: 0,
				base64: ''
			}
		},
		onLoad() {
			this.base64 = ''
			this.loadPaymentConfig()
		},
		methods: {
			gotIntegral() {
				return this.amount == '' ? 0 : accMul(this.amount, this.integralRate)
			},
			loadPaymentConfig() {
				wx.showLoading({
					title: '加载中',
				})
				this.loading = true
				this.$uniRequest.get('/api/config/payment/get_by_type', {
					data: {
						type: 'INTEGRAL'
					}
				}).then(res => {
					this.integralRate = res.data.integral
				}).finally(() => this.loading = false)
			},
			changeAmount(e) {
				this.amount = e.detail
			},
			createQrCode() {
				if (!this.amount > 0) {
					Toast('请输入正确的金额')
					return
				}
				wx.showLoading({
					title: '加载中',
				})
				this.$uniRequest.get('/api/small_procedures/employ/load_integral_recharge_qr_code', {
					data: {
						amount: this.amount
					}
				}).then(res => {
					this.base64 = res.data
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #EBEEF5;
	}
</style>

<style scoped>
	.tips {
		margin-top: 35rpx;
		font-size: 30rpx;
		text-align: center;
	}

	.qrcode {
		margin: 55rpx;
		text-align: center;
	}
</style>
