<template>
	<view class="content">
		<!-- <image width="100%" src="/static/t1.jpg"></image> -->
		<!-- <view class="content"> -->
			<view class="uni-padding-wrap uni-common-mt">
				<view class="uni-flex uni-row">
					<view class="flex-item uni-bg-red"><span class="iconfont icon-youhuiquan"></span></view>
					<view class="flex-item uni-bg-green"><span class="iconfont icon-jifen"></span></view>
				</view>
			</view>
		<!-- </view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
	.iconfont{
		font-size: 50upx;
	}
</style>
