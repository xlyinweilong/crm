<template>
	<view>
		<div class="tips">扫描下方二维即可注册/登录小程序</div>
		<div class="qrcode">
			<image v-if="base64 != ''" mode="widthFix" style="width: 100%;" :src="base64" />
			<!-- <button style="margin-top: 35rpx;" type="primary" @click="download">下载图片</button>
			<button style="margin-top: 25rpx;" open-type="openSetting">打开授权设置页</button> -->
		</div>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				base64: ''
			}
		},
		onLoad() {
			this.loadMyQrCode()
		},
		methods: {
			loadMyQrCode() {
				wx.showLoading({
					title: '加载中',
				})
				this.$uniRequest.get('/api/small_procedures/employ/load_my_qr_code').then(res => {
					this.base64 = res.data
				})
			},
			download() {
				let _this = this
				wx.getSetting({
					success(res) {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							wx.authorize({
								scope: 'scope.writePhotosAlbum',
								success() {
									_this.saveImageToPhotosAlbum()
								},
								fail(){
									wx.showToast({
									  title: '请打开打开授权设置页授权“保存到相册”',
									  icon:'none'
									})
								}
							})
						} else {
							_this.saveImageToPhotosAlbum()
						}
					}
				})
			},
			saveImageToPhotosAlbum() {
				let _this = this
				wx.saveImageToPhotosAlbum({
					filePath:_this.base64,
					success(res) {
						console.log("*************111")
						console.log(res)
					},
					fail(res){
						console.log("*************222")
						console.log(res)
					}
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
	.tips {
		margin-top: 35rpx;
		font-size: 35rpx;
		text-align: center;
	}

	.qrcode {
		margin: 55rpx;
		text-align: center;
	}
</style>
