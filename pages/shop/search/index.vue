<template>
	<view>
		<view class="container">
			<!-- 搜索商品 -->
			<div class="top">
				<div class="search-div">
					<input class="search" focus v-model="searchText" confirm-type="search" @confirm="search" placeholder="搜索" />
					<div @click="search" hover-class="hover-search" style="float:right;margin-top: 4rpx;">
						<van-icon name="search" size="40rpx" />
					</div>
				</div>
			</div>
			<div class="search_list" style="margin-top: 45px;">
				<!-- 历史搜索 -->
				<div v-if="searchHistory.length > 0">
					<div class="title">
						历史搜索
						<div @click="clear" style="float: right;margin-right: 20rpx;margin-top: 10rpx;">
							<van-icon color="#C0C4CC" size="40rpx" name="delete" />
						</div>
					</div>
					<div class="item_list">
						<div v-for="s in searchHistory" hover-class="hover-search-item" :key="s" @click="hitText(s)" class="item">{{s}}</div>
					</div>
				</div>
				<!-- 推荐搜索 -->
				<div v-if="searchRecommend.length > 0">
					<div class="title">推荐搜索</div>
					<div class="item_list">
						<div v-for="s in searchRecommend" :key="s" @click="hitText(s)" hover-class="hover-search-item" class="item">{{s}}</div>
					</div>
				</div>
			</div>
		</view>
		<van-toast id="van-toast" />
		<van-dialog id="van-dialog" />
		<loginCom />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import Dialog from '@/wxcomponents/vant/dialog/dialog'
	import loginCom from '@/pages/shop/components/login'
	export default {
		components: {loginCom},
		data() {
			return {
				searchText: '',
				searchHistory: [],
				searchRecommend: []
			}
		},
		onLoad(query) {
			this.loadHistory()
			this.loadRecommend()
		},
		methods: {
			loadHistory() {
				if (wx.getStorageSync('searchHistory') instanceof Array) {
					this.searchHistory = wx.getStorageSync('searchHistory')
				}
			},
			loadRecommend() {
				this.searchRecommend = wx.getStorageSync('searchRecommend')
				if (this.searchRecommend == null) {
					this.searchRecommend = []
				}
				this.$uniRequest.get('/api/small/shop/search/recommend/all').then(res => {
					this.searchRecommend = res.data.map(s => s.searchText)
					wx.setStorageSync('searchRecommend', this.searchRecommend)
				})
			},
			hitText(text) {
				this.searchText = text
				this.search()
			},
			search() {
				this.searchText = this.searchText.trim()
				if (this.searchText == '') {
					return
				}
				if (this.searchText.length < 20) {
					//查询里面含有
					if (this.searchHistory.length > 0) {
						let index = this.searchHistory.findIndex(s => s == this.searchText)
						if (index > -1) {
							this.searchHistory.splice(index, 1)
						}
					}
					this.searchHistory.unshift(this.searchText)
					if (this.searchHistory.length > 10) {
						this.searchHistory = this.searchHistory.slice(0, 10)
					}
					wx.setStorageSync('searchHistory', this.searchHistory)
				}
				//搜索逻辑
				uni.redirectTo({
					url: '/pages/shop/goods/goods_list?sk=' + this.searchText
				})
			},
			clear() {
				Dialog.confirm({
					title: '提示',
					message: '是否删除历史记录'
				}).then(() => {
					this.searchHistory = []
					wx.setStorageSync('searchHistory', this.searchHistory)
				}).catch(() => {})
			}
		}
	}
</script>

<style>
	page {
		background-color: #ffffff;
	}
</style>

<style scoped>
	
	.top{
		position: fixed;
		top: 0;
		z-index: 19;
		background-color: #ffffff;
		width: 100%;
	}
	
	.container {
		margin-top: 5px;
	}

	.search-div {
		margin-top: 10rpx;
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

	.search_list {
		font-size: 28rpx;
		margin-left: 25rpx;
		margin-rigth: 25rpx;
	}

	.search_list .title {
		color: #909399;
		margin-top: 80rpx;
	}

	.search_list .item_list {
		display: flex;
		flex-wrap: wrap;
	}

	.search_list .item {
		margin-top: 40rpx;
		margin-left: 15rpx;
		color: #606266;
		padding: 20rpx 30rpx 20rpx 30rpx;
		background-color: #E4E7ED;
	}

	.hover-search {
		/* box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); */
	}

	.hover-search-item {
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
	}
</style>
