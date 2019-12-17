<template>
	<view>
		<van-popup :show="showSelectChannel" close-on-click-overlay position="bottom" custom-style="height: 40%;" @close="showSelectChannel = false">
			<div v-show="loadingChannel" style="text-align: center;margin-top: 20%;height: 100%;">
				<van-loading color="#1989fa" size="40rpx">加载中...</van-loading>
			</div>
			<van-radio-group v-show="!loadingChannel" :value="selectedChannelId">
				<van-cell-group>
					<van-cell v-for="channel in channelList" :title="channel.name" clickable :data-name="channel.id" @click="onClickChannel(channel)">
						<van-radio slot="right-icon" :name="channel.id" />
					</van-cell>
				</van-cell-group>
			</van-radio-group>
		</van-popup>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'

	export default {
		components: {},
		data() {
			return {
				showSelectChannel: false,
				channelList: [],
				loadingChannel: false,
			}
		},
		props: {
			selectedChannelId: {
				default: ''
			},
			selectedChannelName: {
				default: ''
			},
		},
		methods: {
			onOpen() {
				this.showSelectChannel = true
				if (this.channelList.length == 0) {
					this.loadingChannelLocation()
				}
			},
			onClickChannel(channel) {
				wx.setStorageSync('cache.employChannel',channel)
				this.$emit('update:selectedChannelId', channel.id)
				this.$emit('update:selectedChannelName', channel.name)
				this.showSelectChannel = false
			},
			loadingChannelLocation() {
				let _this = this
				wx.getSetting({
					success(res) {
						if (!res.authSetting['scope.userLocation']) {
							wx.authorize({
								scope: 'scope.userLocation',
								success() {
									_this.getWxLocation()
								},
								fail(e) {
									Toast('获取定位失败，请授权定位')
								}
							})
						} else {
							_this.getWxLocation()
						}
					},
					fail(e) {
						Toast('获取定位失败，请授权定位')
					}
				})
			},
			getWxLocation() {
				let _this = this
				wx.getLocation({
					type: 'wgs84',
					success(res) {
						_this.loadingChannelList(res.latitude, res.longitude)
					},
					fail(e) {
						Toast('获取定位失败，请授权定位')
					}
				})
			},
			loadingChannelList(lat, lng) {
				this.loadingChannel = true
				this.$uniRequest.get('/api/small_procedures/channel/nearby', {
					data: {
						lat: lat,
						lng: lng
					}
				}).then(res => {
					this.channelList = res.data
				}).finally(() => this.loadingChannel = false)
			}
		}
	}
</script>

<style scoped>
</style>
