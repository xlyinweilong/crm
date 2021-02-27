<template>
	<view class="add_balance">
		<div class="recharge_list">
			<div class="recharge_list_title">充值卡</div>
			<div class="inputDivFirst">
				<van-cell-group custom-class="cellGroup">
					<van-field input-class="input" custom-style="background-color: #FFFFFF;" title-width="50px" :value="info.code"
					 :maxlength="32" clearable label="卡号" @change="changeCode" />
				</van-cell-group>
			</div>
			<div class="inputDiv">
				<van-cell-group custom-class="cellGroup">
					<van-field input-class="input" custom-style="background-color: #FFFFFF;" title-width="50px" :value="info.secret"
					 :maxlength="10" clearable label="密码" @change="changeSecret" />
				</van-cell-group>
			</div>
			<button :loading="loading" class="submit" @click="saveDate">确定</button>
		</div>
		<van-toast id="van-toast" />
		<van-dialog id="van-dialog" confirm-button-color="#C80000" />
	</view>
</template>

<script>
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import {
		accMul,
		accSub,
		accAdd
	} from '@/utils/mathUtils'

	export default {
		components: {},
		data() {
			return {
				info: {
					code: '',
					secret: ''
				},
				loading: false
			}
		},
		onLoad(query) {},
		methods: {
			changeCode(e) {
				this.info.code = e.detail
			},
			changeSecret(e) {
				this.info.secret = e.detail
			},
			saveDate() {
				if (!this.loading) {
					this.loading = true
					this.$uniRequest.post('/api/sale/vip_store_card_detail/recharge_info', this.info).then(res => {
						Dialog.confirm({
							title: '确认',
							message: '本次充值' + res.data.typeMean + ':' + res.data.rechargeAmount,
							className: 'vipStore'
						}).then(() => {
							// on confirm
							Toast.loading({
								message: '加载中...',
								forbidClick: true,
								loadingType: 'spinner',
							})
							if (!this.loading) {
								this.loading = true
								this.$uniRequest.post('/api/sale/vip_store_card_detail/recharge', this.info).then(res => {
									this.info.code = ''
									this.info.secret = ''
									Toast.clear()
									Toast.success('充值成功');
								}).catch(e => Toast.clear()).finally(() => this.loading = false)
							}
						}).catch(() => {
							// on cancel
						})
					}).finally(() => this.loading = false)
				}
			}
		}
	}
</script>

<style>
	.vipStore .van-button--default {
		color: #C80000;
	}
</style>

<style scoped>
	.van-button--default {
		color: #C80000;
	}

	.add_balance .value-class {
		flex: none !important;
	}

	.add_balance {
		margin-top: 10rpx;
		background-color: #FFFFFF;
	}

	.add_balance .recharge_item {
		text-align: center;
		border: 1px solid #706000;
		padding: 35rpx 25rpx 35rpx 25rpx;
		margin: 20rpx 20rpx 20rpx 20rpx;
		color: #706000;
		font-size: 35rpx;
		border-radius: 5px;
	}

	.recharge_list_title {
		padding-top: 40rpx;
		color: #706000;
		font-size: 30rpx;
		width: 100%;
		text-align: center;
	}

	.shoujia {
		font-size: 22rpx;
		font-weight: lighter;
	}

	.add_balance .recharge_item_hover {
		color: #C80000;
	}

	.inputDivFirst {
		margin: 20rpx 40rpx 0rpx 40rpx;
		border-color: #878787;
		border-style: solid;
		border-top-width: 1rpx;
		border-right-width: 0rpx;
		border-bottom-width: 1rpx;
		border-left-width: 0rpx;
	}

	.inputDiv {
		margin-left: 40rpx;
		margin-right: 40rpx;
		border-color: #878787;
		border-style: solid;
		border-top-width: 0rpx;
		border-right-width: 0rpx;
		border-bottom-width: 1rpx;
		border-left-width: 0rpx;
	}

	.submit {
		color: #ffffff;
		font-size: 28rpx;
		border-radius: 2em;
		margin: 45rpx 60rpx 0 60rpx;
		background: #AE0000;
	}

	.input {
		height: 60rpx;
		border-color: #878787;
		border-style: solid;
		border-top-width: 0rpx;
		border-right-width: 0rpx;
		border-bottom-width: 1rpx;
		border-left-width: 0rpx;
		padding-left: 10rpx;
	}

	.button {
		margin-top: 10rpx;
		text-align: center;
		font-size: 23rpx;
	}

	.inputClass {
		background-color: #F8F8F8;
	}

	.cellGroup {}
</style>
