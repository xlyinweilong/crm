<template>
	<view style="padding-left: 10rpx;padding-right: 10rpx;">
		<!-- header -->
		<div class="header">
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
		</div>
		<!-- tickets -->
		<div class="tickets">
			<i-row>
				<i-col span="8" i-class="col-class">col-8</i-col>
				<i-col span="8" i-class="col-class">col-8</i-col>
				<i-col span="8" i-class="col-class">col-8</i-col>
			</i-row>
		</div>
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
