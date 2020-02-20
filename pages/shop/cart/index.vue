<template>
	<view>
		<!-- 购物车空的时候 -->
		<view v-if="cartList.length == 0" style="text-align: center;">
			<div style="margin-top: 150rpx;">
				<van-icon color="#909399" name="shopping-cart-o" size="200rpx" />
			</div>
			<p style="margin-top: 30rpx;size: 30rpx;">购物车空空</p>
			<div style="margin-top: 30rpx;" @click="goToGoodsList">
				<van-button color="#706000">去逛逛</van-button>
			</div>
		</view>
		<!-- 购物车有商品的时候 -->
		<view v-if="cartList.length > 0">
			<!-- 商品列表 -->
			<div class="goods_list">
				<!-- 商品明细 -->
				<div v-for="(e,index) in cartList" class="goods_detail">
					<!-- 选中标签 -->
					<div style="width:40rpx;padding-top: 125rpx;margin-left: 5rpx; margin-right: 5rpx;">
						<van-checkbox icon-size="40rpx" :value="e.checked" checked-color="#706000" @change="onChangeCheck($event,e)" />
					</div>
					<!-- 商品图片 -->
					<div @click="goToGoodsDetail(e)" style="width:250rpx;margin-top: 25rpx;">
						<image style="width: 250rpx; height: 250rpx; background-color: #eeeeee;" mode="aspectFit" :src="e.imageList[0]" />
					</div>
					<!-- 右侧区域 -->
					<div style="font-size:26rpx;padding-top: 10px;color: #606266;width:400rpx;margin-left: 10rpx;">
						<!-- 第一层，名称和删除 -->
						<div style="text-align: right;">
							<div @click="goToGoodsDetail(e)" style="text-align: left;float:left;width:330rpx;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
								{{e.goodsDisplayName}}
							</div>
							<div>
								<van-icon @click="deleteEle(e,index)" size="38rpx" name="delete" />
							</div>
						</div>
						<!-- 第二层颜色尺码 -->
						<div class="goods_color" style="text-align: right;" @click="showGoodsDetail(e)">
							<div style="text-align: left;float:left;width:300rpx;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
								颜色：{{e.colorName}}、尺码：{{e.sizeName}}
							</div>
							<div style="margin-right: 15rpx;">
								<van-icon name="arrow-down" size="30rpx" />
							</div>
						</div>
						<!-- 第三层，金额、数量 -->
						<div style="margin-top: 50rpx;text-align: right;">
							<div style="float:left;margin-top: 15rpx;">￥{{e.price}}</div>
							<van-stepper input-width="60rpx" @change="onChangeStepper($event,e,index)" button-size="60rpx" :value="e.quantity"
							 :step="1" :min="1" :max="e.stockCount > 1 ? e.stockCount : 1" />
						</div>
					</div>
				</div>
			</div>
			<div v-if="cardTips != ''" style="margin-top: 10px;padding-left: 20rpx;padding-right: 20;font-size: 22rpx;color:#706000">{{cardTips}}</div>
			<div style="margin-bottom: 10px;height: 10px;"></div>
			<!-- 结算栏 -->
			<div class="settle">
				<!-- 全选 -->
				<div style="float: left;margin-left: 20rpx;margin-top: 18px;">
					<van-checkbox :value="checkedAll" checked-color="#706000" @change="onChangeCheckAll">
						全选
					</van-checkbox>
				</div>
				<!-- 结算 -->
				<div style="float: right">
					<div class="settle-button" @click="doSettle">结算</div>
				</div>
				<!-- 总计 -->
				<div style="float: right;margin-right: 20rpx;padding-top: 13px;">
					<div class="settle-total">
						<p><span style="color: #909399;">总计：</span>
							<span>￥{{totalAmount}}</span></p>
						<p><span style="color: #909399;">不含运费</span></p>
					</div>
				</div>
			</div>
			<van-dialog id="van-dialog" confirm-button-color="#706000" />
			<van-popup z-index="200" :show="isShowGoodsDetail" closeable position="bottom" custom-style="height:1000rpx" @close="onCloseGoodsDetail">
				<div v-if="loadingDetail" style="text-align: center;">加载中...</div>
				<div v-if="!loadingDetail">
					<!-- 第一行，图片、价格、编号 -->
					<div class="popup-image-div">
						<!-- 图片 -->
						<div style="float: left;margin-top: 15px;margin-left: 15px;">
							<image style="width: 250rpx; height: 250rpx; background-color: #eeeeee;" mode="aspectFit" :src="selected.imageList[0]" />
						</div>
						<div style="float: left;margin-left: 20px;margin-top: 15px;">
							<!-- 价格 -->
							<p style="font-size: 18px;color:#303133">￥{{goods.price}}</p>
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
							<div style="margin-bottom: 90px;margin-top: 10px;padding-left: 15px;">
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
											<div :style="{  'background-color': selected.sizeId == size.id ? '#706000':(size.stockCount == 0 ? '#F2F6FC':'#ffffff'),
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
						<div style="margin-left: 15px;margin-right: 15px;height: 60px;margin-top: 15px;">
							<van-button @click="onOkGoodsDetail" :disabled="selected.stockCount == 0" custom-class="popup-button" size="large"
							 color="#706000">
								<span v-text="selected.stockCount == 0 ? '售罄' : '确定'"></span>
							</van-button>
						</div>
					</div>
				</div>
			</van-popup>
		</view>
		<tabbar :active="2" />
		<loginCom />
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import tabbar from '@/pages/shop/components/index'
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import loginCom from '@/pages/shop/components/login'
	import Toast from '@/wxcomponents/vant/toast/toast'
	export default {
		components: {
			tabbar,
			loginCom
		},
		data() {
			return {
				loadingDetail: false,
				loading: false,
				cartList: [],
				isShowGoodsDetail: false,
				selected: {},
				goods: {},
				cardList: null,
				baseExpressFee: -1,
				expressAmountFree: -1,
				cardTips: ''
			}
		},
		computed: {
			totalAmount() {
				if (this.cartList == null) {
					return 0
				}
				return this.cartList.filter(e => e.checked).reduce((t, a) => t + (a.quantity * a.price), 0)
			},
			checkedAll() {
				if (this.cartList == null) {
					return false
				}
				return this.cartList.every(c => c.checked)
			}
		},
		onLoad(query) {
			let user = wx.getStorageSync('token')
			if (user != '' && user != null) {
				this.cardList = user.cardList
			}
		},
		onShow() {
			
			if (wx.getStorageSync('cartList') instanceof Array) {
				this.cartList = wx.getStorageSync('cartList')
				this.loadInfo()
			}
		},
		onReady() {},
		methods: {
			loadInfo() {
				Toast.loading({
					duration: 0,
					mask: true,
					message: '加载中...'
				})
				let _this = this
				uni.request({
					url: _this.$baseURL + '/api/small/shop/order/settle_info',
					data: _this.cartList,
					method: 'POST',
					header: {
						'content-type': 'application/json',
						'X-Token': _this.$uniRequest.defaults.headers.common['X-Token'],
						'tn_id': _this.$tnId
					},
					success: (res) => {
						res = res.data
						if (res.code == 0) {
							_this.baseExpressFee = res.data.baseExpressFee
							_this.expressAmountFree = res.data.expressAmountFree
							_this.cardTips = res.data.cardTips
							//刷新库存数量
							_this.cartList = res.data.settleList
							Toast.clear()
							wx.setStorageSync('cartList', _this.cartList)
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
			//选择尺码
			selectSize(size) {
				if (this.selected.colorId == '') {
					Toast("请先选择颜色")
					return
				}
				if (size.stockCount <= 0) {
					return
				}
				this.selected.sizeId = size.id
				this.selected.sizeName = size.name
				this.selected.stockCount = size.stockCount
			},
			//选择颜色
			selectColor(color) {
				if (color.stockCount <= 0) {
					return
				}
				this.selected.colorId = color.id
				this.selected.colorName = color.name
				//加载尺码的库存
				this.goods.sizeList.forEach(si => {
					si.stockCount = this.goods.stockList.filter(s => s.colorId === this.selected.colorId && this.selected.sizeId ===
						s.sizeId).reduce(
						(t, a) => t + a.stockCount, 0)
				})
			},
			//跳转到商品明细
			goToGoodsDetail(e) {
				uni.navigateTo({
					url: '/pages/shop/goods/goods_detail?g=' + e.goodsCode
				})
			},
			//跳转到商品列表
			goToGoodsList() {
				uni.navigateTo({
					url: '/pages/shop/goods/goods_list'
				})
			},
			//选中，或者取消
			onChangeCheck(e, d) {
				d.checked = e.detail
				if (e.detail && d.stockCount <= 0) {
					Toast("库存不足")
					d.checked = false
				}
				wx.setStorageSync('cartList', this.cartList)
			},
			//修改数量
			onChangeStepper(e, d, index) {
				d.quantity = e.detail
				d.checked = true
				wx.setStorageSync('cartList', this.cartList)
			},
			//全选
			onChangeCheckAll(e) {
				if (this.checkedAll) {
					this.cartList.forEach(c => c.checked = false)
				} else {
					this.cartList.forEach(c => c.checked = true)
				}
			},
			//加载弹出窗明细
			showGoodsDetail(e) {
				this.selected = e
				this.isShowGoodsDetail = true
				//加载数据
				this.loadingDetail = true
				this.$uniRequest.get('/api/small/shop/goods/info', {
					data: {
						code: e.goodsCode
					}
				}).then(res => {
					this.goods = res.data
					this.goods.colorList.forEach(c => {
						c.stockCount = this.goods.stockList.filter(s => s.colorId === c.id).reduce((t, a) => t + a.stockCount, 0)
					})
					this.goods.sizeList.forEach(si => {
						si.stockCount = this.goods.stockList.filter(s => s.colorId === this.selected.colorId && si.id === s.sizeId).reduce(
							(t, a) => t + a.stockCount, 0)
					})
					//判断当前货品的库存是否够
					e.stockCount = this.goods.stockList.filter(s => s.colorId === this.selected.colorId && this.selected.sizeId ===
						s.sizeId).reduce(
						(t, a) => t + a.stockCount, 0)
					if (e.stockCount < 0) {
						e.checked = false
						wx.setStorageSync('cartList', this.cartList)
					}
				}).finally(() => this.loadingDetail = false)
			},
			//确定弹出页面
			onOkGoodsDetail() {
				this.selected.checked = true
				wx.setStorageSync('cartList', this.cartList)
				this.isShowGoodsDetail = false
			},
			//关闭弹出页面
			onCloseGoodsDetail() {
				this.cartList = wx.getStorageSync('cartList')
				this.isShowGoodsDetail = false
			},
			//删除商品
			deleteEle(ele, index) {
				Dialog.confirm({
					title: '提示',
					message: '确定要删除该商品吗？'
				}).then(() => {
					this.cartList.splice(index, 1)
					wx.setStorageSync('cartList', this.cartList)
				}).catch(() => {})
			},
			//结算
			doSettle() {
				if (this.hasVipCard()) {
					if (this.cartList.filter(e => e.checked).length == 0) {
						Toast("请选择要结算的商品")
						return
					}
					//判断限购
					let outList = this.cartList.filter(g => g.checked && g.limitBuyCount != null && g.limitBuyCount > 0 && g.quantity > g.limitBuyCount);
					if (outList.length > 0) {
						Dialog.alert({
							message: outList[0].goodsDisplayName + '限购' + outList[0].limitBuyCount
						}).then(() => {
							// on close
						})
						return
					}
					//售罄判断
					let saleOut = this.cartList.filter(g => g.checked && g.quantity == 0)
					if (saleOut.length > 0) {
						Toast(saleOut[0].goodsDisplayName + saleOut[0].colorName + saleOut[0].sizeName + '已经售罄')
						return
					}
					uni.navigateTo({
						url: '/pages/shop/settle/index'
					})
				}
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
			}
		}
	}
</script>

<style>
	page {
		background-color: #ffffff;
	}

	.popup-button {
		letter-spacing: 15rpx;
	}
</style>

<style scoped>
	.goods_color {
		margin-top: 20rpx;
		padding-top: 15rpx;
		padding-bottom: 15rpx;
		padding-left: 10rpx;
		color: #909399;
		width: 400rpx;
		border: 1px solid #DCDFE6;
		font-size: 22rpx;
	}

	.goods_list {
		background-color: #ffffff;
	}

	.goods_detail {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 300rpx;
		border-bottom: 1px solid #E4E7ED;
	}

	.settle {
		z-index: 100;
		background-color: #ffffff;
		width: 100%;
		height: 60px;
		position: fixed;
		bottom: 50px;
		border-top: 1px solid #E4E7ED;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}

	.settle-button {
		z-index: 100;
		font-size: 38rpx;
		text-align: center;
		width: 200rpx;
		height: 60px;
		color: #ffffff;
		background-color: #706000;
		line-height: 60px;
		letter-spacing: 10rpx;
	}

	.settle-total {
		font-size: 28rpx;
		color: #303133;
		text-align: right;
		height: 60px;
	}

	.popup-button-div {
		background-color: #FFFFFF;
		z-index: 200;
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
</style>
