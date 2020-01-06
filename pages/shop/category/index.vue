<template>
	<view>
		<view class="container">
			<!-- 搜索商品 -->
			<div class="search-div">
				<input class="search" placeholder="搜索" />
				<div style="float:right;">
					<van-icon name="search" size="20px" />
				</div>
			</div>
			<!-- 左边分类 750 - 30 = 720 -->
			<div style="display: flex;flex-direction: row;padding-top:20rpx;">
				<scroll-view class="left" scroll-y="true" :style="{'height':(winHeight-105)+'px'}">
					<div style="color:#706000;font-size:30rpx;padding-top:13px;padding-bottom:13px">昕逸</div>
					<div style="color:#303133;font-size:28rpx;padding-top:13px;padding-bottom:13px">大衣</div>
					<div style="color:#303133;font-size:28rpx;padding-top:13px;padding-bottom:13px">基础内衣内</div>
				</scroll-view>
				<!-- 右边明细 -->
				<scroll-view scroll-y="true" style="width:560rpx;padding-left:15rpx;color:#606266" :style="{'height':(winHeight-105)+'px'}">
					<div style="padding-top:10px"><image style="width: 545rpx; height: 250rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" /></div>
					<p style="text-align:center;color:#706000;font-size:40rpx;padding-top:20px">品牌</p>
					<div style="display: flex;font-size: 30rpx;">
						<div style="width: 150rpx;text-align: center;padding: 20rpx;">
							<image style="width: 150rpx; height: 80rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
						</div>
						<div style="width: 150rpx;text-align: center;padding: 20rpx;">
							<image style="width: 150rpx; height: 80rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
						</div>
						<div style="width: 150rpx;text-align: center;padding: 20rpx;">
							<image style="width: 150rpx; height: 80rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
						</div>
					</div>
					<div style="display: flex;font-size: 30rpx;">
						<div style="width: 150rpx;text-align: center;padding: 20rpx;">
							<image style="width: 150rpx; height: 80rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
						</div>
						<div style="width: 150rpx;text-align: center;padding: 20rpx;">
							<image style="width: 150rpx; height: 80rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
						</div>
					</div>
					<p style="text-align:center;color:#706000;font-size:40rpx;padding-top:20px">款式</p>
					<div style="display: flex;font-size: 30rpx;">
						<div style="width: 150rpx;text-align: center;padding: 20rpx;">
							<image style="width: 150rpx; height: 80rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
							<p style="font-size:28rpx">大衣</p>
						</div>
						<div style="width: 150rpx;text-align: center;padding: 20rpx;">
							<image style="width: 150rpx; height: 80rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
							<p style="font-size:28rpx">风衣</p>
						</div>
					</div>
					<div style="display: flex;font-size: 30rpx;">
						<div style="width: 150rpx;text-align: center;padding: 20rpx;">
							<image style="width: 150rpx; height: 80rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
							<p style="font-size:28rpx">大衣</p>
						</div>
						<div style="width: 150rpx;text-align: center;padding: 20rpx;">
							<image style="width: 150rpx; height: 80rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
							<p style="font-size:28rpx">风衣</p>
						</div>
					</div>
					<div style="display: flex;font-size: 30rpx;">
						<div style="width: 150rpx;text-align: center;padding: 20rpx;">
							<image style="width: 150rpx; height: 80rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
							<p style="font-size:28rpx">大衣</p>
						</div>
						<div style="width: 150rpx;text-align: center;padding: 20rpx;">
							<image style="width: 150rpx; height: 80rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
							<p style="font-size:28rpx">风衣</p>
						</div>
					</div>
					<div style="display: flex;font-size: 30rpx;">
						<div style="width: 150rpx;text-align: center;padding: 20rpx;">
							<image style="width: 150rpx; height: 80rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
							<p style="font-size:28rpx">大衣</p>
						</div>
						<div style="width: 150rpx;text-align: center;padding: 20rpx;">
							<image style="width: 150rpx; height: 80rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
							<p style="font-size:28rpx">风衣</p>
						</div>
					</div>
					<div style="display: flex;font-size: 30rpx;">
						<div style="width: 150rpx;text-align: center;padding: 20rpx;">
							<image style="width: 150rpx; height: 80rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
							<p style="font-size:28rpx">大衣</p>
						</div>
						<div style="width: 150rpx;text-align: center;padding: 20rpx;">
							<image style="width: 150rpx; height: 80rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
							<p style="font-size:28rpx">风衣</p>
						</div>
					</div>
				</scroll-view>
			</div>
		</view>
		<tabbar :active="1" />
	</view>
</template>

<script>
	import tabbar from '@/pages/shop/components/tabbar'
	export default {
		components: {
			tabbar
		},
		data() {
			return {
				loading: false,
				winWidth: 0,
				winHeight: 0
			}
		},
		onLoad(query) {
			let _this = this
			wx.getSystemInfo({
				success: function(res) {
					_this.winWidth = res.windowWidth
					_this.winHeight = res.windowHeight
				}
			});
			if (query.posCode) {

			}
		},
		methods: {
			onChange(e) {
				this.active = e.detail
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
		width: 200rpx;
		border-right: 1px solid #DCDFE6;
		text-align: center;
	}
</style>
