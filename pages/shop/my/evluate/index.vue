<template>
	<view>
		<view>
			<div v-for="g in order.goodsList" style="margin-bottom: 10px;border-bottom: 1px solid #E4E7ED;background-color: #ffffff;padding-bottom: 24rpx;">
				<div class="goods_detail">
					<div @click="goToGoodsDetail(g)" style="width:250rpx;margin-top: 25rpx;">
						<image style="width: 250rpx; height: 250rpx; background-color: #eeeeee;" mode="aspectFit" :src="g.imageUrl" />
					</div>
					<!-- 右侧区域 -->
					<div style="font-size:26rpx;padding-top: 10px;color: #606266;width:400rpx;margin-left: 10rpx;">
						<!-- 第一层，名称和删除 -->
						<div @click="goToGoodsDetail(g)" style="font-size: 30rpx;margin-top: 18rpx;width:370rpx;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
							<b>{{g.goodsDisplayName}}</b>
						</div>
						<!-- 第三层，金额、数量 -->
						<div style="margin-top: 20rpx;font-size: 24rpx">
							<p>颜色：{{g.colorName}}、尺码：{{g.sizeName}}</p>
							<p>单价：￥{{g.price}}</p>
							<p>数量：{{g.quantity}}</p>
						</div>
						<div style="margin-top: 30rpx;">
							<uni-rate :disabled="order.status != 'PENDING_EVALUATE'" :value="g.rate" @change="changeRate($event,g)"></uni-rate>
						</div>
					</div>
				</div>
				<div>
					<textarea :disabled="order.status != 'PENDING_EVALUATE'" :value="g.evaluateText" @input="blurChange($event,g)" style="height: 160rpx;margin-left: 10rpx;width: 730rpx;border: 1px solid #DCDFE6;"
					 placeholder="请输入评价内容" />
					</div>
			</div>
			<div v-if="order.status == 'PENDING_EVALUATE'">
				<van-button @click="onEvaluate" size="large" color="#706000">
					确定
				</van-button>
			</div>
			<van-dialog id="van-dialog" confirm-button-color="#706000" />
			<van-toast id="van-toast" />
		</view>
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import Dialog from '@/wxcomponents/vant/dialog/dialog'
	import uniRate from '@/components/uni-rate/uni-rate.vue'

	export default {
		components: {
			uniRate
		},
		data() {
			return {
				id: '',
				order: {}
			}
		},
		computed: {},
		onLoad(query) {
			this.loadOrder(query.id)
		},
		onShow() {},
		methods: {
			loadOrder(id) {
				Toast.loading({
					duration: 0,
					mask: true,
					message: '加载中...'
				})
				this.$uniRequest.get('/api/small/shop/order/info', {
					data: {
						id: id
					}
				}).then(res => {
					this.order = res.data
				}).finally(e => Toast.clear())
			},
			changeRate(e,goods) {
				goods.rate = e.value
			},
			blurChange(e,goods){
				setTimeout(() => { goods.evaluateText = e.detail.value }, 0)
			},
			onEvaluate() {
				if(this.order.goodsList.some(e => e.rate == null)){
					Toast('请给评价分数')
					return
				}
				if(this.order.goodsList.some(e => e.evaluateText == null || e.evaluateText == '')){
					Toast('请输入评价内容')
					return
				}
				Toast.loading({
					duration: 0,
					mask: true,
					message: '加载中...'
				})
				let _this = this
				uni.request({
					url: _this.$baseURL + '/api/small/shop/order/evluate',
					data: this.order,
					method: 'POST',
					header: {
						'content-type': 'application/json',
						'X-Token': _this.$uniRequest.defaults.headers.common['X-Token'],
						'tn_id': _this.$tnId
					},
					success: (res) => {
						Toast('评价成功')
						Toast.clear()
						uni.navigateBack()
					}
				})
			},
			//跳转到商品明细
			goToGoodsDetail(e) {
				uni.navigateTo({
					url: '/pages/shop/goods/goods_detail?g=' + e.code
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #DCDFE6;
	}
</style>

<style scoped>
	.goods_detail {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 300rpx;
	}
	
	.goods_color {
		margin-top: 20rpx;
		padding-top: 15rpx;
		padding-bottom: 15rpx;
		padding-left: 10rpx;
		font-size: 22rpx;
	}
</style>
