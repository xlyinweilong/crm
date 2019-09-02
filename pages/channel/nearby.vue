<template>
	<view class="nearby">
		<van-search :value="searchText" placeholder="请输入搜索关键词" />
		<div class="cell" v-for="channel in channelList">
			<van-row>
				<van-col span="8">
					<image class="channelImage" :src="channel.imageUrl" />
				</van-col>
				<van-col span="16">
					<div style="position:relative;height:185rpx;">
						<p class="name">{{channel.name}}</p>
						<div class="endDiv">
							<p class="address">{{channel.address}}</p>
							<p class="distance"><van-icon color="#675500" size="20rpx" name="location-o" />{{channel.distanceStr}}</p>
						</div>
					</div>
				</van-col>
			</van-row>
		</div>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				searchText: "",
				channelList: []
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
			getLocation(reflush) {
				let _this = this
				wx.getSetting({
					success(res) {
						if (!res.authSetting['scope.userLocation']) {
							wx.authorize({
								scope: 'scope.userLocation',
								success() {
									_this.getWxLocation(reflush)
								}
							})
						} else {
							_this.getWxLocation(reflush)
						}
					}
				})
			},
			getWxLocation(reflush) {
				let _this = this
				wx.getLocation({
					type: 'gcj02',
					success(res) {
						_this.getChannelList(res.latitude, res.longitude, reflush)
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
