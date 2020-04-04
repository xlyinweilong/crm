<template>
	<view>
		<div>
			<div class="title">
				选择取货时间
			</div>
			<div class="title" @click="show = true">
				{{selectTime}}
			</div>
			<div class="title" style="margin-top: 18rpx;">
				选择上门取货地址
			</div>
			<div @click="selectLocation" style="display: flex;background: #ffffff;font-size: 28rpx;
				color:#303133;align-items: center;
				padding-top: 30rpx;padding-bottom: 30rpx;
				padding-left: 20rpx;padding-right: 20rpx;">
				<div style="width: 40rpx;">
					<span style="font-size: 40rpx;" class="iconfont icon-fujinmendian"></span>
				</div>
				<div style="width: 600rpx;margin-left: 20rpx;">
					<p v-if="selectedLocation.receiver != null" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">发货人：<span>{{selectedLocation.receiver}}</span><span
						 style="margin-left: 16rpx;">{{selectedLocation.mobile}}</span></p>
					<p v-if="selectedLocation.receiver != null" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
						<span>{{selectedLocation.provinceName}}</span>
						<span style="margin-left: 16rpx;">{{selectedLocation.cityName}}</span>
						<span style="margin-left: 16rpx;">{{selectedLocation.stationName}}</span>
						<span style="margin-left: 16rpx;">{{selectedLocation.address}}</span>
					</p>
				</div>
				<div style="width: 40rpx;">
					<span style="font-size: 48rpx;color:#909399" class="iconfont icon-arrow-right"></span>
				</div>
			</div>
			<div class="title" style="margin-top: 18rpx;" v-if="ele.goodsList.some(g => g.quantity > g.totalRefundQuantity)">
				选择退货商品
			</div>
			<div class="title" style="margin-top: 18rpx;" v-if="ele.goodsList.every(g => g.quantity <= g.totalRefundQuantity)">
				已经没有退货商品了
			</div>
			<!-- 商品明细 -->
			<div v-for="g in ele.goodsList" :key="g.id" v-if="g.quantity > g.totalRefundQuantity" class="detail_info" @click="onChangeCheck(g)">
				<div class="detail_info_text">
					<!-- 选中标签 -->
					<div style="width:40rpx;padding-top: 125rpx;margin-left: 5rpx; margin-right: 5rpx;">
						<van-checkbox icon-size="40rpx" :value="g.checked" checked-color="#706000" />
					</div>
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
			</div>
			<!-- 订单操作 -->
			<div class="detail_option" v-if="ele.goodsList.some(g => g.quantity > g.totalRefundQuantity)">
				<div style="margin-top: 18rpx;margin-bottom: 18rpx;">
					<span class="detail_option_button" @click="refund" style="color:#706000;border-color:#706000">确认退货</span>
				</div>
			</div>
		</div>
		<van-action-sheet :show="show" :actions="actions" @close="onClose" @select="onSelect" />
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
				ele: {},
				selectedLocation: {},
				locationId: '',
				show: false,
				actions: [{
						name: '明天'
					},
					{
						name: '后天'
					},
					{
						name: '第三天'
					},
					{
						name: '第四天'
					},
					{
						name: '第五天'
					}
				],
				selectTime: '明天'
			}
		},
		computed: {},
		onLoad(query) {
			if (query.id) {
				this.id = query.id
			}
			this.locationId = query.locationId
		},
		onShow() {
			this.loadLocation()
			this.info()
		},
		methods: {
			onClose() {
				this.show = false
			},
			onSelect(event) {
				this.selectTime = event.detail.name
			},
			//加载地址
			loadLocation() {
				this.loadingLocation = true
				this.$uniRequest.get('/api/small/shop/location/list').then(res => {
					this.locationList = res.data
					if (this.locationId == null && this.locationList.find(l => l.defaultLocation) != null) {
						this.selectedLocation = this.locationList.find(l => l.defaultLocation)
					}
					if (this.locationId != null) {
						this.selectedLocation = this.locationList.find(l => l.id == this.locationId)
					}
				}).finally(() => this.loadingLocation = false)
			},
			//选中，或者取消
			onChangeCheck(d) {
				d.checked = !d.checked
			},
			selectLocation() {
				uni.navigateTo({
					url: '/pages/shop/my/location/index?type=refund&id=' + this.id
				})
			},
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
					res.data.goodsList.forEach(g => g.checked = true)
					this.ele = res.data
				}).finally(() => Toast.clear())
			},
			refund() {
				let goodsList = this.ele.goodsList.filter(g => g.checked)
				if (goodsList.length == 0) {
					Toast("请选择要退货的商品")
					return
				}
				if (this.selectedLocation.id == null || this.selectedLocation.id == '') {
					Toast("请选择上门取货地址")
					return
				}
				Toast.loading({
					duration: 0,
					mask: true,
					message: '加载中...'
				})
				let ele = {
					id:this.id,
					goodsList: goodsList,
					selectTime: this.selectTime
				}
				ele.locationId = this.selectedLocation.id
				ele.locationMobile = this.selectedLocation.mobile
				ele.locationAddress = this.selectedLocation.address
				ele.locationCityName = this.selectedLocation.cityName
				ele.locationSender = this.selectedLocation.receiver
				ele.locationProvinceName = this.selectedLocation.provinceName 
				ele.locationStationName = this.selectedLocation.stationName
				let _this = this
				uni.request({
					url: _this.$baseURL + '/api/small/shop/refund_order/create_refund_order',
					data: ele,
					method: 'POST',
					header: {
						'content-type': 'application/json',
						'X-Token': _this.$uniRequest.defaults.headers.common['X-Token'],
						'tn_id': _this.$tnId
					},
					success: (res) => {
						res = res.data
						if(res.code == 0){
							Toast.clear()
							Toast("提交成功")
							//返回
							_this.info()
						}else{
							Toast.clear()
							Toast(res.message)
						}
					},
					fail(res) {
					}
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
		font-size: 26rpx;
		border-bottom: 1px solid #F7F7F7;
		background-color: #ffffff;
		padding-bottom: 12rpx;
	}

	.detail_info_text {
		padding-top: 24rpx;
		display: flex;
	}

	.title {
		text-align: center;
		background-color: #ffffff;
		font-size: 30rpx;
		padding-right: 20rpx;
		padding-top: 24rpx;
		padding-bottom: 24rpx;
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
