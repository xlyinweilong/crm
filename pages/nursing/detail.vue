<template>
	<view class="nursing_detail">
		<div class="item">
			<div style="height: 45rpx;">
				<div class="item_title_left">状态:
					<van-tag type="primary" size="large" v-if="billDetail.status == 'INIT'">已揽货</van-tag>
					<van-tag type="primary" size="large" v-if="billDetail.status == 'WASHING'">焕新中</van-tag>
					<van-tag type="success" size="large" v-if="billDetail.status == 'IN_CHANNEL'">待领取</van-tag>
					<van-tag type="success" size="large" v-if="billDetail.status == 'FINISHED'">已领取</van-tag>
					<van-tag type="success" size="large" v-if="billDetail.status == 'SETTLED'">已领取</van-tag>
					<van-tag type="success" size="large" v-if="billDetail.status == 'FINISHED_PROBLEM'">已领取(问题)</van-tag>
					<van-tag type="success" size="large" v-if="billDetail.status == 'PROBLEM_AGREE'">问题已确认</van-tag>
					<van-tag type="success" size="large" v-if="billDetail.status == 'PROBLEM'">问题待确认</van-tag>
					<van-tag type="success" size="large" v-if="billDetail.status == 'PROBLEM_REFUSE'">待领取(问题)</van-tag>
				</div>
				<!-- <div class="item_title_right" @click="showSheetInfo(billDetail)" hover-class="hover_item_title_right">
					<van-icon name="weapp-nav" />
				</div> -->
			</div>
			<van-divider />
			<p class="item_p">单号：{{billDetail.code}}</p>
		</div>
		<div class="qrcode" v-show="billDetail.status == 'IN_CHANNEL' || billDetail.status == 'PROBLEM_REFUSE'">
			<p class="qrcode_p">出示二维码取货</p>
			<tki-qrcode ref="qrcode" :size="400" :val="qrcode" />
		</div>
		<div v-if="billDetail.problemImageUrlList.length > 0" class="item">
			<div style="height: 45rpx;">
				<div class="item_title_left">焕新工坊问题:</div>
			</div>
			<van-divider />
			<div>
				<view class="form-first-bottom">
					<view class="add-container" v-for="(imageEle,index) in billDetail.problemImageUrlList">
						<image @click="showImage(imageEle,billDetail.problemImageUrlList)" class="selectclass1" mode="aspectFill" :src="imageEle" />
					</view>
				</view>
			</div>
			<div>
				<p class="item_p">{{billDetail.problemMessage}}</p>
			</div>
		</div>
		<view v-for="ele in billDetail.goodsList">
			<div class="item">
				<div style="height: 45rpx;">
					<div class="item_title_left">品类:{{ele.categoryName}}
					</div>
					<!-- <div class="item_title_right" @click="showSheetInfo(ele)" hover-class="hover_item_title_right">
						<van-icon name="weapp-nav" />
					</div> -->
				</div>
				<van-divider />
				<div v-if="ele.imageUrlList.length > 0">
					<view class="form-first-bottom">
						<view class="add-container" v-for="(imageEle,index) in ele.imageUrlList">
							<image @click="showImage(imageEle,ele.imageUrlList)" class="selectclass1" mode="aspectFill" :src="imageEle" />
						</view>
					</view>
				</div>
				<div v-if="ele.problemImageUrlList.length > 0">
					<van-divider />
					<div style="height: 45rpx;">
						<div class="item_title_left">客服问题:</div>
					</div>
					<van-divider />
					<view class="form-first-bottom">
						<view class="add-container" v-for="(imageEle,index) in ele.problemImageUrlList">
							<image @click="showImage(imageEle,ele.problemImageUrlList)" class="selectclass1" mode="aspectFill" :src="imageEle" />
						</view>
					</view>
					<div>
						<p class="item_p">{{ele.problemMessage}}</p>
					</div>
				</div>
			</div>
		</view>
		<div class="item" style="text-align: right;" v-if="billDetail.status == 'PROBLEM'">
			<span style="margin-right: 30rpx;">
				<van-button @click="changeStatus('agree')" custom-class="agree" type="primary">同意</van-button>
			</span>
			<span style="margin-right: 10rpx;">
				<van-button @click="changeStatus('refuse')" custom-class="refuse" type="danger">拒绝</van-button>
			</span>
		</div>
		<van-action-sheet :show="showSheet" cancel-text="取消" @cancel="onClose" :actions="actions" @close="onClose" @select="onSelect" />
		<van-dialog id="van-dialog" />
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"

	export default {
		components: {
			tkiQrcode
		},
		data() {
			return {
				id: '',
				billDetail: {},
				qrcode: '',
				selectedGoods: {},
				showSheet: false,
				actions: [{
					name: '删除',
					color: '#ee0a24',
					id: 'delete'
				}]
			}
		},
		onLoad(query) {
			this.id = query.id
			this.getInfo()
		},
		onPullDownRefresh() {
			this.getInfo()
		},
		methods: {
			showSheetInfo(goods) {
				this.selectedGoods = goods
				this.showSheet = true
			},
			onClose() {
				this.showSheet = false
			},
			showImage(url, list) {
				wx.previewImage({
					current: url,
					urls: list
				})
			},
			getInfo() {
				Toast.loading('加载中...')
				this.$uniRequest.get('/api/small_procedures/nursing/bill_info', {
					data: {
						id: this.id
					}
				}).then(res => {
					for (let i = 0; i < res.data.goodsList.length; i++) {
						let goods = res.data.goodsList[i]
						goods.imageUrlList = []
						if (goods.goodsWxUrl1 != null) {
							goods.imageUrlList.push(goods.goodsWxUrl1)
						}
						if (goods.goodsWxUrl2 != null) {
							goods.imageUrlList.push(goods.goodsWxUrl2)
						}
						if (goods.goodsWxUrl3 != null) {
							goods.imageUrlList.push(goods.goodsWxUrl3)
						}
						goods.problemImageUrlList = []
						if (goods.problemGoodsWxUrl1 != null) {
							goods.problemImageUrlList.push(goods.problemGoodsWxUrl1)
						}
						if (goods.problemGoodsWxUrl2 != null) {
							goods.problemImageUrlList.push(goods.problemGoodsWxUrl2)
						}
						if (goods.problemGoodsWxUrl3 != null) {
							goods.problemImageUrlList.push(goods.problemGoodsWxUrl3)
						}
					}
					res.data.problemImageUrlList = []
					if (res.data.problemGoodsWxUrl1 != null) {
						res.data.problemImageUrlList.push(res.data.problemGoodsWxUrl1)
					}
					if (res.data.problemGoodsWxUrl2 != null) {
						res.data.problemImageUrlList.push(res.data.problemGoodsWxUrl2)
					}
					if (res.data.problemGoodsWxUrl3 != null) {
						res.data.problemImageUrlList.push(res.data.problemGoodsWxUrl3)
					}
					this.billDetail = res.data
					this.qrcode = this.billDetail.code
					if(this.billDetail.status == 'IN_CHANNEL' || this.billDetail.status == 'PROBLEM_REFUSE'){
						this.$nextTick(() => {
							this.$refs.qrcode._makeCode()
						})
					}
				}).finally(() => Toast.clear())
			},
			onSelect(e) {
				if (e.detail.id == 'delete') {
					this.deleteGoods(this.selectedGoods.id)
				}
			},
			deleteGoods(id) {
				Dialog.confirm({
					title: '删除',
					message: '确定要删除吗？'
				}).then(() => {
					Toast.loading('加载中...')
					this.$uniRequest.post('/api/small_procedures/nursing/delete_goods', {
						id: id
					}).then(res => {
						this.getInfo()
					}).catch(() => Toast.clear())
				})
			},
			changeStatus(s) {
				let status = s == 'refuse' ? 'PROBLEM_REFUSE' : 'PROBLEM_AGREE'
				let words = s == 'refuse' ? '拒绝' : '同意'
				let _this = this
				Dialog.confirm({
					title: '操作确认',
					message: '确定要' + words + '吗？'
				}).then(() => {
					Toast.loading('加载中...')
					this.$uniRequest.post('/api/small_procedures/nursing/change_status_by_id', {
						id: this.id,
						status: status
					}).then(res => {
						Toast.clear()
						Toast.success('操作成功')
						this.getInfo()
					}).catch(() => Toast.clear())
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
	.qrcode {
		padding-top: 10rpx;
		text-align: center;
		margin: 0 auto;
		width: 450upx;
	}

	.qrcode_p {
		margin-top: 5rpx;
		margin-bottom: 5rpx;
		font-size: 26rpx;
	}

	.form-first-bottom {
		margin-left: 30rpx;
		margin-right: 20rpx;
		margin-top: 0rpx;
		padding-bottom: 10rpx;
		width: clac(100% - 50rpx);
		display: flex;
		flex-wrap: wrap;
		padding-top: 20rpx;
	}

	.add-container {
		width: calc(34% - 18rpx);
		height: 220rpx;
		text-align: center;
		line-height: 200rpx;
		padding-top: 13rpx;
		padding-right: 13rpx;
	}

	.form-first-bottom>.add-container:nth-of-type(3n) {
		/* 选择个数是3的倍数的元素 */
		padding-right: 0;
	}

	.selectclass1 {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.content {
		padding-bottom: 150rpx;
	}

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

	.agree {
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

	.refuse {
		padding-left: 30rpx;
		padding-right: 30rpx;
	}
</style>
