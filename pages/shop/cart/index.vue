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
		<view>

		</view>
		<!-- 购物车有商品的时候 -->
		<view>
			<!-- 商品列表 -->
			<div class="goods_list">
				<!-- 商品明细 -->
				<div v-for="e in list" class="goods_detail">
					<!-- 选中标签 -->
					<div style="width:40rpx;padding-top: 125rpx;margin-left: 5rpx; margin-right: 5rpx;">
						<van-checkbox icon-size="40rpx" :value="checkedAll" checked-color="#706000" @change="onChangeCheckAll" />
					</div>
					<!-- 商品图片 -->
					<div style="width:250rpx;margin-top: 25rpx;">
						<image style="width: 250rpx; height: 250rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
					</div>
					<!-- 右侧区域 -->
					<div style="font-size:26rpx;padding-top: 10px;color: #606266;width:400rpx;margin-left: 10rpx;">
						<!-- 第一层，名称和删除 -->
						<div style="text-align: right;">
							<div style="text-align: left;float:left;width:330rpx;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
								LA CLOVER兰卡文蜜糖琥珀兰卡文蜜糖琥珀兰卡文蜜糖琥珀
							</div>
							<div>
								<van-icon @click="deleteEle" size="38rpx" name="delete" />
							</div>
						</div>
						<!-- 第二层颜色尺码 -->
						<div class="goods_color" style="text-align: right;">
							<div @click="showGoodsDetail" style="text-align: left;float:left;width:300rpx;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
								颜色：香槟色
							</div>
							<div style="margin-right: 15rpx;">
								<van-icon name="arrow-down" size="30rpx" />
							</div>
						</div>
						<!-- 第三层，金额、数量 -->
						<div style="margin-top: 50rpx;text-align: right;">
							<div style="float:left;margin-top: 15rpx;">￥280.00</div>
							<van-stepper input-width="60rpx" button-size="60rpx" :value="1" :step="1" :min="1" />
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
							<span>￥1200.00</span></p>
						<p><span style="color: #909399;">不含运费</span></p>
					</div>
				</div>
			</div>
			<van-dialog id="van-dialog" confirm-button-color="#706000" />
			<van-popup :show="isShowGoodsDetail" closeable position="bottom" custom-style="height:1000rpx" @close="onCloseGoodsDetail">
				<!-- 第一行，图片、价格、编号 -->
				<div class="popup-image-div">
					<!-- 图片 -->
					<div style="float: left;margin-top: 15px;margin-left: 15px;">
						<image style="width: 250rpx; height: 250rpx; background-color: #eeeeee;" mode="aspectFill" :src="src" />
					</div>
					<div style="float: left;margin-left: 20px;margin-top: 15px;">
						<!-- 价格 -->
						<p style="font-size: 18px;color:#303133">￥1280.00</p>
						<p style="font-size: 14px;color: #909399;">颜色：香槟 尺码：XXL</p>
					</div>
				</div>
				<!-- 第二行，颜色、尺码 -->
				<view>
					<scroll-view :scroll-y="true" style="height: 700rpx;">
						<div style="margin-bottom: 90px;margin-top: 10px;padding-left: 15px;">
							<div>
								<p style="color: #909399;font-size: 26rpx;">颜色</p>
								<div style="display: flex;font-size: 30rpx;color: #606266;">
									<div style="width: 25%;text-align: center;padding: 20rpx">
										<div style="background-color: #706000;color: #FFFFFF;padding: 20rpx;">红色</div>
									</div>
								</div>
							</div>
							<div style="margin-top: 20rpx;">
								<p style="color: #909399;font-size: 26rpx;">尺码</p>
								<div style="display: flex;font-size: 30rpx;color: #606266;">
									<div style="width: 25%;text-align: center;padding: 20rpx;">
										<div style="background-color: #F2F6FC;padding: 20rpx;">xl</div>
									</div>
									<div style="width: 25%;text-align: center;padding: 20rpx">
										<div style="background-color: #706000;color: #FFFFFF;padding: 20rpx;">xll</div>
									</div>
								</div>
							</div>
						</div>
					</scroll-view>
				</view>
				<!-- 第三行，按钮确定 -->
				<div class="popup-button-div">
					<div style="margin-left: 15px;margin-right: 15px;height: 60px;margin-top: 15px;">
						<van-button custom-class="popup-button" size="large" color="#706000">确定</van-button>
					</div>
					<!-- <button class="popup-button">确定</button> -->
				</div>
			</van-popup>
		</view>
		<tabbar :active="2" />
	</view>
</template>

<script>
	import tabbar from '@/pages/shop/components/tabbar'
	import Dialog from 'wxcomponents/vant/dialog/dialog'

	export default {
		components: {
			tabbar
		},
		data() {
			return {
				loading: false,
				list: [1, 2, 3, 4, 5, 6, 7],
				checkedAll: false,
				isShowGoodsDetail: false
			}
		},
		onLoad(query) {},
		methods: {
			onChangeCheckAll(e) {
				this.checkedAll = e.detail
			},
			showGoodsDetail() {
				this.isShowGoodsDetail = true
			},
			onCloseGoodsDetail() {
				this.isShowGoodsDetail = false
			},
			deleteEle(ele) {
				Dialog.confirm({
					title: '提示',
					message: '确定要删除该商品吗？'
				}).then(() => {}).catch(() => {})
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
		font-size: 26rpx;
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
</style>
