<template>
	<van-dialog use-slot :show="showMembershipCode" @close="onClose" :showConfirmButton="false" :closeOnClickOverlay="true">
		<view class="membershipCode">
			<div class="image-div">
				<image mode="widthFix" src="../../static/images/ticket_bg.png" />
			</div>
			<div class="gradename">
				VIP银卡会员
			</div>
			<div class="code">
				NO.<span>ZK890370</span>
			</div>
			<span class="iconfont icon-huiyuanka"></span>
			<div v-show="showImage" class="qrcode">
				<tki-qrcode ref="qrcode" :val="'123'" />
			</div>
			<div v-show="showImage" class="barcode">
				<tki-barcode ref="barcode" :val="'1234567890'" />
			</div>
			<div class="info">
				使用时请出示给店员
			</div>
			<div class="hr">
				<hr />
			</div>
			<div class="close" @click="onClose">
				关闭
			</div>
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
				showImage: false
			}
		},
		onLoad() {

		},
		methods: {
			onClose() {
				this.showImage = false
				this.$emit('update:showMembershipCode', false)
			}
		},
		watch: {
			showMembershipCode: function(n, o) {
				if (n) {
					this.$nextTick(() => setTimeout(() => this.showImage = true, 400))
				}
			}
		}
	}
</script>

<style>
	.membershipCode .image-div {
		text-align: center;
		padding-top: 50rpx;
		padding-left: 50rpx;
		padding-right: 50rpx;
	}

	.membershipCode .gradename {
		color: #FFFFFF;
		font-size: 31rpx;
		position: absolute;
		z-index: 200;
		top: 85rpx;
		left: 95rpx;
	}

	.membershipCode .code {
		color: #FFFFFF;
		font-size: 22rpx;
		position: absolute;
		z-index: 200;
		top: 295rpx;
		left: 95rpx;
	}

	.membershipCode .icon-huiyuanka {
		color: #FFFFFF;
		font-size: 42rpx;
		position: absolute;
		z-index: 200;
		top: 272rpx;
		right: 95rpx;
	}

	.membershipCode .qrcode {
		padding-top: 25rpx;
		text-align: center;
		margin: 0 auto;
		width: 250upx;
	}

	.membershipCode .barcode {
		padding-top: 25rpx;
		text-align: center;
		margin: 0 auto;
	}

	.membershipCode .info {
		padding-top: 35rpx;
		color: #000000;
		text-align: center;
		font-size: 20rpx;
		font-weight: bold;
	}

	.membershipCode .hr {
		padding-top: 20rpx;
		padding-bottom: 23rpx;
		padding-left: 45rpx;
		padding-right: 45rpx;
	}

	.membershipCode hr {
		height: 1px;
		border: none;
		border-top: 1px solid #000000;
	}

	.membershipCode .close {
		text-align: center;
		font-size: 30rpx;
		font-weight: bold;
		color: #BF0000;
		padding-bottom: 28rpx;
	}
</style>
