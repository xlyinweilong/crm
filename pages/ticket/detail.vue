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
			<div v-if="cardCode != ''">
				<div class="qrcode">
					<tki-qrcode ref="qrcode" :size="400" :val="cardCode" />
				</div>
				<div class="code">
					<span>{{cardCode}}</span>
				</div>
			</div>
		</div>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"

	export default {
		components: {
			tkiQrcode
		},
		data() {
			return {
				ele: {
					id: ''
				},
				loading: false,
				cardCode: ''
			}
		},
		onLoad(query) {
			this.info(query.id)
		},
		methods: {
			info(id) {
				let _this = this
				wx.showLoading({
					title: '加载中'
				})
				this.$uniRequest.get('/api/small_ticket_detail/info', {
					data: {
						id: id
					}
				}).then(res => {
					this.ele = res.data
					console.log(this.ele)
					this.cardCode = this.ele.userCardCode
					console.log(this.cardCode)
					this.$nextTick(() => {
						this.$refs.qrcode._makeCode()
					})
				}).finally(() => wx.hideLoading())
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

	.qrcode {
		padding-top: 45rpx;
		text-align: center;
		margin: 0 auto;
		width: 450upx;
	}

	.code {
		font-size: 20rpx;
		margin-top: 10rpx;
	}
</style>
