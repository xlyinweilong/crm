<template>
	<view class="role_power">
		<van-tabs :active="erpId" tab-class="item th" animated swipeable>
			<van-tab tab-class="item th" v-for="grade in gradeList" :title="grade.name" title-style="">
				<div class="content">
					<div>
						<view>会员规则</view>
						{{ruleInfo}}
					</div>
					<div>
						<view>会员权益</view>
						{{powerInfo}}
					</div>
				</div>
			</van-tab>
		</van-tabs>
		<!-- <scroll-view class="scroll-view_w" scroll-x style="width:100%">
			<view class="item" v-for="grade in gradeList">
				<view class="th" :class="{ active: erpId ===  grade.erpId}">{{grade.name}}</view>
			</view>
		</scroll-view> -->
		
	</view>
</template>

<script>
	import Notify from 'wxcomponents/vant/notify/notify'
	import Dialog from 'wxcomponents/vant/dialog/dialog'

	export default {
		components: {},
		data() {
			return {
				loading: false,
				list: [],
				tab: 1,
				gradeList: [],
				powerTemplateList: [],
				powerList: [],
				id: '',
				powerInfo:'',
				ruleInfo:''
			}
		},
		onLoad() {
			let user = wx.getStorageSync('token')
			this.userInfo = wx.getStorageSync('userInfo')
			this.getGradeAll()

		},
		methods: {
			getGradeAll() {
				this.$uniRequest.get('/api/vip/vip_grade/all').then(res => {
					this.gradeList = res.data.filter(d => !!d.powerShow)
					this.getGradeInfo()
				})
			},
			getGradeInfo() {
				this.$uniRequest.get('/api/small_procedures/vip_grade/info').then(res => {
					this.id = res.data.id
					this.getPowerRuleInfo()
				})
				
			},
			getPowerRuleInfo() {
				this.$uniRequest.get('/api/vip/vip_power_rule_info/info', {
					data: {
						gradeErpId: this.id
					}
				}).then(res => {
					this.powerInfo = res.data.powerInfo == null ? '' : res.data.powerInfo
					this.ruleInfo = res.data.ruleInfo == null ? '' : res.data.ruleInfo
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #615451;
	}
</style>

<style scoped>
	.role_power .horizontal-scroll {
		overflow: hidden;
	}

	.role_power .scroll-view_w {
		margin-top: 50rpx;
		width: 100%;
		white-space: nowrap;
	}

	.role_power .scroll-view_w .item {
		width: 100px;
		display: inline-block;
	}

	.role_power .scroll-view_w .th {
		font-weight: 800;
		/* color: #cba064; */
		color: #89632e;
		height: 80rpx;
		padding: 0 10px;
		line-height: 80rpx;
		text-align: center;
		font-size: 30rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.role_power .scroll-view_w .active {
		color: #cba064;
	}

	.item {
		background-color: #cba064;
		color: #89632e;
	}

	.th {
		background-color: #cba064;
		color: #cba064;
	}

	.content {
		background-color: #FFFFFF;
		margin:20rpx;
		height: 100%;
	}
</style>
