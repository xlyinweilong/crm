<template>
	<view style="">
		<div style="padding-top: 15rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-field @input="inputEmployCode" :value="employCode" required clearable label="员工编号" placeholder="请输入员工编号" />
			</van-cell-group>
		</div>
		<div style="padding-top: 30rpx;padding-left: 30rpx;padding-right: 30rpx;">
			<van-cell-group>
				<van-button :loading="loading" loading-text="绑定中..." :disabled="employCode == ''" type="primary" size="large"
				 open-type="getUserInfo" @getuserinfo="doBind">绑定</van-button>
			</van-cell-group>
		</div>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'

	export default {
		components: {

		},
		data() {
			return {
				employCode: '',
				loading: false
			}
		},
		onLoad() {

		},
		methods: {
			inputEmployCode(e) {
				this.employCode = e.detail
			},
			doBind() {
				let that = this
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						that.updateUserInfo(infoRes.userInfo)
					},
					fail:function(){
						Toast('成为VIP需要您授权获取头像等信息')
					}
				})
			},
			updateUserInfo(userInfo) {
				this.loading = true
				let form = {}
				if (userInfo != null) {
					form = userInfo
				}
				form.code = this.employCode
				this.$uniRequest.post('/api/small_procedures/employ/bind', form).then(res => {
					Toast(res.message)
					//跳转到授权 TODO
					uni.redirectTo({
						url: '/pages/employ/index'
					})
				}).finally(() => this.loading = false)
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
