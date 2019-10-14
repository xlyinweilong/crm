<template>
	<view style="">
		<!-- 员工进入后的首页
		会员拉新使用自己的code生成小程序二维码 -->
		<div>
			<i-grid>
				<i-grid-item>
					<div @click="changeRole">
						<i-grid-icon>
							<i-icon type="group" size="28" />
						</i-grid-icon>
						<i-grid-label>切换角色</i-grid-label>
					</div>
				</i-grid-item>
				<i-grid-item>
					<div @click="goTo('employ/my_qrcode')">
						<i-grid-icon>
							<i-icon type="scan" size="28" />
						</i-grid-icon>
						<i-grid-label>二维码</i-grid-label>
					</div>
				</i-grid-item>
				<i-grid-item>
					<div @click="goTo('employ/my_referrals')">
						<i-grid-icon>
							<i-icon type="financial_fill" size="28" />
						</i-grid-icon>
						<i-grid-label>我的拉新</i-grid-label>
					</div>
				</i-grid-item>
				<i-grid-item>
					<div @click="goTo('employ/my_vip')">
						<i-grid-icon>
							<i-icon type="addressbook" size="28" />
						</i-grid-icon>
						<i-grid-label>我的顾客</i-grid-label>
					</div>
				</i-grid-item>
			</i-grid>
			<i-grid>
				<i-grid-item>
					<div @click="goTo('employ/ticket_list')">
						<i-grid-icon>
							<i-icon type="group" size="28" />
						</i-grid-icon>
						<i-grid-label>卡券核销</i-grid-label>
					</div>
				</i-grid-item>
				<i-grid-item>
				</i-grid-item>
				<i-grid-item>
				</i-grid-item>
				<i-grid-item>
				</i-grid-item>
			</i-grid>
		</div>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import Dialog from '@/wxcomponents/vant/dialog/dialog'

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
			changeRole() {
				Dialog.confirm({
				  title: '切换角色',
				  message: '确认切换成会员吗？'
				}).then(() => {
					uni.redirectTo({
						url: '/pages/info/index'
					})
				}).catch(() => {
				})
			},
			goTo(url){
				uni.navigateTo({
					url: '/pages/' + url
				})
			}
		}
	}
</script>

<style scoped>
	
</style>
