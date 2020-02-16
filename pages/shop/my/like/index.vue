<template>
	<view>
		<view v-if="list.length == 0 && !loading" style="text-align: center;">
			<p style="margin-top: 160rpx;size: 30rpx;">还没有收藏</p>
			<div style="margin-top: 30rpx;" @click="goPage('shop/goods/goods_list')">
				<van-button color="#706000">去逛逛</van-button>
			</div>
		</view>
		<view v-if="list.length > 0 || loading">
			<!-- 商品列表 -->
			<div class="goods_list">
				<div class="row">
					<div v-for="g in list" :key="g.id" class="item" @click="goToGoodsDetail(g.goods)">
						<!-- 图片区域 -->
						<div>
							<image class="goods_image" mode="aspectFit" :src="g.goods.imageUrl1" />
						</div>
						<!-- 价格 -->
						<div class="price">
							￥{{g.goods.price}}
							<span v-if="g.goods.tagPrice > 0" class="delete_price">￥{{g.goods.tagPrice}}</span>
							<span v-if="discount(g.goods) != null" class="discount">{{discount(g.goods)}}折</span>
						</div>
						<!-- 名称 -->
						<div class="name">{{g.goods.displayName}}</div>
					</div>
				</div>
			</div>
			<uni-load-more :status="status"></uni-load-more>
			<van-dialog id="van-dialog" confirm-button-color="#706000" />
		</view>
	</view>
</template>

<script>
	import loginCom from '@/pages/shop/components/login'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import Dialog from '@/wxcomponents/vant/dialog/dialog'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			loginCom,
			uniLoadMore
		},
		data() {
			return {
				listQuery: {
					pageIndex: 1,
					pageSize: 10
				},
				loading: false,
				list: [],
				status: ''
			}
		},
		computed: {},
		onLoad(query) {},
		onShow() {
			this.reLoad()
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
			discount(goods) {
				if (goods.price == null || goods.tagPrice == null) {
					return null
				}
				if (goods.tagPrice == 0) {
					return 0
				}
				return Math.floor(goods.price / goods.tagPrice * 100) / 10
			},
			reLoad() {
				this.loading = true
				this.listQuery.pageIndex = 1
				this.list = []
				this.getList()
			},
			getList() {
				this.status = "loading"
				this.$uniRequest.get('/api/small/shop/user_collect/list', {
					data: this.listQuery
				}).then(res => {
					this.loading = false
					res.data.content.filter(e => this.list.every(g => g.id !== e.id)).forEach(e => {
						this.list.push(e)
					})
					uni.hideNavigationBarLoading()
					this.status = "more"
					if (res.data.content.length == 0 || res.data.totalElements == this.goodsList.length) {
						this.status = "noMore"
					}
				}).catch(e => {
					uni.hideNavigationBarLoading()
					this.status = "noMore"
				})
			},
			goPage(page) {
				uni.navigateTo({
					url: '/pages/' + page
				})
			},
			deleteEle(location) {
				Dialog.confirm({
					title: '提示',
					message: '确定要删除此地址吗？'
				}).then(() => {
					Toast.loading()
					this.$uniRequest.post('/api/small/shop/location/delete', {
						id: location.id
					}).then(res => {
						this.loadLocation()
					}).finally(() => Toast.clear())
				}).catch(() => {})
			},
			//跳转到商品明细
			goToGoodsDetail(e) {
				uni.navigateTo({
					url: '/pages/shop/goods/goods_detail?g=' + e.code
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #DCDFE6;
	}
</style>

<style scoped>
	
	
	.goods_image {
		background-color: #eeeeee;
		margin: auto;
		width: 360rpx;
		height: 360rpx;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
	}

	.row .price {
		margin-left: 20rpx;
		margin-right: 20rpx;
		font-size: 38rpx;
		color: #303133;
		text-overflow: ellipsis;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		word-break: break-all;
	}

	.row .delete_price {
		margin-left: 10rpx;
		font-size: 24rpx;
		color: #909399;
		text-decoration: line-through;
	}

	.row .discount {
		margin-left: 10rpx;
		font-size: 24rpx;
		color: #909399;
	}

	.row .name {
		margin-left: 20rpx;
		margin-right: 20rpx;
		font-size: 30rpx;
		color: #606266;
		text-overflow: ellipsis;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
	}

	.row .item {
		margin-left: 8rpx;
		margin-top: 10rpx;
		height: 520rpx;
		width: 360rpx;
		background-color: #ffffff;
		border: 1px solid #E4E7ED;
		border-radius: 6px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
	}

	.goods_list {
	}

</style>