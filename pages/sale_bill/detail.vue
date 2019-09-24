<template>
	<view class="detail">
		<van-cell-group>
			<van-cell title="单号" :value="posCode" />
		</van-cell-group>
		<div>
			<van-cell-group v-for="ele in list">
				<van-cell title="货号" :value="ele.goodsCode" />
				<van-cell title="颜色" :value="ele.colorName" />
				<van-cell title="尺码" :value="ele.sizeName" />
				<van-cell title="数量" :value="ele.billCount" />
				<van-cell title="金额" :value="ele.billAmount" />
			</van-cell-group>
		</div>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'

	export default {
		components: {},
		data() {
			return {
				loading: false,
				list: [],
				posCode: ''
			}
		},
		onLoad(query) {
			if (query.posCode) {
				this.posCode = decodeURIComponent(query.posCode)
				this.info()
			}
		},
		methods: {
			info() {
				Toast('我是提示文案，建议不超过十五字~');
				Toast.loading({
					mask: true,
					message: '加载中...'
				})
				this.$uniRequest.get('/api/small_procedures/vip/my_sale_detail', {
					data: {
						posCode: this.posCode
					}
				}).then(res => {
					this.list = res.data
				}).finally(() => Toast.clear())
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
	.title {
		font-weight: 800;
		margin-left: 10rpx;
		font-size: 32rpx;
		color: #706000;
	}

	.content {
		color: #909399;
		margin: 15rpx 30rpx 0rpx 30rpx;
		border-bottom: 2px solid #706000;
	}

	.sub_content {
		font-size: 28rpx;
		margin-top: 5rpx;
		margin-bottom: 10rpx;
		background-color: #F2F6FC;
		padding: 15rpx;
	}
</style>
