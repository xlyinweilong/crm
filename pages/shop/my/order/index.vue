<template>
	<view>
		<van-tabs :active="active" @change="onChangeActive" color="#706000">
			<van-tab title="线上订单" name="1">
				<div class="title">
					<div @click="selectSubActive('')" class="subTitle" :style="{'color':listQuery.status == '' ? '#706000':'#606266' }">全部</div>
					<div @click="selectSubActive('PENDING_PAYMENT')" class="subTitle" :style="{'color':listQuery.status == 'PENDING_PAYMENT' ? '#706000':'#606266' }">待支付</div>
					<div @click="selectSubActive('PENDING_SEND')" class="subTitle" :style="{'color':listQuery.status == 'PENDING_SEND' ? '#706000':'#606266' }">待发货</div>
					<div @click="selectSubActive('PENDING_RECEIVE')" class="subTitle" :style="{'color':listQuery.status == 'PENDING_RECEIVE' ? '#706000':'#606266' }">待收货</div>
					<div @click="selectSubActive('PENDING_EVALUATE')" class="subTitle" :style="{'color':listQuery.status == 'PENDING_EVALUATE' ? '#706000':'#606266' }">待评价</div>
				</div>
				<div>
					<div v-for="o in orderList" :key="o.id" class="detail">
						<div class="detail_code">
							<div class="detail_code_left">单号：{{o.code}}</div>
							<div style="color: #706000;" class="detail_code_right">
								{{o.statusMean}}
							</div>
						</div>
						<div v-for="g in o.goodsList" :key="g.id" class="detail_info" @click="showDetail(o)">
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
							<div class="detail_info_total">
								<span>共{{o.quantity}}件商品</span>
								<span style="margin-left: 18rpx;">合计：{{o.amount}}</span>
							</div>
						</div>
						<div class="detail_option">
							<div style="margin-top: 18rpx;margin-bottom: 18rpx;">
								<span v-if="o.statusCode == 'EVALUATED'" class="detail_option_button" @click="evaluate(o)" style="color:#706000;border-color:#706000">查看评价</span>
								<span v-if="o.statusCode == 'PENDING_EVALUATE'" class="detail_option_button" @click="evaluate(o)" style="color:#706000;border-color:#706000">评价</span>
								<span v-if="o.statusCode == 'PENDING_PAYMENT'" class="detail_option_button" @click="doPay(o)" style="color:#706000;border-color:#706000">支付</span>
								<span v-if="o.statusCode == 'PENDING_PAYMENT' || o.statusCode == 'INVALID'" class="detail_option_button" @click="deleteOrder(o)">删除订单</span>
								<span v-if="o.statusCode == 'PENDING_RECEIVE'" class="detail_option_button" @click="receive(o)" style="color:#706000;border-color:#706000">确认收货</span>
							</div>
						</div>
					</div>
				</div>
				<uni-load-more :status="status"></uni-load-more>
			</van-tab>
			<van-tab title="线下订单" name="2">
				<div>
					<div v-for="ele in list" :key="ele.posCode" class="content" @click="goDetail(ele)" hover-class="hover-div">
						<div>
							<span class="title">{{ele.channelName}}</span>
							<span style="font-size: 26rpx;float: right;margin-top: 5rpx;">{{ele.billDate}}</span>
						</div>
						<div class="sub_content">
							<div>单号：{{ele.posCode}}</div>
							<div style="margin-top: 5rpx;">
								<span>数量：*{{ele.totalCount}}件</span>
								<span style="float: right;">支付：<span style="color:#C80000">{{ele.totalAmount}}</span>元</span>
							</div>
						</div>
					</div>
				</div>
				<uni-load-more :status="status"></uni-load-more>
			</van-tab>
		</van-tabs>
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
				active: '1',
				loading: false,
				orderList: [],
				listQuery: {
					status: '',
					pageIndex: 1,
					pageSize: 10
				},
				status: "loading",
				list: []
			}
		},
		computed: {},
		onLoad(query) {
			if (query.a) {
				this.active = query.a
			}
			if (query.s) {
				this.listQuery.status = query.s
			}
		},
		onShow() {
			if (this.active == '1') {
				this.reLoadList()
			} else {
				this.getBillList()
			}
		},
		// 上拉加载
		onReachBottom() {
			if (this.status == "loading" || this.status == "noMore") {
				return false
			}
			this.listQuery.pageIndex += 1
			uni.showNavigationBarLoading()
			if (this.active == '1') {
				this.getList()
			} else {
				this.moreBill()
			}
		},
		methods: {
			//切换1级tab
			onChangeActive(e) {
				this.active = e.detail.name
				if (this.active == '1') {
					this.reLoadList()
				} else {
					this.getBillList()
				}
			},
			//切换2级tab
			selectSubActive(e) {
				this.listQuery.status = e
				this.reLoadList()
			},
			getList() {
				this.status = "loading"
				this.$uniRequest.post('/api/small/shop/order/list', this.listQuery).then(res => {
					res.data.content.filter(order => this.orderList.every(g => g.id !== order.id)).forEach(order => {
						this.orderList.push(order)
					})
					uni.hideNavigationBarLoading()
					this.status = "more"
					if (res.data.content.length == 0 || res.data.totalElements <= this.orderList.length) {
						this.status = "noMore"
					}
				}).catch(e => {
					uni.hideNavigationBarLoading()
					this.status = "noMore"
				})
			},
			//重新加载数据
			reLoadList() {
				this.pageIndex = 1
				this.orderList = []
				this.getList()
			},
			//支付
			doPay(o) {
				Toast.loading({
					duration: 0,
					mask: true,
					message: '加载中...'
				})
				let _this = this
				this.$uniRequest.post('/api/small/shop/order/re_pay', {
					id: o.id
				}).then(res => {
					wx.requestPayment({
						timeStamp: res.data.timeStamp + '',
						nonceStr: res.data.nonceStr,
						package: res.data.package,
						signType: 'MD5',
						paySign: res.data.paySign,
						success(res) {
							Toast("支付成功")
							_this.reLoadList()
						},
						fail(res) {
							Toast("支付失败")
						}
					})
				}).finally(() => Toast.clear())
			},
			receive(o){
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
						Toast('操作成功')
						this.reLoadList()
					}).finally(() => Toast.clear())
				}).catch(e => {})
			},
			//删除单据
			deleteOrder(o) {
				Dialog.confirm({
					message: '确定要删除此订单吗？'
				}).then(() => {
					Toast.loading({
						duration: 0,
						mask: true,
						message: '加载中...'
					})
					this.$uniRequest.post('/api/small/shop/order/delete_order', {
						id: o.id
					}).then(res => {
						Toast('删除成功')
						this.reLoadList()
					}).finally(() => Toast.clear())
				}).catch(e => {})
			},
			//评价
			evaluate(o) {
				uni.navigateTo({
					url: '/pages/shop/my/evluate/index?id=' + o.id
				})
			},
			//显示明细
			showDetail(o) {
				uni.navigateTo({
					url: '/pages/shop/my/order/detail?id=' + o.id
				})
			},
			//线下单据明细
			goDetail(e) {
				console.log(e)
				uni.navigateTo({
					url: '/pages/sale_bill/detail?posCode=' + e.posCode
				})
			},
			getBillList() {
				this.listQuery.pageIndex = 1
				this.list = []
				this.moreBill()
			},
			moreBill() {
				this.status = "loading"
				let type = this.tab === 1 ? 'SALE' : 'RETURN'
				this.$uniRequest.get('/api/small_procedures/vip/my_sale_list_2', {
					data: {
						pageIndex: this.listQuery.pageIndex,
						pageSize: 10,
						type: type
					}
				}).then(res => {
					res.data.content.forEach(c => this.list.push(c))
					uni.hideNavigationBarLoading()
					this.status = "more"
					if (res.data.content.length == 0 || res.data.totalElements <= this.list.length) {
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
		background-color: #F2F6FC;
	}
</style>

<style scoped>
	.popup-button-div {
		background-color: #FFFFFF;
		z-index: 100;
		text-align: center;
		position: fixed;
		height: 80px;
		bottom: 0px;
		width: 100%;
		border-top: 1px solid #DCDFE6;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}

	.title {
		display: flex;
		background: #F7F7F7;
		border-top: 1px solid #DCDFE6;
		border-bottom: 1px solid #DCDFE6;
	}

	.subTitle {
		width: 150rpx;
		font-size: 26rpx;
		color: #606266;
		text-align: center;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
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

	.detail_option {
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

	.hover-div {
		border: 1px solid #706000;
		background-color: #F2F6FC;
	}

	.title {
		font-weight: 800;
		margin-left: 10rpx;
		font-size: 32rpx;
		color: #706000;
	}

	.content {
		color: #909399;
		padding: 15rpx 30rpx 0rpx 30rpx;
		border-bottom: 2px solid #706000;
		background-color: #ffffff;
	}

	.sub_content {
		font-size: 28rpx;
		margin-top: 5rpx;
		margin-bottom: 10rpx;
		background-color: #ffffff;
		padding: 15rpx;
	}
</style>
