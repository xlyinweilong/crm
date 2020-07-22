<template>
	<view>
		<div class="tabs_content">
			<van-dropdown-menu active-color="#74d2d4">
				<van-dropdown-item @change="changeOption1" :value="listQuery.usePlatform" :options="option1" />
			</van-dropdown-menu>
			<view v-for="ele in list" :key="ele.id">
				<div style="margin-top: 14px;">
					<div class="ticket" @click="clickTicket(ele)" hover-class="user-info-hover">
						<div style="width: 400rpx;height: 300rpx;">
							<div style="color: #74d2d4;margin-left: 20rpx;margin-top: 34rpx;">
								<div v-if="ele.cardType == 'CASH'">
									<span style="font-size: 48rpx;">￥</span>
									<span style="font-size: 80rpx;font-weight:600;margin-left: 8rpx;">{{ele.reduceCost}}</span>
									<span style="font-size: 24rpx;margin-left: 8rpx;">
										代金卷
									</span>
								</div>
								<div v-if="ele.cardType == 'DISCOUNT'">
									<span style="font-size: 80rpx;font-weight:600;margin-left: 8rpx;">{{ele.discountMean}}</span>
									<span style="font-size: 24rpx;margin-left: 8rpx;">
										折
									</span>
								</div>
							</div>
							<div class="ticket_limit" v-if="ele.leastCost != null">满{{ele.leastCost}}元可用</div>
							<div class="ticket_limit" v-if="ele.leastCost == null">满0元可用</div>
							<div class="ticket_info">
								{{ele.description}}
							</div>
							<div class="ticket_info"><span>{{ele.usePlatformMean}}</span><span v-if="ele.onShelfTypeMean != null" style="margin-left: 14rpx;">{{ele.onShelfTypeMean}}</span></div>
						</div>
						<div style="background-color: #74d2d4;width: 300rpx;height: 300rpx;text-align: center;">
							<div style="margin-top:120rpx;color: #fff;">{{ele.gotStr}}</div>
						</div>
					</div>
				</div>
			</view>
			<uni-load-more :status="status"></uni-load-more>
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
				listQuery: {
					pageIndex: 1,
					usePlatform: ''
				},
				status: 'loading',
				loadingPage: false,
				option1: [{
						text: '全部优惠券',
						value: ''
					},
					{
						text: '线上优惠券',
						value: 'ONLINE'
					},
					{
						text: '商场优惠券',
						value: 'MARKET'
					}
				]
			}
		},
		onLoad(query) {
			this.reSearch()
		},
		onPullDownRefresh() {
			this.reSearch()
		},
		// 上拉加载
		onReachBottom() {
			if (this.status == "loading" || this.status == "noMore") {
				return false
			}
			this.listQuery.pageIndex += 1
			uni.showNavigationBarLoading()
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
			changeOption1(e){
				this.listQuery.usePlatform = e.detail
				this.reSearch()
			},
			reSearch() {
				this.listQuery.pageIndex = 1
				this.list = []
				this.getList()
			},
			clickTicket(ele) {
				if (ele.type == 'INDEPENDENT') {
					uni.navigateTo({
						url: '/pages/ticket/shelf/detail?code=' + ele.code
					})
				} else {
					if (ele.canGot) {
						if (ele.needPay) {
							this.isPayed(ele)
						} else {
							this.useThis(ele)
						}
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
				if (!this.loadingPage) {
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
				this.status = "loading"
				this.$uniRequest.get('/api/small_ticket_shelf/list', {
					data: {
						pageIndex: this.listQuery.pageIndex,
						pageSize: 10,
						usePlatform: this.listQuery.usePlatform
					}
				}).then(res => {
					res.data.records.forEach(c => {
						if (this.list.find(l => l.id === c.id) == null) {
							c.show = false
							this.list.push(c)
						}
					})
					uni.stopPullDownRefresh()
					uni.hideNavigationBarLoading()
					this.status = "more"
					if (res.data.records.length == 0 || res.data.total == this.list.length) {
						this.status = "noMore"
					}
				}).catch(error => {
					uni.stopPullDownRefresh()
					uni.hideNavigationBarLoading()
					this.status = "noMore"
				})
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

	.go180 {
		transform: rotate(180deg);
		-ms-transform: rotate(180deg);
		-moz-transform: rotate(180deg);
		-o-transform: rotate(180deg);
	}

	.quan-what .icon_soldout {
		width: 63px;
		height: 63px;
		display: block;
		position: absolute;
		bottom: 10px;
		right: 45px;
		background: url(//misc.360buyimg.com/user/quan/3.0.0/css/i/market.png) no-repeat -235px -363px;
	}

	.user-info-hover {
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}

	.ticket .used {
		background: #FFFFFF;
		filter: alpha(Opacity=70);
		-moz-opacity: 0.7;
		opacity: 0.7;
	}
</style>
