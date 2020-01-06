<template>
	<view>
		<view class="container">
			<!-- 搜索商品 -->
			<div class="search-div">
				<input class="search" placeholder="搜索您喜欢的商品" />
				<div style="float:right;">
					<van-icon name="search" size="20px" />
				</div>
			</div>
			<div style="margin-top: 10px;">
				<uni-swiper-dot :info="info" :current="current" field="content" :mode="mode" :dotsStyles="dotsStyles">
					<swiper class="swiper-box" @change="change">
						<swiper-item v-for="(item ,index) in info" :key="index">
							<view class="swiper-item">
								<image style="width: 750rpx;height: 400rpx;background-color: #eeeeee;" mode="scaleToFill" src="https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK4Is7MBic1aLL4niaraMrjyW38iaPhvz8ric7CxjWeoNtHXJdUkYYiaIZiauWF0NYQVW0RZWXnEyaB7KIQ/132"></image>
							</view>
						</swiper-item>
					</swiper>
				</uni-swiper-dot>
			</div>
			<!-- 自定义组件 -->
			<div style="margin-top: 10px;">
				<!-- 标题 -->
				<div>组件文字</div>
				<!-- 图片 -->
				<div><image style="width: 750rpx;height: 400rpx;background-color: #eeeeee;" mode="scaleToFill" src="https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK4Is7MBic1aLL4niaraMrjyW38iaPhvz8ric7CxjWeoNtHXJdUkYYiaIZiauWF0NYQVW0RZWXnEyaB7KIQ/132" /></div>
				<!-- 图片 -->
				<div></div>
				<!-- 说明 -->
				<div>组件文字2</div>
			</div>
			<!-- 好物精选 FEATURE -->
			<div style="margin-top: 10px;">
				
			</div>
			<!-- 商品推荐 -->
			<div>
				<van-tabs :active="activeGoodsTab">
				  <van-tab title="新品文胸">
					  <div class="row">
						  <div class="cell">
						  </div>
						  <div class="cell"></div>
					  </div>
				  </van-tab>
				  <van-tab title="舒适内裤">
					  
				  </van-tab>
				  <van-tab title="保暖打底">
					  
				  </van-tab>
				  <van-tab title="家居睡衣">
					  
				  </van-tab>
				</van-tabs>
			</div>
		</view>
		<tabbar :active="0" />
	</view>
</template>

<script>
	import tabbar from '@/pages/shop/components/tabbar'
	import uniSwiperDot from "@/components/uni-swiper-dot/uni-swiper-dot.vue"
	export default {
		components: {
			tabbar,
			uniSwiperDot
		},
		data() {
			return {
				activeGoodsTab:0,
				info: [{
					content: '内容 A'
				}, {
					content: '内容 B'
				}, {
					content: '内容 C'
				}],
				current: 0,
				mode: 'default',
				dotsStyles: {
					selectedBackgroundColor: "#706000",
					backgroundColor: "rgba(255, 255, 255, .3)",
					color: "#eeeeee"
				}
			}
		},
		onLoad(query) {
			if (query.posCode) {

			}
		},
		methods: {
			change(e) {
				this.current = e.detail.current;
			},
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
</style>
