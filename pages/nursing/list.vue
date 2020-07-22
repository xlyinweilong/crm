<template>
	<view class="nursing_list">
		<div class="content">
			<view v-for="ele in list" class="item">
				<van-row>
					<van-col span="8">
						<div style="width: 100%;text-align: center;">
							<image class="channelImage" :src="ele.firstImageUrl" />
						</div>
					</van-col>
					<van-col span="16">
						<div style="height: 50rpx;">
							<div class=".item_title_left">
								日期：{{ele.createDate}}
							</div>
							<div class="item_title_right" @click="showSheetInfo(ele)" hover-class="hover_item_title_right">
								<van-icon name="weapp-nav" />
							</div>
						</div>
						<div @click="showDetail(ele)" hover-class="hover_div">
							<p class="item_p">店铺：{{ele.channelAliasNameAndName}}</p>
							<p class="item_p">单号：{{ele.code}}</p>
							<p class="item_p">客服：{{ele.createEmployName}}</p>
							<p class="item_p">货品数量：{{ele.goodsList.length}}</p>
							<div v-if="(ele.status == 'FINISHED' || ele.status == 'SETTLED' || ele.status =='FINISHED_PROBLEM') && ele.evaluateStatus == 'UNEVALUATED'"
							 style="margin-top: 10rpx;"><span class="jinxingpingjia">进行评价</span></div>
							<div v-if="ele.evaluateStatus == 'EVALUATED'" style="margin-top: 10rpx;"><span class="jinxingpingjia">查看评价</span></div>
						</div>
					</van-col>
				</van-row>
			</view>
			<div v-show="!loading && !noMore" @click="more" style="margin-top: 20rpx;text-align: center;">
				<div>加载更多</div>
				<div class="iconfont icon-xiangxia"></div>
			</div>
			<div v-show="loading">
				<uni-load-more status="loading" />
			</div>
			<div v-show="noMore">
				<uni-load-more status="noMore" />
			</div>
		</div>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import uniLoadMore from "components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				activeTag: '',
				selected: {},
				list: [],
				loading: false,
				pageIndex: 0,
				noMore: false,
				status: '',
				evaluateStatus: ''
			}
		},
		props: {},
		onLoad(query) {},
		methods: {
			showDetail(ele) {
				if (ele.status == 'FINISHED' || ele.status == 'SETTLED' || ele.status == 'FINISHED_PROBLEM') {
					uni.navigateTo({
						url: '/pages/nursing/do_evaluate?id=' + ele.id
					})
				} else if (ele.status == 'EVALUATED') {

				} else {
					uni.navigateTo({
						url: '/pages/nursing/detail?id=' + ele.id
					})
				}
			},
			add() {
				uni.navigateTo({
					url: '/pages/employ/nursing/create_bill'
				})
			},
			getList(status, evaluateStatus) {
				this.pageIndex = 0
				this.list = []
				this.status = status
				this.evaluateStatus = evaluateStatus == null ? '' : evaluateStatus
				this.more()
			},
			more() {
				if (!this.loading) {
					this.loading = true
					this.pageIndex += 1
					this.$uniRequest.get('/api/small_procedures/nursing/list', {
						data: {
							customer: true,
							statusList: this.status,
							evaluateStatusList: this.evaluateStatus,
							pageIndex: this.pageIndex,
							pageSize: 10
						}
					}).then(res => {
						res.data.records.forEach(c => {
							if (this.list.find(l => l.id === c.id) == null) {
								this.list.push(c)
							}
						})
						this.noMore = this.list.length >= res.data.total
						uni.stopPullDownRefresh()
					}).finally(() => this.loading = false)
				}
			},
			showSheetInfo(ele) {
				this.$emit("show-sheet-action", ele)
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
	.nursing_list .channelImage {
		margin-top: 15rpx;
		width: 220rpx;
		height: 220rpx;
	}

	.nursing_list .content {
		padding-bottom: 150rpx;
	}

	.nursing_list .item {
		color: #675500;
		margin-bottom: 20rpx;
		padding: 10rpx;
		background-color: #FFFFFF;
		font-size: 24rpx;
	}

	.nursing_list .item_p {
		margin: 5rpx 20rpx 5rpx 0rpx;
	}

	.nursing_list .item_title_left {
		font-weight: 800;
		margin-top: 15rpx;
		float: left;
		font-size: 28rpx;
	}

	.nursing_list .item_title_right {
		margin-right: 20rpx;
		float: right;
		font-size: 45rpx;
		margin-top: 5rpx;
	}

	.nursing_list .hover_item_title_right {
		color: red
	}

	.nursing_list .jinxingpingjia {
		background-color: #AE0000;
		color: #FFFFFF;
		font-size: 24rpx;
		padding: 5rpx 15rpx 5rpx 15rpx;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
		border-bottom-left-radius: 16rpx;
	}

	.hover_div {
		color: red
	}
</style>
