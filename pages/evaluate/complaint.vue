<template>
	<view class="evaluate">
		<div v-if="isPosted">
			<div style="margin-top: 200rpx;margin-left: 60rpx;">
				<image class="chenggongImage" src="../../static/images/chenggong.png" /></span>
			</div>
			<div style="color:red;font-size:50rpx;margin-top: 20rpx;">提交成功</div>
			<div style="width: 65%;margin: auto;margin-top: 20rpx;">
				<button @click="redirectTo('info/index')" class="submit"><span style="color: #ffffff;font-size:24rpx;">返回首页</span></button>
			</div>
		</div>
		<div v-if="!isPosted">
			<van-cell-group>
				<div @click="showChannels">
					<van-field :value="channel.name" readonly clickable required label="发生店铺" placeholder="请选择店铺" />
				</div>
			</van-cell-group>
			<van-cell-group>
				<van-field :maxlength="500" :value="message" required label="投诉与意见" type="textarea" placeholder="请输入留言" autosize :border="false"
				 @change="changeMessage" />
			</van-cell-group>
			<div>
				<button :loading="loading" type="primary" class="submit" @click="submit">提交</button>
			</div>
			<van-toast id="van-toast" />
			<van-popup :show="show" @close="onClose" position="bottom" close-on-click-overlay>
				<van-loading v-show="loadingChannel" color="#fff" />
				<van-cell-group v-show="!loadingChannel">
					<van-cell>
						<span @click="onClose" style="color:#1989fa;float: left;">取消</span>
						<span @click="saveChannel" style="color:#1989fa">确定</span>
					</van-cell>
					<van-radio-group :value="tempChnanelId">
						<van-cell v-for="channel in channelList" @click="clickChannel(channel)" center clickable>
							<van-radio :name="channel.id" checked-color="#07c160">{{channel.name}}</van-radio>
						</van-cell>
					</van-radio-group>
				</van-cell-group>
			</van-popup>
		</div>
	</view>
</template>

<script>
	import Toast from 'wxcomponents/vant/toast/toast'

	export default {
		components: {},
		data() {
			return {
				loading: false,
				show: false,
				message: '',
				channel: {
					id: '',
					name: ''
				},
				channelName: '',
				tempChnanelId: '',
				code:'',
				channelList: [],
				loadingChannel: true,
				isPosted: false
			}
		},
		onLoad(query) {
			if (query.code) {
				this.code = decodeURIComponent(query.code)
			}
			let user = wx.getStorageSync('token')
			this.getLocation()
		},
		methods: {
			redirectTo(page) {
				uni.reLaunch({
					url: '/pages/' + page
				})
			},
			saveChannel() {
				if (this.tempChnanelId != '') {
					this.channel = this.channelList.find(c => c.id === this.tempChnanelId)
				} else {
					this.channel = {
						id: '',
						name: ''
					}
				}
				this.onClose()
			},
			clickChannel(e) {
				this.tempChnanelId = e.id
			},
			onClose() {
				this.show = false
			},
			changeMessage(e) {
				this.message = e.detail
			},
			showChannels() {
				this.tempChnanelId = this.channelId
				this.show = true
			},
			getLocation() {
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
									_this.getChannelList(0, 0)
								}
							})
						} else {
							_this.getWxLocation()
						}
					},
					fail(e) {
						_this.getChannelList(0, 0)
					}
				})
			},
			getWxLocation() {
				let _this = this
				wx.getLocation({
					type: 'wgs84',
					success(res) {
						_this.getChannelList(res.latitude, res.longitude)
					},
					fail(e) {
						_this.getChannelList(0, 0)
					}
				})
			},
			getChannelList(lat, lng) {
				this.loadingChannel = true
				this.$uniRequest.get('/api/small_procedures/channel/nearby', {
					data: {
						lat: lat,
						lng: lng
					}
				}).then(res => {
					this.channelList = res.data
					if(this.code != ''){
						let channel = this.channelList.find(d => d.code == this.code)
						if(channel != null){
							this.tempChnanelId = channel.id
							this.saveChannel()
						}
					}
				}).finally(() => this.loadingChannel = false)
			},
			submit() {
				if (this.channel.id == '') {
					Toast.fail('请选择店铺')
					return
				}
				if (this.message == '') {
					Toast.fail('请输入投诉与意见')
					return
				}
				if (!this.loading) {
					this.loading = true
					this.$uniRequest.post('/api/small_procedures/complaint/save', {
						channelId: this.channel.id,
						channelName: this.channel.name,
						message: this.message
					}).then(res => {
						this.isPosted = true
					}).finally(() => this.loading = false)
				}

			}
		}
	}
</script>

<style>
	page {
		background-color: #ffffff;
	}
</style>

<style scoped>
	
	.evaluate{
		text-align: center;
	}
	
	.evaluate .submit {
		font-size: 26rpx;
		border: 1px solid #AE0000;
		padding: 0px;
		border-radius: 2em;
		margin: 40rpx 60rpx 0 60rpx;
		background: #AE0000;
	}
	
	.chenggongImage {
		width: 300rpx;
		height: 300rpx;
		vertical-align: middle;
	}
</style>
