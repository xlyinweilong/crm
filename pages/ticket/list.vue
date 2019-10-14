<template>
	<view class="ticket">
		<div style="text-align: center;padding: 10rpx 0rpx 10rpx 0rpx;" @click="goPage('ticket/shelf/list')" hover-class="user-info-hover">
			<span class="tickets-icon iconfont icon-youhuijuan" style="margin-right: 10rpx;"></span>
			领劵中心
		</div>
		<van-tabs sticky @click="onClick">
			<van-tab :title="'可使用('+couponCount.canUseCountStr+')'">
				<ticketList ref="ticketList" type="0" />
			</van-tab>
			<van-tab :title="'已使用('+couponCount.hasUsedCountStr+')'">
				<ticketList ref="ticketList2" type="1" />
			</van-tab>
			<van-tab :title="'已失效('+couponCount.disabledCountStr+')'">
				<ticketList ref="ticketList3" type="2" />
			</van-tab>
		</van-tabs>
	</view>
</template>

<script>
	import ticketList from 'pages/ticket/ticketList'
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import uniLoadMore from "components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			uniLoadMore,
			ticketList
		},
		data() {
			return {
				couponCount: {
					canUseCountStr: 0,
					hasUsedCountStr: 0,
					disabledCountStr: 0
				}
			}
		},
		onShow() {
			this.$refs.ticketList.getList()
			let userInfo = wx.getStorageSync('userInfo')
			this.$uniRequest.get('/api/small_ticket/my_ticket_list_count').then(res => {
				this.couponCount = res.data
				userInfo.coupon = res.data.canUseCountStr
			})
		},
		methods: {
			goPage(page) {
				uni.navigateTo({
					url: '/pages/' + page
				})
			},
			onClick(e) {
				if (e.detail.index === 0) {
					this.$refs.ticketList.getList()
				} else if (e.detail.index === 1) {
					console.log(e)
					this.$refs.ticketList2.getList()
				} else if (e.detail.index === 2) {
					this.$refs.ticketList3.getList()
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
	.user-info-hover {
		color: #C80000;
	}
</style>
