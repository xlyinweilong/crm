<template>
	<view class="evaluate">
		<div @click="goPage('evaluate/evaluate')" style="margin-top: 200rpx;">
			<image class="imageClass" src="../../static/images/pingjia.png" />
			<!-- <span class="evaluate-icon iconfont icon-tousujianyi"></span> -->
		</div>
		<div @click="goPage('evaluate/evaluate')" style="width: 65%;margin: auto;">
			<button class="submit"><span style="color: #ffffff;">消费评价</span></button>
		</div>
		<p @click="goPage('evaluate/evaluate')" class="jinjijinru">点击进入</p>
		<div @click="goPage('evaluate/complaint')" style="margin-top: 80rpx;">
			<image class="imageClass" src="../../static/images/tousu.png" />
			<!-- <span class="evaluate-icon iconfont icon-xiaofeipingjia"></span> -->
		</div>
		<div @click="goPage('evaluate/complaint')" style="width: 65%;margin: auto;">
			<button class="submit"><span style="color: #ffffff;">投诉建议</span></button>
		</div>
		<p @click="goPage('evaluate/complaint')" class="jinjijinru">点击进入</p>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {}
		},
		onLoad() {
			let user = wx.getStorageSync('token')
		},
		methods: {
			goPage(page){
				uni.navigateTo({
					url: '/pages/' + page
				})
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
	.evaluate {
		text-align: center;
	}

	.evaluate-icon {
		font-size: 140rpx;
	}

	.evaluate .submit {
		font-size: 22rpx;
		border-radius: 2em;
		margin: 30rpx 60rpx 0 60rpx;
		background: #AE0000;
		font-color: #ffffff;
	}
	
	.jinjijinru{
		margin-top: 10rpx;
		font-size: 18rpx;
		color: #1E90FF;
	}
	
	.imageClass{
		width: 180rpx;
		height: 180rpx;
	}
</style>
