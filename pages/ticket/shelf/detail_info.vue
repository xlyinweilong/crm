<template>
	<view>
		<div v-if="ele.id != ''">
			<van-cell-group title="优惠券详情">
				<van-cell title="使用说明" :label="ele.description" :border="true" />
			</van-cell-group>
		</div>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	import Dialog from 'wxcomponents/vant/dialog/dialog'

	export default {
		components: {},
		data() {
			return {
				ele: {
					id: ''
				},
				loading: false
			}
		},
		onLoad(query) {
			this.info(query.code)
		},
		methods: {
			info(code) {
				wx.showLoading({
					title: '加载中',
				})
				this.$uniRequest.get('/api/small_ticket_shelf/info', {
					data: {
						code: code
					}
				}).then(res => {
					this.ele = res.data
				}).finally(() => wx.hideLoading())
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
