<template>
	<view class="ticket">
		<div class="tabs_content">
			<view v-for="ele in list">
				<div @click="clickTicket(ele)" class="ticketDiv" hover-class="user-info-hover">
					<div style="position:relative">
						<div class="quanchangjuan">{{ele.title}}</div>
						<div class="jiage">
							{{ele.name}}
							<span v-if="ele.cardType == 'CASH'" style="font-size: 32rpx;margin-left: 5rpx;">元</span>
							<span v-if="ele.cardType == 'DISCOUNT'" style="font-size: 32rpx;margin-left: 5rpx;">折</span>
						</div>
						<div class="youhuima">
							<span :class="{'disabledSpan' : ele.canGot == false}">{{ele.gotStr}}</span>
						</div>
						<div class="youxiaoqi" :style="{'color:#ff807b': ele.onShelfType == null || ele.onShelfType == 'FULL_COURT','color:#9186ff':ele.onShelfType == 'CATEGORY'}">
							<div v-if="ele.dateInfoType == 'DATE_TYPE_FIX_TIME_RANGE'">
								<div>启用:{{ele.startTime}}</div>
								<div>失效:{{ele.endTime}}</div>
							</div>
							<div v-if="ele.dateInfoType == 'DATE_TYPE_FIX_TERM'">
								领取后<span v-if="ele.fixedBeginTerm">{{ele.fixedBeginTerm}}天生效</span>{{ele.fixedTerm}}天失效
								<div v-if="ele.fixedEndTime != null">{{ele.fixedEndTime}} 统一失效</div>
							</div>
						</div>
					</div>
					<image :class="{'used': type == 2}" v-if="ele.onShelfType == null || ele.onShelfType == 'FULL_COURT'" style="width: 100%;"
					 class="image" mode="widthFix" src="../../../static/images/ticket/quanchangquan.png" />
					<image :class="{'used': type == 2}" v-if="ele.onShelfType == 'CATEGORY'" style="width: 100%;" class="image" mode="widthFix"
					 src="../../../static/images/ticket/pinleiquan.png" />
					<p style="color: #000000;margin-bottom: 10rpx;">{{ele.description}}</p>
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
				list: [],
				loading: false,
				pageIndex: 0,
				noMore: false,
				loadingPage: false
			}
		},
		onLoad(query) {
			this.getList()
		},
		onPullDownRefresh() {
			this.getList()
		},
		onShareAppMessage(options) {
			var that = this;
			// 设置菜单中的转发按钮触发转发事件时的转发内容
			let user = wx.getStorageSync('token')
			var shareObj = {
				// title: "我的优惠分你一半", // 默认是小程序的名称(可以写slogan等)
				path: '/pages/login/index?scene=share,ticket_shelf_list,' + user.id, // 默认是当前页面，必须是以‘/’开头的完整路径
				imageUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
				success(res) {
					// 转发成功之后的回调
					if (res.errMsg == 'shareAppMessage:ok') {}
				},
				fail() {
					// 转发失败之后的回调
					if (res.errMsg == 'shareAppMessage:fail cancel') {
						// 用户取消转发
					} else if (res.errMsg == 'shareAppMessage:fail') {
						// 转发失败，其中 detail message 为详细失败信息
					}
				},
				complete() {
					// 转发结束之后的回调（转发成不成功都会执行）
				}
			}
			// 来自页面内的按钮的转发
			if (options.from == 'button') {
				var eData = options.target.dataset;
				console.log(eData.name); // shareBtn
				// 此处可以修改 shareObj 中的内容
				shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
			}
			// 返回shareObj
			return shareObj
		},
		methods: {
			clickTicket(ele) {
				if (ele.canGot) {
					if (ele.needPay) {
						this.isPayed(ele)
					} else {
						this.useThis(ele)
					}
				}
			},
			useThis(ele, type) {
				if (type == null) {
					type = "SHELF"
				}
				let user = wx.getStorageSync('token')
				this.loadingPage = true
				this.$uniRequest.get('/api/small_ticket_shelf/getCardSign', {
					data: {
						id: ele.id,
						cardId: ele.cardId
					}
				}).then(res => {
					wx.addCard({
						cardList: [{
							cardId: ele.cardId,
							cardExt: '{"nonce_str": "' + res.data.nonceStr + '","code": "", "outer_str":"' + type +
								'","openid": "", "timestamp": "' + res.data.timestamp +
								'", "signature":"' + res.data.signature + '"}'
						}],
						success(res) {
							console.log(res)
						}
					})
				}).finally(error => this.loadingPage = false)
			},
			isPayed(ele) {
				if(!this.loadingPage){
					let user = wx.getStorageSync('token')
					let _this = this
					this.loadingPage = true
					this.$uniRequest.post('/api/small_procedures/pay/has_payed_order', {
						id: ele.id
					}).then(res => {
						if (res.data) {
							_this.useThis(ele, "PAYED")
						} else {
							_this.zhifu(ele)
						}
					}).finally(() => this.loadingPage = false)
				}
			},
			zhifu(ele) {
				let user = wx.getStorageSync('token')
				let _this = this
				this.loadingPage = true
				this.$uniRequest.post('/api/small_procedures/pay/create_order', {
					id: ele.id
				}).then(res => {
					wx.requestPayment({
						timeStamp: res.data.timeStamp + '',
						nonceStr: res.data.nonceStr,
						package: res.data.package,
						signType: 'MD5',
						paySign: res.data.paySign,
						success(res) {
							console.log("支付成功")
							//支付成功后直接跳转
							_this.useThis(ele, "PAYED")
						},
						fail(res) {
							console.log("支付失败")
						}
					})
				}).finally(error => this.loadingPage = false)
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
					this.$uniRequest.get('/api/small_ticket_shelf/list', {
						data: {
							pageIndex: this.pageIndex,
							pageSize: 10
						}
					}).then(res => {
						res.data.content.forEach(c => {
							if (this.list.find(l => l.id === c.id) == null) {
								c.show = false
								this.list.push(c)
							}
						})
						this.noMore = this.list.length >= res.data.totalElements
						uni.stopPullDownRefresh()
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
</style>

<style scoped>
	.disabledSpan {
		color: #909399
	}

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

	.user-info-hover {
		color: #C80000;
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
		color: #FFFFFF;
		font-size: 68rpx;
		position: absolute;
		top: 55rpx;
		right: 30rpx;
	}

	.ticket .youhuima {
		width: 100%;
		z-index: 103;
		letter-spacing: 0rpx;
		color: #FFFFFF;
		font-size: 28rpx;
		position: absolute;
		top: 240rpx;
		left: 10rpx;
		right: 10rpx;
		text-align: center;
	}

	.ticket .youxiaoqi {
		font-size: 28rpx;
		position: absolute;
		z-index: 102;
		top: 122rpx;
		left: 56rpx;
	}

	.ticket .image {}

	.ticket .used {
		background: #FFFFFF;
		filter: alpha(Opacity=70);
		-moz-opacity: 0.7;
		opacity: 0.7;
	}
</style>
