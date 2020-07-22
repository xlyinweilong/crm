<template>
	<div class="tabs_content">
		<view v-for="ele in list" :key="ele.id">
			<div style="margin-top: 14px;">
				<div class="ticket" :class="{'used': type == 2}" @click="useThis(ele)" hover-class="user-info-hover">
					<div style="width: 400rpx;height: 300rpx;">
						<div style="color: #74d2d4;margin-left: 20rpx;margin-top: 34rpx;">
							<div v-if="ele.type == 'CASH'">
								<span style="font-size: 48rpx;">￥</span>
								<span style="font-size: 80rpx;font-weight:600;margin-left: 8rpx;">{{ele.amount}}</span>
								<span style="font-size: 24rpx;margin-left: 8rpx;">
									代金卷
								</span>
							</div>
							<div v-if="ele.type == 'DISCOUNT'">
								<span style="font-size: 80rpx;font-weight:600;margin-left: 8rpx;">{{ele.discountMean}}</span>
								<span style="font-size: 24rpx;margin-left: 8rpx;">
									折
								</span>
							</div>
						</div>
						<div class="ticket_limit">{{ele.title}}</div>
						<div class="ticket_info">
							有效期至: {{ele.endDate}}
						</div>
						<div class="ticket_info"><span>{{ele.usePlatformMean}}</span><span v-if="ele.onShelfTypeMean != null" style="margin-left: 14rpx;">{{ele.onShelfTypeMean}}</span></div>
					</div>
					<div style="background-color: #74d2d4;width: 300rpx;height: 300rpx;text-align: center;">
						<div style="margin-top:120rpx;color: #fff;" v-if="type == 0">立即使用</div>
						<div style="margin-top:120rpx;color: #fff;" v-if="type == 1">已经使用</div>
						<div style="margin-top:120rpx;color: #fff;" v-if="type == 2">已失效</div>
					</div>
				</div>
			</div>
		</view>
		<uni-load-more :status="status"></uni-load-more>
	</div>
</template>

<script>
	import uniLoadMore from "components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				loadingInfo: false
			}
		},
		props: {
			type: {
				default: 0
			},
			list: {
				default: []
			},
			status: {
				default: 'loading'
			}
		},
		onLoad() {
			wx.loadFontFace({
				family: 'msyh',
				source: 'url("https://erp.wisdomyy.com/长城长宋体.TTF")',
			})
		},
		methods: {
			useThis(ele) {
				if (this.type == 0) {
					if (ele.usePlatform == 'MARKET') {
						if (ele.ticketType == 'WE_CHAT') {
							wx.openCard({
								cardList: [{
									cardId: ele.cardId,
									code: ele.userCardCode
								}],
								success(res) {
									console.log(res)
								}
							})
						}
					} else {
						//跳转到对应的商品
						if (ele.onShelfType == 'FULL_COURT') {
							uni.navigateTo({
								url: '/pages/shop/goods/goods_list'
							})
						} else {
							uni.navigateTo({
								url: '/pages/shop/goods/goods_list?t=' + ele.ticketId
							})
						}
					}

				}
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>

<style>
	.ticket {
		display: flex;
		width: 700rpx;
		margin: auto;
		height: 300rpx;
		border: 1px solid #f1f1f1;
		background: #fff;
		font-family: "Microsoft YaHei";
	}

	.ticket_limit {
		width: 180px;
		color: #666;
		margin-top: 20rpx;
		height: 30rpx;
		line-height: 30rpx;
		margin-left: 20rpx;
		font-size: 30rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.ticket_info {
		white-space: nowrap;
		margin-top: 20rpx;
		text-overflow: ellipsis;
		overflow: hidden;
		width: 180px;
		height: 26rpx;
		margin-left: 20rpx;
		line-height: 26rpx;
		font-size: 26rpx;
		color: #999;
		argin-left: 20rpx;
		cursor: default;
	}

	.used {
		background: #c3c3c3;
		/* filter: alpha(Opacity=70);
		-moz-opacity: 0.7;
		opacity: 0.7; */
	}

	.user-info-hover {
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
</style>
