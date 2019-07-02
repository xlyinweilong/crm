<template>
	<van-dialog use-slot :show="showMembershipCode" @close="onClose" :showConfirmButton="false"
	 :closeOnClickOverlay="true">
		<view class="membershipCode">
			<div class="image-div">
				<image mode="widthFix" src="../../static/images/ticket_bg.png" />
			</div>
			<div class="gradename">
				VIP银卡会员
			</div>
			<div class="code">
				NO:<span>ZK890370</span>
			</div>
			<span class="iconfont icon-huiyuanka"></span>
			<div class="qrcode">
				<tki-qrcode ref="qrcode" :val="'123'" />
			</div>
			<tki-barcode ref="barcode" :val="'123'" />
		</view>
	</van-dialog>
</template>

<script>
	import tkiBarcode from "@/components/tki-barcode/tki-barcode.vue"
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"

	export default {
		components: {
			tkiBarcode,
			tkiQrcode
		},
		props: {
			showMembershipCode: {
				type: Boolean,
				default: false
			}
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
				}]
			}
		},
		onLoad() {

		},
		methods: {
			onClose(){
				this.showMembershipCode = false
				this.$emit('update:showMembershipCode', this.showMembershipCode)
			}
		}
	}
</script>

<style>
	.membershipCode .image-div{
		text-align: center;
		padding-top: 50rpx;
		padding-left: 50rpx;
		padding-right: 50rpx;
	}
	
	.membershipCode .gradename{
		color: #FFFFFF;
		font-size:31rpx;
		position :absolute;
		z-index: 200;
		top:85rpx;
		left:95rpx;
	}
	
	.membershipCode .code{
		color: #FFFFFF;
		font-size: 22rpx;
		position :absolute;
		z-index: 200;
		top:295rpx;
		left:95rpx;
	}
	
	.membershipCode .icon-huiyuanka{
		color: #FFFFFF;
		font-size: 42rpx;
		position :absolute;
		z-index: 200;
		top:272rpx;
		right:95rpx;
	}
	
	.membershipCode .qrcode{
		margin-top: 15rpx;
		text-align: center;
		margin:0 auto;
		width:280upx;
	}
</style>
