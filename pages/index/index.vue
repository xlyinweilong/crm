<template>
	<view style="padding-left: 10rpx;padding-right: 10rpx;background-color: #FFFFFF;">
		<!-- header -->
		<!-- <image mode="widthFix" style="width: 100%;" src="../../static/images/123456.jpg" /> -->
		<view class="header">
			<!-- <image mode="widthFix" style="width: 100%;" src="../../static/images/header_nike.jpg" /> -->
			<image mode="widthFix" style="width: 100%;" src="../../static/images/header.png" />
			<div class="user-img">
				<image class="user-img-image" src="../../static/images/user.png" />
			</div>
			<div class="user-center">
				<div class="user-name">Hi,大隆</div>
				<div class="user-card-no">VIP:78985541</div>
				<div class="user-card-tips">有效期至永久有效</div>
			</div>
			<div class="user-qrcode">
				<i-row>
					<i-col span="6" offset="4">
						<span class="iconfont icon-ico"></span>
					</i-col>
					<i-col span="14">
						<div class="user-qrcode-name">会员码</div>
						<div class="user-qrcode-enname">Membership Code</div>
					</i-col>
				</i-row>
			</div>
			<div class="user-info">
				<i-row>
					<i-col span="6" offset="4">
						<span class="iconfont icon-wode"></span>
					</i-col>
					<i-col span="14">
						<div class="user-info-name">我的资料</div>
						<div class="user-info-enname">My Information</div>
					</i-col>
				</i-row>
			</div>
		</view>
		<!-- tickets -->
		<view class="tickets">
			<i-row>
				<i-col span="12" i-class="tickets-row-col-left">
					<button class="tickets-div">
						<i-row>
							<i-col span="9">
								<div style="padding-top: 8rpx;">
									<span class="tickets-icon iconfont icon-wodeyouhuijuan"></span>
									<div style="font-size: 20rpx;">优惠卷</div>
								</div>
							</i-col>
							<i-col span="1">
								<div class="shuxian"></div>
							</i-col>
							<i-col span="12">
								<div style="padding-top: 19rpx;">
									<span class="count">3</span><span class="danwei">张</span>
								</div>
							</i-col>
						</i-row>
					</button>
				</i-col>
				<i-col span="12" i-class="tickets-row-col-right">
					<button class="tickets-div">
						<i-row>
							<i-col span="10">
								<div style="padding-top: 8rpx;">
									<span class="tickets-icon iconfont icon-jifen"></span>
									<div style="font-size: 20rpx;">积分查询</div>
								</div>
							</i-col>
							<i-col span="1">
								<div class="shuxian"></div>
							</i-col>
							<i-col span="11">
								<div style="padding-top: 19rpx;">
									<span class="count">3529</span><span class="danwei">分</span>
								</div>
							</i-col>
						</i-row>
					</button>
				</i-col>
			</i-row>
		</view>
	</view>
</template>

<script>
	import '@/static/css/style.css'

	export default {
		components: {},
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

<style scoped>
	image {
		will-change: transform
	}
</style>
