<template>
	<view class="nursing_add">
		<div class="content">
			<van-cell-group title="服务店铺">
				<van-cell title="选择店铺" required :value="form.selectedChannelName" is-link @click="openSelectChannel" />
			</van-cell-group>
		</div>
		<div style="position:fixed;bottom: 0;text-align: center;width: 100%;">
			<van-button @click="scanCode" type="primary" :disabled="form.selectedChannelId == ''" size="large">扫客户二维码</van-button>
		</div>
		<channelSelect ref="channelSelect" :selectedChannelId.sync="form.selectedChannelId" :selectedChannelName.sync="form.selectedChannelName" />
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import channelSelect from './channelSelect'
	import Toast from '@/wxcomponents/vant/toast/toast'

	export default {
		components: {
			channelSelect
		},
		data() {
			return {
				form: {
					selectedChannelId: '',
					selectedChannelName: ''
				}
			}
		},
		onLoad() {
			let cacheEmployChannel = wx.getStorageSync('cache.employChannel')
			if (cacheEmployChannel != null) {
				this.form.selectedChannelId = cacheEmployChannel.id
				this.form.selectedChannelName = cacheEmployChannel.name
			}
		},
		methods: {
			openSelectChannel(){
				this.$refs.channelSelect.onOpen()
			},
			scanCode(ele) {
				let _this = this
				wx.scanCode({
					success(res) {
						Toast.loading('加载中...')
						_this.$uniRequest.post('/api/small_procedures/nursing/create_bill', {
							channelId: _this.form.selectedChannelId,
							customerQrCode: res.result
						}).then(res => {
							//记录用户余额
							uni.redirectTo({
								url: '/pages/employ/nursing/add?billId=' + res.data.id + '&balance=' + res.data.userBalance
							})
						}).finally(() => Toast.clear())
					},
					error(e) {
						Toast.fail(e)
					}
				})
			}
		}
	}
</script>

<style>
	page {}
</style>

<style scoped>
	.form-first-bottom {
		margin-left: 30rpx;
		margin-right: 20rpx;
		margin-top: 0rpx;
		padding-bottom: 10rpx;
		width: clac(100% - 50rpx);
		display: flex;
		flex-wrap: wrap;
		padding-top: 20rpx;
	}

	.add-container {
		width: calc(34% - 18rpx);
		height: 220rpx;
		text-align: center;
		line-height: 200rpx;
		padding-top: 13rpx;
		padding-right: 13rpx;
	}

	.form-first-bottom>.add-container:nth-of-type(3n) {
		/* 选择个数是3的倍数的元素 */
		padding-right: 0;
	}

	.selectclass1 {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.selectclass {
		width: 100%;
		height: 100%;
		font-size: 100rpx;
		background-color: #E4E7ED;
		text-align: center;
		vertical-align: middle;
		padding: 0;
	}

	.content {
		padding-bottom: 150rpx;
	}

	.close {
		border-radius: 15rpx;
		box-shadow: 0 0 0 3rpx #fff;
		min-width: 30rpx;
		line-height: 30rpx;
		font-style: normal;
		background-color: #fff;
		color: #969799;
		font-size: 30rpx;
		position: absolute;
		top: -335rpx;
		right: -15rpx;
		padding: 0 3rpx;
	}
</style>
