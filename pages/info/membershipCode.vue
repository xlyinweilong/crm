<template>
	<view>
		<view class="myInfo">
			<div v-if="cardImageDiyUrl != null && cardImageDiyUrl != ''" class="image-div">
				<image class="image" mode="widthFix" :src="cardImageDiyUrl" />
				<div class="gradename">
					{{gradeName}}
				</div>
				<div class="code">
					NO.<span>{{cardCode}}</span>
				</div>
				<span class="iconfont icon-huiyuanka"></span>
			</div>
			<div class="button">
				<span class="left" @click="goPage('bind_vip/bind_vip')" hover-class="button-hover">会员卡绑定</span>
				<span class="right marginLeft" @click="goPage('info/changeVipCard')">切换当前会员</span>
			</div>
			<div class="qrcode">
				<tki-qrcode ref="qrcode" :size="400" :val="cardCode"/>
			</div>
			<div class="barcode">
				<tki-barcode ref="barcode" :val="cardCode" />
			</div>
			<div class="info">
				使用时请出示给店员
			</div>
			<div class="hr">
				<hr />
			</div>
		</view>
	</view>
</template>

<script>
	import tkiBarcode from "@/components/tki-barcode/tki-barcode.vue"
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"

	export default {
		components: {
			tkiBarcode,
			tkiQrcode
		},
		data() {
			return {
				cardImageDiyUrl: '',
				gradeName: '',
				cardCode: '',
				baseUrl: this.$baseURL + '/static/images/card/',
				loading: false,
				showImage:true
			}
		},
		onShow() {
			this.init()
		},
		onPullDownRefresh() {
			this.init()
		},
		methods: {
			init() {
				let user = wx.getStorageSync('token')
				this.avatarUrl = user.avatarUrl
				this.nickName = user.nickName
				if (user.cardList.length > 0 && user.defaultVipErpId) {
					this.cardCode = user.cardList.find(c => c.vipErpId == user.defaultVipErpId).vipCode
				}
				let grade = wx.getStorageSync('grade')
				if (grade != null) {
					this.cardImageDiyUrl = grade.cardImageDiyUrl
					this.gradeName = grade.name
				}
				this.getGradeInfo()
				
			},
			getGradeInfo() {
				wx.showLoading({
					title: '加载中',
				})
				this.$uniRequest.get('/api/small_procedures/vip_grade/info').then(res => {
					this.cardImageDiyUrl = res.data.cardImageDiyUrl
					this.gradeName = res.data.name
					wx.setStorageSync('grade', res.data)
					this.$refs.qrcode._makeCode()
					uni.stopPullDownRefresh()
				})
			},
			goPage(page) {
				uni.navigateTo({
					url: '/pages/' + page
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style scoped>
	.myInfo .value-class {
		flex: none !important;
	}

	.myInfo .image-div {
		text-align: center;
		margin-top: 50rpx;
	}

	.myInfo .image {
		width: 520rpx;
		height: 310rpx;
	}

	.myInfo .gradename {
		color: #FFFFFF;
		font-size: 31rpx;
		position: absolute;
		z-index: 200;
		top: 85rpx;
		left: 155rpx;
	}

	.myInfo .code {
		color: #FFFFFF;
		font-size: 20rpx;
		position: absolute;
		z-index: 200;
		top: 305rpx;
		left: 145rpx;
	}

	.myInfo .icon-huiyuanka {
		color: #FFFFFF;
		font-size: 38rpx;
		position: absolute;
		z-index: 200;
		top: 295rpx;
		right: 135rpx;
	}


	.myInfo .button {
		margin-top: 10rpx;
		text-align: center;
		font-size: 23rpx;
	}

	.myInfo .marginLeft {
		margin-left: 80rpx;
	}

	.myInfo .left {
		font-weight: 800;
		color: #000000;
		border-bottom: 3rpx solid #000000;
	}

	.myInfo .right {
		font-weight: 800;
		color: #C80000;
		border-bottom: 3rpx solid #C80000;
	}


	.myInfo .info {
		padding-top: 35rpx;
		color: #000000;
		text-align: center;
		font-size: 20rpx;
		font-weight: bold;
	}

	.myInfo .hr {
		height: 1px;
		padding-left: 45rpx;
		padding-right: 45rpx;
	}
	
	.myInfo .qrcode {
		padding-top: 45rpx;
		text-align: center;
		margin: 0 auto;
		width: 450upx;
	}
	
	.myInfo .barcode {
		padding-top: 45rpx;
		text-align: center;
		margin: 0 auto;
		/* width: 450upx; */
	}
	
	.button-hover{
		color: #C80000;
	}
</style>
