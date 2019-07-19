<template>
	<view style="">
		<div style="text-align: center;font-size: 35rpx;padding-top: 35rpx;">请输入手机号码</div>
		<div style="padding-top: 35rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-field title-width="75rpx" maxlength="11" :value="phone" @input="inputPhone" center clearable placeholder="请输入手机号码" label="+86" border="true"></van-field>
			</van-cell-group>
		</div>
		<div style="padding-top: 30rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-button type="primary" size="large" :disabled="!isMobile" @click="goNext">下一步</van-button>
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
				phone: ''
			}
		},
		onLoad() {

		},
		computed: {
			isMobile() {
				return (/^1[3456789]\d{9}$/.test(this.phone))
			}
		},
		methods: {
			inputPhone(e) {
				this.phone = e.detail
			},
			goNext() {
				uni.navigateTo({
					url: '/pages/register/signCode?id=1&name=uniapp'
				})
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
