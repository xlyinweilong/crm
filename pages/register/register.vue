<template>
	<view style="">
		<div style="padding-top: 15rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-switch-cell title="我有会员卡" :checked="hasVipCard" @change="onChangeHasVipCard" />
		</div>
		<div v-show="!hasVipCard" style="padding-top: 30rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-button :loading="loading" loading-text="注册中..." type="primary" size="large" open-type="getUserInfo"
				 @getuserinfo="createNew">注册成为新会员</van-button>
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
				 size="large" open-type="getUserInfo" @getuserinfo="getUserInfo">绑定会员卡</van-button>
			</van-cell-group>
		</div>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import {
		isResponseOk
	} from '@/utils/http.js'

	export default {
		components: {

		},
		data() {
			return {
				showRegisterType: false,
				hasVipCard: false,
				vipCode: '',
				loading: false,
				scene: ''
			}
		},
		onLoad(query) {
			if (query.scene) {
				this.scene = decodeURIComponent(query.scene)
			}
		},
		methods: {
			onChangeHasVipCard(e) {
				this.hasVipCard = e.detail
			},
			onCloseRegisterType() {
				this.showRegisterType = false
			},
			inputVipCode(e) {
				this.vipCode = e.detail
			},
			createNew() {
				this.vipCode = ''
				this.getUserInfo()
			},
			getUserInfo() {
				let that = this
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						that.register(infoRes.userInfo)
					},
					fail: function() {
						Toast('成为VIP需要您授权获取头像等信息')
					}
				})
			},
			register(userInfo) {
				this.loading = true
				userInfo.vipCode = this.vipCode
				if(this.scene != null && this.scene != ''){
					userInfo.recommendOpenId = this.scene
				}
				this.$uniRequest.post('/api/small_procedures/login/register', userInfo).then(res => {
					if (isResponseOk(res)) {
						uni.redirectTo({
							url: '/pages/info/index'
						})
					} else {
						Toast(res.data.message)
					}
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
