<template>
	<view>
		<div style="text-align: center;background-color: #fff;width: 720rpx;margin: auto;padding-bottom: 10px;padding-top: 20px;margin-top: 30px;">
			<div style="font-size: 30rpx;">{{ele.title}}</div>
			<div v-if="ele.cardType == 'CASH'" style="margin-top: 28rpx;">
				<span style="font-size: 48rpx;">￥</span>
				<span style="font-size: 80rpx;font-weight:600;margin-left: 8rpx;">{{ele.reduceCost}}</span>
				<span style="font-size: 24rpx;margin-left: 8rpx;">
					代金券
				</span>
			</div>
			<div class="ticket_limit" v-if="ele.leastCost != null">满{{ele.leastCost}}元可用</div>
			<div style="padding-left: 24rpx;padding-right: 15px;margin-top: 24rpx;font-size: 20px;">
				<button @click="tryReceive(ele)" :disabled="!ele.canGot" type="primary" :loading="loading" v-text="getText(ele)">
				</button>
			</div>

		</div>
	</view>
</template>

<script>
	import Dialog from 'wxcomponents/vant/dialog/dialog'

	export default {
		components: {},
		data() {
			return {
				ele: {
					id: ''
				},
				loading: false
			}
		},
		onLoad(query) {
			this.info(query.code)
		},
		methods: {
			getText(ele) {
				if (ele.canGot) {
					if (ele.needPay) {
						return ele.gotStr
					} else {
						return "立即领取"
					}
				} else {
					return "已经领取"
				}
			},
			info(code) {
				let _this = this
				wx.showLoading({
					title: '加载中',
				})
				this.$uniRequest.get('/api/small_ticket_shelf/info', {
					data: {
						code: code
					}
				}).then(res => {
					this.ele = res.data
				}).finally(() => wx.hideLoading())
			},
			tryReceive(ele) {
				if (ele.canGot) {
					if (ele.needPay) {
						this.zhifu(ele)
					} else {
						this.receive()
					}
				} else {
					wx.showToast({
						title: '已经领取，不要贪心哦',
						icon: 'none',
						duration: 1500
					})
				}
			},
			zhifu(ele) {
				let user = wx.getStorageSync('token')
				let _this = this
				this.loading = true
				this.$uniRequest.post('/api/small_procedures/pay/create_order', {
					id: ele.id
				}).then(res => {
					wx.requestPayment({
						timeStamp: res.data.timeStamp + '',
						nonceStr: res.data.nonceStr,
						package: res.data.package,
						signType: 'MD5',
						paySign: res.data.paySign,
						success(res) {
							wx.showToast({
								title: '支付成功',
								icon: 'none',
								duration: 1500
							})
							//支付成功后跳转跳转到我的卡券列表
							//_this.useThis(ele, "PAYED")
							uni.navigateBack()
						},
						fail(res) {
							wx.showToast({
								title: '支付失败',
								icon: 'none',
								duration: 1500
							})
						}
					})
				}).finally(error => this.loading = false)
			},
			receive() {
				this.loading = true
				this.$uniRequest.post('/api/small_ticket_shelf/receive', {
					id: this.ele.id
				}).then(res => {
					wx.showToast({
						title: '领取成功',
						icon: 'success',
						duration: 1500
					})
					setTimeout(() => {
						this.loading = false
						uni.navigateBack()
					}, 1500)
				}).catch(() => this.loading = false)
			}
		}
	}
</script>

<style>
	page {
		background-color: #439057;
	}
</style>

<style scoped>
	.ticket_limit {
		width: 700rpx;
		color: #666;
		margin: auto;
		margin-top: 20rpx;
		height: 30rpx;
		line-height: 30rpx;
		font-size: 30rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
