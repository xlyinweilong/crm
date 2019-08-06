<template style="background-color:#cccccc">
	<view class="integral" style="background-color:#cccccc">
		<!-- header -->
		<div style="text-align: center;background-color: #615451;height: 360rpx;">
			<div class="white" style="padding-top:55rpx;font-size: 20rpx;">剩余积分</div>
			<div class="white" style="padding-top:11rpx;font-size: 92rpx;">35393<span style="font-size: 30rpx;">分</span></div>
			<div class="white" style="padding-top:5rpx;font-size: 18rpx;">累计消费：380000分</div>
		</div>
		<div>
			<div class="tabDiv">
				<i-row span="10">
					<view @click="onClickTab(1)"><i-col span="12" :i-class="tab == 1 ? 'active' : 'tabSpan'"><span class="iconfont icon-jifenliebiao-wodejifen" />积分交易</i-col></view>
					<view @click="onClickTab(2)"><i-col span="12" :i-class="tab == 2 ? 'active' : 'tabSpan'"><span class="iconfont icon-jifenliebiao-wodeyue" />储值交易</i-col></view>
				</i-row>
				<div class="tabs_content">
					<i-row span="22">
						<i-col span="8" i-class="tab_header">时间</i-col>
						<i-col span="8" i-class="tab_header">类型</i-col>
						<i-col span="8" i-class="tab_header">积分</i-col>
					</i-row>
					<view v-for="ele in list">
						<i-row span="22">
							<i-col span="8" i-class="tab_td"><span>{{ele.operationDate}}</span></i-col>
							<i-col span="8" i-class="tab_td">{{ele.operationName}}</i-col>
							<i-col span="8" i-class="tab_td">{{ele.integral}}分</i-col>
						</i-row>
					</view>
					<div v-show="!loading && !noMore" @click="more" style="margin-top: 20rpx;">
						<div>加载更多</div>
						<div class="iconfont icon-xiangxia"></div>
					</div>
					<div v-show="loading"><uni-load-more status="loading" /></div>
					<div v-show="noMore"><uni-load-more status="noMore" /></div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import uniLoadMore from "components/uni-load-more/uni-load-more.vue"
	import {
		isResponseOk
	} from '@/utils/http.js'


	export default {
		components: {uniLoadMore},
		data() {
			return {
				loading : false,
				list: [],
				cardCode: '',
				pageIndex: 0,
				coupon: 0,
				integral: 0,
				noMore:false,
				tab:1
			}
		},
		onLoad() {
			let user = wx.getStorageSync('token')
			this.avatarUrl = user.avatarUrl
			this.nickName = user.nickName
			this.cardCode = user.cardCode
			this.isEmploy = user.isEmploy
			if (this.avatarUrl == null || this.avatarUrl == '') {
				this.avatarUrl = '../../static/images/user.png'
			}
			this.list = []
			this.getList()
		},
		methods: {
			getList() {
				this.pageIndex = 0
				this.list = []
				this.more()
			},
			more(){
				if(!this.loading){
					this.loading = true
					this.pageIndex += 1
					this.$uniRequest.get('/api/small_procedures/vip/my_integral_list', {
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
			onClickTab(tab) {
				this.tab = tab
				this.noMore = false
				this.getList()
			},
			hasVipCard() {
				if (!this.isEmploy) {
					Dialog.confirm({
						title: '标题',
						message: '还未绑定会员卡，现在去绑定吗？'
					}).then(() => {
						console.log(111)
						uni.redirectTo({
							url: '/pages/bind_vip/bind_vip'
						})
					}).catch(() => {})
				}
				return this.isEmploy
			},
			showFun(ele) {
				if (this.hasVipCard()) {
					ele = true
				}
			}
		}
	}
</script>

<style>
	image {
		will-change: transform
	}

	.white {
		color: #FFFFFF;
	}

	.customClass {
		margin-left: 25rpx;
		margin-right: 25rpx;
	}

	.navClass {
		border-radius: 10px;
		border: 1px solid;
	}

	.tabClass {}

	.active {
		font-size: 28rpx;
		font-weight: 800;
		color: #C80000;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		border-top-left-radius: 18rpx;
		border-top-right-radius: 18rpx;
		background-color: #FFFFFF;
	}

	.tabSpan {
		font-size: 28rpx;
		font-weight: 800;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		border-top-left-radius: 18rpx;
		border-top-right-radius: 18rpx;
		background-color: #cccccc;
	}


	.tabDiv {
		position: relative;
		top: -80rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
		text-align: center;
	}

	.tabs_content {
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
	}
</style>
