<template>
	<view style="padding-left: 10rpx;padding-right: 10rpx;background-color: #FFFFFF;">
		<!-- header -->
		<view class="header">
			<image mode="widthFix" style="width: 100%;" src="../../static/images/header.png" />
			<div class="user-img">
				<image class="user-img-image" src="../../static/images/user.png" />
			</div>
			<div class="user-center">
				<div class="user-name">Hi,大隆</div>
				<div class="user-card-no">VIP:78985541</div>
				<div class="user-card-tips">有效期至永久有效</div>
			</div>
			<div class="user-qrcode" @click="showMembershipCode = true">
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
			<div class="user-info">
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
									<span class="count">3529</span><span class="danwei">分</span>
								</div>
							</i-col>
						</i-row>
					</button>
				</i-col>
			</i-row>
			<div class="icons">
				<i-row i-class="icons-row">
					<i-col span="8">
						<div><span class="iconfont icon-huiyuanquanyi"></span></div>
						<div class="wenzi">会员权益</div>
					</i-col>
					<i-col span="8">
						<div><span class="iconfont icon-chakandingdan"></span></div>
						<div class="wenzi">查看单据</div>
					</i-col>
					<i-col span="8">
						<div><span class="iconfont icon-zhuanshuguwen"></span></div>
						<div class="wenzi">专属顾问</div>
					</i-col>
				</i-row>
				<i-row i-class="icons-row">
					<i-col span="8">
						<div><span class="iconfont icon-jifenshangcheng"></span></div>
						<div class="wenzi">积分商城</div>
					</i-col>
					<i-col span="8">
						<div><span class="iconfont icon-guanfangshangcheng"></span></div>
						<div class="wenzi">官方商城</div>
					</i-col>
					<i-col span="8">
						<div><span class="iconfont icon-fujinmendian"></span></div>
						<div class="wenzi">附近门店</div>
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
				<image mode="widthFix" style="width: 100%;" src="../../static/images/footer2.jpg" />
			</view>	
		</view>
		<membershipCode  :showMembershipCode.sync="showMembershipCode"/>
	</view>
</template>

<script>
	import '@/static/css/style.css'
	import membershipCode from "./membershipCode.vue"
	

	export default {
		components: {
			membershipCode
		},
		data() {
			return {
				title: 'Hello',
				current: 0,
				info: [{
					url: '../../static/images/footer1.png'
				}, {
					url: '../../static/images/footer1.png'
				}, {
					url: '../../static/images/footer1.png'
				}],
				showMembershipCode: false,
				opt: {
					displayValue: false,
					format: 'code128'
				},
				val: '123123123'
			}
		},
		onLoad() {
		},
		methods: {
			change(e) {
				this.current = e.detail.current;
			}
		}
	}
</script>

<style scoped>
	image {
		will-change: transform
	}
</style>
