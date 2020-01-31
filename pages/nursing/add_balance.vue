<template>
	<view class="add_balance">
		<div class="recharge_list">
			<div class="recharge_list_title">充焕新币</div>
			<van-row v-for="recharge in rechargeConfigList">
				<van-col span="8" v-for="ele in recharge.subList">
					<div class="recharge_item div-inline" hover-class="recharge_item_hover" @click="createPayOrder(ele)">
						<p>{{ele.nursingAmount}}个</p>
						<p class="shoujia">售价{{ele.payAmount}}元</p>
					</div>
				</van-col>
			</van-row>
		</div>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'

	export default {
		components: {},
		data() {
			return {
				rechargeConfigList: []
			}
		},
		onLoad(query) {
			this.loadRechargeConfig()
		},
		onPullDownRefresh() {
			this.loadRechargeConfig()
		},
		methods: {
			//加载所有充值配置
			loadRechargeConfig() {
				Toast.loading('加载中...')
				this.$uniRequest.get('/api/nursing_recharge_config/list').then(res => {
					this.rechargeConfigList = []
					let ele = null;
					for (let i = 0; i < res.data.length; i++) {
						if (i == 0 || i % 3 == 0) {
							ele = {
								subList: []
							}
							this.rechargeConfigList.push(ele)
						}
						ele.subList.push(res.data[i])
					}
				}).finally(() => Toast.clear())
			},
			//创建支付订单
			createPayOrder(ele) {
				Toast.loading('加载中...')
				this.$uniRequest.post('/api/small_procedures/pay_nursing_balance/create_order', ele).then(res => {
					wx.requestPayment({
						timeStamp: res.data.timeStamp + '',
						nonceStr: res.data.nonceStr,
						package: res.data.package,
						signType: 'MD5',
						paySign: res.data.paySign,
						success(res) {
							console.log("支付成功")
							Toast.success('充值成功')
						},
						fail(res) {
							console.log("支付失败")
						}
					})
				}).finally(() => Toast.clear())
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
	.add_balance {
		margin-top: 10rpx;
		background-color: #FFFFFF;
		padding-bottom: 15rpx;
	}

	.add_balance .recharge_item {
		text-align: center;
		border:1px solid #706000;
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
