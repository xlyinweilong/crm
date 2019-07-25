<template>
	<view style="background-color:#cccccc">
		<!-- header -->
		<div style="text-align: center;background-color: #615451;height: 360rpx;">
			<div class="white" style="padding-top:65rpx;font-size: 22rpx;">剩余积分</div>
			<div class="white" style="padding-top:12rpx;font-size: 95rpx;">35393<span style="font-size: 30rpx;">分</span></div>
			<div class="white" style="padding-top:6rpx;font-size: 18rpx;">累计消费：380000分</div>
		</div>
		<div>
		<!-- 	<div class="tabDiv">
				<div>
					<span class="tabSpan">积分交易</span>
					<span class="tabSpan">储值交易</span>
				</div>
			</div> -->

			<van-tabs  custom-class="customClass" nav-class="navClass" tab-class="tabClass" @click="onClickTab">
				<van-tab tab-class="tabClass" title="标签 1">内容 1</van-tab>
				<van-tab tab-class="tabClass" title="标签 2">内容 2</van-tab>
			</van-tabs>
		</div>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import Dialog from 'wxcomponents/vant/dialog/dialog';


	export default {
		components: {},
		data() {
			return {
				avatarUrl: '',
				nickName: '',
				cardCode: '',
				current: 0,
				isEmploy: false,
				coupon: 0,
				integral: 0,
				info: [{
					url: '../../static/images/footer1.png'
				}, {
					url: '../../static/images/footer1.png'
				}, {
					url: '../../static/images/footer1.png'
				}],
				showMembershipCode: false,
				showMyInfo: false
			}
		},
		onLoad() {
			let user = wx.getStorageSync('token')
			this.avatarUrl = user.avatarUrl
			this.nickName = user.nickName
			this.cardCode = user.cardCode
			this.isEmploy = user.isEmploy
			if (this.avatarUrl == null || this.avatarUrl == '') {
				this.avatarUrl = '../../static/images/user.png'
			}
		},
		methods: {
			onClickTab() {

			},
			hasVipCard() {
				if (!this.isEmploy) {
					Dialog.confirm({
						title: '标题',
						message: '还未绑定会员卡，现在去绑定吗？'
					}).then(() => {
						console.log(111)
						uni.redirectTo({
							url: '/pages/bind_vip/bind_vip'
						})
					}).catch(() => {})
				}
				return this.isEmploy
			},
			showFun(ele) {
				if (this.hasVipCard()) {
					ele = true
				}
			}
		}
	}
</script>

<style>
	image {
		will-change: transform
	}

	.white {
		color: #FFFFFF;
	}
	
	.customClass{
		margin-left: 25rpx;
		margin-right: 25rpx;
	}

	.navClass {
		border-radius: 10px;
		border: 1px solid;
	}

	.tabClass {
	}

	.tabSpan {
		width: 50%;
		box-shadow: 10px 10px 5px #888888;
		border-radius: 25px;
	}

	.tabDiv {
		background-color: #FFFFFF;
		text-align: center;
	}
</style>
