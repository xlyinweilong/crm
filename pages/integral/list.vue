<template style="background-color:#cccccc">
	<view class="integral" style="background-color:#cccccc">
		<!-- header -->
		<div style="text-align: center;background-color: #615451;height: 360rpx;">
			<div class="white" style="padding-top:55rpx;font-size: 20rpx;">剩余积分</div>
			<div class="white" style="padding-top:11rpx;font-size: 92rpx;">35393<span style="font-size: 30rpx;">分</span></div>
			<div class="white" style="padding-top:5rpx;font-size: 18rpx;">累计消费：380000分</div>
		</div>
		<div>
			<div class="tabDiv">
				<i-row span="10">
					<i-col span="12" i-class="active"><span class="iconfont icon-jifenliebiao-wodejifen" />积分交易</i-col>
					<i-col span="12" i-class="tabSpan"><span class="iconfont icon-jifenliebiao-wodeyue" />储值交易</i-col>
				</i-row>
				<div class="tabs_content">
					<table>
						<hr>
						<hd>时间</hd>
						<hd>店铺</hd>
						<hd>类型</hd>
						<hd>积分</hd>
						</hr>
					</table>
				</div>
			</div>
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

	.customClass {
		margin-left: 25rpx;
		margin-right: 25rpx;
	}

	.navClass {
		border-radius: 10px;
		border: 1px solid;
	}

	.tabClass {}

	.active {
		font-size: 28rpx;
		font-weight: 800;
		color: #C80000;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		border-top-left-radius: 18rpx;
		border-top-right-radius: 18rpx;
		background-color: #FFFFFF;
	}

	.tabSpan {
		font-size: 28rpx;
		font-weight: 800;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		border-top-left-radius: 18rpx;
		border-top-right-radius: 18rpx;
		background-color: #cccccc;
	}


	.tabDiv {
		position: relative;
		top: -80rpx;
		/* border-radius: 5px; */
		margin-left: 30rpx;
		margin-right: 30rpx;
		/* display: flex; */
		/* background-color: #FFFFFF; */
		text-align: center;
	}

	.tabs_content {
		height: 200rpx;
		background-color: #FFFFFF;
		border-bottom-right-radius: 18rpx;
		border-bottom-left-radius: 18rpx;
	}

	.integral .iconfont {
		font-size: 34rpx;
		margin-right: 8rpx;
	}
</style>
