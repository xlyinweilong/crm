<template>
	<view>
		<van-tabbar :active="active" @change="onChange" active-color="#706000" z-index="199">
			<van-tabbar-item :icon="active == 0 ? 'shop':'shop-o'">首页</van-tabbar-item>
			<van-tabbar-item :icon="active == 1 ? 'bag':'bag-o'">分类</van-tabbar-item>
			<van-tabbar-item :icon="active == 2 ? 'shopping-cart':'shopping-cart-o'">购物车</van-tabbar-item>
			<van-tabbar-item :icon="active == 3 ? 'manager':'manager-o'">我的</van-tabbar-item>
		</van-tabbar>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
			}
		},
		props: {
			active: {
				default: 0
			}
		},
		onLoad(query) {},
		methods: {
			onChange(e) {
				// this.active = e.detail
				if (e.detail == 0) {
					uni.switchTab({
						url: '/pages/shop/index/index'
					})
				} else if (e.detail == 1) {
					uni.switchTab({
						url: '/pages/shop/category/index'
					})
				} else if (e.detail == 2) {
					uni.switchTab({
						url: '/pages/shop/cart/index'
					})
				} else if (e.detail == 3) {
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
</style>