<template>
	<view>
		<view class="changeVipCard">
			<p class="title">会员卡账户</p>
			<van-radio-group :value="vipCardId">
				<div class="cell">
					<div v-for="ele in list" class="vancell">
						<van-cell @click="setVipId(ele)" center clickable>
							<van-radio :name="ele.erpId" checked-color="#07c160">
								<span class="text">{{ele.code}} ({{ele.gradeName}})</span>
							</van-radio>
						</van-cell>
					</div>
				</div>
			</van-radio-group>
			<div class="footer">
				<div class="footerIn">
					<van-icon color="#AE0000" size="2em" name="warning-o" />
					<p class="warning">变更会员卡后原卡将无法积分等</p>
					<p class="warning">请谨慎操作</p>
					<button :loading="loading" type="primary" class="submit" @click="show = true">更改</button>
				</div>
			</div>
		</view>
		<van-popup :show="show" @close="onClose">
			<div style="text-align: center;width: 500rpx;">
				<p class="pop-title">温馨提示</p>
				<p class="pop-text">
					<van-icon custom-style="margin-top: 10rpx" color="#AE0000" size="32rpx" name="warning-o" />您确定要切换会员卡？</p>
				<p class="pop-info">变更会员卡后原卡将无法积分等，请谨慎操作!</p>
				<div class="pop-footer">
					<van-row>
					  <van-col span="10" offset="1">
						  <button type="primary" class="pop-cancel" @click="show = false">取消</button>
					  </van-col>
					  <van-col span="10" offset="2">
						  <button type="primary" class="pop-submit" @click="saveDate">确定</button>
					  </van-col>
					</van-row>
				</div>
			</div>
		</van-popup>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				vipCardId: "",
				list: [],
				loading: false,
				show: false
			}
		},
		onLoad() {
			let user = wx.getStorageSync('token')
			this.vipCardId = user.defaultVipErpId
			console.log(this.vipCardId)

			this.loadMyVipCards()
		},
		methods: {
			onClose() {
				this.show = false
			},
			loadMyVipCards() {
				wx.showLoading({
					title: '加载中',
				})
				this.loading = true
				this.$uniRequest.get('/api/small_procedures/vip/my_card_list').then(res => this.list = res.data).finally(() => {
					this.loading = false
					wx.hideLoading()
				})
			},
			setVipId(ele) {
				this.vipCardId = ele.erpId
			},
			saveDate() {
				wx.showLoading({
					title: '加载中',
				})
				this.loading = true
				this.$uniRequest.post('/api/small_procedures/vip/change_vip', {
					vipErpId: this.vipCardId
				}).then(res => {
					let user = wx.getStorageSync('token')
					user.defaultVipErpId = this.vipCardId
					wx.setStorageSync('token', user)
					wx.showToast({
						title: '修改成功',
						icon: 'none'
					})
					this.onClose()
				}).finally(() => {
					this.loading = false
					wx.hideLoading()
				})
			}
		}
	}
</script>
<style>
	page {
		background-color: #F8F8F8;
	}
</style>
<style scoped>
	.changeVipCard {
		margin: 20rpx 25rpx 0rpx 25rpx;
	}

	.changeVipCard .title {
		font-weight: 800;
		color: #909399;
		font-size: 26rpx;
		margin-bottom: 10rpx;
		margin-left: 20rpx;
	}

	.changeVipCard .text {
		color: #606266;
		font-size: 28rpx;
	}

	.changeVipCard .submit {
		font-size: 28rpx;
		border-radius: 2em;
		margin: 15rpx 0 0 0;
		background: #AE0000;
	}

	.changeVipCard .warning {
		color: #AE0000;
	}

	.changeVipCard .cell {
		margin-bottom: 300rpx;
	}

	.changeVipCard .vancell {
		border-color: #878787;
		border-style: solid;
		border-top-width: 0rpx;
		border-right-width: 0rpx;
		border-bottom-width: 1rpx;
		border-left-width: 0rpx;
	}

	.changeVipCard .footer {
		margin-left: auto;
		margin-right: auto;
		left: 0;
		right: 0;
		position: fixed;
		bottom: 0;
		z-index: 100;
		background-color: #F8F8F8;
	}

	.footerIn {
		margin-right: 20rpx;
		margin-left: 20rpx;
		margin-bottom: 20rpx;
		text-align: center;
	}

	.pop-title {
		margin-top: 30rpx;
		font-size: 24rpx;
	}

	.pop-text {
		font-weight: 800;
		margin-top: 10rpx;
		font-size: 34rpx;
		color: #AE0000;
	}

	.pop-info {
		margin-top: 5rpx;
		font-size: 19rpx;
		margin-left: 25rpx;
		margin-right: 25rpx;
		padding-bottom: 20rpx;
		color: #AE0000;
		border-color: #000000;
		border-style: solid;
		border-top-width: 0rpx;
		border-right-width: 0rpx;
		border-bottom-width: 1rpx;
		border-left-width: 0rpx;
	}

	.pop-footer {
		margin-top: 10rpx;
		margin-bottom: 25rpx;
	}
	
	.pop-submit{
		font-size: 26rpx;
		border-radius: 2em;
		margin: 15rpx 0 0 0;
		background: #AE0000;
	}
	
	.pop-cancel{
		font-size: 26rpx;
		border-radius: 2em;
		margin: 15rpx 0 0 0;
		background: #909399;
	}
</style>
