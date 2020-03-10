<template>
	<view style="">
		<div v-for="e in list" :key="e.id" style="margin-top: 22rpx;">
			<navigator :url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + e.roomid">
				<div class="item" :style="{'background-image':'url('+e.anchorImg+')'}">
				<!-- <div class="item" style="background:#000000"> -->
					<div style="position:absolute;bottom: 0;left: 18rpx;">
						<p><span class="room">{{e.name}}</span></p>
						<p style="margin-top: 18rpx;margin-bottom: 22rpx;">
							<span class="startText">开始时间</span><span class="dateText">{{e.startTimeNoYear}}</span>
						</p>
					</div>
				</div>
			</navigator>
		</div>
		<uni-load-more :status="status"></uni-load-more>
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				listQuery: {
					pageIndex: 1,
					pageSize: 10
				},
				list: [],
				status: "loading"
			}
		},
		onLoad(query) {
			this.reLoad()
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
			reLoad() {
				this.status = "more"
				this.listQuery.pageIndex = 1
				this.list = []
				this.getList()
			},
			getList() {
				if (this.status == "more") {
					this.status = "loading"
					this.$uniRequest.get('/api/live/list', {
						data: {
							pageIndex: this.listQuery.pageIndex,
							pageSize: this.listQuery.pageSize
						}
					}).then(res => {
						res.data.content.forEach(c => {
							if (this.list.every(e => e.id != c.id)) {
								this.list.push(c)
								console.log(c)
							}
						})
						uni.hideNavigationBarLoading()
						this.status = "more"
						if (res.data.content.length == 0 || res.data.totalElements == this.goodsList.length) {
							this.status = "noMore"
						}
					}).catch(() => {
						uni.hideNavigationBarLoading()
						this.status = "noMore"
					})
				}
			}
		}
	}
</script>

<style scoped>

	.item {
		position:relative;
		border-radius: 16rpx;
		width: 700rpx;
		height: 560rpx;
		margin: auto;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		background-repeat:no-repeat;
		background-size:100% 100%;
	}
	
	.room{	
		color: #ffffff;
		font-size: 28rpx;
	}
	
	.startText{
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		border-top-left-radius:2em;
		border-bottom-left-radius:2em;
		color: #000000;
		font-size: 22rpx;
		background-color: #ffffff;
		padding-left: 18rpx;
		padding-top: 6rpx;
		padding-bottom: 6rpx;
		padding-right: 8rpx;
		
	}
	
	.dateText{
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		border-top-right-radius:2em;
		border-bottom-right-radius:2em;
		background-color: #000000;
		margin-top: 100rpx;
		color: #ffffff;
		font-size: 22rpx;
		padding-left: 8rpx;
		padding-top: 6rpx;
		padding-bottom: 6rpx;
		padding-right: 18rpx;
	}
</style>
