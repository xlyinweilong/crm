<template>
	<div class="ticket">
		<div class="tabs_content">
			<view v-for="ele in list">
				<div @click="useThis(ele)" class="ticketDiv" hover-class="user-info-hover">
					<div style="position:relative">
						<div class="quanchangjuan">{{ele.title}}</div>
						<div class="jiage">
							{{ele.name}}
							<span v-if="ele.type == 'CASH'" style="font-size: 32rpx;margin-left: 5rpx;">元</span>
							<span v-if="ele.type == 'DISCOUNT'" style="font-size: 32rpx;margin-left: 5rpx;">折</span>
						</div>
						<div class="youhuima">优惠码: {{ele.userCardCode}}</div>
						<div v-if="ele.ticketType == null || ele.ticketType == 'FULL_COURT'" class="youxiaoqi" style="color:#ff807b">有效期至: {{ele.endDate}}</div>
						<div v-if="ele.ticketType == 'CATEGORY'" class="youxiaoqi" style="color:#9186ff">有效期至: {{ele.endDate}}</div>
					</div>
					<image :class="{'used': type == 2}" v-if="ele.ticketType == null || ele.ticketType == 'FULL_COURT'" style="width: 100%;" class="image" mode="widthFix" src="../../static/images/ticket/quanchangquan.png" />
					<image :class="{'used': type == 2}" v-if="ele.ticketType == 'CATEGORY'" style="width: 100%;" class="image" mode="widthFix" src="../../static/images/ticket/pinleiquan.png" />
				</div>
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
				if (this.type == 0) {
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
		text-align: center;
		display: table-cell;
		vertical-align: middle
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
	
	.ticket .ticketDiv {
		color: #FFFFFF;
	}

	.ticket .user-info-hover {
		color: #C80000;
		/* background: #000000; */
		/* font-weight: bold; */
	}

	.ticket .quanchangjuan {
		z-index: 100;
		/* color:#FFFFFF; */
		font-size: 50rpx;
		position: absolute;
		top: 35rpx;
		left: 40rpx;
	}

	.ticket .jiage {
		font-family: 'AvantGarde';
		z-index: 101;
		letter-spacing: 4rpx;
		color:#FFFFFF;
		font-size: 68rpx;
		position: absolute;
		top: 55rpx;
		right: 30rpx;
	}

	.ticket .youhuima {
		width: 100%;
		z-index: 103;
		letter-spacing: 0rpx;
		color:#FFFFFF;
		font-size: 28rpx;
		position: absolute;
		top: 240rpx;
		left: 10rpx;
		right: 10rpx;
		text-align: center;
	}

	.ticket .youxiaoqi {
		background-color: #FFFFFF;
		padding: 5rpx;
		font-size: 28rpx;
		position: absolute;
		z-index: 102;
		top: 122rpx;
		left: 56rpx;
	}

	.ticket .image {
		
	}
	
	.ticket .used{
		background: #FFFFFF;
		filter: alpha(Opacity=70);
		-moz-opacity: 0.7;
		opacity: 0.7;
	}
</style>
