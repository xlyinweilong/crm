<template>
	<view style="">
		<!-- 员工进入后的首页
		会员拉新使用自己的code生成小程序二维码 -->
		<div>
			<!-- <van-grid>
			  <van-grid-item icon="photo-o" text="拉人人数" />
			  <van-grid-item icon="photo-o" text="" />
			  <van-grid-item icon="photo-o" text="文字" />
			  <van-grid-item icon="photo-o" text="文字" />
			</van-grid> -->
			<van-cell-group title="基础功能">
				<van-cell title="切换角色" is-link @click="changeRole" icon="exchange" />
				<van-cell v-if="powerKeyList.indexOf('e_qr_code') > -1" title="二维码" is-link @click="goTo('employ/my_qrcode')" icon="qr" />
				<van-cell v-if="powerKeyList.indexOf('e_my_recommend') > -1" title="我的拉新" is-link @click="goTo('employ/my_referrals')"
				 icon="friends-o" />
				<van-cell v-if="powerKeyList.indexOf('e_my_customer') > -1" title="我的顾客" is-link @click="goTo('employ/my_vip')"
				 icon="user-circle-o" />
				<van-cell v-if="powerKeyList.indexOf('e_ticket_check') > -1" title="卡券核销" is-link @click="goTo('employ/ticket_list')"
				 icon="records" />
				 <van-cell v-if="powerKeyList.indexOf('e_shop_goods_receive') > -1" title="商城出货" is-link @click="goTo('employ/shop/goods_receive/index')"
				  icon="shopping-cart-o" />
			</van-cell-group>
			<van-cell-group title="宝贝焕新" v-if="powerKeyList.indexOf('e_nursing') > -1 || powerKeyList.indexOf('e_nursing_wash') > -1">
				<van-cell title="店铺收货" v-if="powerKeyList.indexOf('e_nursing') > -1" is-link @click="goTo('employ/nursing/list')" icon="logistics" />
				<van-cell title="宝贝洗涤" v-if="powerKeyList.indexOf('e_nursing_wash') > -1" is-link @click="goTo('employ/nursing/wash_list')" icon="completed" />
			</van-cell-group>
		</div>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import Dialog from '@/wxcomponents/vant/dialog/dialog'

	export default {
		components: {},
		data() {
			return {
				employCode: '',
				loading: false,
				powerKeyList: []
			}
		},
		onLoad() {
			this.powerKeyList = wx.getStorageSync('powerKeyList')
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
				}).catch(() => {})
			},
			goTo(url) {
				uni.navigateTo({
					url: '/pages/' + url
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #EBEEF5;
	}
</style>

<style scoped>

</style>
