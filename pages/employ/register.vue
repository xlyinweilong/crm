<template>
	<view style="">
		<div style="padding-top: 15rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<i-input v-model="employCode" title="收货人" autofocus placeholder="名字" />
				<!-- <van-field :value="employCode" required clearable label="员工编号" placeholder="请输入员工编号" /> -->
			</van-cell-group>
		</div>
		<div style="padding-top: 30rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-button :disabled="employCode == ''" type="primary" size="large">绑定</van-button>
			</van-cell-group>
		</div>

	</view>
</template>

<script>
	import '@/static/css/style.css'


	export default {
		components: {

		},
		data() {
			return {
				employCode:'',
				current: 0,
				showMembershipCode: false,
				showMyInfo: false
			}
		},
		onLoad() {

		},
		methods: {
			onClickLeft() {
				wx.showToast({
					title: '点击返回',
					icon: 'none'
				})
			},
			onClickRight() {
				wx.showToast({
					title: '点击按钮',
					icon: 'none'
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
