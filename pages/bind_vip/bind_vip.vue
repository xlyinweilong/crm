<template>
	<view style="">
		<div style="padding-top: 15rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-field @input="inputVipCode" :value="vipCode" required clearable label="会员卡号" placeholder="请输入会员卡号" />
			</van-cell-group>
		</div>
		<div style="padding-top: 30rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-button :loading="loading" loading-text="绑定中..." :disabled="vipCode == ''" type="primary" size="large" @click="bindVip">绑定会员卡</van-button>
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
				vipCode: '',
				loading: false
			}
		},
		onLoad() {},
		methods: {
			inputVipCode(e) {
				this.vipCode = e.detail
			},
			bindVip() {
				this.loading = true
				this.$uniRequest.post('/api/small_procedures/login/bind_vip', {
					vipCode: this.vipCode
				}).then(res => {
					if (isResponseOk(res)) {
						Toast("绑定成功")
						let user = wx.getStorageSync('token')
						user.cardList = res.data
						wx.setStorageSync('token', user)
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
