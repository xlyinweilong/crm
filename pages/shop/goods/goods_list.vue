<template>
	<view>
		<view class="container">
			<!-- 搜索商品 -->
			<div class="top">
				<div class="search-div">
					<input class="search" v-model="listQuery.searchKey" placeholder="搜索" confirm-type="search" @confirm="reSearch" />
					<div @click="reSearch" style="float:right;margin-top: 4rpx;">
						<van-icon name="search" size="40rpx" />
					</div>
				</div>
				<!-- 排序 -->
				<div class="sort">
					<div class="sort_item" :class="{'sort_active':listQuery.sortKey == 'DEFUALT'}" @click="clickSortPrice('DEFUALT')"
					 :style="{'color':listQuery.sortKey == 'DEFUALT'?'#706000':'#606266'}">综合</div>
					<div class="sort_item" :class="{'sort_active':listQuery.sortKey == 'SALE'}" @click="clickSortPrice('SALE')" :style="{'color':listQuery.sortKey == 'SALE'?'#706000':'#606266'}">销量</div>
					<div class="sort_item" :class="{'sort_active':listQuery.sortKey == 'PRICE'}" @click="clickSortPrice('PRICE')"
					 :style="{'color':listQuery.sortKey == 'PRICE'?'#706000':'#606266'}">
						价格
						<span v-if="listQuery.sortKey == 'PRICE' && listQuery.sortAsc" class="iconfont icon-order_up"></span>
						<span v-if="listQuery.sortKey == 'PRICE' && !listQuery.sortAsc" class="iconfont icon-order_down"></span>
					</div>
					<div @click="clickDrawer" class="sort_item">筛选</div>
				</div>
			</div>
			<div class="goods_list">
				<div class="row">
					<div v-for="g in goodsList" :key="g.id" class="item" @click="goToDetail(g)">
						<!-- 图片区域 -->
						<div>
							<div class="sell-out" v-if="g.stockCount <= 0">
								<div style="margin-top: 170rpx;opacity:1">售罄</div>
							</div>
							<image class="goods_image" mode="aspectFit" :src="g.imageUrl1" />
						</div>
						<!-- 价格 -->
						<div class="price">
							￥{{g.crmPrice}}
							<span v-if="g.tagPrice > 0" class="delete_price">￥{{g.tagPrice}}</span>
							<span v-if="discount(g) != null" class="discount">{{discount(g)}}折</span>
						</div>
						<!-- 名称 -->
						<div class="name">{{g.displayName}}</div>
						<!-- 限购 -->
						<div class="limitBuyCount" v-if="g.limitBuyCount != null && g.limitBuyCount > 0">限购{{g.limitBuyCount}}</div>
					</div>
				</div>
				<uni-load-more :status="status"></uni-load-more>
			</div>
		</view>
		<uni-drawer :visible="showDrawer" mode="right" @close="showDrawer = false">
			<scroll-view scroll-y class="scroll-Y" :style="{height:(winHeight-70)+'px'}">
				<!-- 已选择区域 -->
				<view class="drawer-item" style="" v-if="selectGoodsAttrList.length > 0">
					<view class="drawer-title">
						已选择
					</view>
					<div class="drawer-content">
						<div v-for="e in selectGoodsAttrList" :key="e.id" style="padding-left: 10rpx;padding-right: 10rpx;">
							<div class="drawer-selected">
								{{e.name}}
							</div>
						</div>
					</div>
				</view>
				<view class="drawer-item" v-if="goodsBrandList.length > 0">
					<view class="drawer-title" @click="goodsBrandAll = !goodsBrandAll">
						品牌
						<div style="float: right;color: #909399;font-size: 24rpx;padding-top: 8rpx;">
							可多选
							<span v-if="!goodsBrandAll" style="font-size: 28rpx;padding-left: 10rpx;" class="iconfont icon-arrow-right"></span>
							<span v-if="goodsBrandAll" style="font-size: 28rpx;padding-left: 10rpx;" class="iconfont icon-arrow-down"></span>
						</div>
					</view>
					<div class="drawer-content">
						<div v-for="e in showGoodsBrandList" @click="selectGoodsAttr(e,goodsBrandList,'brand')" :key="e.id" style="padding-left: 10rpx;padding-right: 10rpx;">
							<div class="drawer-selected" :class="e.selected ? 'drawer-active':''">
								{{e.name}}
							</div>
						</div>
					</div>
				</view>
				<view class="drawer-item" v-if="goodsCategoryList.length > 0">
					<view class="drawer-title" @click="goodsCategoryAll = !goodsCategoryAll">
						类型
						<div style="float: right;color: #909399;font-size: 24rpx;padding-top: 8rpx;">
							可多选
							<span v-if="!goodsCategoryAll" style="font-size: 28rpx;padding-left: 10rpx;" class="iconfont icon-arrow-right"></span>
							<span v-if="goodsCategoryAll" style="font-size: 28rpx;padding-left: 10rpx;" class="iconfont icon-arrow-down"></span>
						</div>
					</view>
					<div class="drawer-content">
						<div v-for="e in showGoodsCategoryList" @click="selectGoodsAttr(e,goodsCategoryList,'category')" :key="e.id"
						 style="padding-left: 10rpx;padding-right: 10rpx;">
							<div class="drawer-selected" :class="e.selected ? 'drawer-active':''">
								{{e.name}}
							</div>
						</div>
					</div>
				</view>
				<view class="drawer-item" v-if="goodsCategory2List.length > 0">
					<view class="drawer-title" @click="goodsCategory2All = !goodsCategory2All">
						款式
						<div style="float: right;color: #909399;font-size: 24rpx;padding-top: 8rpx;">
							可多选
							<span v-if="!goodsCategory2All" style="font-size: 28rpx;padding-left: 10rpx;" class="iconfont icon-arrow-right"></span>
							<span v-if="goodsCategory2All" style="font-size: 28rpx;padding-left: 10rpx;" class="iconfont icon-arrow-down"></span>
						</div>
					</view>
					<div class="drawer-content">
						<div v-for="e in showGoodsCategory2List" @click="selectGoodsAttr(e,goodsCategory2List,'category2')" :key="e.id"
						 style="padding-left: 10rpx;padding-right: 10rpx;">
							<div class="drawer-selected" :class="e.selected ? 'drawer-active':''">
								{{e.name}}
							</div>
						</div>
					</div>
				</view>
				<view class="drawer-item">
					<view class="drawer-title" @click="goodsCategory2All = !goodsCategory2All">
						价格
					</view>
					<div class="drawer-content">
						<div style="padding-left: 10rpx;padding-right: 10rpx;">
							<div class="drawer-selected-price">
								<input type="digit" v-model="startPrice" class="uni-input" placeholder="最低价" />
							</div>
						</div>
						<div style="padding-left: 10rpx;padding-right: 10rpx;">
							<div class="drawer-selected-price-to">
								~
							</div>
						</div>
						<div style="padding-left: 10rpx;padding-right: 10rpx;">
							<div class="drawer-selected-price">
								<input type="digit" v-model="endPrice" class="uni-input" placeholder="最高价" />
							</div>
						</div>
					</div>
				</view>
			</scroll-view>
			<!-- 按钮区域 -->
			<view class="drawer-button">
				<div class="sub-button">
					<van-button :loading="loadingAttr" @click="clearFilter" size="large" color="#EBEEF5">重置</van-button>
				</div>
				<div class="sub-button">
					<van-button :loading="loadingAttr" @click="setFilter" size="large" color="#706000">确定</van-button>
				</div>
			</view>
		</uni-drawer>
		<van-toast id="van-toast" />
		<!-- <loginCom /> -->
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import uniSwiperDot from "@/components/uni-swiper-dot/uni-swiper-dot.vue"
	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue'
	export default {
		components: {
			uniSwiperDot,
			uniLoadMore,
			uniDrawer
		},
		data() {
			return {
				listQuery: {
					searchKey: '',
					pageIndex: 1,
					pageSize: 10,
					goodsBrandIds: '',
					goodsCategoryIds: '',
					goodsCategory2Ids: '',
					goodsYearIds: '',
					goodsSeasonIds: '',
					sortKey: 'DEFUALT',
					ticketId: '',
					sortAsc: true,
					startPrice:'',
					endPrice:'',
					diyGoodsListCode:''
				},
				startPrice:'',
				endPrice:'',
				goodsList: [],
				status: "loading",
				showDrawer: false,
				winHeight: 0,
				goodsBrandList: [],
				goodsBrandAll: false,
				goodsCategoryList: [],
				goodsCategoryAll: false,
				goodsCategory2List: [],
				goodsCategory2All: false,
				selectGoodsAttrList: []
			}
		},
		created() {
			this.winHeight = uni.getSystemInfoSync().windowHeight;
		},
		onLoad(query) {
			console.log(query)
			if (query.diy) {
				this.listQuery.diyGoodsListCode = query.diy
			}
			if (query.c) {
				this.listQuery.goodsCategoryIds = query.c
			}
			if (query.c2) {
				this.listQuery.goodsCategory2Ids = query.c2
			}
			if (query.b) {
				this.listQuery.goodsBrandIds = query.b
			}
			this.listQuery.goodsYearIds = ''
			if (query.y) {
				this.listQuery.goodsYearIds = query.y
			}
			this.listQuery.goodsSeasonIds = ''
			if (query.s) {
				this.listQuery.goodsSeasonIds = query.s
			}
			if (query.sk) {
				this.listQuery.searchKey = query.sk
			}
			if (query.t) {
				this.listQuery.ticketId = query.t
			}
			this.loadGoodsAttr()
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
		computed: {
			showGoodsBrandList() {
				return !this.goodsBrandAll ? this.goodsBrandList.slice(0, 3) : this.goodsBrandList
			},
			showGoodsCategoryList() {
				return !this.goodsCategoryAll ? this.goodsCategoryList.slice(0, 3) : this.goodsCategoryList
			},
			showGoodsCategory2List() {
				return !this.goodsCategory2All ? this.goodsCategory2List.slice(0, 3) : this.goodsCategory2List
			}
		},
		methods: {
			reSearch() {
				this.listQuery.pageIndex = 1
				this.goodsList = []
				this.getList()
			},
			clickSortPrice(key) {
				this.listQuery.sortKey = key
				if (this.listQuery.sortKey == 'PRICE') {
					this.listQuery.sortAsc = !this.listQuery.sortAsc
				}
				this.reSearch()
			},
			setFilter() {
				this.listQuery.goodsBrandIds = this.goodsBrandList.filter(g => g.selected).map(g => g.erpId).join(',')
				this.listQuery.goodsCategoryIds = this.goodsCategoryList.filter(g => g.selected).map(g => g.erpId).join(',')
				this.listQuery.goodsCategory2Ids = this.goodsCategory2List.filter(g => g.selected).map(g => g.erpId).join(',')
				this.listQuery.startPrice = this.startPrice
				this.listQuery.endPrice = this.endPrice
				this.showDrawer = false
				this.reSearch()
			},
			clearFilter() {
				this.selectGoodsAttrList = []
				this.goodsBrandList.filter(g => g.selected).forEach(g => g.selected = false)
				this.goodsCategoryList.filter(g => g.selected).forEach(g => g.selected = false)
				this.goodsCategory2List.filter(g => g.selected).forEach(g => g.selected = false)
				this.listQuery.startPrice = ''
				this.listQuery.endPrice = ''
			},
			clickDrawer() {
				this.setDrawer()
				this.showDrawer = true
			},
			setDrawer() {
				this.clearFilter()
				this.goodsBrandList.filter(g => this.listQuery.goodsBrandIds.split(',').indexOf(g.erpId) > -1).forEach(g => {
					g.selected = true
					g.type = 'brand'
					this.selectGoodsAttrList.push(g)
				})
				this.goodsCategoryList.filter(g => this.listQuery.goodsCategoryIds.split(',').indexOf(g.erpId) > -1).forEach(g => {
					g.selected = true
					g.type = 'category'
					this.selectGoodsAttrList.push(g)
				})
				this.goodsCategory2List.filter(g => this.listQuery.goodsCategory2Ids.split(',').indexOf(g.erpId) > -1).forEach(g => {
					g.selected = true
					g.type = 'category2'
					this.selectGoodsAttrList.push(g)
				})
			},
			discount(goods) {
				if (goods.crmPrice == null || goods.tagPrice == null) {
					return null
				}
				if (goods.tagPrice == 0) {
					return 0
				}
				return Math.floor(goods.crmPrice / goods.tagPrice * 100) / 10
			},
			goToDetail(goods) {
				uni.navigateTo({
					url: '/pages/shop/goods/goods_detail?g=' + goods.code
				})
			},
			getList() {
				this.status = "loading"
				this.$uniRequest.post('/api/small/shop/goods/list', this.listQuery).then(res => {
					res.data.records.filter(goods => this.goodsList.every(g => g.id !== goods.id)).forEach(goods => {
						this.goodsList.push(goods)
					})
					uni.hideNavigationBarLoading()
					this.status = "more"
					if (res.data.records.length == 0 || res.data.total == this.goodsList.length) {
						this.status = "noMore"
					}
				}).catch(e => {
					uni.hideNavigationBarLoading()
					this.status = "noMore"
				})
			},
			//加载品牌、品类、款式
			loadGoodsAttr() {
				this.loadingAttr = true
				this.$uniRequest.get('/api/small/shop/goods/goods_attr').then(res => {
					this.goodsBrandList = res.data.goodsBrandList
					this.goodsCategoryList = res.data.goodsCategoryList
					this.goodsCategory2List = res.data.goodsCategory2List
					this.setDrawer()
					this.getList()
				}).finally(() => this.loadingAttr = false)
			},
			selectGoodsAttr(e, list, type) {
				e.selected = !e.selected
				if (e.selected) {
					e.type = type
					this.selectGoodsAttrList.push(e)
				} else {
					let index = this.selectGoodsAttrList.findIndex(g => g.erpId == e.erpId && g.type == type)
					this.selectGoodsAttrList.splice(index, 1)
				}
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
	.sell-out {
		color: #ffffff;
		font-size: 40rpx;
		text-align: center;
		margin: auto;
		width: 360rpx;
		height: 360rpx;
		position: absolute;
		z-index: 18;
		background-color: #000000;
		opacity: 0.4;
	}

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
		font-size: 26rpx;
		color: #606266;
		text-overflow: ellipsis;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
	}

	.limitBuyCount {
		margin-left: 20rpx;
		margin-right: 20rpx;
		font-size: 24rpx;
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
		height: 540rpx;
		width: 360rpx;
		background-color: #ffffff;
		border: 1px solid #E4E7ED;
		border-radius: 6px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
	}

	.top {
		position: fixed;
		top: 0;
		z-index: 19;
		background-color: #ffffff;
		width: 100%;
		/* box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); */
	}

	.sort {
		padding-top: 20px;
		padding-bottom: 15px;
		display: flex;
		flex-direction: row;
	}

	.sort_item {
		margin: auto;
		width: 160rpx;
		font-size: 32rpx;
		text-align: center;
		color: #606266;
	}

	.container {
		margin-top: 5px;
	}

	.search-div {
		margin-top: 10rpx;
		font-size: 34rpx;
		margin-left: 15rpx;
		margin-right: 15rpx;
		padding-left: 18rpx;
		padding-right: 18rpx;
		padding-bottom: 10rpx;
		border-bottom: 2rpx solid #000000;
		display: flex;
		flex-direction: row;
	}

	.search {
		width: 650rpx;
		border: 0px;
		line-height: 18px;
		height: 22px;
	}

	.goods_list {
		margin-top: 95px;
	}

	.drawer-button {
		flex-wrap: nowrap;
		display: flex;
		justify-content: center;
		border-top: 1px solid #E4E7ED;
		height: 65px;
		width: 650rpx;
	}

	.drawer-button .sub-button {
		width: 300rpx;
		height: 50px;
		margin-top: 10px;
		padding-left: 10rpx;
		padding-right: 10rpx;
	}

	.drawer-item {
		margin-top: 20px;
		padding-bottom: 10px;
		padding-left: 14rpx;
		padding-right: 14rpx;
	}

	.drawer-title {
		font-size: 32rpx;
		color: #606266;
	}

	.drawer-content {
		display: flex;
		flex-wrap: wrap;
	}

	.drawer-selected {
		margin-top: 20rpx;
		font-size: 24rpx;
		width: 190rpx;
		text-align: center;
		padding-top: 18rpx;
		padding-bottom: 18rpx;
		color: #606266;
		background-color: #E4E7ED;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.drawer-selected-price {
		margin-top: 20rpx;
		font-size: 24rpx;
		width: 270rpx;
		text-align: center;
		padding-top: 18rpx;
		padding-bottom: 18rpx;
		color: #606266;
		background-color: #E4E7ED;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.drawer-selected-price-to{
		margin-top: 20rpx;
		font-size: 24rpx;
		width: 30rpx;
		text-align: center;
		padding-top: 18rpx;
		padding-bottom: 18rpx;
		color: #606266;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.drawer-active {
		color: #ffffff;
		background-color: #706000;
	}

	.sort_active {
		font-weight: 800
	}
</style>

<style lang="scss" scoped>
	/deep/ .uni-drawer {
		.uni-drawer__content {
			width: 660rpx;
		}
	}
</style>
