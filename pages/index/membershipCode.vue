<template>
	<view style="padding-left: 10rpx;padding-right: 10rpx;background-color: #FFFFFF;">
	</view>
</template>

<script>
	import '@/static/css/style.css'

	export default {
		components: {
		},
		data() {
			return {
				title: 'Hello',
				current: 0,
				info: [{
					url: '../../static/images/footer1.png'
				}, {
					url: '../../static/images/footer1.png'
				}, {
					url: '../../static/images/footer1.png'
				}],
				showMembershipCode:false
			}
		},
		onLoad() {

		},
		methods: {
			change(e) {
				this.current = e.detail.current;
			}
		}
	}
</script>

<style scoped>
	image {
		will-change: transform
	}
</style>
