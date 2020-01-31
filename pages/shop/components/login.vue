<template>
	<view>

	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				scene: ''
			}
		},
		props: {
			query: {}
		},
		methods: {
			login() {
				let that = this
				wx.login({
					success(res) {
						if (res.code) {
							that.$uniRequest.get('/api/small_procedures/login/login', {
								data: {
									code: res.code
								}
							}).then(res => {
								that.loginOk(res.data)
							}).catch(error => {
								wx.showToast({
									title: '服务器错误，请稍清理缓存重新进入',
									icon: 'none'
								})
							})
						}
					}
				})
			},
			loginOk(data) {
				wx.setStorage({
					key: 'token',
					data: data
				})
			}
		},
		created() {
		},
		onLoad() {
		},
		beforeMount() {
		},
		mounted() {
			if(wx.getStorageSync('token') == ''){
				this.login()
			}
		},
		beforeUpdate() {
		},
		updated() {
		},
		beforeDestroy() {
		},
		destroyed() {
		}
	}
</script>

<style>

</style>
