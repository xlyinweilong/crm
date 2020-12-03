<template>
	<view>
		<div>
			<div v-if="ele.id != ''"  style="text-align: center;width: 750rpx;margin: auto;padding-bottom: 10px;padding-top: 20px;">
				<div style="font-size: 30rpx;">{{ele.title}}</div>
				<div v-if="ele.cardType == 'CASH'" style="margin-top: 28rpx;">
					<span style="font-size: 48rpx;">￥</span>
					<span style="font-size: 80rpx;font-weight:600;margin-left: 8rpx;">{{ele.reduceCost}}</span>
					<span style="font-size: 24rpx;margin-left: 8rpx;">
						{{ele.cardTypeMean}}
					</span>
				</div>
				<div v-if="ele.cardType == 'DISCOUNT'" style="margin-top: 28rpx;">
					<span style="font-size: 80rpx;font-weight:600;margin-left: 8rpx;">{{ele.discount}}</span>
					<span style="font-size: 24rpx;margin-left: 8rpx;">
						{{ele.cardTypeMean}}
					</span>
				</div>
				<div v-if="ele.cardType != 'DISCOUNT' && ele.cardType != 'CASH'" style="margin-top: 28rpx;">
					<span style="font-size: 24rpx;margin-left: 8rpx;">
						{{ele.cardTypeMean}}
					</span>
				</div>
				<div class="ticket_limit" v-if="ele.leastCost != null">满{{ele.leastCost}}元可用</div>
			</div>
			<van-cell-group>
				<van-cell v-if="ele.taskCount > 0" title="目标数量" :value="ele.taskCount" />
				<van-cell title="已领数量" :value="ele.receiveCount" />
				<van-cell title="核销数量" :value="ele.checkedCount" />
			</van-cell-group>
			<div class="tips">
				个人优惠券小程序二维码<br />
				长按可下载
			</div>
			<div class="qrcode">
				<image v-if="base64 != ''" show-menu-by-longpress mode="widthFix" style="width: 100%;" :src="base64" />
			</div>
		</div>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import uniLoadMore from "components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				ele: {
					id: '',
					title:''
				},
				base64: ''
			}
		},
		props: {},
		onLoad(query) {
			this.info(query.id)
		},
		methods: {
			info(id) {
				wx.showLoading({
					title: '加载中',
				})
				this.$uniRequest.get('/api/small_ticket/info', {
					data: {
						id: id
					}
				}).then(res => {
					this.ele = res.data
					this.base64 = res.data.base64
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #EBEEF5;
	}
</style>

<style>
	.ticket {
		margin: 3px 10px 0px 10px;
		border-top: 3px solid #DCDFE6;
		padding-top: 7px;
	}

	.ticket_limit {
		width: 700rpx;
		color: #666;
		margin: auto;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		height: 30rpx;
		line-height: 30rpx;
		font-size: 30rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tips {
		margin-top: 35rpx;
		font-size: 25rpx;
		text-align: center;
	}

	.qrcode {
		margin: 55rpx;
		text-align: center;
	}
</style>
