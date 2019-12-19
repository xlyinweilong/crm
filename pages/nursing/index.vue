<template>
	<view class="nursing_list">
		<van-tabs sticky swipeable :active="activeTag" @change="onChange">
			<van-tab title="待焕新" name="1">
				<nursingList ref="nursingList1" @showSheetAction="showSheetAction" />
			</van-tab>
			<van-tab title="待确认" name="2">
				<nursingList ref="nursingList2" @showSheetAction="showSheetAction" />
			</van-tab>
			<van-tab title="焕新中" name="3">
				<nursingList ref="nursingList3" @showSheetAction="showSheetAction" />
			</van-tab>
			<van-tab title="待领取" name="4">
				<nursingList ref="nursingList4" @showSheetAction="showSheetAction" />
			</van-tab>
			<van-tab title="已领取" name="5">
				<nursingList ref="nursingList5" @showSheetAction="showSheetAction" />
			</van-tab>
			<van-tab title="已评价" name="6">
				<nursingList ref="nursingList6" @showSheetAction="showSheetAction" />
			</van-tab>
		</van-tabs>
		<van-dialog id="van-dialog" />
		<div class="add_balance_div">
			<div class="add_balance" hover-class="add_balance_hover" @click="goTo">充值</div>
		</div>
		<van-action-sheet :show="showSheet" cancel-text="取消" @cancel="onClose" :actions="actions" @close="onClose" @select="onSelect" />
	</view>
</template>

<script>
	import {
		list as nursingList
	} from './list'

	export default {
		components: {
			nursingList
		},
		data() {
			return {
				activeTag: 1,
				showSheet: false,
				selected: {},
				actions: [{
					name: '查看明细',
					color: '07c160',
					id: 'detail'
				}]
			}
		},
		onLoad(query) {
			this.$refs.nursingList1.getList(this.status)
		},
		computed: {
			status() {
				///INIT,WASHING,IN_CHANNEL,FINISHED,SETTLED
				if (this.activeTag == 1) {
					return 'INIT,PROBLEM_AGREE'
				} else if (this.activeTag == 2) {
					return 'PROBLEM'
				} else if (this.activeTag == 3) {
					return 'WASHING'
				} else if (this.activeTag == 4) {
					return 'IN_CHANNEL,PROBLEM_REFUSE'
				} else if (this.activeTag == 5 || this.activeTag == 6) {
					return 'FINISHED,SETTLED,FINISHED_PROBLEM'
				}
				return 'INIT'
			}
		},
		onPullDownRefresh() {},
		methods: {
			showSheetAction(ele) {
				this.selected = ele
				this.showSheet = true
			},
			onChange(e) {
				this.selected = {}
				this.activeTag = e.detail.name
				if (this.activeTag == 1) {
					this.$refs.nursingList1.getList(this.status)
				} else if (this.activeTag == 2) {
					this.$refs.nursingList2.getList(this.status)
				} else if (this.activeTag == 3) {
					this.$refs.nursingList3.getList(this.status)
				} else if (this.activeTag == 4) {
					this.$refs.nursingList4.getList(this.status)
				} else if (this.activeTag == 5) {
					this.$refs.nursingList5.getList(this.status,'UNEVALUATED')
				} else if (this.activeTag == 6) {
					this.$refs.nursingList6.getList(this.status,'EVALUATED')
				}
			},
			onClose() {
				this.showSheet = false
			},
			goTo() {
				uni.navigateTo({
					url: '/pages/nursing/add_balance'
				})
			},
			onSelect(e) {
				if (e.detail.id == 'delete') {
					this.deleteEle(this.selected.id)
				} else if (e.detail.id == 'detail') {
					uni.navigateTo({
						url: '/pages/nursing/detail?id=' + this.selected.id
					})
				}
			},
			deleteEle(id) {
				Dialog.confirm({
					title: '删除',
					message: '确定要删除吗？'
				}).then(() => {
					Toast.loading('加载中...')
					this.$uniRequest.post('/api/small_procedures/nursing/delete_bill', {
						id: id
					}).then(res => {
						let index = this.list.findIndex(e => e.id === id)
						this.list.splice(index, 1)
					}).finally(() => Toast.clear())
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
	.content {}

	.item {
		margin-top: 20rpx;
		padding: 10rpx;
		background-color: #FFFFFF;
		font-size: 34rpx;
	}

	.item_p {
		margin: 15rpx 20rpx 15rpx 20rpx;
	}

	.item_title_left {
		font-weight: 800;
		margin-top: 15rpx;
		margin-left: 20rpx;
		float: left;
		font-size: 34rpx;
	}

	.item_title_right {
		margin-right: 20rpx;
		float: right;
		font-size: 45rpx;
		margin-top: 15rpx;
	}

	.hover_item_title_right {
		color: red
	}

	.add_balance {
		margin: 20rpx 20rpx 20rpx 20rpx;
		background-color: #FFFFFF;
	}

	.add_balance_div {
		position: fixed;
		bottom: 0;
		text-align: center;
		width: 100%;
		background-color: #FFFFFF;
		border-top: 2px solid #E4E7ED;
	}

	.add_balance_hover {
		color: #C80000;
	}
</style>
