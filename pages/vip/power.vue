<template>
	<view class="integral">
		<!-- header -->
		<div style="text-align: center;background-color: #615451;height: 330rpx;">
			<div class="white" style="padding-top:60rpx;font-size: 92rpx;">VIP</span></div>
			<div class="white" style="padding-top:5rpx;font-size: 25rpx;">MEMBER BENEFITS</div>
		</div>
		<div>
			<div class="tabDiv">
				<i-row span="10">
					<view @click="onClickTab(1)">
						<i-col span="12" :i-class="tab == 1 ? 'active' : 'tabSpan'">会员权益</i-col>
					</view>
					<view @click="onClickTab(2)">
						<i-col span="12" :i-class="tab == 2 ? 'active' : 'tabSpan'">等级规则</i-col>
					</view>
				</i-row>
				<div v-show="tab == 1" class="tabs_content">
					<view class="horizontal-scroll">
						<view class="fixed-content">
							<view class="top"></view>
							<view class="th" @click="showMessage('会员等级')">会员等级</view>
							<view class="td" style="font-weight: 800;" v-for="template in powerTemplateList" @click="showMessage(template.templateName)">{{template.templateName}}</view>
						</view>
						<view class="scroll-content">
							<scroll-view class="scroll-view_w" scroll-x style="width:100%">
								<view class="item" v-for="grade in gradeList">
									<view class="top"><span v-if="erpId === grade.erpId">
											<van-icon color="#C80000" size="28rpx" name="arrow-down" /></span></view>
									<view class="th" :class="{ activeItem: erpId ===  grade.erpId}">{{grade.name}}</view>
									<view class="td" v-for="template in powerTemplateList" :class="{ activeItem: erpId ===  grade.erpId}">
										<van-icon v-if="isSuccessIcon(grade.erpId,template)" name="success" color="#C80000" size="30rpx" />
										<span @click="showMessageInfo(grade.erpId,template)">{{getText(grade.erpId,template)}}</span>
									</view>
								</view>
							</scroll-view>
						</view>
						<view @click="goInfo" class="showMore">
							更多具体会员等级规则详情请点击查看
							<van-icon name="info" />
						</view>
					</view>
				</div>
				<div v-show="tab == 2" class="tabs_content">
					<div class="rule-title">会员等级如何计算</div>
					<view>
						<i-row span="22">
							<i-col span="2">
								<div @click="clickIconTabLeft" class="arrow" v-show="iconDataList.length > 3">
									<van-icon name="arrow-left" size="2em" color="#e2e2e3" />
								</div>
							</i-col>
							<view v-for="rule in iconDataList">
								<i-col span="5">
									<div class="iconFrame" :class="{'iconActive':erpId === rule.gradeErpId}">
										<div class="iconDiv">
											<image mode="widthFix" style="width: 100%;" :src="baseURL + '/static/images/icon/'+rule.icon" />
										</div>
										<div class="iconName">{{rule.gradeName}}</div>
										<hr class="hr" />
										<div class="iconInfo">{{rule.levelUpInfo}}</div>
									</div>
								</i-col>
							</view>
							<i-col span="2">
								<div @click="clickIconTabRight" class="arrow" v-show="iconDataList.length > 3">
									<van-icon name="arrow" size="2em" color="#e2e2e3" />
								</div>
							</i-col>
						</i-row>
					</view>
					<div style="margin: 20rpx 15rpx 50rpx 15rpx">
						<i-row span="22">
							<i-col span="20" :offset="2">
								<div style="font-size: 32rpx;font-weight: 800;text-align: left;color:#706000">{{showDataGradeName}}会员规则</div>
								<div style="font-size: 22rpx;text-align: left;color:#706000;margin-top: 15rpx;">{{showDataText}}</div>
								<view @click="goInfo" class="showMore">
									<hr class="hr2" />
									更多具体会员等级规则详情请点击查看
									<van-icon name="info" />
								</view>
							</i-col>
							<i-col span="2">
								&nbsp;
							</i-col>
						</i-row>
					</div>

				</div>
			</div>
		</div>
		<van-notify id="van-notify" />
	</view>
</template>

<script>
	import Notify from 'wxcomponents/vant/notify/notify'
	import Dialog from 'wxcomponents/vant/dialog/dialog'

	export default {
		components: {},
		computed: {
			iconDataList() {
				let dataList = []
				let index = this.ruleList.findIndex(r => this.erpId === r.gradeErpId)
				if (index == null) {
					return dataList
				}
				this.ruleList.forEach(r => {
					let grade = this.gradeList.find(g => g.erpId === r.gradeErpId)
					if (grade != null) {
						r.gradeName = grade.name
					}
					dataList.push(r)
				})
				if (index < 4) {
					dataList = dataList.slice(0, 4)
				} else {
					dataList = dataList.slice(index - 3, index + 1)
				}
				return dataList
			},
			showDataGradeName() {
				let rule = this.ruleList.find(r => this.erpId === r.gradeErpId)
				if (rule == null) {
					return ''
				}
				return rule.gradeName
			},
			showDataText() {
				let rule = this.ruleList.find(r => this.erpId === r.gradeErpId)
				if (rule == null) {
					return ''
				}
				return rule.info
			}
		},
		data() {
			return {
				baseURL: this.$baseURL,
				loading: false,
				list: [],
				tab: 1,
				gradeList: [],
				powerTemplateList: [],
				powerList: [],
				erpId: '',
				ruleList: [],
				detailUrl: ''
			}
		},
		onLoad() {
			let user = wx.getStorageSync('token')
			this.userInfo = wx.getStorageSync('userInfo')
			this.getGradeAll()
			this.getGradeInfo()
			this.getRuleList()
			this.getConfig()
		},
		methods: {
			getConfig() {
				this.$uniRequest.get('/api/config/sysconfig/info', {
					data: {
						key: 'VIP_DETAIL'
					}
				}).then(res => {
					this.detailUrl = res.data.configValue
				})
			},
			goInfo() {
				uni.navigateTo({
					url: '/pages/info/web?url=' + encodeURIComponent(this.detailUrl)
				})
			},
			isSuccessIcon(gradeErpId, template) {
				if (template.templateType === 'BOOLEAN') {
					let ele = this.powerList.find(d => d.gradeErpId === gradeErpId && template.id === d.templateId)
					if (ele != null) {
						return ele.valueBoolean
					}
				}
				return false
			},
			getText(gradeErpId, template) {
				if (template.templateType === 'STRING') {
					let ele = this.powerList.find(d => d.gradeErpId === gradeErpId && template.id === d.templateId)
					if (ele != null) {
						return ele.valueText
					}
				}
				return ''
			},
			getList() {
				this.pageIndex = 0
				this.list = []
				this.more()
			},
			getPowerList() {
				this.$uniRequest.get('/api/vip/vip_power_detail/list').then(res => {
					this.powerList = res.data
				})
			},
			getPowerTemplateList() {
				this.$uniRequest.get('/api/vip/vip_power_template/list').then(res => {
					this.powerTemplateList = res.data
					this.getPowerList()
				})
			},
			getGradeAll() {
				this.$uniRequest.get('/api/vip/vip_grade/all').then(res => {
					this.gradeList = res.data.filter(d => !!d.powerShow)
					this.getPowerTemplateList()
				})
			},
			getGradeInfo() {
				this.$uniRequest.get('/api/small_procedures/vip_grade/info').then(res => this.erpId = res.data.erpId)
			},
			showMessageInfo(gradeErpId, template) {
				let text = this.getText(gradeErpId, template)
				this.showMessage(text)
			},
			showMessage(text) {
				Notify({
					text: text,
					duration: 1500,
					backgroundColor: '#FFFFFF',
					color: '#706000'
				})
			},
			onClickTab(e) {
				this.tab = e
			},
			getRuleList() {
				this.$uniRequest.get('/api/vip/vip_rule/all').then(res => {
					this.ruleList = res.data
				})
			},
			clickIconTabLeft() {
				let index = this.ruleList.findIndex(r => this.erpId === r.gradeErpId)
				if (index != null && index - 1 >= 0) {
					this.erpId = this.ruleList[index - 1].gradeErpId
				}
			},
			clickIconTabRight() {
				let index = this.ruleList.findIndex(r => this.erpId === r.gradeErpId)
				if (index != null && this.ruleList.length >= index + 2) {
					this.erpId = this.ruleList[index + 1].gradeErpId
				}
			}
		}
	}
</script>

<style>
	page {
		/* background-color: #FFFFFF; */
	}

	.integral .tabDiv {
		position: relative;
		top: -80rpx;
		margin-left: 10rpx;
		margin-right: 10rpx;
		text-align: center;
	}

	.integral .active {
		font-size: 28rpx;
		font-weight: 800;
		color: #C80000;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		border-top-left-radius: 18rpx;
		border-top-right-radius: 18rpx;
		background-color: #FFFFFF;
	}

	.integral .tabSpan {
		font-size: 28rpx;
		font-weight: 800;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		border-top-left-radius: 18rpx;
		border-top-right-radius: 18rpx;
		background-color: #cccccc;
	}
</style>

<style scoped>
	.integral .white {
		color: #FFFFFF;
	}

	.integral .tabs_content {
		height: 100%;
		background-color: #FFFFFF;
		border-bottom-right-radius: 18rpx;
		border-bottom-left-radius: 18rpx;
		padding-left: 10rpx;
		padding-right: 10rpx;
	}

	.horizontal-scroll {
		overflow: hidden;
	}

	.fixed-content {
		float: left;
		width: 35%;
	}

	.scroll-content {
		float: left;
		width: 65%;
	}

	.scroll-view_w {
		width: 100%;
		white-space: nowrap;
	}

	.scroll-view_w .item {
		width: 100px;
		display: inline-block;
	}

	.horizontal-scroll .top {
		height: 20rpx;
		text-align: center;
		vertical-align: bottom;
	}

	.horizontal-scroll .th {
		/* background: #f5f5f5; */
		font-weight: 800;
		color: #706000;
		height: 80rpx;
		padding: 0 10px;
		line-height: 80rpx;
		text-align: center;
		font-size: 24rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		border-bottom: 1rpx solid #706000;
	}

	.horizontal-scroll .td {
		/* background: #fff; */
		/* color:#706000; */
		font-size: 24rpx;
		padding: 0 10px;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		border-bottom: 1rpx solid #706000;
	}

	.horizontal-scroll .td:nth-last-child(2n+1) {
		/* border-bottom:1rpx solid #eee; */
	}

	.showMore {
		font-weight: 800;
		text-align: left;
		font-size: 24rpx;
		color: #706000;
		margin-top: 40rpx;
		margin-bottom: 50rpx;
	}

	.activeItem {
		background: #eee;
	}

	.rule-title {
		font-weight: 800;
		margin: 0rpx 40rpx 0rpx 40rpx;
		padding-top: 34rpx;
		padding-bottom: 15rpx;
		color: #89632e;
		font-size: 30rpx;
		text-align: center;
		border-bottom: 5rpx solid #909399;
	}

	.iconFrame {
		margin: 20rpx 5rpx 10rpx 5rpx;
		border: 1rpx solid #000000;
	}

	.iconDiv {
		margin-top: 50rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.iconName {
		margin-top: 15rpx;
		color: #89632E;
		font-size: 22rpx;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 40rpx;
	}

	.hr {
		margin: 15rpx 8rpx 0rpx 8rpx;
		border-bottom: 1rpx solid #89632E;
	}

	.hr2 {
		margin-bottom: 5rpx;
		border-bottom: 1rpx solid #89632E;
	}

	.iconInfo {
		color: #C80000;
		font-size: 21rpx;
		margin: 20rpx 15rpx 20rpx 15rpx;
	}

	.arrow {
		height: 330rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.iconActive {
		border: 1rpx solid #C80000;
	}
</style>
