<template>
	<view>
		<view class="container">
			<!-- 卡片1 -->
			<div class="card" style="padding-bottom: 40rpx;">
				<div>
					<uni-swiper-dot :info="goods.imageList" :current="current" field="content" :mode="mode" :dotsStyles="dotsStyles">
						<swiper class="swiper-box" @change="changeImage">
							<swiper-item v-for="(item ,index) in goods.imageList" :key="index">
								<view class="swiper-item" @click="previewImage(item)">
									<image class="dot-image" mode="aspectFit" :src="item"></image>
								</view>
							</swiper-item>
						</swiper>
					</uni-swiper-dot>
				</div>
				<div style="margin-top: 10px;">{{goods.displayName}}</div>
				<div style="margin-top: 10px;font-size: 34rpx;">￥{{goods.price}}
					<span class="delete_price">￥{{goods.tagPrice}}</span>
					<span class="discount">￥{{discount(goods)}}折</span>
				</div>
			</div>
			<!-- 卡片2 -->
			<div style="margin-top: 10px;">
				<van-cell @click="showGoodsDetail" :title="(selected.colorId != '' ? ('颜色:' + selected.colorName) : '选择：颜色')+' '+(selected.sizeId != '' ? ('尺码:' + selected.sizeName) : '选择：尺码')"
				 is-link value="" />
			</div>
			<div class="card tools">
				<div hover-class="hover-button" style="width: 250rpx;" @click="doLike">
					<button class="text-button">
						<span v-show="!goods.like" class="iconfont icon-favorites" style="font-size: 32rpx;"></span>
						<span v-show="goods.like" class="iconfont icon-favorites-fill" style="font-size: 32rpx;"></span>
						<span v-text="goods.like ? '已收藏' : '收藏' "></span>
					</button>
				</div>
				<div style="width: 250rpx;border-left: 1px solid #DCDFE6;border-right: 1px solid #DCDFE6;">
					<button class="text-button" open-type="contact" bindcontact="handleContact" hover-class="hover-button">
						<span class="iconfont icon-icon_sms" style="font-size: 32rpx;"></span>客服
					</button>
				</div>
				<div style="width: 250rpx;">
					<button class="text-button" @click="createNewImg" hover-class="hover-button">
						<span class="iconfont icon-icon_share" style="font-size: 32rpx;"></span>分享
					</button>
				</div>
			</div>
			<!-- 悬浮的客服电话 -->
			<div v-if="service400 != ''" @click="makePhoneCall" style="position:fixed;right:45px;bottom:160px;background-color: #ffffff;
			border-radius:20px;height: 40px;width: 40px;
			border: 1px solid #d9d9d9;
			box-shadow: 2px 2px 12px 2px rgba(0, 0, 0, 0.1)"><span
				 style="font-size: 38px;" class="iconfont icon-service"></span></div>
			<!-- 品牌 -->
			<div class="card" style="display: flex;">
				<div style="width: 200rpx;">
					<image style="width: 200rpx;height: 150rpx;" :src="goods.brand.logoUrl" />
				</div>
				<div style="width: 350rpx;">
					<div style="padding-left: 10rpx;margin-top: 30rpx;overflow: hidden;
							text-overflow: ellipsis;white-space: nowrap;">{{goods.brand.name}}</div>
					<div style="padding-left: 10rpx;margin-top: 10rpx;font-size: 20rpx;color: #909399;overflow: hidden;
							text-overflow: ellipsis;white-space: nowrap;">
						{{goods.brand.slogan}}
					</div>
				</div>
				<div @click="goToBrandList" style="padding-top: 60rpx;width: 200rpx;text-align: right;">
					进入品牌馆<span class="iconfont icon-arrow-right"></span>
				</div>
			</div>
			<!-- 同系列推荐todo -->

			<!-- 上滑查看图文详情 -->
			<div v-if="goods.imageDetailList.length == 0" class="card" style="margin-top: 10px;padding-top: 26rpx;padding-bottom: 26rpx;text-align: center;">
				暂无图文详情
			</div>
			<div v-if="goods.imageDetailList.length > 0" class="card" style="margin-top: 10px;padding-top: 26rpx;padding-bottom: 26rpx;text-align: center;">
				上滑查看图文详情
			</div>
			<!-- 图片明细 -->
			<div style="background-color: #ffffff;margin-top: 10px;margin-bottom: 50px;">
				<image v-for="imageUrl in goods.imageDetailList" style="width: 750rpx;" mode="widthFix" :src="imageUrl" />
			</div>
			<!-- 工具条 -->
			<div class="detail-tabbar">
				<!-- 回到首页 -->
				<div style="width: 130rpx;" @click="goToIndex">
					<div style="margin-top: 5px;"><span class="iconfont icon-home"></span></div>
					<div style="margin-top: 1px;">返回首页</div>
				</div>
				<!-- 购物车 -->
				<div style="width: 130rpx;" @click="goToCart">
					<div class="relative" style="margin-top: 5px">
						<span class="iconfont icon-cart-full"></span>
						<span v-if="cartList.length > 0" class="message-num">{{cartList.length}}</span>
					</div>
					<div style="margin-top: 1px;">
						购物车
					</div>
				</div>
				<!-- 加入购物车 -->
				<div style="width: 244rpx;" @click="addToCart">
					<van-button custom-class="popup-button" size="large" color="#706000">加入购物车</van-button>
				</div>
				<div style="width: 246rpx;" @click="buyNow">
					<van-button custom-class="popup-button" size="large" color="#333">立即购买</van-button>
				</div>
			</div>
			</div>
		</view>
		<van-toast id="van-toast" />
		<van-popup :show="isShowGoodsDetail" closeable position="bottom" custom-style="height:1000rpx" @close="onCloseGoodsDetail">
			<!-- 第一行，图片、价格、编号 -->
			<div class="popup-image-div">
				<!-- 图片 -->
				<div style="float: left;margin-top: 15px;margin-left: 15px;">
					<image style="width: 250rpx; height: 250rpx; background-color: #eeeeee;" mode="aspectFit" :src="goods.imageList[0]" />
				</div>
				<div style="float: left;margin-left: 20px;margin-top: 15px;">
					<!-- 价格 -->
					<p style="font-size: 30rpx;color:#303133">￥{{goods.price}}</p>
					<p style="font-size: 24rpx;color: #909399;">
						<span v-if="selected.colorId != ''">颜色：{{selected.colorName}}</span>
						<span v-if="selected.colorId == ''">请选择颜色</span>
					</p>
					<p style="font-size: 24rpx;color: #909399;">
						<span v-if="selected.sizeId != ''">尺码：{{selected.sizeName}}</span>
						<span v-if="selected.sizeId == ''">请选择尺码</span>
					</p>
				</div>
			</div>
			<!-- 第二行，颜色、尺码 -->
			<view>
				<scroll-view :scroll-y="true" style="height: 700rpx;">
					<div style="margin-bottom: 90px;margin-top: 10px;padding-left: 10rpx;">
						<div>
							<p style="color: #909399;font-size: 26rpx;">颜色</p>
							<div style="display: flex;font-size: 24rpx;color: #606266;">
								<div @click="selectColor(color)" v-for="color in goods.colorList" :key="color.id" style="width: 152rpx;text-align: center;padding: 14rpx">
									<div :style="{ 'background-color': selected.colorId == color.id ? '#706000':(color.stockCount == 0 ? '#F2F6FC':'#ffffff'),
									'border-color':selected.colorId == color.id ? '#706000':'#606266',
									'color':selected.colorId == color.id ? '#ffffff':'#606266'}"
									 style="padding: 20rpx;border:1px solid">{{color.name}}</div>
								</div>
							</div>
						</div>
						<div style="margin-top: 20rpx;">
							<p style="color: #909399;font-size: 26rpx;">尺码</p>
							<div style="display: flex;flex-wrap:wrap;font-size: 24rpx;color: #606266;">
								<div @click="selectSize(size)" v-for="size in goods.sizeList" :key="size.id" style="width: 152rpx;text-align: center;padding: 14rpx">
									<div :style="{ 'background-color': selected.sizeId == size.id ? '#706000':(size.stockCount == 0 ? '#F2F6FC':'#ffffff'),
									'border-color':selected.sizeId == size.id ? '#706000':'#606266',
									'color':selected.sizeId == size.id ? '#ffffff':'#606266'}"
									 style="padding: 20rpx;border:1px solid">{{size.name}}</div>
								</div>
							</div>
						</div>
					</div>
				</scroll-view>
			</view>
			<!-- 第三行，按钮确定 -->
			<div class="popup-button-div">
				<div @click="chooseIntoCart" style="margin-left: 15px;margin-right: 15px;height: 60px;margin-top: 15px;">
					<van-button v-if="type == 0" custom-class="popup-button" size="large" color="#706000">加入购物车</van-button>
					<van-button v-if="type == 1" custom-class="popup-button" size="large" color="#333">立即购买</van-button>
				</div>
				<!-- <button class="popup-button">确定</button> -->
			</div>
		</van-popup>
		<van-popup :show="showPopup" @close="onClosePopup" position="bottom" custom-style="height: 910rpx">
			<div style="text-align: center;" v-if="loadingImage">加载中...</div>
			<div style="text-align: center;" v-show="!loadingImage">
				<canvas class="canvas" canvas-id="mycanvas" />
				<div style="position: absolute;bottom: 0;width: 100%;">
					<van-button custom-class="popup-button" @click="saveImage" size="large" color="#706000">保存到相册</van-button>
				</div>
			</div>
		</van-popup>
		<van-dialog id="van-dialog" confirm-button-color="#706000" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import uniSwiperDot from "@/components/uni-swiper-dot/uni-swiper-dot.vue"
	export default {
		components: {
			uniSwiperDot
		},
		data() {
			return {
				goods: {
					id: '',
					code: '',
					displayName: '',
					price: '',
					tagPrice: '',
					imageList: [],
					like: false,
					imageDetailList: [],
					sizeList: [],
					colorList: []
				},
				selected: {
					colorId: '',
					colorName: '',
					sizeId: '',
					sizeName: ''
				},
				current: 0,
				mode: 'default',
				dotsStyles: {
					selectedBackgroundColor: "#706000",
					backgroundColor: "rgba(255, 255, 255, .3)",
					color: "#eeeeee"
				},
				isShowGoodsDetail: false,
				cartList: [],
				showPopup: false,
				shareImagePath: '',
				windowWidth: 0,
				user: {},
				loadingImage: false,
				cardList: [],
				scene: '',
				service400: '',
				type: 0
			}
		},
		onShareAppMessage(options) {
			var that = this;
			let user = wx.getStorageSync('token')
			var shareObj = {
				// title: "一起", // 默认是小程序的名称(可以写slogan等)
				path: '/pages/shop/goods/goods_detail?scene=' + user.id + ',' + that.goods.code,
				imageUrl: '',
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
			// 返回shareObj
			return shareObj
		},
		onPullDownRefresh() {
			this.getInfo()
		},
		onLoad(query) {
			if (query.scene) {
				this.scene = decodeURIComponent(query.scene)
			}
			//登录
			let that = this
			Toast.loading({
				duration: 0,
				mask: true,
				message: '加载中...'
			})
			wx.checkSession({
				success() {
					uni.request({
						url: that.$baseURL + '/api/small_procedures/login/is_login',
						method: 'GET',
						header: {
							'content-type': 'application/json',
							'X-Token': that.$uniRequest.defaults.headers.common['X-Token'],
							'tn_id': that.$tnId
						},
						success: (res) => {
							res = res.data
							if (res.code == 0) {
								that.init(query)
							} else {
								that.login(query)
							}
						}
					})
				},
				fail() {
					that.login(query)
				}
			})

		},
		methods: {
			login(query) {
				let that = this
				wx.login({
					success(res) {
						if (res.code) {
							that.$uniRequest.get('/api/small_procedures/login/login', {
								data: {
									code: res.code
								}
							}).then(res => {
								wx.setStorage({
									key: 'token',
									data: res.data
								})
								that.$uniRequest.defaults.headers.common['X-Token'] = res.data.token
								that.init(query)
							})
						}
					}
				})
			},
			init(query) {
				var systemInfo = wx.getSystemInfoSync()
				this.windowWidth = systemInfo.windowWidth
				if (this.scene != '' && query.room_id == null) {
					this.$recommender.uid = this.scene.split(",")[0]
					wx.setStorageSync('recommend', query.u)
					this.goods.code = this.scene.split(",")[1]
					this.getInfo()
				} else if (query.g) {
					this.goods.code = query.g
					this.getInfo()
				}
				//加载购物车数量
				if (wx.getStorageSync('cartList') instanceof Array) {
					this.cartList = wx.getStorageSync('cartList')
				}
				let user = wx.getStorageSync('token')
				this.service400 = (user.service400 != null && user.service400 != '') ? user.service400 : ''
			},
			onClosePopup() {
				this.showPopup = false
			},
			makePhoneCall() {
				wx.makePhoneCall({
					phoneNumber: this.service400
				})
			},
			selectSize(size) {
				if (this.selected.colorId == '') {
					Toast("请先选择颜色")
					return
				}
				if (size.stockCount <= 0) {
					Toast("该尺码已经售罄")
					return
				}
				this.selected.sizeId = size.id
				this.selected.sizeName = size.name
			},
			selectColor(color) {
				if (color.stockCount <= 0) {
					Toast("该颜色已经售罄")
					return
				}
				this.selected.colorId = color.id
				this.selected.colorName = color.name
				//加载尺码的库存
				this.goods.sizeList.forEach(si => {
					si.stockCount = this.goods.stockList.filter(s => s.colorId === this.selected.colorId && si.id === s.sizeId).reduce(
						(t, a) => t + a.stockCount, 0)
				})
			},
			discount(goods) {
				if (goods.price == null || goods.tagPrice == null) {
					return null
				}
				if (goods.tagPrice == 0) {
					return 0
				}
				return Math.floor(goods.price / goods.tagPrice * 100) / 10
			},
			changeImage(e) {
				this.current = e.detail.current
			},
			previewImage(url) {
				let _this = this
				wx.previewImage({
					current: url,
					urls: _this.goods.imageList
				})
			},
			getInfo() {
				Toast.clear()
				let user = wx.getStorageSync('token')
				if (user != '' && user != null) {
					this.cardList = user.cardList
				}
				Toast.loading({
					duration: 0,
					mask: true,
					message: '加载中...'
				})
				this.$uniRequest.get('/api/small/shop/goods/info', {
					data: {
						code: this.goods.code
					}
				}).then(res => {
					this.goods = res.data
					//设置颜色的库存
					this.goods.colorList.forEach(c => {
						c.stockCount = this.goods.stockList.filter(s => s.colorId === c.id).reduce((t, a) => t + a.stockCount, 0)
						if (c.stockCount > 0 && this.goods.colorList.length == 1) {
							this.selectColor(c)
							//设置尺码							
							if (this.goods.sizeList.length == 1) {
								let stock = this.goods.stockList.find(s => s.colorId === c.id && s.sizeId === this.goods.sizeList[0].id)
								if (stock != null && stock.stockCount > 0) {
									this.selectSize(this.goods.sizeList[0])
								}
							}
						}
					})
					Toast.clear()
					uni.stopPullDownRefresh()
				}).catch(() => Toast.clear())
			},
			//收藏
			doLike() {
				if (!this.hasVipCard()) {
					return
				}
				Toast.loading({
					duration: 0,
					mask: true,
					message: '加载中...'
				})
				this.$uniRequest.post('/api/small/shop/user_collect/collect', {
					id: this.goods.id
				}).then(res => {
					Toast.clear()
					this.goods.like = !this.goods.like
					Toast(res.message)
				}).catch(e => Toast.clear())
			},
			//添加购物车
			addToCart() {
				this.type = 0
				if (this.selected.sizeId != '' && this.selected.colorId != '') {
					this.chooseIntoCart()
				} else {
					this.showGoodsDetail()
				}
			},
			//立即购买
			buyNow() {
				if (!this.hasVipCard()) {
					return
				}
				this.type = 1
				if (this.selected.sizeId != '' && this.selected.colorId != '') {
					this.chooseIntoCart()
				} else {
					this.showGoodsDetail()
				}
			},
			//显示明细
			showGoodsDetail() {
				this.isShowGoodsDetail = true
			},
			//关闭明细
			onCloseGoodsDetail() {
				this.isShowGoodsDetail = false
			},
			//选择加入到购物车
			chooseIntoCart() {
				if (this.selected.colorId == '') {
					Toast('请选择颜色')
					return
				}
				if (this.selected.sizeId == '') {
					Toast('请选择尺码')
					return
				}
				if (this.type == 0) {
					let cart = this.cartList.find(c => c.goodsId === this.goods.id && c.colorId === this.selected.colorId && c.sizeId ===
						this.selected.sizeId)
					if (cart != null) {
						cart.quantity += 1
					} else {
						this.cartList.push(this.newEle())
					}
					wx.setStorageSync('cartList', this.cartList)
					Toast('成功加入购物车')
				} else {
					//跳转到支付页面
					wx.setStorageSync('settle', this.newEle())
					uni.redirectTo({
						url: '/pages/shop/settle/index?type=settle'
					})
				}
				this.onCloseGoodsDetail()
			},
			newEle() {
				let stockCount = this.goods.stockList.filter(s => s.colorId === this.selected.colorId && this.selected.sizeId ===
					s.sizeId).reduce(
					(t, a) => t + a.stockCount, 0)
				return {
					goodsId: this.goods.id,
					goodsCode: this.goods.code,
					goodsDisplayName: this.goods.displayName,
					tagPrice: this.goods.tagPrice,
					price: this.goods.price,
					colorId: this.selected.colorId,
					colorName: this.selected.colorName,
					sizeId: this.selected.sizeId,
					sizeName: this.selected.sizeName,
					quantity: 1,
					checked: true,
					imageList: this.goods.imageList,
					stockCount: stockCount,
					limitBuyCount: this.goods.limitBuyCount
				}
			},
			goToCart() {
				uni.switchTab({
					url: '/pages/shop/cart/index'
				})
			},
			goToIndex() {
				uni.switchTab({
					url: '/pages/shop/index/index'
				})
			},
			goToBrandList() {
				uni.redirectTo({
					url: '/pages/shop/goods/goods_list?b=' + this.goods.brandId
				})
			},
			setUserName(ctx) {
				// this.user.nickName = '嘻嘻嘻啊哈哈哈哈哈哈哈'
				// this.goods.displayName = '嘻嘻嘻啊哈哈哈哈哈哈哈嘻嘻嘻啊哈哈哈哈哈哈哈displayName'
				// this.goods.price = 10
				// this.goods.tagPrice = 10
				let displayName = this.goods.displayName.length > 12 ? (this.goods.displayName.substring(0, 11) + '...') : this.goods
					.displayName
				//写入来自谁的分享
				ctx.setFillStyle("#909399")
				ctx.setFontSize(this.rpxToPx(24))
				ctx.fillText('来自' + this.user.nickName + '的分享', this.rpxToPx(100), this.rpxToPx(720))
				//写入商品名称
				ctx.setFillStyle("#606266")
				ctx.setFontSize(this.rpxToPx(32))
				ctx.fillText(displayName, this.rpxToPx(34), this.rpxToPx(580), this.rpxToPx(380))
				//写入吊牌
				let priceLength = (this.goods.price + '').length
				let tagPriceLength = (this.goods.tagPrice + '').length
				let left = 80 + ((priceLength) * 19)
				let lengthLeft = (tagPriceLength) * 19
				ctx.setFillStyle("#909399")
				ctx.setFontSize(this.rpxToPx(20))
				ctx.fillText('￥' + this.goods.tagPrice, this.rpxToPx(left), this.rpxToPx(640))
				//长按二维码购买
				ctx.setFillStyle("#606266")
				ctx.setFontSize(this.rpxToPx(24))
				ctx.fillText('长按二维码购买', this.rpxToPx(420), this.rpxToPx(700))
				//删除线
				ctx.setFillStyle("#909399")
				ctx.beginPath()
				ctx.setLineWidth(1)
				ctx.moveTo(this.rpxToPx(left), this.rpxToPx(630))
				ctx.lineTo(this.rpxToPx(left + lengthLeft), this.rpxToPx(630))
				ctx.stroke()
				//写入价钱
				ctx.setFillStyle("#F56C6C")
				ctx.setFontSize(this.rpxToPx(38))
				ctx.fillText('￥' + this.goods.price, this.rpxToPx(30), this.rpxToPx(640))
			},
			//绘制用户头像
			setAvatarUrl(ctx, avatarRes) {
				let sWidth = avatarRes.width > avatarRes.height ? avatarRes.width : avatarRes.height
				ctx.arc(this.rpxToPx(30 + 30), this.rpxToPx(680 + 30), this.rpxToPx(30), 0, 2 * Math.PI)
				ctx.clip()
				ctx.drawImage(avatarRes.path, 0, 0, sWidth, sWidth, this.rpxToPx(30), this.rpxToPx(680), this.rpxToPx(60), this.rpxToPx(
					60))
			},
			setQrCode(context, url) {
				context.drawImage(url, 0, 0, 480, 480, this.rpxToPx(440), this.rpxToPx(540), this.rpxToPx(150), this.rpxToPx(
					150))
			},
			//将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
			rpxToPx(rpx) {
				return rpx * this.windowWidth / 750
			},
			createNewImg() {
				if (!this.hasVipCard()) {
					return
				}
				let _this = this
				this.showPopup = true
				this.user = wx.getStorageSync("token")
				//加载中...
				this.loadingImage = true
				wx.downloadFile({
					url: this.$baseURL + '/api/small/shop/goods/share_qr_code?goodsCode=' + this.goods.code,
					header: {
						'content-type': 'application/json',
						'X-Token': this.$uniRequest.defaults.headers.common['X-Token'],
						'tn_id': this.$tnId
					},
					success(res) {
						let qrCodeUrl = res.tempFilePath
						wx.getImageInfo({
							src: _this.user.avatarUrl,
							success(res) {
								let avatarRes = res
								//请求服务器生成一张小程序二维码
								wx.getImageInfo({
									src: _this.goods.imageList[0].replace("http:", "https:"),
									success(res) {
										let context = wx.createCanvasContext('mycanvas')
										context.setFillStyle('#ffffff')
										context.fillRect(0, 0, 600, 800)
										context.restore()
										let path = res.path
										let sWidth = res.width > res.height ? res.width : res.height
										context.drawImage(path, 0, 0, sWidth, sWidth, _this.rpxToPx(50), _this.rpxToPx(40), _this.rpxToPx(500),
											_this.rpxToPx(
												500))
										_this.setUserName(context)
										_this.setQrCode(context, qrCodeUrl)
										_this.setAvatarUrl(context, avatarRes)
										context.draw()
										context.save()
										_this.loadingImage = false
									},
									fail(e) {
										console.log(e)
										Toast('生成海报失败，重新重新来过吧')
									}
								})
							},
							fail(e) {
								console.log(e)
								Toast('生成海报失败，重新重新来过吧')
							}
						})
					},
					fail(e) {
						Toast('生成海报失败，重新重新来过吧')
					}
				})
			},
			saveImage() {
				let _this = this
				wx.canvasToTempFilePath({
					canvasId: 'mycanvas',
					success: function(res) {
						let shareImagePath = res.tempFilePath
						wx.saveImageToPhotosAlbum({
							filePath: shareImagePath,
							success(res) {
								Toast('保存成功')
								_this.onClosePopup()
							}
						})
					},
					fail: function(res) {
						console.log(res.errMsg)
					}
				})
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
					}).catch(e => {})
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
					}).catch(e => {})
					return false
				} else {
					return true
				}
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
	.canvas {
		width: 600rpx;
		height: 800rpx;
		margin: auto;
		background-color: #ffffff;
	}

	.text-button {
		background-color: #ffffff;
		padding: auto;
		font-size: 28rpx;
	}

	.text-button:after {
		border: none;
	}

	.hover-button {}

	.container {
		font-size: 28rpx;
		color: #303133;
		overflow-y: hidden;
	}

	.swiper-box {
		height: 750rpx;
	}

	.dot-image {
		background-color: #eeeeee;
		width: 750rpx;
		height: 750rpx;
	}

	.card {
		background-color: #ffffff;
		padding-left: 20rpx;
		padding-right: 20rpx;
	}

	.delete_price {
		margin-left: 10rpx;
		font-size: 24rpx;
		color: #909399;
		text-decoration: line-through;
	}

	.discount {
		margin-left: 10rpx;
		font-size: 24rpx;
		color: #909399;
	}

	.tools {
		display: flex;
		text-align: center;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		border: 1px solid #DCDFE6;
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

	.popup-image-div {
		background-color: #FFFFFF;
		width: 100%;
		height: 300rpx;
		border-bottom: 1px solid #DCDFE6;
	}

	.detail-tabbar {
		height: 50px;
		width: 100%;
		background-color: #ffffff;
		position: fixed;
		bottom: 0;
		z-index: 99;
		border-top: 1px solid #c8c7cc;
		display: flex;
		text-align: center;
		font-size: 12px;
		color: #606266;
	}

	.detail-tabbar .iconfont {
		font-size: 24px;
	}

	.relative {
		position: relative;
	}

	.message-num {
		border-radius: 18rpx;
		min-width: 36rpx;
		line-height: 36rpx;
		font-style: normal;
		background-color: #fa5151;
		color: #fff;
		font-size: 16rpx;
		position: absolute;
		top: -10rpx;
		right: 10rpx;
	}
</style>
