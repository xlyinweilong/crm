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
				<div class="user-name" v-if="nickName == null || nickName == ''">Hi</div>
				<div class="user-name" v-if="nickName != null && nickName != ''">Hi,{{nickName}}</div>
				<div class="user-card-no" v-if="cardCode != ''">VIP:{{cardCode}}</div>
				<div class="user-card-tips" v-if="cardCode != ''">有效期至永久有效</div>
				<div @click="changeRole" class="user-name" v-if="isEmploy">切换角色</div>
			</div>
			<div class="user-qrcode" @click="goPage('info/membershipCode')" hover-class="user-info-hover">
				<van-row>
					<van-col span="6" offset="4">
						<span class="iconfont icon-huiyuanma"></span>
					</van-col>
					<van-col span="14">
						<div class="user-qrcode-name">会员码</div>
						<div class="user-qrcode-enname">Membership Code</div>
					</van-col>
				</van-row>
			</div>
			<div class="user-info" @click="goPage('info/myInfo')" hover-class="user-info-hover">
				<van-row>
					<van-col span="6" offset="4">
						<span class="iconfont icon-wodeziliao"></span>
					</van-col>
					<van-col span="14">
						<div class="user-info-name">我的资料</div>
						<div class="user-info-enname">My Information</div>
					</van-col>
				</van-row>
			</div>
		</view>
		<!-- tickets -->
		<view class="tickets">
			<van-row>
				<van-col span="12" custom-class="tickets-row-col-left">
					<div class="tickets-div" @click="goPage('ticket/list')" hover-class="user-info-hover">
						<van-row>
							<van-col span="10">
								<div style="padding-top: 2rpx;">
									<span class="tickets-icon iconfont icon-youhuijuan"></span>
									<div style="font-size: 20rpx;">优惠券</div>
								</div>
							</van-col>
							<van-col span="1">
								<div class="shuxian"></div>
							</van-col>
							<van-col span="13">
								<div style="padding-top: 19rpx;padding-bottom: 15rpx;">
									<span class="count">{{userInfo.coupon}}</span><span class="danwei">张</span>
								</div>
							</van-col>
						</van-row>
					</div>
				</van-col>
				<van-col span="12" custom-class="tickets-row-col-right">
					<div class="tickets-div" @click="goPage('integral/list')" hover-class="user-info-hover">
						<van-row>
							<van-col span="10">
								<div style="padding-top: 2rpx;">
									<span class="tickets-icon iconfont icon-jifenchaxun"></span>
									<div style="font-size: 20rpx;">积分查询</div>
								</div>
							</van-col>
							<van-col span="1">
								<div class="shuxian"></div>
							</van-col>
							<van-col span="13">
								<div style="padding-top: 19rpx;padding-bottom: 15rpx;">
									<span class="count">{{totalIntegral}}</span>
									<span class="danwei">{{totalIntegralStr}}分</span>
								</div>
							</van-col>
						</van-row>
					</div>
				</van-col>
			</van-row>
			<div class="icons">
				<van-row custom-class="icons-row">
					<van-col span="8">
						<div @click="reLaunchPage('shop/index/index')" hover-class="user-info-hover">
							<div><span class="iconfont icon-guanfangshangcheng"></span></div>
							<div class="wenzi">官方商城</div>
						</div>
					</van-col>
					<van-col span="8">
						<div @click="goPageBase('pagesA/live/room')" hover-class="user-info-hover">
							<div><span class="iconfont icon-play"></span></div>
							<div class="wenzi">直播列表</div>
						</div>
					</van-col>
					
					<van-col span="8">
						<div style="border:10px;background-color:transparent;">
							<!-- <button class="text-button" style="background-color:transparent;" @click="goPage('info/customer/index')"
							 hover-class="user-info-hover">
								<div><span class="iconfont icon-zhuanshuguwen"></span></div>
								<div class="wenzi">专属顾问</div>
							</button> -->
							<button class="text-button" style="background-color:transparent;" open-type="contact" bindcontact="handleContact"
							 hover-class="user-info-hover">
								<div><span class="iconfont icon-zhuanshuguwen"></span></div>
								<div class="wenzi">专属顾问</div>
							</button>
						</div>
					</van-col>
				</van-row>
				<van-row custom-class="icons-row">

					<!-- <van-col span="8">
						<div @click="goPage('channel/nearby')" hover-class="user-info-hover">
							<div><span class="iconfont icon-jifenshangcheng"></span></div>
							<div class="wenzi">积分商城</div>
						</div>
					</van-col> -->
					<van-col span="8">
						<div @click="goPage('channel/nearby')" hover-class="user-info-hover">
							<div><span class="iconfont icon-fujinmendian"></span></div>
							<div class="wenzi">附近门店</div>
						</div>
					</van-col>
					<van-col span="8">
						<div @click="goPage('evaluate/index')" hover-class="user-info-hover">
							<div><span class="relative iconfont icon-pingjiaguanli"><em v-show="userInfo.evaluateCount != null" class="message-num">{{userInfo.evaluateCount}}</em></span></div>
							<div class="wenzi">评价管理</div>
						</div>
					</van-col>
					<van-col span="8">
						<div @click="goPage('nursing/index')" hover-class="user-info-hover">
							<div><span class="relative iconfont icon-baobeihuanxin"><em v-show="userInfo.pendingReceiveCount != null" class="message-num">{{userInfo.pendingReceiveCount}}</em></span></div>
							<div class="wenzi">宝贝焕新</div>
						</div>
					</van-col>
				</van-row>
				<van-row custom-class="icons-row">
					<van-col span="8">
						<div @click="goPage('vip/power')" hover-class="user-info-hover">
							<div><span class="iconfont icon-huiyuanquanyi"></span></div>
							<div class="wenzi">会员权益</div>
						</div>
					</van-col>
					<van-col span="8">
						<div @click="goPage('sale_bill/list')" hover-class="user-info-hover">
							<div><span class="iconfont icon-chakandingdan"></span></div>
							<div class="wenzi">消费记录</div>
						</div>
					</van-col>
					<van-col span="8">
						<div @click="goPage('ticket/shelf/list')" hover-class="user-info-hover">
							<div><span class="iconfont icon-youhuijuan"></span></div>
							<div class="wenzi">领券中心</div>
						</div>
					</van-col>
				</van-row>
			</div>
			<view class="footer1">
				<uni-swiper-dot :info="info" :current="current" field="content" :mode="'long'">
					<swiper style="height: 200rpx;" @change="change">
						<swiper-item v-for="(item ,index) in info" :key="index" @click="goPageFooter(index)">
							<view class="swiper-item">
								<image style="height: 200rpx;width: 100%;" :src="item.url" />
							</view>
						</swiper-item>
					</swiper>
				</uni-swiper-dot>
			</view>
			<view class="footer2" @click="goPageFooter2('info/web',footerUrlGoUrl)">
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
					return Math.floor(this.userInfo.totalIntegral / 1000000 * 10) / 10
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
					totalIntegral: 0,
					evaluateCount: null,
					pendingReceiveCount: null
				},
				footerUrl: "../../static/images/footer1.png",
				footerUrlGoUrl: '',
				fileListUrls: ''
			}
		},
		onPullDownRefresh() {
			this.init(true)
		},
		onLoad() {},
		onShareAppMessage(options) {
			var that = this;
			let user = wx.getStorageSync('token')
			var shareObj = {
				// title: "一起", // 默认是小程序的名称(可以写slogan等)
				path: '/pages/login/index?scene=share,info_index,' + user.id,
				imageUrl: '',
				success(res) {
					// 转发成功之后的回调
					if (res.errMsg == 'shareAppMessage:ok') {}
				},
				fail() {
					// 转发失败之后的回调
					if (res.errMsg == 'shareAppMessage:fail cancel') {
						// 用户取消转发
					} else if (res.errMsg == 'shareAppMessage:fail') {
						// 转发失败，其中 detail message 为详细失败信息
					}
				},
				complete() {
					// 转发结束之后的回调（转发成不成功都会执行）
				}
			}
			// 来自页面内的按钮的转发
			if (options.from == 'button') {
				var eData = options.target.dataset;
				console.log(eData.name); // shareBtn
				// 此处可以修改 shareObj 中的内容
				shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
			}
			// 返回shareObj
			return shareObj
		},
		onShow() {
			this.init(true)
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
				this.evaluateCount = user.evaluateCount
				this.pendingReceiveCount = user.pendingReceiveCount
				if (this.avatarUrl == null || this.avatarUrl == '') {
					this.avatarUrl = '../../static/images/user.png'
				}
				if (this.cardList != null && this.cardList.length > 0 && user.defaultVipErpId) {
					this.cardCode = this.cardList.find(c => c.vipErpId == user.defaultVipErpId).vipCode
				}
				if (this.cardList != null) {
					this.myInfo(reflush)
				}
				//查询图片等信息
				this.$uniRequest.get('/api/diy_ui/info').then(res => {
					if (res.data.infoBackImageUrl != null) {
						this.headerUrl = this.$baseImageURL + res.data.infoBackImageUrl
					}
					if (res.data.infoFooterImageUrl != null) {
						this.footerUrl = this.$baseImageURL + res.data.infoFooterImageUrl
					}
					this.footerUrlGoUrl = res.data.infoFooterImageUrlGoUrl
					this.fileListUrls = res.data.fileListUrls
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
				if (this.cardList == null) {
					Dialog.confirm({
						message: '您还没有注册成会员，现在去注册吗？'
					}).then(() => {
						uni.navigateTo({
							url: '/pages/register/register'
						})
					})
					return false
				}
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
			reLaunchPage(page) {
				if (this.hasVipCard()) {
					uni.reLaunch({
						url: '/pages/' + page
					})
				}
			},
			goPageBase(page){
				if (this.hasVipCard()) {
					uni.navigateTo({
						url: '/' + page
					})
				}
			},
			goPageFooter2(page, param) {
				if (this.hasVipCard()) {
					if (param != null && param != '') {
						uni.navigateTo({
							url: '/pages/info/web?url=' + encodeURIComponent(param)
						})
					}
				}
			},
			goPageFooter(index) {
				if (this.hasVipCard()) {
					let param = this.fileListUrls.split(",")[index]
					if (param != null) {
						uni.navigateTo({
							url: '/pages/info/web?url=' + encodeURIComponent(param)
						})
					}
				}
			},
			comingsone() {
				Dialog.alert({
					title: '敬请期待',
					message: '该功能稍后上线，敬请期待'
				}).then(() => {
					// on close
				});
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
	.text-button:after {
		border: none;
	}

	image {
		will-change: transform
	}

	.user-info-hover {
		color: #C80000;
	}

	.relative {
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
</style>
