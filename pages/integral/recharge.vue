<template>
	<view class="add_balance">
		<div class="recharge_list">
			<div class="recharge_list_title">购买积分</div>
			<van-row>
				<van-col span="24">
					<div class="recharge_item div-inline" hover-class="recharge_item_hover" @click="createPayOrder">
						<p>{{gotIntegral()}}积分</p>
						<p class="shoujia">售价{{amount}}元</p>
					</div>
				</van-col>
			</van-row>
		</div>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import uniLoadMore from "components/uni-load-more/uni-load-more.vue"
	import Toast from '@/wxcomponents/vant/toast/toast'
	import {
		accMul,
		accSub,
		accAdd
	} from '@/utils/mathUtils'

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				amount: 0,
				uid: '',
				qrCodeId: '',
				loading: false,
				integralRate: 0
			}
		},
		onLoad(query) {
			this.amount = query.amount
			this.uid = query.uid
			this.qrCodeId = query.qrCodeId
			this.loadPaymentConfig()
		},
		methods: {
			gotIntegral() {
				return this.amount == '' ? 0 : accMul(this.amount, this.integralRate)
			},
			loadPaymentConfig() {
				Toast.loading('加载中...')
				this.$uniRequest.get('/api/config/payment/get_by_type', {
					data: {
						type: 'INTEGRAL'
					}
				}).then(res => {
					this.integralRate = res.data.integral
				}).finally(() => Toast.clear())
			},
			//创建支付订单
			createPayOrder(ele) {
				Toast.loading('加载中...')
				this.$uniRequest.post('/api/small_procedures/pay_integral_balance/create_order', {
					qrCodeId: this.qrCodeId,
					integral: this.gotIntegral(),
					uid: this.uid,
					payAmount: this.amount
				}).then(res => {
					wx.requestPayment({
						timeStamp: res.data.timeStamp + '',
						nonceStr: res.data.nonceStr,
						package: res.data.package,
						signType: 'MD5',
						paySign: res.data.paySign,
						success(res) {
							Toast.success('购买成功')
							uni.reLaunch({
								url: '/pages/login/index'
							})
						},
						fail(res) {}
					})
				}).finally(() => Toast.clear())
			}
		}
	}
</script>

<style scoped>
	.add_balance {
		margin-top: 10rpx;
		background-color: #FFFFFF;
		padding-bottom: 15rpx;
	}

	.add_balance .recharge_item {
		text-align: center;
		border: 1px solid #706000;
		padding: 35rpx 25rpx 35rpx 25rpx;
		margin: 20rpx 20rpx 20rpx 20rpx;
		color: #706000;
		font-size: 35rpx;
		border-radius: 5px;
	}

	.recharge_list_title {
		padding-top: 30rpx;
		margin-left: 20rpx;
		padding-bottom: 15rpx;
		color: #706000;
		font-size: 30rpx;
	}

	.shoujia {
		font-size: 22rpx;
		font-weight: lighter;
	}

	.add_balance .recharge_item_hover {
		color: #C80000;
	}
</style>
