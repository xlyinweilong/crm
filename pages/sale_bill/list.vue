<template>
	<view class="integral">
		<!-- <van-search :value="searchKey" use-action-slot clearable placeholder="请输入搜索关键词" @search="onSearch">
			<view slot="action" :tap="onSearch">搜索</view>
		</van-search> -->
		<div v-for="ele in list" class="content" @click="goDetail(ele.code)" hover-class="hover-div">
			<div>
				<span class="title">{{ele.channelName}}</span>
				<span style="font-size: 26rpx;float: right;margin-top: 5rpx;">{{ele.billDate}}</span>
			</div>
			<div class="sub_content">
				<div>单号：{{ele.code}}</div>
				<div style="margin-top: 5rpx;">
					<span>数量：*{{ele.quantity}}件</span>
					<span style="float: right;">支付：<span style="color:#C80000">{{ele.amount}}</span>元</span>
				</div>
			</div>
		</div>
		<div style="text-align: center;">
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
				searchKey: '',
				loading: false,
				list: [],
				cardCode: '',
				pageIndex: 0,
				noMore: false
			}
		},
		onLoad() {
			this.list = []
			this.getList()
		},
		methods: {
			goDetail(posCode) {
				uni.navigateTo({
					url: '/pages/sale_bill/detail?posCode=' + posCode
				})
			},
			onSearch() {

			},
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
					this.$uniRequest.get('/api/small_procedures/vip/my_sale_list_2', {
						data: {
							pageIndex: this.pageIndex,
							pageSize: 10,
							type: type
						}
					}).then(res => {
						res.data.records.forEach(c => this.list.push(c))
						this.noMore = this.list.length >= res.data.total
					}).finally(error => {
						this.loading = false
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

<style scoped>
	.hover-div{
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
		margin: 15rpx 30rpx 0rpx 30rpx;
		border-bottom: 2px solid #706000;
	}

	.sub_content {
		font-size: 28rpx;
		margin-top: 5rpx;
		margin-bottom: 10rpx;
		background-color: #F2F6FC;
		padding: 15rpx;
	}
</style>
