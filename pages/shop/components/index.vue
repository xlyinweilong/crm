<template>
	<view>
		<!-- <van-tabbar :active="active" @change="onChange" active-color="#706000" z-index="199">
			<van-tabbar-item :icon="active == 0 ? 'shop':'shop-o'">首页</van-tabbar-item>
			<van-tabbar-item :icon="active == 1 ? 'bag':'bag-o'">分类</van-tabbar-item>
			<van-tabbar-item :icon="active == 2 ? 'shopping-cart':'shopping-cart-o'">购物车</van-tabbar-item>
			<van-tabbar-item :icon="active == 3 ? 'manager':'manager-o'">我的</van-tabbar-item>
		</van-tabbar> -->
		<div class="tabbar">
			<div @click="onChange(0)" class="tabbar-item" :style="{color:active == 0?'#706000':'#606266'}">
				<div class="icon">
					<span v-show="active != 0" class="iconfont icon-home"></span>
					<span v-show="active == 0" class="iconfont icon-home-fill"></span>
				</div>
				<div class="text">首页</div>
			</div>
			<div @click="onChange(1)" class="tabbar-item" :style="{color:active == 1?'#706000':'#606266'}">
				<div class="icon">
					<span v-show="active != 1" class="iconfont icon-all"></span>
					<span v-show="active == 1" class="iconfont icon-all-fill"></span>
				</div>
				<div class="text">分类</div>
			</div>
			<div @click="onChange(2)" class="tabbar-item" :style="{color:active == 2?'#706000':'#606266'}">
				<div class="icon">
					<span v-show="active != 2" class="iconfont icon-cart-full"></span>
					<span v-show="active == 2" class="iconfont icon-cart-full-fill"></span>
				</div>
				<div class="text">购物车</div>
			</div>
			<div @click="onChange(3)" class="tabbar-item" :style="{color:active == 3?'#706000':'#606266'}">
				<div class="icon">
					<span v-show="active != 3" class="iconfont icon-bussiness-man"></span>
					<span v-show="active == 3" class="iconfont icon-bussiness-man-fill"></span>
				</div>
				<div class="text">我的</div>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {}
		},
		props: {
			active: {
				default: 0
			}
		},
		onLoad() {
		},
		methods: {
			onChange(e) {
				if (e == 0) {
					uni.switchTab({
						url: '/pages/shop/index/index'
					})
				} else if (e == 1) {
					uni.switchTab({
						url: '/pages/shop/category/index'
					})
				} else if (e == 2) {
					uni.switchTab({
						url: '/pages/shop/cart/index'
					})
				} else if (e == 3) {
					uni.switchTab({
						url: '/pages/shop/my/index'
					})
				}
			}
		}
	}
</script>

<style>
	page {}

	.tabbar {
		z-index: 199;
		display: flex;
		position: fixed;
		bottom: 0px;
		height: 50px;
		text-align: center;
		background-color: #ffffff;
		width: 100%;
	}

	.tabbar-item {
		width: 25%;
		font-size: 13px;
	}

	.tabbar-item .iconfont {
		font-size: 24px;
	}

	.tabbar-item .icon {
		margin-top: 3px;
	}

	.tabbar-item .text {
		margin-top: 1px;
	}
</style>
