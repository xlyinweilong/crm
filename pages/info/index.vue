<template>
	<view style="padding-left: 10rpx;padding-right: 10rpx;background-color: #FFFFFF;">
		<!-- header -->
		<van-notice-bar v-if="!isGodUserInfoIntegral && setUserInfoGiveIntegral > 0" mode="closeable" :text="'进入[我的资料],完善个人资料可以获得'+setUserInfoGiveIntegral+'积分'" />
		<view class="header">
			<image mode="widthFix" style="width: 100%;" :src="headerUrl" />
			<div class="user-img">
				<image class="user-img-image" :src="avatarUrl" />
			</div>
			<div class="user-center">
				<div class="user-name" v-if="nickName != ''">Hi,{{nickName}}</div>
				<div class="user-card-no" v-if="cardCode != ''">VIP:{{cardCode}}</div>
				<div class="user-card-tips" v-if="cardCode != ''">有效期至永久有效</div>
				<div @click="changeRole" class="user-name" v-if="isEmploy">切换角色</div>
			</div>
			<div class="user-qrcode" @click="goPage('info/membershipCode')" hover-class="user-info-hover">
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
			<div class="user-info" @click="goPage('info/myInfo')" hover-class="user-info-hover">
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
					<button class="tickets-div" @click="goPage('ticket/list')" hover-class="user-info-hover">
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
									<span class="count">{{userInfo.coupon}}</span><span class="danwei">张</span>
								</div>
							</i-col>
						</i-row>
					</button>
				</i-col>
				<i-col span="12" i-class="tickets-row-col-right">
					<button class="tickets-div" @click="goPage('integral/list')" hover-class="user-info-hover">
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
									<span class="count">{{totalIntegral}}</span>
									<span class="danwei">{{totalIntegralStr}}分</span>
								</div>
							</i-col>
						</i-row>
					</button>
				</i-col>
			</i-row>
			<div class="icons">
				<i-row i-class="icons-row">
					<i-col span="8">
						<div @click="goPage('vip/power')" hover-class="user-info-hover">
							<div><span class="iconfont icon-huiyuanquanyi"></span></div>
							<div class="wenzi">会员权益</div>
						</div>
					</i-col>
					<i-col span="8">
						<div @click="goPage('sale_bill/list')" hover-class="user-info-hover">
							<div><span class="iconfont icon-chakandingdan"></span></div>
							<div class="wenzi">查看单据</div>
						</div>
					</i-col>
					<i-col span="8">
						<div><span class="iconfont icon-zhuanshuguwen"></span></div>
						<div class="wenzi">专属顾问</div>
					</i-col>
				</i-row>
				<i-row i-class="icons-row">
					<i-col span="8">
						<div @click="goPage('channel/nearby')" hover-class="user-info-hover">
							<div><span class="iconfont icon-jifenshangcheng"></span></div>
							<div class="wenzi">积分商城</div>
						</div>
					</i-col>
					<i-col span="8">
						<div @click="goPage('channel/nearby')" hover-class="user-info-hover">
							<div><span class="iconfont icon-guanfangshangcheng"></span></div>
							<div class="wenzi">官方商城</div>
						</div>
					</i-col>
					<i-col span="8">
						<div @click="goPage('channel/nearby')" hover-class="user-info-hover">
							<div><span class="iconfont icon-fujinmendian"></span></div>
							<div class="wenzi">附近门店</div>
						</div>
					</i-col>
				</i-row>
			</div>
			<view class="footer1">
				<uni-swiper-dot :info="info" :current="current" field="content" :mode="'long'">
					<swiper style="height: 200rpx;" @change="change">
						<swiper-item v-for="(item ,index) in info" :key="index">
							<view class="swiper-item">
								<image style="height: 200rpx;width: 100%;" :src="item.url" />
							</view>
						</swiper-item>
					</swiper>
				</uni-swiper-dot>
			</view>
			<view class="footer2">
				<image mode="widthFix" style="width: 100%;" :src="footerUrl" />
			</view>
		</view>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import '@/static/css/style.css'
	import Dialog from 'wxcomponents/vant/dialog/dialog'


	export default {
		components: {},
		computed: {
			totalIntegral() {
				if (this.userInfo.totalIntegral < 10000) {
					return this.userInfo.totalIntegral
				} else if (this.userInfo.totalIntegral < 100000) {
					return Math.floor(this.userInfo.totalIntegral / 10000 * 10) / 10
				} else if (this.userInfo.totalIntegral < 1000000) {
					return Math.floor(this.userInfo.totalIntegral / 100000 * 10) / 10
				} else if (this.userInfo.totalIntegral < 10000000) {
					return Math.floor(this.userInfo.totalIntegral / 1000000* 10) / 10
				} else if (this.userInfo.totalIntegral < 100000000) {
					return Math.floor(this.userInfo.totalIntegral / 10000000 * 10) / 10
				} else {
					return '1+'
				}
			},
			totalIntegralStr() {
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
		data() {
			return {
				setUserInfoGiveIntegral: 0,
				isGodUserInfoIntegral: true,
				headerUrl: "../../static/images/header.png",
				avatarUrl: '',
				nickName: '',
				cardCode: '',
				cardList: [],
				current: 0,
				isEmploy: false,
				coupon: 0,
				info: [{
					url: '../../static/images/footer1.png'
				}, {
					url: '../../static/images/footer1.png'
				}, {
					url: '../../static/images/footer1.png'
				}],
				showMembershipCode: false,
				showMyInfo: false,
				userInfo: {
					coupon: 0,
					totalIntegral: 0
				},
				footerUrl: "../../static/images/footer2.jpg"
			}
		},
		onPullDownRefresh() {
			this.init(true)
		},
		onLoad() {
			this.init(false)
		},
		methods: {
			init(reflush) {
				let user = wx.getStorageSync('token')
				this.avatarUrl = user.avatarUrl
				this.nickName = user.nickName
				this.cardList = user.cardList
				this.isEmploy = user.isEmploy
				this.setUserInfoGiveIntegral = user.setUserInfoGiveIntegral
				this.isGodUserInfoIntegral = user.isGodUserInfoIntegral
				if (this.avatarUrl == null || this.avatarUrl == '') {
					this.avatarUrl = '../../static/images/user.png'
				}
				if (this.cardList.length > 0 && user.defaultVipErpId) {
					this.cardCode = this.cardList.find(c => c.vipErpId == user.defaultVipErpId).vipCode
				}
				this.myInfo(reflush)
				//查询图片等信息
				this.$uniRequest.get('/api/diy_ui/info').then(res => {
					if (res.data.infoBackImageUrl != null) {
						this.headerUrl = this.$baseImageURL + res.data.infoBackImageUrl
					}
					if (res.data.infoFooterImageUrl != null) {
						this.footerUrl = this.$baseImageURL + res.data.infoFooterImageUrl
					}
					if (res.data.fileList.length > 0) {
						this.info = res.data.fileList.map(f => ({
							url: this.$baseImageURL + f
						}))
					}
				})
			},
			myInfo(reflush) {
				if (!reflush) {
					wx.showLoading({
						title: '加载中',
					})
				}
				this.$uniRequest.get('/api/small_procedures/vip/my_info').then(res => {
					this.userInfo = res.data
					wx.setStorageSync('userInfo', this.userInfo)
					if (reflush) {
						uni.stopPullDownRefresh()
					}
				})
			},
			hasVipCard() {
				if (this.cardList.length == 0) {
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
			},
			goPage(page) {
				if (this.hasVipCard()) {
					uni.navigateTo({
						url: '/pages/' + page
					})
				}
			},
			changeRole() {
				Dialog.confirm({
					title: '切换角色',
					message: '确认切换成员工吗？'
				}).then(() => {
					uni.redirectTo({
						url: '/pages/employ/index'
					})
				})
			}
		}
	}
</script>


<style scoped>
	image {
		will-change: transform
	}

	.user-info-hover {
		color: #C80000;
	}
</style>
