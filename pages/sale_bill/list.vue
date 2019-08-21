<template>
	<view class="integral">
		<!-- header -->
		<div v-show="tab == 1" style="text-align: center;background-color: #615451;height: 360rpx;">
			<div class="white" style="padding-top:55rpx;font-size: 20rpx;">累计金额</div>
			<div class="white" style="padding-top:11rpx;font-size: 92rpx;">{{totalSale.totalAmount}}<span style="font-size: 30rpx;">元</span></div>
			<div class="white" style="padding-top:5rpx;font-size: 18rpx;">累计数量：{{totalSale.totalCount}}</div>
		</div>
		<div v-show="tab == 2" style="text-align: center;background-color: #615451;height: 360rpx;">
			<div class="white" style="padding-top:55rpx;font-size: 20rpx;">累计金额</div>
			<div class="white" style="padding-top:11rpx;font-size: 92rpx;">{{totalReturn.totalAmount}}<span style="font-size: 30rpx;">元</span></div>
			<div class="white" style="padding-top:5rpx;font-size: 18rpx;">累计数量：{{totalReturn.totalCount}}</div>
		</div>
		<div>
			<div class="tabDiv">
				<i-row span="10">
					<view @click="onClickTab(1)">
						<i-col span="12" :i-class="tab == 1 ? 'active' : 'tabSpan'"><span class="iconfont icon-jifenliebiao-wodeyue" />购买单据</i-col>
					</view>
					<view @click="onClickTab(2)">
						<i-col span="12" :i-class="tab == 2 ? 'active' : 'tabSpan'"><span class="iconfont icon-jifenliebiao-wodeyue" />退货单据</i-col>
					</view>
				</i-row>
				<div v-show="tab == 1" class="tabs_content">
					<i-row span="22">
						<i-col span="6" i-class="tab_header">时间</i-col>
						<i-col span="6" i-class="tab_header">商品</i-col>
						<i-col span="6" i-class="tab_header">颜色</i-col>
						<i-col span="6" i-class="tab_header">金额</i-col>
					</i-row>
					<view v-for="ele in list">
						<i-row span="22">
							<i-col span="6" i-class="tab_td"><span>{{ele.billDate}}</span></i-col>
							<i-col span="6" i-class="tab_td">{{ele.goodsName}}</i-col>
							<i-col span="6" i-class="tab_td">{{ele.colorName}}</i-col>
							<i-col span="6" i-class="tab_td">{{ele.billAmount}}</i-col>
						</i-row>
					</view>
					<div v-show="!loading && !noMore" @click="more" style="margin-top: 20rpx;">
						<div>加载更多</div>
						<div class="iconfont icon-xiangxia"></div>
					</div>
					<div v-show="loading">
						<uni-load-more status="loading" />
					</div>
					<div v-show="noMore">
						<uni-load-more status="noMore" />
					</div>
				</div>
				<div v-show="tab == 2" class="tabs_content">
					<i-row span="22">
						<i-col span="6" i-class="tab_header">时间</i-col>
						<i-col span="6" i-class="tab_header">商品</i-col>
						<i-col span="6" i-class="tab_header">颜色</i-col>
						<i-col span="6" i-class="tab_header">金额</i-col>
					</i-row>
					<view v-for="ele in list">
						<i-row span="22">
							<i-col span="6" i-class="tab_td"><span>{{ele.billDate}}</span></i-col>
							<i-col span="6" i-class="tab_td">{{ele.goodsName}}</i-col>
							<i-col span="6" i-class="tab_td">{{ele.colorName}}</i-col>
							<i-col span="6" i-class="tab_td">{{ele.billAmount}}</i-col>
						</i-row>
					</view>
					<div v-show="!loading && !noMore" @click="more" style="margin-top: 20rpx;">
						<div>加载更多</div>
						<div class="iconfont icon-xiangxia"></div>
					</div>
					<div v-show="loading">
						<uni-load-more status="loading" />
					</div>
					<div v-show="noMore">
						<uni-load-more status="noMore" />
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import uniLoadMore from "components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				totalSale: {
					totalAmount: 0,
					totalCount: 0
				},
				totalReturn: {
					totalAmount: 0,
					totalCount: 0
				},
				loading: false,
				list: [],
				cardCode: '',
				pageIndex: 0,
				coupon: 0,
				integral: 0,
				noMore: false,
				tab: 1
			}
		},
		onLoad() {
			let user = wx.getStorageSync('token')
			this.userInfo = wx.getStorageSync('userInfo')
			this.avatarUrl = user.avatarUrl
			this.nickName = user.nickName
			this.cardCode = user.cardCode
			this.isEmploy = user.isEmploy
			if (this.avatarUrl == null || this.avatarUrl == '') {
				this.avatarUrl = '../../static/images/user.png'
			}
			this.list = []
			this.getList()
			this.getTotal("SALE")
			this.getTotal("RETURN")
		},
		methods: {
			getList() {
				this.pageIndex = 0
				this.list = []
				this.more()
			},
			more() {
				if (!this.loading) {
					this.loading = true
					this.pageIndex += 1
					let type = this.tab === 1 ? 'SALE' : 'RETURN'
					this.$uniRequest.get('/api/small_procedures/vip/my_sale_list', {
						data: {
							pageIndex: this.pageIndex,
							pageSize: 10,
							type: type
						}
					}).then(res => {
						res.data.content.forEach(c => this.list.push(c))
						this.noMore = this.list.length >= res.data.totalElements
					}).finally(error => {
						this.loading = false
					})
				}
			},
			getTotal(type) {
				this.$uniRequest.get('/api/small_procedures/vip/my_sale_total', {
					data: {
						type: type
					}
				}).then(res => {
					if (type == "SALE") {
						this.totalSale = res.data
					} else {
						this.totalReturn = res.data
					}
				})
			},
			onClickTab(tab) {
				this.tab = tab
				this.noMore = false
				this.getList()
			}
		}
	}
</script>

<style>
	page {
		background-color: #cccccc;
	}

	.integral .white {
		color: #FFFFFF;
	}

	.integral .customClass {
		margin-left: 25rpx;
		margin-right: 25rpx;
	}

	.integral .navClass {
		border-radius: 10px;
		border: 1px solid;
	}

	.integral .tabClass {}

	.integral .active {
		font-size: 28rpx;
		font-weight: 800;
		color: #C80000;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		border-top-left-radius: 18rpx;
		border-top-right-radius: 18rpx;
		background-color: #FFFFFF;
	}

	.integral .tabSpan {
		font-size: 28rpx;
		font-weight: 800;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		border-top-left-radius: 18rpx;
		border-top-right-radius: 18rpx;
		background-color: #cccccc;
	}


	.integral .tabDiv {
		position: relative;
		top: -80rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
		text-align: center;
	}

	.integral .tabs_content {
		height: 100%;
		background-color: #FFFFFF;
		border-bottom-right-radius: 18rpx;
		border-bottom-left-radius: 18rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.integral .iconfont {
		font-size: 34rpx;
		margin-right: 8rpx;
	}

	.integral .tab_header {
		font-size: 30rpx;
		margin-top: 25rpx;
		font-weight: 800;
		padding-bottom: 15rpx;
		border-bottom: 4rpx solid #706000;
	}

	.integral .tab_td {
		height: 80rpx;
		font-size: 28rpx;
		padding-top: 17rpx;
		border-bottom: 2rpx solid #706000;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
