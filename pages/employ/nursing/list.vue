<template>
	<view class="nursing_list">
		<van-dropdown-menu>
			<van-dropdown-item :value="channelId" :options="channelOptions" @change="changeOptions" />
			<van-dropdown-item id="item" title="日期">
				<van-field type="number" label="开始时间" :value="startDate" placeholder="20200101" @change="onChangeStartDate" />
				<van-field type="number" label="结束时间" :value="endDate" placeholder="20200101" @change="onChangeEndDate" />
				<van-button type="info" block @click="onConfirmDate">
					查询
				</van-button>
			</van-dropdown-item>
		</van-dropdown-menu>
		<van-tabs sticky swipeable :active="activeTag" @change="onChange">
			<van-tab title="用户来货" name="1">
				<listDetail ref="activeTag1" @showSheetInfo="showSheetInfo" :activeTag="1" />
			</van-tab>
			<van-tab title="衣店取走" name="2">
				<listDetail ref="activeTag2" @showSheetInfo="showSheetInfo" :activeTag="2" />
			</van-tab>
			<van-tab title="店铺收货" name="3">
				<listDetail ref="activeTag3" @showSheetInfo="showSheetInfo" @changeSelected="changeSelected" :activeTag="3" />
			</van-tab>
			<van-tab title="用户取走" name="4">
				<listDetail ref="activeTag4" @showSheetInfo="showSheetInfo" @changeSelected="changeSelected" :activeTag="4" />
			</van-tab>
			<van-tab title="已结算" name="5">
				<listDetail ref="activeTag5" @showSheetInfo="showSheetInfo" :activeTag="5" />
			</van-tab>
			<van-tab title="问题单" name="6">
				<listDetail ref="activeTag6" @showSheetInfo="showSheetInfo" :activeTag="6" @changeSelected="changeSelected" />
			</van-tab>
		</van-tabs>
		<div v-show="activeTag == 1" style="position:fixed;bottom: 0rpx;text-align: center;width: 100%;">
			<van-button type="primary" size="large" icon="plus" @click="add">添加单据</van-button>
		</div>
		<div v-show="activeTag == 4 || activeTag == 3 || activeTag == 6" style="position:fixed;bottom: 0rpx;text-align: center;width: 100%;">
			<van-button type="primary" size="large" @click="scanCode">扫码确定</van-button>
		</div>
		<van-action-sheet :show="showSheet" cancel-text="取消" @cancel="onClose" :actions="actions" @close="onClose" @select="onSelect" />
		<van-dialog id="van-dialog" />
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import {
		format
	} from 'utils/date.js'
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import listDetail from './list_detail'
	import uniLoadMore from "components/uni-load-more/uni-load-more.vue"
	import Toast from 'wxcomponents/vant/toast/toast'

	export default {
		components: {
			uniLoadMore,
			listDetail
		},
		data() {
			return {
				selectedList: [],
				activeTag: 1,
				selected: {},
				list: [],
				loading: false,
				pageIndex: 0,
				noMore: false,
				showSheet: false,
				channelOptions: [{
					text: '全部店铺',
					value: ''
				}],
				channelList: [],
				channelId: '',
				startDate: '',
				endDate: ''

			}
		},
		computed: {
			actions() {
				let action = [{
						name: '查看明细',
						color: '07c160',
						id: 'detail'
					},
					{
						name: '电话联系客户',
						color: '07c160',
						id: 'mobile'
					},
					{
						name: '删除',
						color: '#ee0a24',
						id: 'delete',
						disabled: false
					}
				]
				if (this.activeTag != 1) {
					action.find(a => a.id == 'delete').color = null
					action.find(a => a.id == 'delete').disabled = true
				} else {
					action.find(a => a.id == 'delete').disabled = false
				}
				return action
			}
		},
		onLoad(query) {
			let now = new Date()
			this.startDate = format(now, 'yyyyMM') + '01'
			this.endDate = format(now, 'yyyyMMdd')
			this.loadChannelList()
			// this.onLoadList()
		},
		onPullDownRefresh() {},
		methods: {
			changeOptions(e) {
				this.channelId = e.detail
				this.onLoadList()
			},
			onConfirmDate() {
				this.selectComponent('#item').toggle()
				this.onLoadList()
			},
			loadChannelList() {
				if (this.channelList.length == 0) {
					this.$uniRequest.get('/api/small_procedures/channel/all').then(res => {
						this.channelList = res.data
						this.channelList.forEach(c => {
							this.channelOptions.push({
								text: c.aliasNameAndName,
								value: c.id
							})
						})
					})
				}
			},
			onChangeStartDate(e) {
				this.startDate = e.detail
			},
			onChangeEndDate(e) {
				this.endDate = e.detail
			},
			onLoadList() {
				this.loadList(this.activeTag)
			},
			onChange(e) {
				this.selectedList = []
				this.activeTag = e.detail.name
				this.onLoadList()
			},
			loadList(name) {
				if (name == 1) {
					this.$refs.activeTag1.getList(this.startDate, this.endDate, this.channelId)
				} else if (name == 2) {
					this.$refs.activeTag2.getList(this.startDate, this.endDate, this.channelId)
				} else if (name == 3) {
					this.$refs.activeTag3.getList(this.startDate, this.endDate, this.channelId)
				} else if (name == 4) {
					this.$refs.activeTag4.getList(this.startDate, this.endDate, this.channelId)
				} else if (name == 5) {
					this.$refs.activeTag5.getList(this.startDate, this.endDate, this.channelId)
				} else if (name == 6) {
					this.$refs.activeTag6.getList(this.startDate, this.endDate, this.channelId)
				}
			},
			add() {
				uni.navigateTo({
					url: '/pages/employ/nursing/create_bill'
				})
			},
			showSheetInfo(ele) {
				this.selected = ele
				this.showSheet = true
			},
			onClose() {
				this.showSheet = false
			},
			onSelect(e) {
				if (e.detail.id == 'delete') {
					this.deleteEle(this.selected.id)
				} else if (e.detail.id == 'detail') {
					uni.navigateTo({
						url: '/pages/employ/nursing/bill_detail?id=' + this.selected.id
					})
				}else if(e.detail.id == 'mobile'){
					wx.makePhoneCall({
						phoneNumber: this.selected.customerUserMobile //仅为示例，并非真实的电话号码
					})
				}
			},
			deleteEle(id) {
				Dialog.confirm({
					title: '删除',
					message: '确定要删除吗？'
				}).then(() => {
					this.doDelete(id)
				}).catch((e) => {})
			},
			doDelete(id) {
				Toast.loading('加载中...')
				this.$uniRequest.post('/api/small_procedures/nursing/delete_bill', {
					id: id
				}).then(res => {
					Toast('删除成功')
					this.onLoadList()
				}).catch((e) => Toast.clear())
			},
			changeSelected(selectList) {
				this.selectedList = selectList
			},
			scanCode() {
				//发起扫码
				if (this.selectedList.length == 0) {
					Toast('请选择单据')
					return
				}
				let _this = this
				let status = this.activeTag == 3 ? 'FINISHED' : 'SETTLED'
				if (this.activeTag == 6) {
					status = 'FINISHED_PROBLEM'
				}
				wx.scanCode({
					success(res) {
						Toast.loading('加载中...')
						_this.$uniRequest.post('/api/small_procedures/nursing/change_status', {
							billIdList: _this.selectedList.map(c => c.id).join(','),
							qrCode: res.result,
							scanType: res.scanType,
							path: res.path,
							status: status
						}).then(res => {
							Toast.success('操作成功')
							_this.onLoadList()
						}).finally(() => Toast.clear())
					},
					error(e) {
						Toast.fail(e)
					}
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
	.content {
		padding-bottom: 150rpx;
	}
