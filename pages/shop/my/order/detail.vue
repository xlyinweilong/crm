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
						</div>
						<div style="margin-top: 12rpx;width:410rpx;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
							单价：￥{{g.price}}
						</div>
						<div style="margin-top: 12rpx;width:410rpx;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
							数量：{{g.quantity}}<span v-if="g.totalRefundQuantity > 0" style="margin-left: 12px;">退数量：{{g.totalRefundQuantity}}</span>
						</div>
					</div>
				</div>
				<!-- 金额明细 -->
				<div style="padding-left: 30rpx;color:#909399;border-top: 1px solid #F7F7F7;">
					<div style="display: flex;margin-top: 20rpx;">
						<div style="width: 300rpx;">商品金额</div>
						<div style="width: 420rpx;text-align: right;padding-right: 30rpx;">￥{{g.amount}}</div>
					</div>
					<div v-if="g.totalRefundAmount > 0" style="display: flex;margin-top: 20rpx;">
						<div style="width: 300rpx;">商品退款</div>
						<div style="width: 420rpx;text-align: right;padding-right: 30rpx;">￥{{g.totalRefundAmount}}</div>
					</div>
					<!-- <div style="display: flex;margin-top: 20rpx;">
						<div style="width: 300rpx;">活动优惠</div>
						<div style="width: 420rpx;text-align: right;padding-right: 30rpx;">-￥0.00</div>
					</div> -->
					<div style="display: flex;margin-top: 20rpx;margin-bottom: 18rpx;">
						<div style="width: 300rpx;">获得积分</div>
						<div style="width: 420rpx;text-align: right;padding-right: 30rpx;">{{g.cleanIntegral}}</div>
					</div>
				</div>
			</div>
			<!-- 订单时间 -->
			<div class="order_detail">
				<div style="margin-top: 18rpx;">订单编号：{{ele.code}}</div>
				<div style="margin-top: 18rpx;">创建时间：{{ele.createDate}}</div>
				<div v-if="ele.ticketAmount > 0" style="display: flex;margin-top: 20rpx;">
					<div style="width: 300rpx;">优惠卷</div>
					<div style="width: 420rpx;text-align: right;padding-right: 30rpx;">-￥{{ele.ticketAmount}}</div>
				</div>
			</div>
			<div v-if="ele.expressCode != null" class="order_detail">
				<div style="margin-top: 18rpx;">快递：{{ele.expressCompanyName}}</div>
				<div style="margin-top: 18rpx;">快递单号：{{ele.expressCode}}</div>
			</div>
			<div v-if="ele.packageId != null" class="order_detail">
				<div style="margin-top: 18rpx;">快递：{{ele.shopPackagePo.deliveryId}}</div>
				<div style="margin-top: 18rpx;">快递单号：{{ele.shopPackagePo.waybillId}}</div>
			</div>
			<!-- 订单快递 -->
			<div v-if="!loadingDetail && expressLocationList.length > 0" class="order_detail">
				<div v-for="e in expressLocationList" :key="e.actionType" style="margin-top: 18rpx;height: 30rpx;padding-right: 18rpx;">
					<div style="float: left;">{{e.actionTime}}</div>
					<div style="float: right;">{{e.actionMsg}}</div>
				</div>
			</div>
			<!-- 取货二维码 -->
			<div v-if="ele.receiveType == 'self' && ele.status == 'PENDING_DELIVERY'" class="detail_option" style="text-align: center;">
				<div style="margin-top: 8rpx;margin-bottom: 8rpx;">出示二维码取货</div>
				<tkiQrcode ref="qrcode" :size="400" :val="ele.code" />
			</div>
			<!-- 订单操作 -->
			<div class="detail_option">
				<div style="margin-top: 18rpx;margin-bottom: 18rpx;">
					<span v-if="ele.statusCode == 'PENDING_SEND' || ele.statusCode == 'PENDING_DELIVERY'" class="detail_option_button" @click="cancelOrder(ele)">取消订单</span>
					<span v-if="ele.statusCode == 'PENDING_RECEIVE'" class="detail_option_button" @click="receive(ele)" style="color:#706000;border-color:#706000">确认收货</span>
					<span v-if="ele.canRefund" class="detail_option_button" @click="refund(ele)" style="color:#706000;border-color:#706000">退货</span>
				</div>
			</div>
		</div>
		<van-toast id="van-toast" />
		<van-dialog id="van-dialog" confirm-button-color="#706000" />
		<uni-popup ref="popup" type="bottom">
			邮寄地址：{{locationMessage}}
		</uni-popup>
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import Dialog from '@/wxcomponents/vant/dialog/dialog'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"

	export default {
		components: {
			uniLoadMore,
			uniPopup,
			tkiQrcode
		},
		data() {
			return {
				id: '',
				ele: {
					code: ''
				},
				loadingDetail: false,
				expressLocationList: [],
				locationMessage: ''
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
					this.loadDetail()
					if(this.ele.receiveType == 'self' && this.ele.status == 'PENDING_DELIVERY'){
						this.$nextTick(() => {
							this.$refs.qrcode._makeCode()
						})
					}
				}).finally(() => Toast.clear())
			},
			showGoodsDetail(g) {
				uni.navigateTo({
					url: '/pages/shop/goods/goods_detail?g=' + g.goodsCode
				})
			},
			loadDetail() {
				if (this.ele.packageId != null && this.ele.packageId != '') {
					this.loadingDetail = true
					this.$uniRequest.get('/api/small/shop/order/express_path', {
						data: {
							id: this.ele.packageId
						}
					}).then(res => {
						this.expressLocationList = res.data
					}).finally(() => this.loadingDetail = false)
				}
			},
			//取消
			cancelOrder() {
				Dialog.confirm({
					message: '确定要取消吗？'
				}).then(() => {
					Toast.loading({
						duration: 0,
						mask: true,
						message: '加载中...'
					})
					this.$uniRequest.post('/api/small/shop/order/cancel_order', {
						id: this.id
					}).then(res => {
						Toast.clear()
						Toast('取消成功')
						this.info()
					}).catch(e => Toast.clear())
				}).catch(e => {})
			},
			//收货
			receive(o) {
				Dialog.confirm({
					message: '要确定收货吗？'
				}).then(() => {
					Toast.loading({
						duration: 0,
						mask: true,
						message: '加载中...'
					})
					this.$uniRequest.post('/api/small/shop/order/receive_order', {
						id: o.id
					}).then(res => {
						Toast.clear()
						Toast('操作成功')
						this.info()
					}).catch(() => Toast.clear())
				}).catch(e => {})
			},
			//退款
			refund(o) {
				Toast.loading({
					duration: 0,
					mask: true,
					message: '加载中...'
				})
				this.$uniRequest.get('/api/config/sysconfig/info', {
					data: {
						key: "SHOP_CONFIG_received_location"
					}
				}).then(res => {
					Toast.clear()
					if (res.data.configValue == '' || res.data.configValue == null) {
						uni.navigateTo({
							url: '/pages/shop/my/order/refund?id=' + o.id
						})
					} else {
						this.locationMessage = res.data.configValue
						this.$refs.popup.open()
					}
				}).catch(() => Toast.clear())
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

	.detail_option {
		background-color: #ffffff;
		font-size: 26rpx;
		color: #606266;
		border-bottom: 1px solid #F7F7F7;
		text-align: right;
		padding-right: 20rpx;
		padding-top: 24rpx;
		padding-bottom: 24rpx;
	}

	.detail_option_button {
		margin-right: 20rpx;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		text-align: center;
		padding-left: 30rpx;
		padding-right: 30rpx;
		color: #000000;
		border: 1px solid #000000;
	}
</style>
