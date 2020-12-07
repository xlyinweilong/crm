<template>
	<view>
		<div style="background-color: #fff;width: 720rpx;margin: auto;padding-top: 20px;margin-top: 30px;">
			<div style="text-align: center;padding-bottom: 10rpx;">
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
			<div class="wrapper-dashed">
				<div class="dashed"></div>
			</div>
			<van-cell @click="showDetail" title="优惠券详情" :border="true" is-link />
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
				wx.showLoading({
					title: '加载中'
				})
				this.$uniRequest.get('/api/small_ticket_detail/info', {
					data: {
						id: id
					}
				}).then(res => {
					this.ele = res.data
					this.cardCode = this.ele.userCardCode
					this.$nextTick(() => {
						this.$refs.qrcode._makeCode()
					})
				}).finally(() => wx.hideLoading())
			},
			showDetail(){
				uni.navigateTo({
					url: '/pages/ticket/shelf/detail_info?code=' + this.ele.ticketCode
				})
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
	
	.wrapper-dashed {
		position: relative;
		height: 1px;
		width: 100%;
	}
	
	/*虚线实现*/
	.dashed {
		/* border-top: 1px dashed #cccccc; */
		height: 1px;
		overflow: hidden;
	}
	
	.dashed:before,
	.dashed:after {
		display: block;
		position: absolute;
		content: "";
		width: 10px;
		height: 10px;
		background-color: #439057;
		border-radius: 50%;
		top: -5px;
	}
	
	.dashed:before {
		left: -5px;
	}
	
	.dashed:after {
		right: -5px;
	}
</style>
