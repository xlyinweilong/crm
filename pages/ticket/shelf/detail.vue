<template>
	<view>
		<div class="ticket">
			<div style="font-size: 30rpx;">{{ele.title}}</div>
			<div v-if="ele.cardType == 'CASH'" style="margin-top: 28rpx;">
				<span style="font-size: 48rpx;">￥</span>
				<span style="font-size: 80rpx;font-weight:600;margin-left: 8rpx;">{{ele.reduceCost}}</span>
				<span style="font-size: 24rpx;margin-left: 8rpx;">
					代金券
				</span>
			</div>
			<div class="ticket_limit" v-if="ele.leastCost != null">满{{ele.leastCost}}元可用</div>
			<div style="padding-left: 24rpx;padding-right: 15px;margin-top: 24rpx;font-size: 20px;">
				<van-button block @click="tryReceive(ele)" type="primary" :disabled="!ele.canGot" :loading="loading" loading-text="加载中...">{{getText(ele)}}</van-button>
				<!-- <button @click="tryReceive(ele)" :disabled="!ele.canGot" type="primary" :loading="loading" >
				</button> -->
			</div>
		</div>
		<div class="detail">
			<div class="wrapper-dashed">
				<div class="dashed"></div>
			</div>
			<div @click="showDetail" class="item">优惠券详情</div>
		</div>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import Dialog from 'wxcomponents/vant/dialog/dialog'

	export default {
		components: {},
		data() {
			return {
				ele: {
					id: ''
				},
				code: '',
				loading: false
			}
		},
		onLoad(query) {
			this.code = query.code
			this.info(query.code)
		},
		onShareAppMessage(options) {
			var that = this;
			// 设置菜单中的转发按钮触发转发事件时的转发内容
			let user = wx.getStorageSync('token')
			var shareObj = {
				// title: "我的优惠分你一半", // 默认是小程序的名称(可以写slogan等)
				path: '/pages/login/index?scene=share,ticket_detail,' + this.code + ',' + user.id, // 默认是当前页面，必须是以‘/’开头的完整路径
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
			getText(ele) {
				if (ele.canGot) {
					if (ele.gainType === 'PAY' || ele.gainType === 'INTEGRAL') {
						return ele.gotStr
					} else {
						return "立即领取"
					}
				} else {
					return "已经领取"
				}
			},
			info(code) {
				let _this = this
				wx.showLoading({
					title: '加载中',
				})
				this.$uniRequest.get('/api/small_ticket_shelf/info', {
					data: {
						code: code
					}
				}).then(res => {
					this.ele = res.data
				}).finally(() => wx.hideLoading())
			},
			tryReceive(ele) {
				if (ele.canGot) {
					if (ele.gainType === 'PAY') {
						this.zhifu(ele)
					} else if (ele.gainType === 'INTEGRAL') {
						this.zhifuIntegral(ele)
					} else {
						this.receive()
					}
				} else {
					wx.showToast({
						title: '已经领取，不要贪心哦',
						icon: 'none',
						duration: 1500
					})
				}
			},
			zhifu(ele) {
				let user = wx.getStorageSync('token')
				let _this = this
				this.loading = true
				this.$uniRequest.post('/api/small_procedures/pay/create_order', {
					id: ele.id,
					recommendUid: this.$recommender.uid,
					sourceScene: this.$recommender.sourceScene
				}).then(res => {
					wx.requestPayment({
						timeStamp: res.data.timeStamp + '',
						nonceStr: res.data.nonceStr,
						package: res.data.package,
						signType: 'MD5',
						paySign: res.data.paySign,
						success(res) {
							wx.showToast({
								title: '支付成功',
								icon: 'none',
								duration: 1500
							})
							//支付成功后跳转跳转到我的卡券列表
							//_this.useThis(ele, "PAYED")
							uni.navigateBack()
						},
						fail(res) {
							wx.showToast({
								title: '支付失败',
								icon: 'none',
								duration: 1500
							})
						}
					})
				}).finally(error => this.loading = false)
			},
			zhifuIntegral(ele) {
				let user = wx.getStorageSync('token')
				let _this = this
				Dialog.confirm({
					message: '确定要支付积分购买吗？'
				}).then(() => {
					this.receive()
				})
			},
			receive() {
				this.loading = true
				this.$uniRequest.post('/api/small_ticket_shelf/receive', {
					id: this.ele.id,
					recommendUid: this.$recommender.uid,
					sourceScene: this.$recommender.sourceScene
				}).then(res => {
					wx.showToast({
						title: '领取成功',
						icon: 'success',
						duration: 1500
					})
					setTimeout(() => {
						this.loading = false
						uni.navigateBack()
					}, 1500)
				}).catch(() => this.loading = false)
			},
			showDetail(){
				uni.navigateTo({
					url: '/pages/ticket/shelf/detail_info?code=' + this.code
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #439057;
	}
</style>

<style scoped>
	.ticket_limit {
		width: 700rpx;
		color: #666;
		margin: auto;
		margin-top: 20rpx;
		height: 30rpx;
		line-height: 30rpx;
		font-size: 30rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.ticket {
		text-align: center;
		background-color: #fff;
		width: 720rpx;
		margin: auto;
		padding-bottom: 40rpx;
		padding-top: 20px;
		margin-top: 30px;
	}

	.detail {
		background-color: #fff;
		width: 720rpx;
		margin: auto;
	}

	.wrapper-dashed {
		position: relative;
		height: 1px;
		width: 100%;
	}

	/*虚线实现*/
	.dashed {
		border-top: 1px dashed #cccccc;
		height: 1px;
		overflow: hidden;
	}

	.dashed:before,
	.dashed:after {
		display: block;
		position: absolute;
		content: "";
		width: 10px;
		height: 10px;
		background-color: #439057;
		border-radius: 50%;
		top: -5px;
	}

	.dashed:before {
		left: -5px;
	}

	.dashed:after {
		right: -5px;
	}

	.item {
		font-size: 28rpx;
		color: #303133;
		padding-left: 30rpx;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}
</style>
