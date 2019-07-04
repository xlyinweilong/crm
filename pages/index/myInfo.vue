<template>
	<van-dialog use-slot :show="showMyInfo" @close="onClose" :showConfirmButton="false" :closeOnClickOverlay="true">
		<view class="myInfo">
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
			<div class="user-img-div">
				<div class="user-img">
					<image class="user-img-image" src="../../static/images/user.png" />
				</div>
			</div>
			<div class="user-center">
				<div class="user-name">Hi,大隆</div>
			</div>
			<div v-show="showImage" class="barcode">
				<tki-barcode ref="barcode" :val="'1234567890'" />
			</div>
			<div class="hr">
				<hr />
			</div>
			<div class="close" @click="save">
				确定
			</div>
		</view>
	</van-dialog>
</template>

<script>
	export default {
		components: {},
		props: {
			showMyInfo: {
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
				this.$emit('update:showMyInfo', false)
			},
			save() {
				this.onClose()
			}
		}
	}
</script>

<style>
	.myInfo .image-div {
		text-align: center;
		padding-top: 50rpx;
		padding-left: 50rpx;
		padding-right: 50rpx;
	}

	.myInfo .gradename {
		color: #FFFFFF;
		font-size: 31rpx;
		position: absolute;
		z-index: 200;
		top: 85rpx;
		left: 95rpx;
	}

	.myInfo .code {
		color: #FFFFFF;
		font-size: 22rpx;
		position: absolute;
		z-index: 200;
		top: 295rpx;
		left: 95rpx;
	}


	.myInfo .icon-huiyuanka {
		color: #FFFFFF;
		font-size: 42rpx;
		position: absolute;
		z-index: 200;
		top: 272rpx;
		right: 95rpx;
	}
	
	.myInfo .user-img-div{
		position:absolute;
		text-align: center;
	}

	.myInfo .user-img {
		background-color:green;
		position:relative;
		margin: 0 auto;
		width: 105rpx;
		height: 105rpx;
		border-radius: 100%;
		overflow: hidden;
		border: 2rpx solid rgba(255, 255, 255, 0.7);
		margin-right: 0.5rem;
	}
	
	.myInfo .user-img .user-img-image{
		width: 105rpx;
		height: 105rpx;
	}

	.myInfo .hr {
		padding-top: 20rpx;
		padding-bottom: 23rpx;
		padding-left: 45rpx;
		padding-right: 45rpx;
	}

	.myInfo hr {
		height: 1px;
		border: none;
		border-top: 1px solid #000000;
	}

	.myInfo .close {
		text-align: center;
		font-size: 30rpx;
		font-weight: bold;
		color: #BF0000;
		padding-bottom: 28rpx;
	}
</style>
