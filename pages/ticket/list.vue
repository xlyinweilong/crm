<template>
	<view class="ticket">
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
			uniLoadMore,ticketList
		},
		data() {
			return {
				couponCount:{
					canUseCountStr:0,
					hasUsedCountStr:0,
					disabledCountStr:0
				}
			}
		},
		onLoad() {
			this.$refs.ticketList.getList()
			let userInfo = wx.getStorageSync('userInfo')
			this.$uniRequest.get('/api/small_ticket/my_ticket_list_count').then(res => {
				this.couponCount = res.data
				userInfo.coupon = res.data.canUseCountStr
			})
		},
		methods: {
			onClick(e){
				if(e.detail.index === 0){
					this.$refs.ticketList.getList()
				}else if(e.detail.index === 1){
					console.log(e)
					this.$refs.ticketList2.getList()
				}else if(e.detail.index === 2){
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
</style>
