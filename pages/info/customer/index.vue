<template>
	<view style="padding-left: 10rpx;padding-right: 10rpx;background-color: #FFFFFF;">
		<van-dialog id="van-dialog" />
		<cell @startmessage="startmessage" @completemessage="completemessage" plugid='2683627adc8e8e3ce381df0197a4fdf4'  />
	</view>
</template>

<script>
	import Dialog from 'wxcomponents/vant/dialog/dialog'


	export default {
		components: {},
		computed: {
		},
		data() {
			return {
			}
		},
		onPullDownRefresh() {
		},
		onLoad() {},
		onShareAppMessage(options) {
		},
		onShow() {
		},
		methods: {
			startmessage(e){
				console.log(e)
			},
			completemessage(e){
				console.log(e)
			}
		}
	}
</script>


<style scoped>
</style>
