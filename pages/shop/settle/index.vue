<template>
	<view>
		<view>
			<view style="margin-bottom: 60px;">
				<!-- 提示栏目 -->
				<div style="color: #ffffff;font-size: 11px;background-color: #706000;text-align: center;padding-top: 8px;padding-bottom: 8px;">
					为了保障您的包裹顺利到达，请填写真实姓名
				</div>
				<div style="display: flex;background: #ffffff;font-size: 28rpx;
					color:#303133;align-items: center;
					padding-top: 30rpx;padding-tbottom: 6rpx;
					padding-left: 20rpx;padding-right: 20rpx;">
					<van-checkbox checked-color="#706000" :value="receiveType == 'express'" @change="checkReceiveType($event,'express')">快递上门</van-checkbox>
				</div>
				<!-- 快递上门 -->
				<div v-if="receiveType == 'express'" @click="selectLocation" style="display: flex;background: #ffffff;font-size: 28rpx;
					color:#303133;align-items: center;
					padding-top: 30rpx;padding-bottom: 30rpx;
					padding-left: 20rpx;padding-right: 20rpx;">
					<div style="width: 40rpx;">
						<span style="font-size: 40rpx;" class="iconfont icon-fujinmendian"></span>
					</div>
					<div style="width: 600rpx;margin-left: 20rpx;">
						<p v-if="selectedLocation.receiver != null" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">收货人：<span>{{selectedLocation.receiver}}</span><span
							 style="margin-left: 16rpx;">{{selectedLocation.mobile}}</span></p>
						<p v-if="selectedLocation.receiver != null" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
							<span>{{selectedLocation.provinceName}}</span>
							<span style="margin-left: 16rpx;">{{selectedLocation.cityName}}</span>
							<span style="margin-left: 16rpx;">{{selectedLocation.stationName}}</span>
							<span style="margin-left: 16rpx;">{{selectedLocation.address}}</span>
						</p>
					</div>
					<div style="width: 40rpx;">
						<span style="font-size: 48rpx;color:#909399" class="iconfont icon-arrow-right"></span>
					</div>
				</div>
				<!-- 门店自提 -->
				<div style="display: flex;background: #ffffff;font-size: 28rpx;
					color:#303133;align-items: center;
					padding-top: 30rpx;padding-bottom: 30rpx;
					padding-left: 20rpx;padding-right: 20rpx;">
					<van-checkbox checked-color="#706000" :value="receiveType == 'self'" @change="checkReceiveType($event,'self')">门店自提</van-checkbox>
				</div>
				<div v-if="receiveType == 'self'" style="display: flex;background: #ffffff;font-size: 28rpx;
					color:#303133;align-items: center;
					padding-top: 10rpx;padding-bottom: 30rpx;
					padding-left: 20rpx;padding-right: 20rpx;">
					<div v-if="selectChannel.id == null" @click="addChannel" style="font-size: 28rpx;color:#706000">+添加提货地址</div>
					<div v-if="selectChannel.id != null" @click="addChannel" style="font-size: 28rpx;color:#706000">{{selectChannel.aliasName}}</div>
				</div>
				<!-- 商品明细 -->
				<div class="goods_list">
					<div class="goods_detail" v-for="(e,index) in goodsList" :key="index">
						<!-- 商品图片 -->
						<div style="width:250rpx;margin-top: 25rpx;margin-left: 20rpx;margin-right: 20rpx;">
							<image style="width: 250rpx; height: 250rpx; background-color: #eeeeee;" mode="aspectFit" :src="e.imageList[0]" />
						</div>
						<!-- 右侧区域 -->
						<div style="font-size:26rpx;padding-top: 10px;color: #303133;width:400rpx;margin-left: 10rpx;">
							<!-- 第一层，名称和删除 -->
							<div style="font-size:32rpx;width:290rpx;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;margin-top: 30rpx;">
								{{e.goodsDisplayName}}
							</div>
							<!-- 第二层颜色尺码 -->
							<div style="width:290rpx;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;margin-top: 20rpx">
								颜色：{{e.colorName}}
								<span style="margin-left: 20rpx;">尺码：{{e.sizeName}}</span>
							</div>
							<!-- 第三层，金额、数量 -->
							<div style="margin-top: 10rpx;">数量：{{e.quantity}}</div>
							<div style="margin-top: 10rpx;">单价：￥{{e.price}}</div>
						</div>
					</div>
				</div>
				<!-- 优惠卷、活动、运费 -->
				<div class="goods_list">
					<div class="row" @click="showTicketList">
						<div class="left">使用优惠卷</div>
						<div class="right">
							<span v-if="selectedTicket.id == ''">
								没有使用优惠卷
								<span style="font-size: 32rpx;" class="iconfont icon-arrow-right"></span>
							</span>
							<span v-if="selectedTicket.id != ''">-￥{{selectedTicket.amount}}</span>
							
						</div>
					</div>
					<!-- <div class="row">
						<div class="left">活动优惠金额</div>
						<div class="right">
							-￥0.00
						</div>
					</div> -->
					<div class="row">
						<div class="left">运费</div>
						<div class="right">
							￥{{expressFee}}
						</div>
					</div>
					<div class="row">
						<div class="left">估计获得积分</div>
						<div class="right">
							+{{nowGotIntegral}}
						</div>
					</div>
				</div>
			</view>
			<!-- 总计、立即支付 -->
			<div class="tools-bottom">
				<div style="width: 500rpx;padding-left: 20px;display: flex;align-items: center;">
					<div style="color: #909399;">
						<p>总金额：<span style="color: #606266;">{{settleAmount}}</span></p>
						<!-- <p>总积分：<span style="color: #606266;">100000</span></p> -->
					</div>
				</div>
				<div style="width: 250rpx;">
					<button v-if="settleAmount > 0" style="background-color: #706000;" class="tools-bottom-button" @click="doPay" type="primary">支付</button>
					<button v-if="settleAmount == 0" style="background-color: #706000;" class="tools-bottom-button" @click="doPay"
					 type="primary">确定</button>
				</div>
			</div>
		</view>
		<van-toast id="van-toast" />
		<van-popup z-index="200" :show="isShowChannel" closeable position="bottom" custom-style="height:500px" @close="onCloseChannel">
			<div v-if="loadingChannel" style="text-align: center;">加载中...</div>
			<div v-if="!loadingChannel">
				<view>
					<scroll-view :scroll-y="true" style="height: 420px;">
						<div @click="onSelectChannel(c)" v-for="c in channelList" :key="c.id" style="border-bottom: 1px solid #E4E7ED;font-size: 28rpx;padding-left: 30rpx;">
							<div style="margin-top: 30rpx;font-size: 16px;color:#706000;display: flex; align-items:center;">
								<div style="width: 50rpx;">
									<van-checkbox icon-size="30rpx" checked-color="#706000" :value="c.selected"></van-checkbox>
								</div>
								<div style="width: 600rpx;">{{c.aliasName}}</div>
							</div>
							<p style="padding-left: 50rpx;margin-top: 18rpx;">距离：{{c.distanceStr}}</p>
							<p style="padding-left: 50rpx;margin-top: 18rpx;">门店地址：{{c.address}}</p>
							<p style="padding-left: 50rpx;margin-top: 18rpx;margin-bottom: 20rpx;">联系电话：{{c.phone}}</p>
						</div>
					</scroll-view>
				</view>
				<!-- 第三行，按钮确定 -->
				<div class="popup-button-div">
					<div style="margin-left: 15px;margin-right: 15px;height: 60px;margin-top: 15px;">
						<van-button @click="onOkSelect" custom-class="popup-button" size="large" color="#706000">确定</van-button>
					</div>
				</div>
			</div>
		</van-popup>
		<van-dialog id="van-dialog" confirm-button-color="#706000" />
		<loginCom />
		<van-popup :show="isShowTicketList" z-index="201" closeable position="bottom" custom-style="height:1000rpx" @close="onCloseTicketList">
			<div style="margin-top: 40px;padding-left: 2rpx;padding-right: 2rpx;">
				<div style="border-bottom: 1px solid #E4E7ED;"></div>
				<div v-for="t in ticketDetailList" :key="t.id">
					<div class="row" @click="chooseTicket(t)">
						<div class="left">{{t.title}}</div>
						<div class="right">
							{{t.amount}}
							<span v-if="t.id === selectedTicket.id" style="font-size: 36rpx;color: #706000;font-weight:900;margin-left: 6rpx;"
							 class="iconfont icon-zhengque"></span>
						</div>
					</div>
				</div>
			</div>
			<div></div>
		</van-popup>
	</view>
</template>

<script>
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import Toast from '@/wxcomponents/vant/toast/toast'
	export default {
		components: {},
		data() {
			return {
				isShowTicketList: false,
				loading: false,
				loadingLocation: false,
				loadingChannel: false,
				isShowChannel: false,
				cartList: [],
				selectedLocation: {},
				locationList: [],
				locationId: null,
				receiveType: 'express',
				channelList: [],
				selectChannel: {},
				baseExpressFee: -1,
				expressAmountFree: -1,
				consumeGotIntegral: 0,
				gotIntegral: 0,
				cardList: null,
				type: '',
				ticketDetailList: [],
				selectedTicket: {
					id: '',
					amount: 0
				}
			}
		},
		computed: {
			nowGotIntegral(){
				if(this.gotIntegral <= 0){
					return 0
				}
				if(this.selectedTicket.amount == null || this.selectedTicket.amount == 0){
					return this.gotIntegral
				}
				return this.gotIntegral - this.selectedTicket.amount
			},
			goodsList() {
				return this.cartList.filter(c => c.checked)
			},
			totalAmount() {
				return this.cartList.filter(e => e.checked).reduce((t, a) => t + (a.quantity * a.price), 0)
			},
			settleAmount() {
				if (this.selectedTicket.id != '') {
					let r = this.totalAmount + this.expressFee - this.selectedTicket.amount
					return r > 0 ? r : 0
				}
				return this.totalAmount + this.expressFee
			},
			expressFee() {
				if (this.totalAmount >= this.expressAmountFree) {
					return 0
				} else {
					return this.baseExpressFee
				}
			}
		},
		onLoad(query) {
			this.type = ''
			// this.locationId = query.locationId
			if (query.type) {
				this.type = query.type
			}
		},
		onShow() {
			this.loadLocation()
			let user = wx.getStorageSync('token')
			if (user != '' && user != null) {
				this.cardList = user.cardList
			}
			if (this.type == 'settle') {
				let o = wx.getStorageSync('settle')
				this.cartList = []
				this.cartList.push(o)
			} else {
				if (wx.getStorageSync('cartList') instanceof Array) {
					this.cartList = wx.getStorageSync('cartList')
				}
			}
			this.loadInfo()
		},
		methods: {
			chooseTicket(ticket) {
				if (ticket.id === this.selectedTicket.id) {
					this.selectedTicket.id = ''
					this.selectedTicket.amount = 0
				} else {
					this.selectedTicket.id = ticket.id
					this.selectedTicket.amount = ticket.amount
				}
				this.onCloseTicketList()
			},
			onCloseTicketList() {
				this.isShowTicketList = false
			},
			loadInfo() {
				Toast.loading({
					duration: 0,
					mask: true,
					message: '加载中...'
				})
				let _this = this
				uni.request({
					url: _this.$baseURL + '/api/small/shop/order/settle_info',
					data: _this.goodsList,
					method: 'POST',
					header: {
						'content-type': 'application/json',
						'X-Token': _this.$uniRequest.defaults.headers.common['X-Token'],
						'tn_id': _this.$tnId
					},
					success: (res) => {
						res = res.data
						if (res.code == 0) {
							_this.ticketDetailList = res.data.ticketDetailList.filter(t => t.isCanUse)
							_this.baseExpressFee = res.data.baseExpressFee
							_this.expressAmountFree = res.data.expressAmountFree
							_this.consumeGotIntegral = res.data.consumeGotIntegral
							_this.cardTips = res.data.cardTips
							//刷新库存数量
							_this.cartList = res.data.settleList
							//设置每个货品可以获得的积分
							_this.cartList.filter(c => c.checked).forEach(g => g.integral = Math.floor(g.price) * this.consumeGotIntegral)
							_this.gotIntegral = this.cartList.filter(c => c.checked).reduce((t, a) => t + a.integral * a.quantity, 0)
							//自动选择优惠券
							if (_this.ticketDetailList.length > 0) {
								_this.ticketDetailList.forEach(d => {
									if (_this.selectedTicket.amount < d.amount) {
										_this.chooseTicket(d)
									}
								})
							}
							Toast.clear()
						} else {
							Toast.clear()
							Toast(res.message)
						}
					},
					fail() {
						Toast('fail')
						Toast.clear()
					}
				})
			},
			//关闭店铺列表
			onCloseChannel() {
				this.isShowChannel = false
			},
			//加载店铺
			addChannel() {
				this.getWxLocation()
			},
			//获取定位，加载店铺列表
			getWxLocation() {
				let _this = this
				wx.getLocation({
					type: 'wgs84',
					success(res) {
						_this.getChannelList(res.latitude, res.longitude)
					},
					fail(e) {
						console.log(e)
						Toast("请在小程序设置中开启定位授权")
					}
				})
			},
			//加载店铺列表
			getChannelList(lat, lng) {
				this.loadingChannel = true
				this.isShowChannel = true
				this.$uniRequest.get('/api/small_procedures/channel/nearby', {
					data: {
						lat: lat,
						lng: lng
					}
				}).then(res => {
					let id = this.selectChannel.id
					res.data.forEach(c => c.selected = false)
					this.channelList = res.data.filter(c => c.lng != null && c.lat != null)
					if (id != null) {
						this.channelList.find(c => c.id === id).selected = true
					}
				}).finally(() => this.loadingChannel = false)
			},
			//选择收货类型
			checkReceiveType(e, type) {
				if (e.detail) {
					this.receiveType = type
				}
			},
			//加载地址
			loadLocation() {
				this.loadingLocation = true
				this.$uniRequest.get('/api/small/shop/location/list').then(res => {
					this.locationList = res.data
					if (this.locationId == null && this.locationList.find(l => l.defaultLocation) != null) {
						this.selectedLocation = this.locationList.find(l => l.defaultLocation)
					}
					if (this.locationId != null) {
						this.selectedLocation = this.locationList.find(l => l.id == this.locationId)
					}
				}).finally(() => this.loadingLocation = false)
			},
			//支付
			doPay() {
				if (!this.hasVipCard()) {
					return
				}
				//判断是否选择的地址
				if (this.receiveType == 'express' && this.selectedLocation.id == null) {
					Toast("请选择收货地址")
					return
				}
				if (this.receiveType == 'self' && this.selectChannel.id == null) {
					Toast("请选择提货店铺")
					return
				}
				Toast.loading({
					duration: 0,
					mask: true,
					message: '加载中...'
				})
				let goodsList = this.goodsList
				let ele = {
					receiveType: this.receiveType,
					locationId: this.selectedLocation.id,
					channelId: this.selectChannel.id,
					goodsList: goodsList,
					expressFee: this.expressFee,
					recommendUid: this.$recommender.uid,
					ticketDetailIds: [this.selectedTicket.id]
				}
				let _this = this
				uni.request({
					url: _this.$baseURL + '/api/small/shop/order/create_order',
					data: ele,
					method: 'POST',
					header: {
						'content-type': 'application/json',
						'X-Token': _this.$uniRequest.defaults.headers.common['X-Token'],
						'tn_id': _this.$tnId
					},
					success: (res) => {
						res = res.data
						if (res.code == 0) {
							//删除购物车
							if (_this.type == '') {
								wx.setStorageSync('cartList', this.cartList.filter(c => !c.checked))
							}
							Toast.clear()
							if (_this.settleAmount > 0) {
								wx.requestPayment({
									timeStamp: res.data.timeStamp + '',
									nonceStr: res.data.nonceStr,
									package: res.data.package,
									signType: 'MD5',
									paySign: res.data.paySign,
									success(res) {
										Toast("支付成功")
										uni.redirectTo({
											url: '/pages/shop/my/order/index'
										})
									},
									fail(res) {
										uni.redirectTo({
											url: '/pages/shop/my/order/index?s=PENDING_PAYMENT'
										})
									}
								})
							} else {
								Toast("下单成功")
								uni.redirectTo({
									url: '/pages/shop/my/order/index'
								})
							}
						} else {
							Toast.clear()
							Toast(res.message)
						}
					},

				})
			},
			//调转到选择地址
			selectLocation() {
				if (!this.hasVipCard()) {
					return
				}
				let _this = this
				// wx.chooseAddress({
				//   success (res) {
				// 	_this.selectedLocation.receiver = res.userName
				// 	_this.selectedLocation.postalCode = res.postalCode
				// 	_this.selectedLocation.provinceName = res.provinceName
				// 	_this.selectedLocation.cityName = res.cityName
				// 	_this.selectedLocation.stationName = res.countyName
				// 	_this.selectedLocation.address = res.detailInfo
				// 	_this.selectedLocation.nationalCode = res.nationalCode
				// 	_this.selectedLocation.mobile = res.telNumber
				//   }
				// })
				uni.navigateTo({
					url: '/pages/shop/my/location/index?type=settle'
				})
			},
			//选择店铺
			onSelectChannel(c) {
				this.channelList.filter(c => c.selected).forEach(c => c.selected = false)
				c.selected = true
			},
			//确定选择店铺
			onOkSelect() {
				let selected = this.channelList.find(c => c.selected)
				if (selected == null) {
					Toast("请选择店铺")
					return
				}
				this.selectChannel = selected
				this.onCloseChannel()
			},
			hasVipCard() {
				if (this.cardList == null) {
					Dialog.confirm({
						message: '您还没有注册成会员，现在去注册吗？'
					}).then(() => {
						wx.setStorageSync('registerGoPage', '/pages/shop/my/index')
						uni.navigateTo({
							url: '/pages/register/register'
						})
					})
					return false
				}
				if (this.cardList.length == 0) {
					Dialog.confirm({
						message: '还未绑定会员卡，现在去绑定吗？'
					}).then(() => {
						wx.setStorageSync('registerGoPage', '/pages/shop/cart/index')
						uni.navigateTo({
							url: '/pages/bind_vip/bind_vip'
						})
					})
					return false
				} else {
					return true
				}
			},
			//显示优惠卷
			showTicketList() {
				this.isShowTicketList = true
			}
		}
	}
</script>

<style>
	page {
		background-color: #eeeeee;
	}
</style>

<style scoped>
	.goods_list {
		background-color: #ffffff;
		margin-top: 14px;
	}

	.goods_detail {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 300rpx;
		border-bottom: 1px solid #E4E7ED;
	}

	.row {
		font-size: 28rpx;
		align-items: center;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		display: flex;
		width: 100%;
		border-bottom: 1px solid #E4E7ED;
	}

	.left {
		padding-left: 20rpx;
		width: 240rpx;
		text-align: left;
		color: #303133;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.right {
		padding-right: 20rpx;
		width: 450rpx;
		text-align: right;
		color: #909399;
	}

	.tools-bottom {
		background-color: #ffffff;
		color: #606266;
		font-size: 14px;
		display: flex;
		position: fixed;
		border-top: 1px solid #DCDFE6;
		z-index: 200;
		height: 60px;
		bottom: 0px;
		width: 100%;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}

	.tools-bottom-button {
		line-height: 60px;
		color: #ffffff;
		font-size: 18px;
		width: 100%;
		height: 80px;
		border-radius: 0px;
	}

	.popup-button-div {
		background-color: #FFFFFF;
		z-index: 100;
		text-align: center;
		position: fixed;
		height: 80px;
		bottom: 0px;
		width: 100%;
		border-top: 1px solid #DCDFE6;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
</style>
