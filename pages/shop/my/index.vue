<template>
	<view>
		<view style="margin-bottom: 100rpx;">
			<!-- 基础模块 -->
			<view class="card" style="border-bottom: 1px solid #EBEEF5;	padding-left: 30rpx;padding-right: 30rpx;">
				<!-- 用户信息栏 -->
				<view style="height: 240rpx;">
					<!-- 头像 -->
					<div class="left">
						<div class="user-img">
							<image class="user-img-image" :src="user.avatarUrl" />
						</div>
					</div>
					<!-- 用户昵称、会员卡 -->
					<div class="left" style="margin-left: 10rpx;">
						<p style="color: #303133;font-size: 40rpx;margin-top: 20rpx;">
							{{user.nickName}}
							<!-- <span style="color: #706000;padding: 5rpx;border: 1px solid #706000;">{{card}}</span> -->
						</p>
						<p style="color: #606266;font-size: 28rpx;margin-top: 15rpx;">会员卡号:{{card.vipCode}}</p>
					</div>
					<!-- 箭头 -->
					<div style="float: right;">
						<van-icon custom-style="color:#DCDFE6;margin-top: 90rpx;" name="arrow" size="40rpx" />
					</div>
				</view>
				<!-- 优惠卷、积分 -->
				<view class="flex-row" style="padding-top: 35rpx;padding-bottom: 50rpx;text-align: center;">
					<div @click="goPage('ticket/list')" style="width:50%; ">
						<p style="border-right: 1px solid #DCDFE6;">{{userInfo.coupon}}</p>
						<p style="border-right: 1px solid #DCDFE6;padding-top: 5rpx;font-size: 30rpx;color:#606266">优惠券</p>
					</div>
					<div @click="goPage('integral/list')" style="width:50%;">
						<p style="">{{totalIntegral}}{{totalIntegralStr}}</p>
						<p style="padding-top: 5rpx;font-size: 30rpx;color:#606266">积分</p>
					</div>
				</view>
			</view>
			<!-- 订单 -->
			<van-cell title="全部订单" value="查看全部" :border="false" is-link />
			<view class="card">
				<view class="flex-row" style="padding-top: 15rpx;padding-bottom: 50rpx;text-align: center;">
					<div style="width:33%; ">
						<van-icon name="idcard" size="50rpx" />
						<p style="font-size: 28rpx;color:#606266">全部订单</p>
					</div>
					<div style="width:33%;">
						<van-icon name="logistics" size="50rpx" />
						<p style="font-size: 28rpx;color:#606266">代付款</p>
					</div>
					<div style="width:33%;">
						<van-icon name="pending-payment" size="50rpx" />
						<p style="font-size: 28rpx;color:#606266">待处理</p>
					</div>
				</view>
			</view>
			<!-- 线上功能 -->
			<view style="margin-top: 30rpx;">
				<van-cell title="其他功能" :border="false" />
				<view class="card">
					<view class="flex-row" style="padding-top: 15rpx;padding-bottom: 50rpx;text-align: center;">
						<div style="width:50%; ">
							<van-icon name="location-o" size="50rpx" />
							<p style="font-size: 28rpx;color:#606266">地址管理</p>
						</div>
						<div style="width:50%;">
							<van-icon name="like-o" size="50rpx" />
							<p style="font-size: 28rpx;color:#606266">我的收藏</p>
						</div>
					</view>
				</view>
			</view>
			<!-- 线下功能 -->
			<view style="margin-top: 30rpx;">
				<van-cell title="线下功能" value="会员中心" :border="false" is-link />
				<view class="card">
					<view class="flex-row" style="padding-top: 15rpx;text-align: center;">
						<div style="width:33%; ">
							<button @click="goPage('vip/power')" class="text-button" open-type="contact" bindcontact="handleContact" hover-class="hover-button">
								<div><span class="icon-under-line iconfont icon-huiyuanquanyi"></span></div>
								<p class="text-under-line">会员权益</p>
							</button>
						</div>
						<div style="width:33%;">
							<button @click="goPage('sale_bill/list')" class="text-button" open-type="contact" bindcontact="handleContact" hover-class="hover-button">
								<div><span class="icon-under-line iconfont icon-chakandingdan"></span></div>
								<p class="text-under-line">消费记录</p>
							</button>
						</div>
						<div style="width:33%;">
							<button class="text-button" open-type="contact" bindcontact="handleContact" hover-class="hover-button">
								<div><span class="icon-under-line iconfont icon-zhuanshuguwen">
										<!-- <em class="message-num">10+</em> --></span></div>
								<p class="text-under-line">专属顾问</p>
							</button>
						</div>
					</view>
					<view class="flex-row" style="padding-top: 50rpx;padding-bottom: 50rpx;text-align: center;">
						<div style="width:33%; ">
							<button @click="goPage('channel/nearby')" class="text-button" open-type="contact" bindcontact="handleContact" hover-class="hover-button">
								<div><span class="icon-under-line iconfont icon-fujinmendian"></span></div>
								<p class="text-under-line">附近门店</p>
							</button>
						</div>
						<div style="width:33%;">
							<button @click="goPage('evaluate/index')" class="text-button" open-type="contact" bindcontact="handleContact" hover-class="hover-button">
								<div><span class="icon-under-line iconfont icon-pingjiaguanli"></span></div>
								<p class="text-under-line">评价管理</p>
							</button>
						</div>
						<div style="width:33%;">
							<button @click="goPage('nursing/index')" class="text-button" open-type="contact" bindcontact="handleContact" hover-class="hover-button">
								<div><span class="icon-under-line iconfont icon-baobeihuanxin"></span></div>
								<p class="text-under-line">宝贝换新</p>
							</button>
						</div>
					</view>
				</view>
			</view>
		</view>
		<tabbar :active="3" />
	</view>
</template>

<script>
	import tabbar from '@/pages/shop/components/tabbar'
	export default {
		components: {
			tabbar
		},
		data() {
			return {
				loading: false,
				user: {},
				card: {},
				iconPx: 30,
				userInfo: {
					coupon: 0
				}
			}
		},
		computed: {
			totalIntegral() {
				if (this.userInfo.totalIntegral == null) {
					return 0
				}
				if (this.userInfo.totalIntegral < 10000) {
					return this.userInfo.totalIntegral
				} else if (this.userInfo.totalIntegral < 100000) {
					return Math.floor(this.userInfo.totalIntegral / 10000 * 10) / 10
				} else if (this.userInfo.totalIntegral < 1000000) {
					return Math.floor(this.userInfo.totalIntegral / 100000 * 10) / 10
				} else if (this.userInfo.totalIntegral < 10000000) {
					return Math.floor(this.userInfo.totalIntegral / 1000000 * 10) / 10
				} else if (this.userInfo.totalIntegral < 100000000) {
					return Math.floor(this.userInfo.totalIntegral / 10000000 * 10) / 10
				} else {
					return '1+'
				}
			},
			totalIntegralStr() {
				if (this.userInfo.totalIntegral == null) {
					return ''
				}
				if (this.userInfo.totalIntegral < 10000) {
					return ''
				} else if (this.userInfo.totalIntegral < 100000) {
					return '万'
				} else if (this.userInfo.totalIntegral < 1000000) {
					return '十万'
				} else if (this.userInfo.totalIntegral < 10000000) {
					return '百万'
				} else if (this.userInfo.totalIntegral < 100000000) {
					return '千万'
				} else {
					return '亿'
				}
			}
		},
		onLoad(query) {
			if (query.posCode) {}
			//计算
			let systemInfo = wx.getSystemInfoSync();
			this.iconPx = 35 / 750 * systemInfo.windowWidth;
			this.user = wx.getStorageSync('token')
			if (this.user.cardList != null && this.user.cardList.length > 0 && this.user.defaultVipErpId) {
				this.card = this.user.cardList.find(c => c.vipErpId == this.user.defaultVipErpId)
				console.log(this.card)
			}
			// this.$uniRequest.get('/api/small_procedures/vip/my_info').then(res => {
			// 	this.userInfo = res.data
			// 	wx.setStorageSync('userInfo', this.userInfo)
			// })
		},
		methods: {
			goPage(page) {
				if (this.hasVipCard()) {
					uni.navigateTo({
						url: '/pages/' + page
					})
				}
			},
			hasVipCard() {
				if (this.user.cardList == null) {
					Dialog.confirm({
						message: '您还没有注册成会员，现在去注册吗？'
					}).then(() => {
						uni.navigateTo({
							url: '/pages/register/register'
						})
					})
					return false
				}
				if (this.user.cardList.length == 0) {
					Dialog.confirm({
						message: '还未绑定会员卡，现在去绑定吗？'
					}).then(() => {
						uni.navigateTo({
							url: '/pages/bind_vip/bind_vip'
						})
					})
					return false
				} else {
					return true
				}
			}
		}
	}
</script>

<style>
	page {
		background-color: #F2F6FC;
	}
</style>

<style scoped>
	.text-button {
		background-color: transparent;
		padding: auto;
		line-height: 1;
		overflow: auto;
		display: inherit;
	}

	.text-button:after {
		border: none;
	}

	.text-button div {
		margin-top: 10rpx;
		margin-bottom: 20rpx;
	}

	.icon-under-line {
		font-size: 50rpx;
		color: #706000;
		position: relative;
	}

	.message-num {
		border-radius: 15rpx;
		box-shadow: 0 0 0 3rpx #fff;
		min-width: 30rpx;
		line-height: 30rpx;
		font-style: normal;
		background-color: #fa5151;
		color: #fff;
		font-size: 18rpx;
		position: absolute;
		top: -5rpx;
		right: -12rpx;
		padding: 0 3rpx;
	}

	.text-under-line {
		font-size: 28rpx;
		color: #606266;
		margin-top: 10rpx;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
		color: #303133;
		font-size: 34rpx;
	}

	.card {
		background-color: #ffffff;
	}

	.left {
		float: left;
		margin-top: 45rpx;
	}

	.user-img {
		width: 150rpx;
		height: 150rpx;
		border-radius: 100%;
		overflow: hidden;
		border: 1px solid #706000;
		margin-right: 0.5rem;
		z-index: 100;
	}

	.user-img .user-img-image {
		width: 150rpx;
		height: 150rpx;
	}
</style>
