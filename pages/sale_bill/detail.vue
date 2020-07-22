<template>
	<view class="detail">
		<van-cell-group>
			<van-cell v-if="evaluateStatus != 'unevaluated'" title="单号" :value="posCode" />
			<van-cell v-if="evaluateStatus == 'unevaluated'" @click="goToPage" :value="posCode" is-link title-width="220rpx">
				<view slot="title">
					<span class="van-cell-text">单号</span>
					<van-tag type="danger">点击去评价</van-tag>
				</view>
			</van-cell>
		</van-cell-group>
		<van-cell-group>
			<div class="barcode">
				<tki-barcode ref="barcode" :val="posCode" />
			</div>
		</van-cell-group>
		<div>
			<van-cell-group v-for="ele in list">
				<van-cell title="货号" :value="ele.goodsCode" />
				<van-cell title="货品" :value="ele.goodsName" />
				<van-cell title="颜色" :value="ele.goodsColorName" />
				<van-cell title="尺码" :value="ele.goodsSizeName" />
				<van-cell title="数量" :value="ele.quantity" />
				<van-cell title="金额" :value="ele.amount" />
			</van-cell-group>
		</div>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import tkiBarcode from "@/components/tki-barcode/tki-barcode.vue"
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"

	export default {
		components: {
			tkiBarcode,
			tkiQrcode
		},
		data() {
			return {
				loading: false,
				list: [],
				posCode: '',
				evaluateStatus: '',
				ele: {}
			}
		},
		onLoad(query) {
			if (query.posCode) {
				this.posCode = decodeURIComponent(query.posCode)
				this.info()
			}
		},
		methods: {
			goToPage() {
				uni.navigateTo({
					url: '/pages/evaluate/do_evaluate?posCode=' + this.posCode
				})
			},
			info() {
				Toast.loading({
					mask: true,
					message: '加载中...'
				})
				this.$uniRequest.get('/api/small_procedures/vip/my_sale_detail', {
					data: {
						posCode: this.posCode
					}
				}).then(res => {
					this.ele = res.data
					this.list = res.data.goodsList
					if (this.list.length > 0) {
						this.evaluateStatus = this.list[0].evaluateStatus
					}
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
	.barcode {
		text-align: center;
		margin-top: 5rpx;
		margin-bottom: 5rpx;
	}

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
