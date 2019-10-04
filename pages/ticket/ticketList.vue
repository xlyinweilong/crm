<template>
	<div class="ticket">
		<div class="tabs_content">
			<view v-for="ele in list">
				<div class="ticket_card">
					<i-row span="22">
						<i-col span="8">
							<div class="tab_td" style="margin-top: 10rpx;border-right: 3px solid #c11920;">
								<span style="font-size:90rpx;padding-top: 10rpx;padding-bottom: 15rpx;" :style="type == 2 ? 'color:#909399': 'color:#c11920'">
									<span class="price">{{ele.name}}</span>
									<span class="iconfont icon-juan" style="vertical-align: text-top;font-size:30rpx;padding-top: 10rpx;"></span>
								</span>
							</div>
						</i-col>
						<i-col span="11">
							<div class="tab_td ticket_title" :style="type == 2 ? 'color:#909399': 'color:#c11920'">
								<div style="font-size: 36rpx;">{{ele.title}}</div>
								<div style="font-size: 24rpx">
									<span style="border-bottom: 1px dashed #73411e;">优惠码:{{ele.userCardCode}}</span>
								</div>
								<div style="font-size: 22rpx;">{{ele.startDate}}-{{ele.endDate}}</div>
							</div>
						</i-col>
						<i-col span="5">
							<div style="text-align: right;">
								<span v-if="type == 0" @click="useThis(ele)" class="lijishiyong">立即使用</span>
								<span v-if="type == 1" class="lijishiyong" style="background-color: #909399;">已使用</span>
								<span v-if="type == 2" class="lijishiyong" style="background-color: #909399;">已失效</span>
								<div @click="showInfo(ele)" style="margin-top: 65rpx;">
									<span v-show="!ele.show" class="iconfont icon-xiangxia" style="font-size:35rpx;color: #741419;"></span>
									<span v-show="ele.show" class="iconfont icon-xiangshang" style="font-size:35rpx;color: #741419;"></span>

								</div>
							</div>
						</i-col>
					</i-row>
					<div v-show="ele.show" style="border-top: 2px solid #DCDFE6;margin-top: 5rpx;padding-top: 10rpx;">
						<div v-show="!loadingInfo">
							<span class="shiyongxize" style="font-size:26rpx;background-color: #c11920;padding:5rpx;color:#ffffff;">使用细则</span>
							<p>{{ele.cardInfo.description}}</P>
						</div>
						<div v-show="loadingInfo" style="text-align: center;">
							<van-loading color="#741419" />
						</div>
					</div>
				</div>
			</view>
			<div v-show="!loading && !noMore" @click="more" style="margin-top: 20rpx;">
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
				list: [],
				loading: false,
				pageIndex: 0,
				noMore: false,
				loadingInfo: false
			}
		},
		props: {
			type: {
				default: 0
			}
		},
		onLoad() {
			wx.loadFontFace({
				family: 'msyh',
				source: 'url("https://crm.wisdomyy.com/长城长宋体.TTF")',
				success: console.log
			})
		},
		methods: {
			useThis(ele) {
				wx.openCard({
					cardList: [{
						cardId: ele.cardId,
						code: ele.userCardCode
					}],
					success(res) {
						console.log(res)
					}
				})
			},
			showInfo(ele) {
				ele.show = !ele.show
				this.loadingInfo = true
				this.$uniRequest.get('/api/small_ticket/ticket_info', {
					data: {
						cardId: ele.cardId,
					}
				}).then(res => {
					ele.cardInfo = res.data
				}).finally(error => this.loadingInfo = false)
			},
			getList() {
				this.pageIndex = 0
				this.list = []
				this.more()
			},
			more() {
				if (!this.loading) {
					this.loading = true
					this.pageIndex += 1
					this.$uniRequest.get('/api/small_ticket/my_ticket_list', {
						data: {
							pageIndex: this.pageIndex,
							pageSize: 10,
							status: this.type
						}
					}).then(res => {
						res.data.content.forEach(c => {
							if (this.list.find(l => l.id === c.id) == null) {
								c.show = false
								this.list.push(c)
							}
						})
						this.noMore = this.list.length >= res.data.totalElements
					}).finally(error => this.loading = false)
				}
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}

	@font-face {
		font-family: 'AvantGarde';
		src: url('../../static/font/Avant Garde Book BT.ttf') format('truetype');
	}

	/* 	@font-face {
		font-family: 'msyh';
		src: url('https://crm.wisdomyy.com/长城长宋体.TTF') format('truetype');
	} */
</style>

<style>
	.price {
		font-style: normal;
		font-family: 'AvantGarde';
		font-weight: 800;
		font-size: 100rpx;
	}

	.ticket {
		margin: 3px 10px 0px 10px;
		border-top: 3px solid #DCDFE6;
		padding-top: 7px;
		font-family: 'msyh';
	}

	.ticket .tabs_content {}

	.ticket .ticket_card {
		padding: 10rpx 10rpx 10rpx 10rpx;
		/* border: 2px solid #73411e; */
		border: 2px solid #967056;
		margin-bottom: 15rpx;
	}

	.ticket .tab_td {
		/* height: 100rpx; */
		text-align: center;
		align-items: center;
		justify-content: center;
	}

	.ticket .ticket_title {
		margin-top: 18rpx;
		margin-left: 10rpx;
		text-align: left;
		color: #73411e;
		font-family: 'msyh';
	}

	.ticket .lijishiyong {
		background-color: #741419;
		color: #FFFFFF;
		font-size: 26rpx;
		padding: 5rpx 10rpx 5rpx 10rpx;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
		border-bottom-left-radius: 16rpx;
	}

	.go180 {
		transform: rotate(180deg);
		-ms-transform: rotate(180deg);
		-moz-transform: rotate(180deg);
		-o-transform: rotate(180deg);
	}
</style>
