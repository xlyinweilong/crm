<template>
	<view>
		<view class="container">
			<!-- 搜索商品 -->
			<div class="top">
				<div class="search-div" @click="goToSearch">
					<input class="search" placeholder="搜索您喜欢的商品" />
					<div style="float:right;margin-top: 4rpx;">
						<van-icon name="search" size="40rpx" />
					</div>
				</div>
			</div>
			<div style="margin-top: 45px;margin-bottom: 55px;">
				<div v-for="c in theme.componentList" :key="c.index">
					<div v-if="c.key == 'carousel'" :style="{'margin-top':c.marginTop+'px','margin-bottom':c.marginBottom+'px'}">
						<uni-swiper-dot :info="c.imageList" :current="c.current" field="content" :mode="mode" :dotsStyles="dotsStyles">
							<swiper class="swiper-box" @change="change($event,c)" :style="{height:c.imageHeight + 'rpx'}" autoplay="true" :interval="3000">
								<swiper-item v-for="(item ,index) in c.imageList" :key="index">
									<view class="swiper-item" @click="goToPage(item)">
										<image :style="{height:c.imageHeight + 'rpx',width:c.imageWidth+'rpx'}" style="background-color: #eeeeee;"
										 mode="scaleToFill" :src="item.imageUrl"></image>
									</view>
								</swiper-item>
							</swiper>
						</uni-swiper-dot>
					</div>
					<div v-if="c.key == 'div'" :class="c.type == 'shrink' ? 'shrink' : ''" :style="{'text-align':c.align,'font-size':c.fontSize+c.unit,
				'margin-top':c.marginTop+'px','margin-bottom':c.marginBottom+'px'}">
						{{c.text}}
					</div>
					<div v-if="c.key == 'imageList'" style="display: flex;" :style="{'margin-top':c.marginTop+'px','margin-bottom':c.marginBottom+'px'}">
						<image v-for="im in c.imageList" @click="goToPage(im)" style="background-color: #eeeeee;margin: auto;" :style="{width:c.imageWidth+'rpx',height: c.imageHeight+'rpx'}"
						 mode="scaleToFill" :src="im.imageUrl" />
					</div>
					<div v-if="c.key == 'video'">
						<!-- 视频组件 -->
						<video style="width: 100%;" :src="c.videoSrc"
						:autoplay="c.videoAutoplay" :loop="c.videoLoop" controls></video>
					 </div>
				</div>
				
			</div>
		</view>
		<!-- 悬浮的客服电话 -->
		<div v-if="service400 != ''" @click="makePhoneCall" style="position:fixed;right:45px;bottom:160px;background-color: #ffffff;
		border-radius:20px;height: 40px;width: 40px;
		border: 1px solid #d9d9d9;
		box-shadow: 2px 2px 12px 2px rgba(0, 0, 0, 0.1)"><span style="font-size: 38px;" class="iconfont icon-service"></span></div>
		<van-toast id="van-toast" />
		<tabbar ref="tabbar" :active="0" />
		<loginCom/>
		<van-popup :show="showPopup" @close="showPopup = false">
			<image @click="goPopupPage" :style="{width:popup.width+'rpx',height:popup.height+'rpx'}" mode="scaleToFill"
				:src="popup.imageUrl"></image>
		</van-popup>
	</view>
</template>

<script>
	import tabbar from '@/pages/shop/components/index'
	import loginCom from '@/pages/shop/components/login'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import uniSwiperDot from "@/components/uni-swiper-dot/uni-swiper-dot.vue"
	export default {
		components: {
			tabbar,
			uniSwiperDot,
			loginCom
		},
		data() {
			return {
				mode: 'default',
				dotsStyles: {
					selectedBackgroundColor: "#706000",
					backgroundColor: "rgba(255, 255, 255, .3)",
					color: "#eeeeee"
				},
				theme: {
					componentList: []
				},
				service400: '',
				popup:{},
				showPopup:false
			}
		},
		onLoad(query) {
			this.query = query
			this.loadIndex()
			if (query.posCode) {

			}
			this.$refs.tabbar.active = 0
			this.loadPopup()
		},
		methods: {
			goPopupPage() {
				if (this.popup.goPageType == 'APPLETS') {
					uni.navigateTo({
						url: '/' + this.popup.goToPage
					})
				} else {
					uni.navigateTo({
						url: '/pages/info/web?url=' + encodeURIComponent(this.popup.goToPage)
					})	
				}
				this.showPopup = false
			},
			loadPopup() {
				this.$uniRequest.get('/api/small/shop/popup/activity', {
					data: {
						showPage: 'SHOP_INDEX'
					}
				}).then(res => {
					if (res.data != null) {
						this.popup = res.data
						this.showPopup = true
					}
				})
			},
			goToPage(ele) {
				if (ele.imageType == 'H5') {
					uni.navigateTo({
						url: '/pages/info/web?url=' + encodeURIComponent(ele.htmlUrl)
					})
					return
				} else if (ele.imageType == 'PAGE') {
					uni.navigateTo({
						url: ele.pageUrl + '?' + encodeURIComponent(ele.pageParam)
					})
					return
				} else if (ele.imageType == 'GOODS') {
					uni.navigateTo({
						url: '/pages/shop/goods/goods_detail?g=' + encodeURIComponent(ele.goodsCode)
					})
					return
				}
			},
			goToSearch() {
				uni.navigateTo({
					url: '/pages/shop/search/index'
				})
			},
			makePhoneCall(){
				wx.makePhoneCall({
				  phoneNumber: this.service400
				})
			},
			loadIndex() {
				this.theme = wx.getStorageSync('indexPage')
				if (this.theme.id == null) {
					Toast.loading('加载中...')
				}
				this.$uniRequest.get('/api/small/shop/theme/active').then(res => {
					this.theme = res.data
					this.service400 = (this.theme.service400 != null && this.theme.service400 != '') ? this.theme.service400 : ''
					wx.setStorageSync('indexPage', this.theme)
				}).finally(() => Toast.clear())
			},
			change(e, ele) {
				ele.current = e.detail.current;
			},
			onChange(e) {
				this.active = e.detail
			}
		}
	}
</script>

<style>
	page {}
</style>

<style scoped>
	.top {
		position: fixed;
		top: 0;
		z-index: 19;
		background-color: #ffffff;
		width: 100%;
	}

	.shrink {
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.container {
		margin-top: 5px;
	}

	.search-div {
		margin-top: 10rpx;
		margin-left: 15rpx;
		margin-right: 15rpx;
		padding-left: 18rpx;
		padding-right: 18rpx;
		padding-bottom: 5px;
		border-bottom: 1px solid #000000;
		display: flex;
		flex-direction: row;
	}

	.search {
		width: 700rpx;
		border: 0px;
		line-height: 18px;
		height: 22px;
	}
</style>
