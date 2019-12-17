<template>
	<view class="integral">
		<!-- header -->
		<div v-show="tab == 1" style="text-align: center;background-color: #615451;height: 360rpx;">
			<div class="white" style="padding-top:55rpx;font-size: 20rpx;">剩余积分</div>
			<div class="white" style="padding-top:11rpx;font-size: 92rpx;">{{userInfo.totalIntegral}}<span style="font-size: 30rpx;">分</span></div>
			<div class="white" style="padding-top:5rpx;font-size: 18rpx;">累计消费：{{totalUserdIntegral}}分</div>
		</div>
		<div v-show="tab == 2" style="text-align: center;background-color: #615451;height: 360rpx;">
			<div class="white" style="padding-top:55rpx;font-size: 20rpx;">现金余额</div>
			<div class="white" style="padding-top:11rpx;font-size: 92rpx;">{{totalAmount}}<span style="font-size: 30rpx;">元</span></div>
			<div class="white" style="padding-top:5rpx;font-size: 18rpx;">累计消费：{{totalUsedAmount}}元</div>
		</div>
		<div v-show="tab == 3" style="text-align: center;background-color: #615451;height: 360rpx;">
			<div class="white" style="padding-top:55rpx;font-size: 20rpx;">焕新币</div>
			<div class="white" style="padding-top:11rpx;font-size: 92rpx;">{{totalWashingAmount}}<span style="font-size: 30rpx;">个</span></div>
		</div>
		<div>
			<div class="tabDiv">
				<div style="padding-left: 24rpx;padding-right: 24rpx;">
					<van-row gutter="24">
						<view @click="onClickTab(1)">
							<van-col span="8" :custom-class="tab == 1 ? 'active' : 'tabSpan'"><span class="iconfont icon-jifenliebiao-wodejifen" />积分交易</van-col>
						</view>
						<view @click="onClickTab(2)">
							<van-col span="8" :custom-class="tab == 2 ? 'active' : 'tabSpan'"><span class="iconfont icon-jifenliebiao-wodeyue" />储值交易</van-col>
						</view>
						<view @click="onClickTab(3)">
							<van-col span="8" :custom-class="tab == 3 ? 'active' : 'tabSpan'"><span class="iconfont icon-baobeihuanxin" />焕新币</van-col>
						</view>
					</van-row>
				</div>
				<div v-show="tab == 1" class="tabs_content">
					<van-row gutter="24">
						<van-col span="8" custom-class="tab_header">时间</van-col>
						<van-col span="8" custom-class="tab_header">类型</van-col>
						<van-col span="8" custom-class="tab_header">积分</van-col>
					</van-row>
					<view v-for="ele in list">
						<van-row gutter="24">
							<van-col span="8" custom-class="tab_td"><span>{{ele.operationDate}}</span></van-col>
							<van-col span="8" custom-class="tab_td">{{ele.operationName}}</van-col>
							<van-col span="8" custom-class="tab_td">{{ele.integral}}分</van-col>
						</van-row>
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
					<van-row gutter="22">
						<van-col span="8" custom-class="tab_header">时间</van-col>
						<van-col span="8" custom-class="tab_header">类型</van-col>
						<van-col span="8" custom-class="tab_header">金额</van-col>
					</van-row>
					<view v-for="ele in list">
						<van-row gutter="22">
							<van-col span="8" custom-class="tab_td"><span>{{ele.operationDate}}</span></van-col>
							<van-col span="8" custom-class="tab_td">{{ele.operationName}}</van-col>
							<van-col span="8" custom-class="tab_td">{{ele.amount}}元</van-col>
						</van-row>
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
				<div v-show="tab == 3" class="tabs_content">
					<van-row gutter="22">
						<van-col span="8" custom-class="tab_header">时间</van-col>
						<van-col span="8" custom-class="tab_header">类型</van-col>
						<van-col span="8" custom-class="tab_header">个数</van-col>
					</van-row>
					<view v-for="ele in list">
						<van-row gutter="22">
							<van-col span="8" custom-class="tab_td"><span>{{ele.operationDate}}</span></van-col>
							<van-col span="8" custom-class="tab_td">{{ele.operation}}</van-col>
							<van-col span="8" custom-class="tab_td">{{ele.washingAmount}}个</van-col>
						</van-row>
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
				totalAmount: 0,
				totalUsedAmount: 0,
				loading: false,
				list: [],
				cardCode: '',
				pageIndex: 0,
				coupon: 0,
				integral: 0,
				noMore: false,
				tab: 1,
				userInfo: {
					totalIntegral: 0
				},
				totalUserdIntegral: 0,
				totalWashingAmount:0
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
			this.getSumUsedIntegral()
			this.getSumUsedAmount()
			this.getWashingAmount()
			this.$uniRequest.get('/api/small_procedures/vip/my_info').then(res => {
				this.userInfo.totalIntegral = res.data.totalIntegral
				wx.setStorageSync('userInfo', this.userInfo)
			})
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
					let url = this.tab === 1 ? '/api/small_procedures/vip/my_integral_list' :
						'/api/small_procedures/vip/my_stored_card_log_list'
					if (this.tab === 3) {
						url = '/api/small_procedures/nursing_balance_log/my_list'
					}
					this.$uniRequest.get(url, {
						data: {
							pageIndex: this.pageIndex,
							pageSize: 10
						}
					}).then(res => {
						res.data.content.forEach(c => this.list.push(c))
						this.noMore = this.list.length >= res.data.totalElements
					}).finally(error => {
						this.loading = false
					})
				}
			},
			getSumUsedIntegral() {
				this.$uniRequest.get('/api/small_procedures/vip/sum_used_integral').then(res => {
					this.totalUserdIntegral = res.data
				})
			},
			getSumUsedAmount() {
				this.$uniRequest.get('/api/small_procedures/vip/sum_amount').then(res => {
					this.totalAmount = res.data.totalAmount
					this.totalUsedAmount = res.data.totalUsedAmount
				})
			},
			getWashingAmount() {
				this.$uniRequest.get('/api/small_procedures/user/info').then(res => {
					this.totalWashingAmount = res.data.washingBalance
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
		font-size: 26rpx;
		padding-top: 17rpx;
		border-bottom: 2rpx solid #706000;
	}
</style>
