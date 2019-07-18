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
				showMembershipCode: false,
				showMyInfo: false
			}
		},
		onLoad(query) {
			let this_ = this
			let scene = ''
			if(query.scene){
				scene = decodeURIComponent(query.scene)
			}
			console.log(scene)
			wx.login({
				success(res) {
					if (res.code) {
						this_.$uniRequest.get('/api/small_procedures/login/login', {
							data: {
								code: res.code
							}
						}).then(res => {
							wx.setStorage({key:'token',data:res.data})
							//登录成功后，判断参数内容
							//是否为员工注册
							if(scene.trim() == 'employ|register'){
								//跳转到绑定页面
								uni.redirectTo({url:'../employ/register'})
							}	
							console.log(res)
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
