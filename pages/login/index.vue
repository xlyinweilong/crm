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
				current: 0,
				info: [{
					url: '../../static/images/footer1.png'
				}, {
					url: '../../static/images/footer1.png'
				}, {
					url: '../../static/images/footer1.png'
				}],
				showMembershipCode: false,
				showMyInfo: false
			}
		},
		onLoad() {
			let this_ = this
			wx.login({
				success(res) {
					console.log(res)
					if (res.code) {
						this_.$uniRequest.get('/api/small_procedures/login/login', {
							data: {
								code: res.code
							}
						}).then(res => {
							wx.setStorage({key:'token',data:res.data})
							console.log(response)
						}).catch(error => {
							console.log(error)
						})
					}
				}
			})
		},
		methods: {

		}
	}
</script>

<style scoped>
	image {
		will-change: transform
	}
</style>
