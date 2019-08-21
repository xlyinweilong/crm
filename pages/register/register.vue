<template>
	<view class="register">
		<div class="bgdiv">
			<div><i class="iconfont icon-login"></i></div>
			<p class="bgp">小程序由智胜开发，向其提供一下授权既可继续操作</p>
		</div>
		<div>
			<p style="font-size:25rpx;padding-top: 20rpx;">
				<checkbox-group>
					<label>
						<checkbox class="checkbox" :disabled="true" :checked="true" />
						<span style="padding-left: 7rpx;vertical-align:middle;">获得您的公开信息（昵称、头像等）</span>
					</label>
				</checkbox-group>
			</p>
			<button class="submit" :loading="loading" open-type="getUserInfo" @getuserinfo="getUserInfo" type="warn">确认登录</button>
		</div>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				loading: false,
				scene: ''
			}
		},
		onLoad(query) {
			if (query.scene) {
				this.scene = decodeURIComponent(query.scene)
			}
		},
		methods: {
			getUserInfo() {
				let that = this
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						that.register(infoRes.userInfo)
					},
					fail: function() {
						wx.showToast({
							title: '成为VIP需要您授权获取头像等信息',
							icon: 'none'
						})
					}
				})
			},
			register(userInfo) {
				this.loading = true
				userInfo.vipCode = this.vipCode
				if (this.scene != null && this.scene != '') {
					userInfo.recommendOpenId = this.scene
				}
				this.$uniRequest.post('/api/small_procedures/login/register', userInfo).then(res => {
					wx.setStorageSync('token', res.data)
					//跳转到绑定会员卡
					uni.redirectTo({
						url: '/pages/bind_vip/bind_vip'
					})
				}).finally(() => this.loading = false)
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>
<style scoped>

	.register .iconfont {
		padding-top: 75rpx;
		font-size: 200rpx;
		color: #FFFFFF;
	}

	.register .bgdiv {
		height: 450rpx;
		background-color: #766c6a;
		text-align: center;
	}

	.register .bgdiv .bgp {
		color: #FFFFFF;
		padding: 10rpx 160rpx 0rpx 160rpx;
	}

	.register .checkbox {
		vertical-align: middle;
		transform: scale(0.6);
		color: #dad8d7
	}

	.register .submit {
		font-size: 32rpx;
		border-radius: 2em;
		margin: 45rpx 60rpx 0 60rpx;
		background: #AE0000;
	}
</style>
