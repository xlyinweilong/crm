<template>
	<view>
		<div>
			<!-- 收货方式 -->
			<div v-if="ele.receiveType == 'express'" style="display: flex;background: #ffffff;font-size: 28rpx;
					color:#303133;align-items: center;
					padding-top: 30rpx;padding-bottom: 30rpx;
					padding-left: 20rpx;padding-right: 20rpx;">
				<div style="width: 40rpx;">
					<span style="font-size: 40rpx;" class="iconfont icon-fujinmendian"></span>
				</div>
				<div style="width: 600rpx;margin-left: 20rpx;">
					<p v-if="ele.locationReceiver != null" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">收货人：<span>{{ele.locationReceiver}}</span><span
						 style="margin-left: 16rpx;">{{ele.locationMobile}}</span></p>
					<p v-if="ele.locationReceiver != null" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
						<span>{{ele.locationProvinceName}}</span>
						<span style="margin-left: 16rpx;">{{ele.locationCityName}}</span>
						<span style="margin-left: 16rpx;">{{ele.locationStationName}}</span>
						<span style="margin-left: 16rpx;">{{ele.locationAddress}}</span>
					</p>
				</div>
			</div>
			<div v-if="ele.receiveType == 'self'" style="display: flex;background: #ffffff;font-size: 28rpx;
				color:#303133;align-items: center;
				padding-top: 10rpx;padding-bottom: 30rpx;
				padding-left: 20rpx;padding-right: 20rpx;">
				<div style="font-size: 28rpx;color:#706000">{{ele.channelName}}</div>
			</div>
			<!-- 商品明细 -->
			<div v-for="g in ele.goodsList" :key="g.id" class="detail_info" @click="showGoodsDetail(g)">
				<div class="detail_info_text">
					<div style="width: 250rpx;padding-left: 30rpx;">
						<image style="width: 250rpx; height: 250rpx; background-color: #eeeeee;" mode="aspectFit" :src="g.imageUrl" />
					</div>
					<div style="width: 470rpx;padding-left: 20rpx;color:#303133;padding-top: 30rpx;">
						<div style="font-size: 30rpx;width:410rpx;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
							{{g.goodsDisplayName}}
						</div>
						<div style="margin-top: 30rpx;width:410rpx;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
							<span>颜色:{{g.colorName}}</span>
							<span style="margin-left: 18rpx;">尺码:{{g.sizeName}}</span>
							<span style="margin-left: 18rpx;">数量:{{g.quantity}}</span>
						</div>
						<div style="margin-top: 12rpx;width:410rpx;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
							单价：￥{{g.price}}
						</div>
					</div>
				</div>
				<!-- 金额明细 -->
				<div style="padding-left: 30rpx;color:#909399;border-top: 1px solid #F7F7F7;">
					<div style="display: flex;margin-top: 20rpx;">
						<div style="width: 300rpx;">商品金额</div>
						<div style="width: 420rpx;text-align: right;padding-right: 30rpx;">￥{{g.amount}}</div>
					</div>
					<div style="display: flex;margin-top: 20rpx;">
						<div style="width: 300rpx;">活动优惠</div>
						<div style="width: 420rpx;text-align: right;padding-right: 30rpx;">-￥0.00</div>
					</div>
					<div style="display: flex;margin-top: 20rpx;margin-bottom: 18rpx;">
						<div style="width: 300rpx;">获得积分</div>
						<div style="width: 420rpx;text-align: right;padding-right: 30rpx;">0</div>
					</div>
				</div>
			</div>
			<!-- 订单时间 -->
			<div class="order_detail">
				<div style="margin-top: 18rpx;">订单编号：{{ele.code}}</div>
				<div style="margin-top: 18rpx;">创建时间：{{ele.createDate}}</div>
			</div>
			<div v-if="ele.expressCode != null" class="order_detail">
				<div style="margin-top: 18rpx;">快递：{{ele.expressCompanyName}}</div>
				<div style="margin-top: 18rpx;">快递单号：{{ele.expressCode}}</div>
			</div>
			<!-- 订单操作 -->
		</div>
		<van-toast id="van-toast" />
		<van-dialog id="van-dialog" confirm-button-color="#706000" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import Dialog from '@/wxcomponents/vant/dialog/dialog'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				id: '',
				ele: {}
			}
		},
		computed: {},
		onLoad(query) {
			if (query.id) {
				this.id = query.id
				this.info()
			}
		},
		onShow() {

		},
		methods: {
			info() {
				Toast.loading({
					duration: 0,
					mask: true,
					message: '加载中...'
				})
				this.$uniRequest.get('/api/small/shop/order/info', {
					data: {
						id: this.id
					}
				}).then(res => {
					this.ele = res.data
				}).finally(() => Toast.clear())
			},
			showGoodsDetail(g) {
				uni.navigateTo({
					url: '/pages/shop/goods/goods_detail?g=' + g.goodsCode
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F2F6FC;
	}
</style>

<style scoped>
	.order_detail {
		padding-left: 30rpx;
		padding-top: 12rpx;
		margin-top: 18rpx;
		font-size: 26rpx;
		border-bottom: 1px solid #F7F7F7;
		background-color: #ffffff;
		padding-bottom: 30rpx;
		color: #909399;
	}

	.detail_info {
		margin-top: 18rpx;
		font-size: 26rpx;
		border-bottom: 1px solid #F7F7F7;
		background-color: #ffffff;
		padding-bottom: 12rpx;
	}

	.detail_info_text {
		padding-top: 24rpx;
		display: flex;
	}
</style>
