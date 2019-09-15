<template>
	<div>
		<web-view v-if="src != ''" :src="src"></web-view>
		<!-- <web-view src="https://mp.weixin.qq.com"></web-view> -->
	</div>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				src: ""
			}
		},
		computed: {},
		onLoad() {
			//查询appId
			this.$uniRequest.get('/api/config/sysconfig/info', {
				data: {
					key: 'WE_CHAT_PLATFORM_APPID'
				}
			}).then(res => {
				let user = wx.getStorageSync('token')
				console.log("https%3a%2f%2fcrm.pengguantech.com%2fcrm%2fapi%2fauthorization%3ftnId%3d" + this.$tnId +
					"%26uid%3d" + user.id)
				this.src = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + res.data.configValue +
					"&redirect_uri=https%3a%2f%2fcrm.pengguantech.com%2fcrm%2fapi%2fauthorization%3ftnId%3d" + this.$tnId +
					"%26uid%3d" + user.id + "&response_type=code&scope=snsapi_base#wechat_redirect";
				console.log(this.src)
			})
		},
		methods: {}
	}
</script>

<style>
</style>

<style scoped>
</style>
