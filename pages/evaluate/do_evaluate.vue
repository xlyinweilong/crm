<template>
	<view class="do_evaluate">
		<!-- <div v-if="ele.status === 'evaluated'">
			<div style="margin-top: 200rpx;margin-left: 60rpx;">
				<image class="chenggongImage" src="../../static/images/chenggong.png" /></span>
			</div>
			<div style="color:red;font-size:50rpx;margin-top: 20rpx;">提交成功</div>
			<div style="width: 65%;margin: auto;margin-top: 20rpx;">
				<button @click="redirectTo('info/index')" class="submit"><span style="color: #ffffff;font-size:24rpx;">返回首页</span></button>
			</div>
		</div> -->
		<!-- <div v-if="ele.status === 'unevaluated'"> -->
			<div v-for="employ in ele.employList" class="employ_info">
				<div class="employ_name"><b>{{employ.serviceName}}</b></div>
				<div class="employ_code"><b>工号：{{employ.code}}</b></div>
				<div class="employ_rate">
					<span style="margin-top: 3rpx;">
						<image class="xingxingImage" src="../../static/images/xingxing.png" /></span>
					<span style="margin-top: 3rpx;">综合评分：{{employ.avgRate}}分</span>
				</div>
			</div>
			<div class="channel_name">所属店铺：{{ele.channelName}}</div>
			<div>
				<!-- <span class="hr"></span> -->
				<i-divider content="本次消费金额"></i-divider>
				<!-- <span class="bencixiaofeijine">本次消费金额</span> -->
			</div>
			<div style="font-size: 65rpx;color:red">{{ele.amount}}<span style="font-size: 30rpx;color:#675500">元</span></div>
			<div><span style="margin-top: 15rpx;border-bottom:1px solid #675500;font-size:20rpx">查看明细</span></div>
			<div style="margin-top: 15rpx;">
				<i-divider content="本次消费金额"></i-divider>
			</div>
			<!-- <div>本次消费金额</div> -->
			<div style="text-align: right;margin-right: 20rpx;font-size: 20rpx;">
				<label class="radio" @click="isAnonymous = !isAnonymous">
					<radio style="transform:scale(0.5)" :value="true" :checked="isAnonymous" /><span style="margin-left: 2rpx;">匿名</span>
				</label>
			</div>
			<div style="font-size: 30rpx;">
				<b>谢谢您的光临<br />
					请给本次服务进行评价</b>
			</div>
			<div style="margin-top: 20rpx;">
				总体满意度：
				<van-rate size="30" :value="rate" @change="onChangeRate" :readonly="ele.status != 'unevaluated'"/>
				<div style="font-size:20rpx;color:red">{{getRateText}}</div>
			</div>
			<div style="margin-top: 25rpx;" v-if="ele.status === 'unevaluated'">
				<div>
					<span @click="checked(1)" v-if="endEvaluate[1] != null" class="tags" :class="{ 'active': endEvaluate[1].checked }">{{endEvaluate[1].content}}</span>
					<span @click="checked(2)" v-if="endEvaluate[2] != null" class="tags" :class="{ 'active': endEvaluate[2].checked }">{{endEvaluate[2].content}}</span>
					<span @click="checked(3)" v-if="endEvaluate[3] != null" class="tags" :class="{ 'active': endEvaluate[3].checked }">{{endEvaluate[3].content}}</span>
				</div>
				<div style="margin-top: 20rpx;">
					<span @click="checked(4)" v-if="endEvaluate[4] != null" class="tags" :class="{ 'active': endEvaluate[4].checked }">{{endEvaluate[4].content}}</span>
					<span @click="checked(5)" v-if="endEvaluate[5] != null" class="tags" :class="{ 'active': endEvaluate[5].checked }">{{endEvaluate[5].content}}</span>
					<span @click="checked(6)" v-if="endEvaluate[6] != null" class="tags" :class="{ 'active': endEvaluate[6].checked }">{{endEvaluate[6].content}}</span>
				</div>
			</div>
			<div style="margin-top: 40rpx;" v-if="ele.status === 'unevaluated'">
				<span style="font-size:18rpx;color:#AE0000;font-weight: 800;">投诉与建议 > </span>
				<button :loading="loading" type="primary" class="submit" @click="submit">确认提交</button>
			</div>
		<!-- </div> -->
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from 'wxcomponents/vant/toast/toast'

	export default {
		components: {},
		computed: {
			getRateText() {
				if (this.rate === 5) {
					return "非常满意"
				} else if (this.rate === 4) {
					return "比较满意"
				} else if (this.rate === 3) {
					return "一般"
				} else if (this.rate === 2) {
					return "比较不满意"
				} else if (this.rate === 1) {
					return "非常不满意"
				}
				return ''
			}
		},
		data() {
			return {
				loading: false,
				isAnonymous: true,
				rate: 5,
				posCode: '',
				ele: {},
				evaluate: [],
				hasInEvaluate: [],
				endEvaluate: []
			}
		},
		onLoad(query) {
			this.evaluate = wx.getStorageSync('evaluate')
			this.posCode = query.posCode
			if (this.evaluate == null) {
				this.getConfig(true)
			} else {
				this.getInfo()
				this.getConfig(false)
				this.createTags()
			}
		},
		methods: {
			redirectTo(page) {
				uni.reLaunch({
					url: '/pages/' + page
				})
			},
			submit() {
				if (!this.loading) {
					this.loading = true
					let tags = []
					for (let i = 1; i <= 6; i++) {
						tags.push(this.endEvaluate[i])
					}
					tags = tags.filter(e => e != null && e.checked).map(e => e.id)
					this.$uniRequest.post('/api/small_procedures/evaluate/save', {
						posCode: this.posCode,
						rate: this.rate,
						tags: tags.join(','),
						isAnonymous: this.isAnonymous
					}).then(res => {
						//操作成功
						this.ele.status = 'evaluated'
						Toast.success('评价成功，感谢您的评价');
					}).finally(() => this.loading = false)
				}
			},
			checked(index) {
				this.endEvaluate[index].checked = !this.endEvaluate[index].checked
			},
			getTag(position) {
				if (this.evaluate == null) {
					return null
				}
				//啥选出符合条件的分数和位置
				let list = this.evaluate.filter(e => this.rate === e.showInScore && (e.position === 0 || e.position === position) &&
					this.hasInEvaluate.find(h => h.id === e.id) == null)
				if (list.length === 0) {
					return null
				}
				//找出固定位置、权重最大的
				let fixedList = list.filter(e => e.type === 'FIXED').sort((a, b) => a.randomWeight > b.randomWeight)
				if (fixedList.length > 0) {
					this.hasInEvaluate.push(fixedList[0])
					return fixedList[0]
				}
				//权重随机
				let max = list.reduce((t, d) => t + parseInt(d.randomWeight), 0)
				let weight = Math.floor(Math.random() * max)
				let noWeight = 0
				for (let i = 0; i < list.length; i++) {
					let brfore = noWeight
					noWeight = noWeight + list[i].randomWeight
					if (weight >= brfore && weight < noWeight) {
						this.hasInEvaluate.push(list[i])
						return list[i]
					}
				}
				return null
			},
			createTags() {
				this.hasInEvaluate = []
				this.evaluate.forEach(e => e.checked = false)
				for (let i = 1; i <= 6; i++) {
					this.endEvaluate[i] = this.getTag(i)
				}
			},
			goPage(page) {
				uni.navigateTo({
					url: '/pages/' + page
				})
			},
			onChangeRate(e) {
				this.rate = e.detail
				this.createTags()
			},
			getConfig(isAll) {
				if (isAll) {
					Toast.loading({
						mask: true,
						message: '加载中...'
					});
				}
				this.$uniRequest.get('/api/small_procedures/evaluate_tag_template/all').then(res => {
					res.data.forEach(e => e.checked = false)
					this.evaluate = res.data
					wx.setStorageSync('evaluate', this.evaluate)
					if (isAll) {
						this.createTags()
						this.getInfo()
					}
				}).catch(() => Toast.clear())
			},
			getInfo() {
				Toast.loading({
					mask: true,
					message: '加载中...'
				});
				this.$uniRequest.get('/api/small_procedures/evaluate/info', {
					data: {
						posCode: this.posCode
					}
				}).then(res => {
					this.ele = res.data
				}).finally(() => Toast.clear())
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
