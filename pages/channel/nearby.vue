<template>
	<view class="nearby">
		<!-- <van-search :value="searchText" placeholder="请输入搜索关键词" /> -->
		<div class="cell" v-for="channel in channelList">
			<div style="margin-bottom: 10rpx;">
			<van-row>
				<van-col span="8">
					<image class="channelImage" :src="channel.imageUrl" />
				</van-col>
				<van-col span="16">
					<div style="position:relative;height:185rpx;">
						<p class="name">{{channel.name}}</p>
						<div class="endDiv">
							<p class="address">{{channel.address}}</p>
							<p class="distance">
								<van-icon color="#675500" size="20rpx" name="location-o" />{{channel.distanceStr}}</p>
						</div>
					</div>
				</van-col>
			</van-row>
			</div>
			<div style="padding-top:15rpx;border-top:1rpx solid #000;">
				<van-row>
					<van-col span="12">
						<div style="text-align: center;font-size: 28rpx;color: #675500;" @click="makePhoneCall(channel)">
							<span class="iconfont icon-dianhua" style="color:#C80000"></span>咨询电话
						</div>
					</van-col>
					<van-col span="12">
						<div style="text-align: center;font-size: 28rpx;color: #675500;" @click="mapGoTo(channel)">
							<span class="iconfont icon-dianpu" style="color:#C80000"></span>店铺导航
							</div>
					</van-col>
				</van-row>
			</div>
		</div>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'

	export default {
		components: {

		},
		data() {
			return {
				searchText: "",
				channelList: [],
				mapContext: null
			}
		},
		onLoad() {
			let user = wx.getStorageSync('token')
			this.getLocation(false)
		},
		onPullDownRefresh() {
			this.getLocation(true)
		},
		methods: {
			mapGoTo(channel) {
				if (channel.name == null || channel.name.length === 0) {
					Toast('缺少店铺名称，无法导航')
					return
				}
				if (channel.lat == null || channel.lng == null) {
					Toast('店铺还未设置坐标，无法导航')
					return
				}
				if (channel.address == null || channel.address.length === 0) {
					Toast('店铺还未设置地址，无法导航')
					return
				}
				wx.getLocation({ //获取当前经纬度
					type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
					success: function(res) {
						wx.openLocation({ //​使用微信内置地图查看位置。
							latitude: channel.lat, //要去的纬度-地址
							longitude: channel.lng, //要去的经度-地址
							name: channel.name,
							address: channel.address
						})
					}
				})
			},
			makePhoneCall(channel) {
				if (channel.phone == null || channel.phone.length === 0) {
					Toast('店铺咨询电话还未开放')
					return
				}
				wx.makePhoneCall({
					phoneNumber: channel.phone //仅为示例，并非真实的电话号码
				})
			},
			getLocation(reflush) {
				console.log("调用getLocation")
				let _this = this
				wx.getSetting({
					success(res) {
						console.log("进入wx.getSetting的success")
						if (!res.authSetting['scope.userLocation']) {
							console.log("没有权限")
							wx.authorize({
								scope: 'scope.userLocation',
								success() {
									_this.getWxLocation(reflush)
								},fail(e){
									console.log("wx.authorize授权失败")
									console.log(e)
								}
							})
						} else {
							_this.getWxLocation(reflush)
						}
					},
					fail(e){
						console.log("授权失败")
						console.log(e)
					}
				})
			},
			getWxLocation(reflush) {
				console.log("掉用定位")
				let _this = this
				wx.getLocation({
					type: 'wgs84',
					success(res) {
						console.log("定位成功")
						console.log(res)
						_this.getChannelList(res.latitude, res.longitude, reflush)
					},
					fail(e){
						console.log("定位失败")
						console.log(e)
					}
				})
			},
			getChannelList(lat, lng, reflush) {
				if (!reflush) {
					wx.showLoading({
						title: '加载中',
					})
				}
				this.$uniRequest.get('/api/small_procedures/channel/nearby', {
					data: {
						lat: lat,
						lng: lng
					}
				}).then(res => {
					if (reflush) {
						uni.stopPullDownRefresh()
					}
					this.channelList = res.data
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #cccccc;
	}
</style>

<style scoped>
	.nearby .cell {
		margin: 20rpx 15rpx 0rpx 15rpx;
		padding: 15rpx;
		background-color: #FFFFFF;
	}

	.nearby .channelImage {
		width: 200rpx;
		height: 200rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nearby .name {
		margin-top: 15rpx;
		font-size: 35rpx;
		font-weight: 800;
		color: #675500;
	}

	.nearby .endDiv {
		position: absolute;
		bottom: 0rpx;
	}

	.nearby .address {
		font-size: 20rpx;
		color: #675500;
	}

	.nearby .distance {
		margin-top: 10rpx;
		font-size: 20rpx;
		color: #675500;
	}
</style>
