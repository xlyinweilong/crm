<template>
	<view>
		<div style="margin-bottom: 8rpx;">
			<div v-for="e in list" :key="e.id" class="ticket">
				<div @click="showInfo(e)" class="link" hover-class="link-hover"><span class="lable">编号：</span>{{e.code}}</div>
				<div><span class="lable">标题：</span>{{e.title}}</div>
				<div><span class="lable">类型：</span>{{e.cardTypeMean}}</div>
				<div><span class="lable">获取方式：</span>{{e.gainTypeMean}}</div>
				<div><span class="lable">库存：</span>{{e.quantity}}</div>
				<div><span class="lable">已被领取：</span>{{e.receiveQuantity}}</div>
			</div>
			<uni-load-more :status="status"></uni-load-more>
		</div>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import uniLoadMore from "components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				list: [],
				listQuery: {
					pageIndex: 1,
					usePlatform: ''
				},
				status: 'loading'
			}
		},
		props: {},
		onLoad(query) {
			this.reSearch()
		},
		onPullDownRefresh() {
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
			reSearch() {
				this.listQuery.pageIndex = 1
				this.list = []
				this.getList()
			},
			getList() {
				this.status = "loading"
				this.$uniRequest.get('/api/sale/ticket/list', {
					data: {
						pageIndex: this.listQuery.pageIndex,
						pageSize: 10,
						disabled: false
					}
				}).then(res => {
					res.data.records.forEach(c => {
						if (this.list.find(l => l.id === c.id) == null) {
							this.list.push(c)
						}
					})
					uni.stopPullDownRefresh()
					uni.hideNavigationBarLoading()
					this.status = "more"
					if (res.data.records.length == 0 || res.data.total == this.list.length) {
						this.status = "noMore"
					}
				}).catch(error => {
					uni.stopPullDownRefresh()
					uni.hideNavigationBarLoading()
					this.status = "noMore"
				})
			},
			showInfo(e) {
				uni.navigateTo({
					url: '/pages/employ/ticket_detail?id=' + e.id
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
	.ticket {
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		font-size: 28rpx;
		color: #303133;
		margin: 14rpx;
		padding: 14rpx;
		background-color: #ffffff;
	}

	.lable {
		font-size: 30rpx;
		color: #606266;
		margin-right: 10rpx;
	}

	.link {
		color: #409EFF;
	}

	.link-hover {
		color: #2b85e4;
	}
</style>
