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
								console.log(error)
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
				this.$uniRequest.defaults.headers.common['X-Token'] = data.token
			}
		},
		created() {
		},
		onLoad() {},
		beforeMount() {},
		mounted() {
			let that = this
			wx.checkSession({
				success() {
					that.$uniRequest.get('/api/small_procedures/login/is_login')
				},
				fail() {
					that.login()
				}
			})
		},
		beforeUpdate() {},
		updated() {},
		beforeDestroy() {},
		destroyed() {}
	}
</script>

<style>

</style>
