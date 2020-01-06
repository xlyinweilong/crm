<template>
	<view>
		<view style="margin-left: 30rpx;margin-right: 30rpx;">
			<van-divider />
			<p style="margin-top: 30rpx;margin-bottom: 10rpx;">客户付费用，取走商品。</p>
			<van-button type="primary" size="large" @click="submit('FINISHED',false)">确认取走</van-button>
			<van-divider />
			<!-- <van-cell-group>
				<van-field label="客户承担费用" :value="amount" placeholder="费用" border="false" @change="onChange" />
			</van-cell-group> -->
			<p style="margin-top: 30rpx;margin-bottom: 10rpx;">客户对商品有争议，费用由店铺承担。</p>
			<van-button plain type="warning" size="large" @click="confirm('确定费用由店铺承担?','FINISHED')">客户免费，店铺承担费用</van-button>
			<van-divider />
			<p style="margin-top: 30rpx;margin-bottom: 10rpx;">客户对商品有争议，经过协商，费用由洗衣坊承担。</p>
			<van-button plain type="warning" size="large" @click="confirm('确定费用由洗衣坊承担?','NO_SETTLE_PENDING')">客户免费，洗衣坊承担费用</van-button>
		</view>
		<van-dialog id="van-dialog" />
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import Dialog from '@/wxcomponents/vant/dialog/dialog'

	export default {
		components: {},
		data() {
			return {
				qrCode: '',
				amount: 0
			}
		},
		onLoad(query) {
			this.qrCode = query.qrCode
			if (query.qrCode) {
				this.qrCode = decodeURIComponent(query.qrCode)
			}
		},
		methods: {
			submit(status, isFree) {
				Toast.loading('加载中...')
				this.$uniRequest.post('/api/small_procedures/nursing/finish_bill', {
					qrCode: this.qrCode,
					status: status,
					isFree: isFree
				}).then(res => {
					Toast.clear()
					Toast.success('操作成功')
					uni.navigateBack({
						delta: 1
					})
				}).catch(() => Toast.clear())
			},
			confirm(title, status) {
				Dialog.confirm({
					title: '确定',
					message: title
				}).then(() => {
					this.submit(status, true)
				}).catch(() => {})
			}
		}
	}
</script>

<style>
	page {}
</style>

<style scoped>
</style>
