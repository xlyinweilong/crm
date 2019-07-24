<template>
	<view style="padding-left: 10rpx;padding-right: 10rpx;background-color: #FFFFFF;">
		<!-- header -->
		<view class="header">
			<image mode="widthFix" style="width: 100%;" src="../../static/images/header.png" />
			<div class="user-img">
				<image class="user-img-image" :src="avatarUrl" />
			</div>
			<div class="user-center">
				<div class="user-name" v-if="nickName != ''">Hi,{{nickName}}</div>
				<div class="user-card-no" v-if="cardCode != ''">VIP:{{cardCode}}</div>
				<div class="user-card-tips">有效期至永久有效</div>
			</div>
			<div class="user-qrcode" @click="showFun(showMembershipCode)">
				<i-row>
					<i-col span="6" offset="4">
						<span class="iconfont icon-huiyuanma"></span>
					</i-col>
					<i-col span="14">
						<div class="user-qrcode-name">会员码</div>
						<div class="user-qrcode-enname">Membership Code</div>
					</i-col>
				</i-row>
			</div>
			<div class="user-info" @click="showFun(showMyInfo)">
				<i-row>
					<i-col span="6" offset="4">
						<span class="iconfont icon-wodeziliao"></span>
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
								<div style="padding-top: 5rpx;">
									<span class="tickets-icon iconfont icon-youhuijuan"></span>
									<div style="font-size: 20rpx;">优惠卷</div>
								</div>
							</i-col>
							<i-col span="1">
								<div class="shuxian"></div>
							</i-col>
							<i-col span="12">
								<div style="padding-top: 19rpx;">
									<span class="count">{{coupon}}</span><span class="danwei">张</span>
								</div>
							</i-col>
						</i-row>
					</button>
				</i-col>
				<i-col span="12" i-class="tickets-row-col-right">
					<button class="tickets-div">
						<i-row>
							<i-col span="10">
								<div style="padding-top: 5rpx;">
									<span class="tickets-icon iconfont icon-jifenchaxun"></span>
									<div style="font-size: 20rpx;">积分查询</div>
								</div>
							</i-col>
							<i-col span="1">
								<div class="shuxian"></div>
							</i-col>
							<i-col span="11">
								<div style="padding-top: 19rpx;">
									<span class="count">{{integral}}</span><span class="danwei">分</span>
								</div>
							</i-col>
						</i-row>
					</button>
				</i-col>
			</i-row>

		</view>
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
					}).catch(() => {
					})
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

<style scoped>
	image {
		will-change: transform
	}
</style>
