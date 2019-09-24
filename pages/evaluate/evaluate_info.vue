<template>
	<view class="evaluate">
		<div class="tabs_content">
			<view v-for="ele in list">
				<div class="cell" @click="goToEvaluate(ele.posCode)" hover-class="user-info-hover">
					<i-row span="22">
						<i-col span="8">
							<image class="channelImage" :src="ele.channelUrl" />
						</i-col>
						<i-col span="16">
							<div class="info">
								<div>店铺:{{ele.channelName}}</div>
								<div>单号:{{ele.posCode}}</div>
								<div v-show="ele.employErpNames != null">员工:{{ele.employErpNames}}</div>
								<div>日期:{{ele.billDate}}</div>
								<div v-if="status == 'unevaluated'" style="margin-top: 10rpx;"><span class="jinxingpingjia">进行评价</span></div>
								<div v-if="status == 'evaluated'" style="margin-top: 10rpx;"><van-rate :value="ele.rate" readonly/></div>
							</div>
						</i-col>
					</i-row>
				</div>
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
				pageIndex: 0,
				loading: false,
				list: [],
				noMore: false
			}
		},
		props: {
			status: {
				default: 'unevaluated'
			}
		},
		onLoad() {
			let user = wx.getStorageSync('token')
			this.getList()
		},
		methods: {
			goPage(url) {
				uni.navigateTo({
					url: '/pages/' + page
				})
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
					this.$uniRequest.get('/api/small_procedures/evaluate/list', {
						data: {
							pageIndex: this.pageIndex,
							pageSize: 10,
							status: this.status
						}
					}).then(res => {
						res.data.content.forEach(c => {
							if (this.list.find(l => l.posCode === c.posCode) == null) {
								this.list.push(c)
							}
						})
						this.noMore = this.list.length >= res.data.totalElements
						this.$emit("setTotal", '('+res.data.totalElements+')')
					}).finally(() => this.loading = false)
				}
			},
			goToEvaluate(posCode){
				uni.navigateTo({
					url: '/pages/evaluate/do_evaluate?posCode=' + posCode
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #ffffff;
	}
</style>

<style scoped>
	.evaluate {
		text-align: center;
	}

	.evaluate .cell {
		margin: 20rpx 15rpx 0rpx 15rpx;
		padding: 15rpx;
		background-color: #FFFFFF;
	}

	.evaluate .channelImage {
		width: 200rpx;
		height: 200rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.evaluate .info {
		margin-top: 10rpx;
		text-align: left;
		color: #675500;
	}

	.evaluate .jinxingpingjia {
		background-color: #AE0000;
		color: #FFFFFF;
		font-size: 26rpx;
		padding: 5rpx 15rpx 5rpx 15rpx;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
		border-bottom-left-radius: 16rpx;
	}
	
	.user-info-hover {
		color: #C80000;
	}
</style>
