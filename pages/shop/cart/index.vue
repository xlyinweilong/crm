<template>
	<view>
		<!-- 用户没有登录的时候 -->
		<view style="text-align: center;">
			<!-- 购物车图标 -->
			<!-- <div style="margin-top: 150rpx;">
				<van-icon color="#909399" name="shopping-cart-o" size="200rpx" />
			</div> -->
			<!-- 按钮 -->
			<!-- <p style="margin-top: 30rpx;size: 30rpx;">您还未登录</p>
			<div style="margin-top: 30rpx;">
				<van-button color="#706000">登录/注册</van-button>
			</div> -->
		</view>
		<!-- 购物车空的时候 -->
		<view v-if="cartList.length == 0" style="text-align: center;">
			<div style="margin-top: 150rpx;">
				<van-icon color="#909399" name="shopping-cart-o" size="200rpx" />
			</div>
			<p style="margin-top: 30rpx;size: 30rpx;">购物车空空</p>
			<div style="margin-top: 30rpx;">
				<van-button color="#706000" @click="goToGoodsList">去逛逛</van-button>
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
						<image style="width: 250rpx; height: 250rpx; background-color: #eeeeee;" mode="aspectFill" :src="e.imageList[0]" />
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
							 :step="1" :min="1" />
						</div>
					</div>
				</div>
			</div>
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
					<div class="settle-button">结算</div>
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
							<image style="width: 250rpx; height: 250rpx; background-color: #eeeeee;" mode="aspectFill" :src="selected.imageList[0]" />
						</div>
						<div style="float: left;margin-left: 20px;margin-top: 15px;">
							<!-- 价格 -->
							<p style="font-size: 18px;color:#303133">￥{{goods.price}}</p>
							<!-- <p style="font-size: 14px;color: #909399;">颜色：香槟 尺码：XXL</p> -->
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
							<van-button @click="onOkGoodsDetail" custom-class="popup-button" size="large" color="#706000">确定</van-button>
						</div>
					</div>
				</div>
			</van-popup>
		</view>
		<tabbar :active="2" />
		<loginCom />
	</view>
</template>

<script>
	import tabbar from '@/pages/shop/components/index'
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import loginCom from '@/pages/shop/components/login'
	export default {
		components: {
			tabbar,loginCom
		},
		data() {
			return {
				loadingDetail: false,
				loading: false,
				cartList: [],
				isShowGoodsDetail: false,
				selected: {},
				goods: {}
			}
		},
		computed: {
			totalAmount() {
				return this.cartList.filter(e => e.checked).reduce((t, a) => t + (a.quantity * a.price), 0)
			},
			checkedAll() {
				return this.cartList.every(c => c.checked)
			}
		},
		onLoad(query) {
			
		},
		onShow(){
			if (wx.getStorageSync('cartList') instanceof Array) {
				this.cartList = wx.getStorageSync('cartList')
			}
		},
		methods: {
			//选择尺码
			selectSize(size) {
				this.selected.sizeId = size.id
				this.selected.sizeName = size.name
			},
			//选择颜色
			selectColor(color) {
				this.selected.colorId = color.id
				this.selected.colorName = color.name
			},
			//跳转到商品明细
			goToGoodsDetail(e) {
				uni.navigateTo({
					url: '/pages/shop/goods/goods_detail?code=' + e.goodsCode
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
			deleteEle(ele, index) {
				Dialog.confirm({
					title: '提示',
					message: '确定要删除该商品吗？'
				}).then(() => {
					this.cartList.splice(index, 1)
					wx.setStorageSync('cartList', this.cartList)
				}).catch(() => {})
			}
		}
	}
</script>

<style>
	/* page {
		background-color: #F2F6FC;
	} */

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
		margin-bottom: 110px;
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
