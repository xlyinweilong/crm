<template>
	<view style="">
		<navigator url="plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=[直播房间id]">Go to Live Player page</navigator>
	</view>
</template>

<script>
	import '@/static/css/style.css'
	import Toast from '@/wxcomponents/vant/toast/toast'

	export default {
		components: {

		},
		data() {
			return {
				scene: ''
			}
		},
		onLoad(query) {
			let _this = this
		},
		methods: {
			//加载系统配置
			loadConfig() {

			},
			onload(query) {
			},
			login() {
			}
		}
	}
</script>

<style scoped>
	image {
		will-change: transform
	}
</style>
