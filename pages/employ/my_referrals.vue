<template>
	<view>
		<div class="table">
			<view class="header">
				<van-row gutter="22">
					<van-col span="4">
						<div class="tab_header">头像</div>
					</van-col>
					<van-col span="8">
						<div class="tab_header">昵称</div>
					</van-col>
					<van-col span="12">
						<div class="tab_header">时间</div>
					</van-col>
				</van-row>
			</view>
			<view v-for="ele in list" class="info">
				<van-row gutter="22">
					<van-col span="4" i-class="tab_td">
						<div class="tab_td">
							<image v-if="ele.avatarUrl != ''" mode="widthFix" style="width: 80rpx;" :src="ele.avatarUrl" />
						</div>
					</van-col>
					<van-col span="8">
						<div class="tab_td">{{ele.nickName}}</div>
					</van-col>
					<van-col span="12">
						<div class="tab_td">{{ele.createDate}}</div>
					</van-col>
				</van-row>
			</view>
			<div v-show="!loading && !noMore" @click="loadMore" style="margin-top: 20rpx;">
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
	import uniLoadMore from "components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				loading: false,
				pageIndex: 1,
				pageSize: 10,
				searchValue: '',
				base64: '',
				list: [],
				noMore: false
			}
		},
		onLoad() {
			this.loadMore()
		},
		onPullDownRefresh() {
			if(!this.loading){
				this.list = []
				this.pageIndex = 1
				this.loadMore()
			}
		},
		methods: {
			loadMore() {
				if (!this.loading) {
					this.loading = true
					this.$uniRequest.get('/api/small_procedures/employ/my_referrals', {
						data: {
							pageIndex: this.pageIndex,
							pageSize: this.pageSize,
							search: this.searchValue
						}
					}).then(res => {
						this.pageIndex += 1
						res.data.content.forEach(d => {
							if (this.list.every(l => l.id !== d.id)) {
								this.list.push(d)
							}
						})
						this.noMore = this.list.length >= res.data.totalElements
						uni.stopPullDownRefresh()
					}).finally(() => this.loading = false)
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
	.table {
		text-align: center;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.header {
		font-size: 32rpx;
		border-bottom: 2rpx solid #E4E7ED;
	}

	.info {
		font-size: 28rpx;
		border-bottom: 2rpx solid #E4E7ED;
	}


	.tab_header {
		font-size: #303133;
		font-weight:800;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tab_td {
		font-size: #606266;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
