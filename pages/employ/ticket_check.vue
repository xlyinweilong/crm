<template>
	<view>
		<div class="ticket" v-if="ele.id == ''">
			<div style="margin-top: 10px;margin-bottom: 10px;margin-left: 20rpx;margin-right: 20rpx;">
				扫描优惠券二维码，即可以核销二维码
			</div>
			<van-button type="primary" block @click="scanCode">扫码</van-button>
		</div>
		<div v-if="ele.id != ''" style="text-align: center;background-color: #fff;width: 720rpx;margin: auto;padding-bottom: 10px;padding-top: 20px;margin-top: 30px;">
			<div style="font-size: 30rpx;">{{ele.title}}</div>
			<div v-if="ele.cardType == 'CASH'" style="margin-top: 28rpx;">
				<span style="font-size: 48rpx;">￥</span>
				<span style="font-size: 80rpx;font-weight:600;margin-left: 8rpx;">{{ele.reduceCost}}</span>
				<span style="font-size: 24rpx;margin-left: 8rpx;">
					代金券
				</span>
			</div>
			<div class="ticket_limit" v-if="ele.leastCost != null">满{{ele.leastCost}}元可用</div>
			<div class="ticket_limit">{{ele.userCardCode}}</div>
			<div style="padding-left: 24rpx;padding-right: 15px;margin-top: 24rpx;font-size: 20px;">
				<van-button type="primary" block @click="doCheck">确定核销</van-button>
			</div>
		</div>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import uniLoadMore from "components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				ele: {
					id: ''
				},
				loading: false
			}
		},
		props: {},
		onLoad() {},
		methods: {
			scanCode() {
				let _this = this
				wx.scanCode({
					success(res) {
						wx.showLoading({
							title: '加载中',
						})
						let code = res.result
						if (!_this.loading) {
							_this.loading = true
							_this.$uniRequest.get('/api/small_ticket_detail/info_by_code', {
								data: {
									code: code
								}
							}).then(res => {
								_this.ele = res.data
							}).finally(() => {
								_this.loading = false
								wx.hideLoading()
							})
						}
					}
				})
			},
			doCheck() {
				if (this.ele.id == '') {
					return
				}
				wx.showLoading({
					title: '加载中',
				})
				if (!this.loading) {
					this.loading = true
					this.$uniRequest.post('/api/small_ticket_detail/check', {
						id: this.ele.id
					}).then(res => {
						Toast.success('核销成功')
						this.ele = {
							id: ''
						}
					}).finally(() => {
						this.loading = false
						wx.hideLoading()
					})
				}
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>

<style>
	.ticket {
		margin: 3px 10px 0px 10px;
		border-top: 3px solid #DCDFE6;
		padding-top: 7px;
	}

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
