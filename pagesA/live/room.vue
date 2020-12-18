<template>
	<view style="">
		<div v-for="e in list" :key="e.id" style="margin-top: 22rpx;">
			<!-- <navigator :url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' + e.roomid"> -->
				<div class="item" :style="{'background-image':'url('+e.anchorImg+')'}">
					<div style="position:absolute;bottom: 0;left: 18rpx;">
						<p><span class="room">{{e.name}}</span></p>
						<p style="margin-top: 18rpx;margin-bottom: 22rpx;">
							<span class="startText">开始时间</span><span class="dateText">{{e.startTimeNoYear}}</span>
						</p>
					</div>
				</div>
			<!-- </navigator> -->
		</div>
		<uni-load-more :status="status"></uni-load-more>
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	let livePlayer = requirePlugin('live-player-plugin')
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
				status: "loading",
				a:'http://mmbiz.qpic.cn/mmbiz_jpg/sfLiaT4SGl9rpKStQdoBGzib24K6Pf5RsCS3SJsDyX1Oy2uAYOWxVShartJwLxiam20sjluj4h0lodORA1D11Xickw/0'
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
						res.data.records.forEach(c => {
							if (this.list.every(e => e.id != c.id)) {
								livePlayer.getLiveStatus({ room_id: c.roomid }).then(res => {
								  // 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常, 107：已过期 
									c.liveStatus = res.liveStatus
									switch(c.liveStatus){
										case 101:
											c.liveStatusMean = '直播中'
											break
										case 102:
											c.liveStatusMean = '未开始'
											break
										case 103:
											c.liveStatusMean = '已结束'
											break
										case 105:
											c.liveStatusMean = '暂停中'
											break
										case 107:
											c.liveStatusMean = '已过期'
											break
										default:
											c.liveStatusMean = '其他'
									}
								}).catch(err => {
									console.log(err)
								})
								this.list.push(c)
							}
						})
						uni.hideNavigationBarLoading()
						this.status = "more"
						if (res.data.records.length == 0 || res.data.total == this.goodsList.length) {
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
