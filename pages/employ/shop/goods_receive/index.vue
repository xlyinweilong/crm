<template>
	<view>
		<van-dropdown-menu>
			<van-dropdown-item id="item" title="时间筛选" @open="openDropdown">
				<van-cell-group>
					<van-field type="number" :value="startDate" placeholder="请输入开始时间" :border="false" @change="onChange($event,startDate)" />
				</van-cell-group>
				<van-cell-group>
					<van-field type="number" :value="endDate" placeholder="请输入结束时间" :border="false" @change="onChange($event,endDate)" />
				</van-cell-group>
				<van-button type="info" block @click="onConfirm">
					确定
				</van-button>
			</van-dropdown-item>
		</van-dropdown-menu>
		<div style="margin-bottom: 50px;">
			<div v-for="o in list" :key="o.id" class="detail">
				<div class="detail_code">
					<div class="detail_code_left">单号：{{o.code}}</div>
					<div style="color: #706000;" class="detail_code_right">
						{{o.statusMean}}
					</div>
				</div>
				<div v-for="g in o.goodsList" :key="g.id" class="detail_info">
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
					<div class="detail_info_total">
						<span>共{{o.quantity - o.totalRefundQuantity}}件商品</span>
						<span style="margin-left: 18rpx;">合计：￥{{o.totalCleanAmount }}</span>
					</div>
				</div>
				<div class="detail_code">
					<div class="detail_code_left">
						出货时间：{{o.shipmentDate}}
					</div>
				</div>
			</div>
		</div>
		<uni-load-more :status="status"></uni-load-more>
		</div>
		<div class="center" @click="scan" hover-class="user-info-hover">
			<span class="iconfont icon-scanning" style="margin-right: 10rpx;font-size: 16px;"></span>
			扫码出货
		</div>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import {
		format
	} from '@/utils/date'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import Dialog from '@/wxcomponents/vant/dialog/dialog'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				status: "loading",
				loading: false,
				listQuery: {
					pageIndex: 1,
					pageSize: 10,
					startDate: '',
					endDate: ''
				},
				startDate: '',
				endDate: '',
				list: []
			}
		},
		onLoad() {
			this.listQuery.startDate = this.startDate = format(new Date(), 'yyyyMM')
			this.listQuery.endDate = this.endDate = format(new Date(), 'yyyyMM')
			this.reSearch()
		},
		// 上拉加载
		onReachBottom() {
			if (this.status == "loading" || this.status == "noMore") {
				return false
			}
			this.listQuery.pageIndex += 1
			uni.showNavigationBarLoading()
			this.getList()
		},
		methods: {
			openDropdown() {
				this.startDate = this.listQuery.startDate
				this.endDate = this.listQuery.endDate
			},
			onChange(e, d) {
				d = e.detail
			},
			onConfirm() {
				this.listQuery.startDate = this.startDate
				this.listQuery.endDate = this.endDate
				this.reSearch()
				this.selectComponent('#item').toggle();
			},
			scan() {
				let _this = this
				wx.scanCode({
					success(res) {
						if (res.scanType == 'QR_CODE') {
							let code = res.result
							wx.showLoading({
								title: '加载中'
							})
							_this.$uniRequest.post('/api/small/shop/order/employ/shipment', {
								code: code
							}).then(res => {
								_this.reSearch()
							}).catch(e => wx.hideLoading())
						}
					}
				})
			},
			reSearch() {
				this.listQuery.pageIndex = 1
				this.list = []
				this.getList()
			},
			getList() {
				this.status = "loading"
				this.$uniRequest.post('/api/small/shop/order/employ/list', this.listQuery).then(res => {
					res.data.records.filter(d => this.list.every(g => g.id !== d.id)).forEach(d => {
						this.list.push(d)
					})
					uni.hideNavigationBarLoading()
					this.status = "more"
					if (res.data.records.length == 0 || res.data.total == this.list.length) {
						this.status = "noMore"
					}
				}).catch(e => {
					uni.hideNavigationBarLoading()
					this.status = "noMore"
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
	.user-info-hover {
		color: #C80000;
	}

	.center {
		position: fixed;
		text-align: center;
		bottom: 0px;
		z-index: 100;
		background-color: #fff;
		width: 750rpx;
		height: 50px;
		line-height: 50px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}

	.detail {
		background-color: #ffffff;
		font-size: 26rpx;
		color: #606266;
		margin-bottom: 14rpx;
	}

	.detail_code {
		display: flex;
		padding-top: 28rpx;
		padding-bottom: 28rpx;
		border-bottom: 1px solid #F7F7F7;
	}

	.detail_code_left {
		width: 500rpx;
		text-align: left;
		padding-left: 30rpx;
		color: #909399;
	}

	.detail_code_right {
		width: 250rpx;
		text-align: right;
		padding-right: 30rpx;
	}

	.detail_info {
		border-bottom: 1px solid #F7F7F7;
	}

	.detail_info_total {
		padding-right: 30rpx;
		text-align: right;
		padding-top: 24rpx;
		padding-bottom: 24rpx;
	}

	.detail_info_text {
		padding-top: 24rpx;
		display: flex;
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
