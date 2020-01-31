<template>
	<view>
		<view class="container">
			<!-- 搜索商品 -->
			<div class="search-div" @click="goToSearch">
				<input class="search" placeholder="搜索商品" />
				<div style="float:right;">
					<van-icon name="search" size="20px" />
				</div>
			</div>
			<!-- 左边分类 750 - 30 = 720 -->
			<div style="display: flex;flex-direction: row;padding-top:10rpx;">
				<scroll-view class="left" scroll-y="true" :style="{'height':(winHeight-105)+'px'}">
					<div v-for="c in categoryList" :key="c.id" @click="selectCategory(c)" :class="c.active ? 'category1Activity' : ''"
					 class="category1" :style="{color:c.active ? '#706000' : '#303133'}">{{c.name}}</div>
				</scroll-view>
				<!-- 右边明细 -->
				<scroll-view scroll-y="true" style="width:450rpx;padding-left:15rpx;color:#606266" :style="{'height':(winHeight-105)+'px'}">
					<div v-for="c2 in activeCategory.subList" @click="clickSubCategory(c2)" :key="c2.id" class="category2" hover-class="hover-category">{{c2.name}}</div>
				</scroll-view>
			</div>
		</view>
		<tabbar ref="tabbar" :active="'1'" />
		<van-toast id="van-toast" />
		<loginCom />
	</view>
</template>

<script>
	import tabbar from '@/pages/shop/components/index'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import loginCom from '@/pages/shop/components/login'
	export default {
		components: {
			tabbar,loginCom
		},
		data() {
			return {
				loading: false,
				winWidth: 0,
				winHeight: 0,
				categoryList: [],
				activeCategory: {
					subList: []
				}
			}
		},
		onLoad(query) {
			let _this = this
			wx.getSystemInfo({
				success: function(res) {
					_this.winWidth = res.windowWidth
					_this.winHeight = res.windowHeight
				}
			})
			this.loadCategory()
		},
		methods: {
			goToSearch() {
				uni.navigateTo({
					url: '/pages/shop/search/index'
				})
			},
			loadCategory() {
				if (wx.getStorageSync('categoryList') instanceof Array) {
					this.categoryList = wx.getStorageSync('categoryList')
				} else {
					Toast.loading('加载中...')
				}
				this.$uniRequest.get('/api/small/shop/category/all').then(res => {
					res.data.forEach(c => c.active = false)
					if (res.data.length > 0) {
						res.data[0].active = true
						this.activeCategory = res.data[0]
					}
					this.categoryList = res.data
					wx.setStorageSync('categoryList', this.categoryList)
				}).finally(() => Toast.clear())
			},
			selectCategory(ele) {
				this.categoryList.filter(c => c.id != ele.id).forEach(c => c.active = false)
				ele.active = true
				this.activeCategory = ele
			},
			clickSubCategory(ele) {
				uni.navigateTo({
					url: '/pages/shop/goods/goods_list?c2=' + ele.erpId + '&c=' +  this.activeCategory.erpId
				})
			}
		}
	}
</script>

<style>
	page {}
</style>

<style scoped>
	.container {
		margin-top: 5px;
	}

	.search-div {
		margin-top: 10rpx;
		margin-left: 15rpx;
		margin-right: 15rpx;
		padding-left: 18rpx;
		padding-right: 18rpx;
		padding-bottom: 5px;
		border-bottom: 1px solid #000000;
		display: flex;
		flex-direction: row;
	}

	.search {
		width: 700rpx;
		border: 0px;
		line-height: 18px;
		height: 22px;
	}

	.left {
		width: 300rpx;
		/* border-right: 1px solid #DCDFE6; */
		text-align: center;
		background: #eeeeee;
	}

	.category1 {
		font-size: 30rpx;
		padding-top: 13px;
		padding-bottom: 13px;
		color: #303133;
	}

	.category1Activity {
		background: #ffffff;
	}

	.category2 {
		font-size: 28rpx;
		padding: 30rpx 20rpx 30rpx 20rpx;
	}

	.hover-category {
		font-weight: 800
	}
</style>
