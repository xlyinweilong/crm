<template>
	<view style="">
		<div style="padding-top: 15rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-field :value="verificationCode" center clearable label="短信验证码" placeholder="请输入短信验证码" border="false" use-button-slot>
					<van-button slot="button" size="small" type="primary">发送验证码</van-button>
				</van-field>
			</van-cell-group>
		</div>
		<div v-show="!hasVipCard" style="padding-top: 30rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-button :loading="loading" loading-text="注册中..." type="primary" size="large" open-type="getPhoneNumber"
				 @getphonenumber="getPhoneNumber">注册成为新会员</van-button>
			</van-cell-group>
			<p style="text-align: center;font-size:20rpx;color:#909399">会员卡不在身边，可注册成新会员后，在个人中心绑定已有会员卡</p>
		</div>
		<div v-show="hasVipCard" style="padding-top: 15rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-field @input="inputVipCode" :value="vipCode" required clearable label="会员卡号" placeholder="请输入会员卡号" />
			</van-cell-group>
		</div>
		<div v-show="hasVipCard" style="padding-top: 30rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-button v-show="!hasVipCard" :loading="loading" loading-text="绑定中..." :disabled="vipCode == ''" type="primary"
				 size="large" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">绑定会员卡</van-button>
			</van-cell-group>
		</div>
	</view>
</template>

<script>
	import '@/static/css/style.css'
	import Toast from '@/wxcomponents/vant/toast/toast';

	export default {
		components: {

		},
		data() {
			return {
				hasVipCard: false,
				vipCode: '',
				loading: false,
				verificationCode:''
			}
		},
		onLoad() {

		},
		methods: {
			onChangeHasVipCard(e) {
				this.hasVipCard = e.detail
			},
			getPhoneNumber(e) {
				console.log(e)
				console.log(e.detail.errMsg)
				console.log(e.detail.iv)
				console.log(e.detail.encryptedData)
			},
			inputVipCode(e) {
				this.vipCode = e.detail
			},
			register() {

			},
			doBind() {
				//绑定已经有的会员卡
				//注册成为新的会员
				this.updateUserInfo()
				// 查看是否授权
				wx.getSetting({
					success(res) {
						if (res.authSetting['scope.userInfo']) {
							wx.getUserInfo({
								success: function(res) {
									console.log(res.userInfo)
								}
							})
						} else {
							wx.authorize({
								scope: 'scope.userInfo',
								success() {
									wx.getUserInfo({
										success: function(res) {
											console.log(res.userInfo)
										}
									})
								},
								fail() {
									Toast('授权后可以绑定')
								}
							})
						}
					}
				})
			},
			updateUserInfo() {
				this.loading = true
				this.$uniRequest.post('/api/small_procedures/employ/bind', {
					data: {
						code: this.employCode
					}
				}).then(res => {

				}).finally(() => this.loading = false)
			}
		}
	}
</script>

<style scoped>
	image {
		will-change: transform
	}
</style>

<style>

</style>
