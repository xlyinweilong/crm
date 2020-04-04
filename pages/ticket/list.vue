<template>
	<view class="ticket">
		<div style="margin-bottom: 50px;">
			<van-tabs sticky @click="onClick">
				<van-tab :title="'可使用('+couponCount.canUseCountStr+')'">
					<van-dropdown-menu active-color="#74d2d4">
						<van-dropdown-item @change="changeOption1" :value="listQuery.usePlatform" :options="option1" />
					</van-dropdown-menu>
					<ticketList :type="listQuery.type" :status="status" :list="list" />
				</van-tab>
				<van-tab :title="'已使用('+couponCount.hasUsedCountStr+')'">
					<ticketList :type="listQuery.type" :status="status" :list="list" />
				</van-tab>
				<van-tab :title="'已失效('+couponCount.disabledCountStr+')'">
					<ticketList :type="listQuery.type" :status="status" :list="list" />
				</van-tab>
			</van-tabs>
		</div>
		<div class="center" @click="goPage('ticket/shelf/list')" hover-class="user-info-hover">
			<span class="tickets-icon iconfont icon-youhuijuan" style="margin-right: 10rpx;"></span>
			领劵中心
		</div>
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
				},
				list: [],
				listQuery: {
					type: 0,
					pageIndex: 1,
					usePlatform: ''
				},
				status: 'loading',
				option1: [{
						text: '全部优惠券',
						value: ''
					},
					{
						text: '线上优惠券',
						value: 'ONLINE'
					},
					{
						text: '商场优惠券',
						value: 'MARKET'
					}
				]
			}
		},
		onShow() {
			this.reSearch()
			let userInfo = wx.getStorageSync('userInfo')
			this.$uniRequest.get('/api/small_ticket/my_ticket_list_count').then(res => {
				this.couponCount = res.data
				userInfo.coupon = res.data.canUseCountStr
			})
		},
		onReachBottom() {
			if (this.status == "loading" || this.status == "noMore") {
				return false
			}
			this.listQuery.pageIndex += 1
			uni.showNavigationBarLoading()
			this.getList()
		},
		methods: {
			changeOption1(e){
				this.listQuery.usePlatform = e.detail
				this.reSearch()
			},
			goPage(page) {
				uni.navigateTo({
					url: '/pages/' + page
				})
			},
			onClick(e) {
				this.listQuery.type = e.detail.name
				this.listQuery.usePlatform = ''
				this.reSearch()
			},
			reSearch() {
				this.listQuery.pageIndex = 1
				this.list = []
				this.getList()
			},
			getList() {
				this.status = "loading"
				this.$uniRequest.get('/api/small_ticket/my_ticket_list', {
					data: {
						pageIndex: this.listQuery.pageIndex,
						pageSize: 10,
						status: this.listQuery.type,
						usePlatform:this.listQuery.usePlatform
					}
				}).then(res => {
					res.data.content.forEach(c => {
						if (this.list.find(l => l.id === c.id) == null) {
							c.show = false
							this.list.push(c)
						}
					})
					uni.stopPullDownRefresh()
					uni.hideNavigationBarLoading()
					this.status = "more"
					if (res.data.content.length == 0 || res.data.totalElements == this.list.length) {
						this.status = "noMore"
					}
				}).catch(error => {
					uni.stopPullDownRefresh()
					uni.hideNavigationBarLoading()
					this.status = "noMore"
				})
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

	.center {
		position: fixed;
		text-align: center;
		bottom: 0px;
		z-index: 100;
		background-color: #fff;
		width: 750rpx;
		height: 50px;
		line-height: 50px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
</style>
