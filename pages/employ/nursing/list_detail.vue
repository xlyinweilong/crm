<template>
	<div class="list_detail">
		<div class="content">
			<div v-show="type == 1 && totalAmount > 0" class="item" style="text-align: right;">
				<b style="padding-right: 20rpx;">总金额：{{totalAmount}}</b>
			</div>
			<div v-show="(type == 2 || activeTag == 4) && totalSettleAmount > 0" class="item" style="text-align: right;">
				<b style="padding-right: 20rpx;">总结算额：{{totalSettleAmount}}</b>
			</div>
			<view v-for="ele in list" :key="ele.id">
				<div class="item">
					<div style="height: 45rpx;">
						<div class="item_title_left">
							<span v-if="(type == 1) || (type == 2 && (activeTag == 3 || activeTag == 4 || activeTag == 5 || activeTag == 6 || activeTag == 8 || activeTag == 9 || activeTag == 10))">{{statusMean(ele)}}</span>
							<van-checkbox v-if="type == 2 && (activeTag == 1 || activeTag == 2)" :value="ele.checked" @change="changeCheckbox(ele)">{{statusMean(ele)}}</van-checkbox>
						</div>
						<div class="item_title_right" @click="showSheetInfo(ele)" hover-class="hover_item_title_right">
							<van-icon name="weapp-nav" />
						</div>
					</div>
					<van-divider />
					<div @click="showDetail(ele)" hover-class="hover_item_title_right">
						<p class="item_p">单号：{{ele.code}}</p>
						<p class="item_p">店铺：{{ele.channelAliasNameAndName}}</p>
						<p class="item_p">客服：{{ele.createEmployName}}</p>
						<p class="item_p">客户：{{ele.customerVipName}}</p>
						<p class="item_p">日期：{{ele.createDate}}</p>
						<p class="item_p">货品数量：{{ele.goodsList.length}}</p>
					</div>
				</div>
			</view>
			<div v-show="!loading && !noMore" @click="more" style="margin-top: 20rpx;text-align: center;">
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
		<van-dialog id="van-dialog" />
	</div>
</template>

<script>
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import uniLoadMore from "components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			uniLoadMore
		},
		props: {
			activeTag: {
				default: 1
			},
			type: {
				default: 1
			}
		},
		data() {
			return {
				list: [],
				loading: false,
				pageIndex: 0,
				noMore: false,
				startDate: '',
				endDate: '',
				channelId: '',
				totalAmount: 0,
				totalSettleAmount: 0,
				loadingTotal: false
			}
		},
		onLoad(query) {},
		computed: {
			status() {
				if (this.activeTag == 1) {
					return 'INIT,PROBLEM_AGREE'
				} else if (this.activeTag == 2) {
					return 'WASHING'
				} else if (this.activeTag == 3) {
					return 'IN_CHANNEL,PROBLEM_REFUSE'
				} else if (this.activeTag == 4) {
					return 'FINISHED'
				} else if (this.activeTag == 5) {
					return 'SETTLED'
				} else if (this.activeTag == 6) {
					return 'PROBLEM'
				} else if (this.activeTag == 7) {
					return 'FINISHED_PROBLEM'
				} else if (this.activeTag == 8) {
					return 'NO_SETTLE_PENDING'
				} else if (this.activeTag == 9) {
					return 'NO_SETTLE_AGREE'
				} else if (this.activeTag == 10) {
					return 'NO_SETTLE_REFUSE'
				}
			}
		},
		methods: {
			statusMean(ele) {
				if (this.type == 2) {
					if (ele.status == 'INIT') {
						return "待取宝贝"
					} else if (ele.status == 'PROBLEM_AGREE') {
						return "待取宝贝(用户同意)"
					} else if (ele.status == 'WASHING') {
						return "待送宝贝"
					} else if (ele.status == 'IN_CHANNEL') {
						return "已送宝贝"
					} else if (ele.status == 'PROBLEM_REFUSE') {
						return "待用户取走(拒绝)"
					} else if (ele.status == 'FINISHED') {
						return "待结算"
					} else if (ele.status == 'SETTLED') {
						return "已结算"
					} else if (ele.status == 'PROBLEM') {
						return "问题单"
					} else if (ele.status == 'FINISHED_PROBLEM') {
						return "已取走(问题单)"
					}
				} else {
					if (ele.status == 'INIT') {
						return "用户来货"
					} else if (ele.status == 'PROBLEM_AGREE') {
						return "用户同意"
					} else if (ele.status == 'WASHING') {
						return "焕新中"
					} else if (ele.status == 'IN_CHANNEL') {
						return "待用户取走"
					} else if (ele.status == 'PROBLEM_REFUSE') {
						return "待用户取走(拒绝)"
					} else if (ele.status == 'FINISHED') {
						return "待结算"
					} else if (ele.status == 'SETTLED') {
						return "已结算"
					} else if (ele.status == 'PROBLEM') {
						return "问题单"
					} else if (ele.status == 'FINISHED_PROBLEM') {
						return "已取走(问题单)"
					} 
				}
				if (ele.status == 'NO_SETTLE_PENDING') {
					return "无需结算,待处理"
				} else if (ele.status == 'NO_SETTLE_AGREE') {
					return "无需结算,已同意"
				} else if (ele.status == 'NO_SETTLE_REFUSE') {
					return "无需结算,拒绝"
				}
				return ""
			},
			showDetail(ele) {
				uni.navigateTo({
					url: '/pages/employ/nursing/bill_detail?id=' + ele.id
				})
			},
			changeCheckbox(ele) {
				ele.checked = !ele.checked
				//发给上游状态
				this.$emit("changeSelected", this.list.filter(l => l.checked))
			},
			getList(startDate, endDate, channelId) {
				this.pageIndex = 0
				this.list = []
				this.startDate = startDate
				this.endDate = endDate
				this.channelId = channelId
				this.loadTotal()
				this.more()
			},
			loadTotal() {
				if (!this.loadingTotal) {
					this.loadingTotal = true
					this.totalAmount = this.totalSettleAmount = 0
					this.$uniRequest.get('/api/small_procedures/nursing/total', {
						data: {
							startDate: this.startDate,
							endDate: this.endDate,
							channelId: this.channelId,
							statusList: this.status
						}
					}).then(res => {
						this.totalAmount = res.data.amount
						this.totalSettleAmount = res.data.settleAmount
					}).finally(() => this.loadingTotal = false)
				}
			},
			more() {
				if (!this.loading) {
					this.loading = true
					this.pageIndex += 1
					this.$uniRequest.get('/api/small_procedures/nursing/list', {
						data: {
							startDate: this.startDate,
							endDate: this.endDate,
							channelId: this.channelId,
							statusList: this.status,
							pageIndex: this.pageIndex,
							pageSize: 10
						}
					}).then(res => {
						res.data.records.forEach(c => {
							if (this.list.find(l => l.id === c.id) == null) {
								c.checked = false
								this.list.push(JSON.parse(JSON.stringify(c)))
							}
						})
						this.noMore = this.list.length >= res.data.total
					}).finally(() => this.loading = false)
				}
			},
			showSheetInfo(ele) {
				this.$emit("showSheetInfo", ele)
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
	.list_detail .content {
		padding-bottom: 150rpx;
	}

	.list_detail .item {
		margin-top: 20rpx;
		padding: 10rpx;
		background-color: #FFFFFF;
		font-size: 34rpx;
		border-radius: 5rpx;
	}

	.list_detail .item_p {
		margin: 5rpx 20rpx 5rpx 20rpx;
	}

	.list_detail .item_title_left {
		font-weight: 800;
		margin-top: 15rpx;
		margin-left: 20rpx;
		float: left;
		font-size: 34rpx;
		height: 44rpx;
	}

	.list_detail .item_title_right {
		margin-right: 20rpx;
		float: right;
		font-size: 45rpx;
		margin-top: 15rpx;
	}

	.list_detail .hover_item_title_right {
		color: red
	}
</style>
