<template>
	<view class="nursing_detail">
		<div v-if="billDetail.status == 'PROBLEM'" class="item">
			<div style="height: 45rpx;">
				<div class="item_title_left">洗衣坊问题:</div>
			</div>
			<van-divider />
			<div v-if="billDetail.problemImageUrlList.length > 0">
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
		<van-action-sheet :show="showSheet" cancel-text="取消" @cancel="onClose" :actions="actions" @close="onClose" @select="onSelect" />
		<van-dialog id="van-dialog" />
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import Dialog from 'wxcomponents/vant/dialog/dialog'

	export default {
		components: {},
		data() {
			return {
				id: '',
				billDetail: {},
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
</style>
