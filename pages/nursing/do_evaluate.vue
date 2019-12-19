<template>
	<view class="do_evaluate">
		<div style="margin-top: 15rpx;">
			<van-divider contentPosition="center">{{ele.channge}}</van-divider>
		</div>
		<div class="employ_info">
			<div class="employ_name"><b>{{ele.createEmployName}}</b></div>
			<div class="employ_code"><b>工号：{{ele.createEmployCode}}</b></div>
			<!-- <div class="employ_rate">
				<span style="margin-top: 3rpx;">
					<image class="xingxingImage" src="../../static/images/xingxing.png" /></span>
				<span style="margin-top: 3rpx;">综合评分：{{ele.avgRate}}分</span>
			</div> -->
		</div>
		<div style="margin-top: 20rpx;">
			<p>服务满意度：</p>
			<van-rate size="30" :value="employRate" @change="onChangeEmployRate" :readonly="ele.evaluateStatus == 'EVALUATED'" />
			<div style="font-size:20rpx;color:red">{{getEmployRateText}}</div>
		</div>
		<div style="margin-top: 15rpx;">
			<van-divider contentPosition="center">昕逸焕新工坊</van-divider>
		</div>
		<div class="channel_name">本次服务由昕逸焕新工坊提供</div>
		<div style="margin-top: 20rpx;">
			<p>焕新满意度：</p>
			<van-rate size="30" :value="nursingRate" @change="onChangeNursingRate" :readonly="ele.evaluateStatus == 'EVALUATED'" />
			<div style="font-size:20rpx;color:red">{{getNursingRateText}}</div>
		</div>
		<div style="margin-top: 40rpx;" v-if="ele.evaluateStatus != 'EVALUATED'">
			<button :disabled="employRate == 0 || nursingRate == 0" :loading="loading" type="primary" class="submit" @click="submit">确认提交</button>
		</div>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from 'wxcomponents/vant/toast/toast'

	export default {
		components: {},
		computed: {
			getEmployRateText() {
				if (this.employRate === 5) {
					return "非常满意"
				} else if (this.employRate === 4) {
					return "比较满意"
				} else if (this.employRate === 3) {
					return "一般"
				} else if (this.employRate === 2) {
					return "比较不满意"
				} else if (this.employRate === 1) {
					return "非常不满意"
				}
				return ''
			},
			getNursingRateText() {
				if (this.nursingRate === 5) {
					return "非常满意"
				} else if (this.nursingRate === 4) {
					return "比较满意"
				} else if (this.nursingRate === 3) {
					return "一般"
				} else if (this.nursingRate === 2) {
					return "比较不满意"
				} else if (this.nursingRate === 1) {
					return "非常不满意"
				}
				return ''
			}
		},
		data() {
			return {
				loading: false,
				id: '',
				ele: {},
				employRate: 0,
				nursingRate: 0
			}
		},
		onLoad(query) {
			this.id = query.id
			this.getInfo(this.id)
		},
		methods: {
			getInfo(id) {
				Toast.loading('加载中...')
				this.$uniRequest.get('/api/small_procedures/nursing/info', {
					data: {
						id: id
					}
				}).then(res => {
					this.ele = res.data
					if (this.ele.employRate != null) {
						this.employRate = this.ele.employRate
					}
					if (this.ele.nursingRate != null) {
						this.nursingRate = this.ele.nursingRate
					}
				}).finally(() => Toast.clear())
			},
			submit() {
				if (this.employRate == 0 || this.nursingRate == 0) {
					Toast('请先选择满意度')
					return
				}
				if (!this.loading) {
					this.loading = true
					this.$uniRequest.post('/api/small_procedures/nursing/evaluate', {
						id: this.id,
						employRate: this.employRate,
						nursingRate: this.nursingRate
					}).then(res => {
						Toast.success('评价成功，感谢您的评价')
						this.getInfo(this.id)
					}).finally(() => this.loading = false)
				}
			},
			onChangeEmployRate(e) {
				this.employRate = e.detail
			},
			onChangeNursingRate(e) {
				this.nursingRate = e.detail
			}
		}
	}
</script>

<style>
	page {
		background-color: #ffffff;
	}
</style>

<style scoped>
	.hover-class {
		color: #C80000;
	}

	.tags {
		margin: 0rpx 15rpx 0rpx 15rpx;
		font-size: 22rpx;
		padding: 5rpx 15rpx 5rpx 15rpx;
		border-top-left-radius: 18rpx;
		border-top-right-radius: 18rpx;
		border-bottom-right-radius: 18rpx;
		border-bottom-left-radius: 18rpx;
		border: 1px solid #DCDFE6;
		font-weight: 800;
	}

	.active {
		border: 3px solid #AE0000;
	}

	.do_evaluate {
		text-align: center;
		color: #675500;
	}

	.chenggongImage {
		width: 300rpx;
		height: 300rpx;
		vertical-align: middle;
	}

	.xingxingImage {
		width: 26rpx;
		height: 26rpx;
		vertical-align: middle;
		margin-right: 3rpx;
	}

	.employ_info {
		margin-top: 30rpx;
	}

	.employ_name {
		font-size: 40rpx;
	}

	.employ_code {
		margin-top: 10rpx;
		font-size: 28rpx;
	}

	.employ_rate {
		margin-top: 10rpx;
		font-size: 20rpx;
		line-hight: 34rpx;
		vertical-align: middle;
	}

	.channel_name {
		font-size: 30rpx;
		margin-top: 18rpx;
	}

	.do_evaluate .submit {
		font-size: 28rpx;
		border: 3px solid #AE0000;
		border-radius: 2em;
		margin: 20rpx 60rpx 0 60rpx;
		background: #AE0000;
	}

	.bencixiaofeijine {
		border: 2px solid #DCDFE6;
		font-size: 26rpx;
		padding: 5rpx 15rpx 5rpx 15rpx;
		border-top-left-radius: 18rpx;
		border-top-right-radius: 18rpx;
		border-bottom-right-radius: 18rpx;
		border-bottom-left-radius: 18rpx;
	}

	.hr {
		width: 100px;
		line-hight: 34px;
		border-bottom: 2px solid #DCDFE6;
	}
</style>
