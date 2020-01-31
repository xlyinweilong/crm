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
									<image class="dot-image" mode="scaleToFill" :src="item"></image>
								</view>
							</swiper-item>
						</swiper>
					</uni-swiper-dot>
				</div>
				<div style="margin-top: 10px;">{{goods.displayName}}{{goods.code}}</div>
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
					<button class="text-button" open-type="share" hover-class="hover-button">
						<span class="iconfont icon-icon_share" style="font-size: 32rpx;"></span>分享
					</button>
				</div>
			</div>
			<!-- 品牌 -->
			<div class="card" style="display: flex;">
				<div style="width: 200rpx;">
					<image style="width: 200rpx;height: 150rpx;" />
				</div>
				<div style="width: 350rpx;">
					<div style="padding-left: 10rpx;margin-top: 30rpx;overflow: hidden;
							text-overflow: ellipsis;white-space: nowrap;">爱慕</div>
					<div style="padding-left: 10rpx;margin-top: 10rpx;font-size: 20rpx;color: #909399;overflow: hidden;
							text-overflow: ellipsis;white-space: nowrap;">
						你对自己的爱，是我给你的爱慕
					</div>
				</div>
				<div style="padding-top: 60rpx;width: 200rpx;text-align: right;">
					进入品牌馆<span class="iconfont icon-arrow-right"></span>
				</div>
			</div>
			<!-- 同系列推荐todo -->

			<!-- 上滑查看图文详情 -->
			<div class="card" style="margin-top: 10px;padding-top: 26rpx;padding-bottom: 26rpx;text-align: center;">
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
				<div style="width: 490rpx;">
					<van-button @click="addToCart" custom-class="popup-button" size="large" color="#706000">加入购物车</van-button>
				</div>
			</div>
		</view>
		<van-toast id="van-toast" />
		<van-popup :show="isShowGoodsDetail" closeable position="bottom" custom-style="height:1000rpx" @close="onCloseGoodsDetail">
			<!-- 第一行，图片、价格、编号 -->
			<div class="popup-image-div">
				<!-- 图片 -->
				<div style="float: left;margin-top: 15px;margin-left: 15px;">
					<image style="width: 250rpx; height: 250rpx; background-color: #eeeeee;" mode="aspectFill" :src="goods.imageList[0]" />
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
									<div :style="{ 'background-color': selected.colorId == color.id ? '#706000':'#F2F6FC',
									'color':selected.colorId == color.id ? '#FFFFFF':'#303133'}"
									 style="padding: 20rpx;">{{color.name}}</div>
								</div>
							</div>
						</div>
						<div style="margin-top: 20rpx;">
							<p style="color: #909399;font-size: 26rpx;">尺码</p>
							<div style="display: flex;flex-wrap:wrap;font-size: 24rpx;color: #606266;">
								<div @click="selectSize(size)" v-for="size in goods.sizeList" :key="size.id" style="width: 152rpx;text-align: center;padding: 14rpx">
									<div :style="{ 'background-color': selected.sizeId == size.id ? '#706000':'#F2F6FC',
									'color':selected.sizeId == size.id ? '#FFFFFF':'#303133'}"
									 style="padding: 20rpx;">{{size.name}}</div>
								</div>
							</div>
						</div>
					</div>
				</scroll-view>
			</view>
			<!-- 第三行，按钮确定 -->
			<div class="popup-button-div">
				<div style="margin-left: 15px;margin-right: 15px;height: 60px;margin-top: 15px;">
					<van-button @click="chooseIntoCart" custom-class="popup-button" size="large" color="#706000">确定</van-button>
				</div>
				<!-- <button class="popup-button">确定</button> -->
			</div>
		</van-popup>
		<loginCom />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import loginCom from '@/pages/shop/components/login'
	import uniSwiperDot from "@/components/uni-swiper-dot/uni-swiper-dot.vue"
	export default {
		components: {
			uniSwiperDot,loginCom
		},
		data() {
			return {
				goods: {
					id: '',
					code: '',
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
				cartList: []
			}
		},
		onLoad(query) {
			if (query.code) {
				this.goods.code = query.code
				this.getInfo()
			}
			//加载购物车数量
			if (wx.getStorageSync('cartList') instanceof Array) {
				this.cartList = wx.getStorageSync('cartList')
			}
		},
		methods: {
			selectSize(size) {
				this.selected.sizeId = size.id
				this.selected.sizeName = size.name
			},
			selectColor(color) {
				this.selected.colorId = color.id
				this.selected.colorName = color.name
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
				Toast.loading('加载中...')
				this.$uniRequest.get('/api/small/shop/goods/info', {
					data: {
						code: this.goods.code
					}
				}).then(res => {
					this.goods = res.data
					if(this.goods.colorList.length == 1){
						this.selectColor(this.goods.colorList[0])
					}
					if(this.goods.sizeList.length == 1){
						this.selectSize(this.goods.sizeList[0])
					}
				}).finally(() => Toast.clear())
			},
			//收藏
			doLike() {
				this.$uniRequest.post('/api/small/shop/user_collect/collect', {
					id: this.goods.id
				}).then(res => {
					this.goods.like = !this.goods.like
					Toast(res.message)
				}).catch(e => Toast.clear())
			},
			addToCart() {
				if (this.selected.sizeId != '' && this.selected.colorId != '') {

				} else {
					this.showGoodsDetail()
				}
			},
			showGoodsDetail() {
				this.isShowGoodsDetail = true
			},
			onCloseGoodsDetail() {
				this.isShowGoodsDetail = false
			},
			chooseIntoCart() {
				if (this.selected.colorId == '') {
					Toast('请选择颜色')
					return
				}
				if (this.selected.sizeId == '') {
					Toast('请选择尺码')
					return
				}
				this.onCloseGoodsDetail()
				let cart = this.cartList.find(c => c.goodsId === this.goods.id && c.colorId === this.selected.colorId && c.sizeId ===
					this.selected.sizeId)
				if (cart != null) {
					cart.quantity += 1
				} else {
					this.cartList.push({
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
						imageList: this.goods.imageList
					})
				}
				wx.setStorageSync('cartList', this.cartList)
				Toast('成功加入购物车')
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
		height: 1000rpx;
	}

	.dot-image {
		background-color: #eeeeee;
		width: 750rpx;
		height: 1000rpx;
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
