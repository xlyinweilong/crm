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
						<view class="showMore">更多具体会员等级规则详情请点击查看
							<van-icon name="info" />
						</view>
					</view>
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
		data() {
			return {
				loading: false,
				list: [],
				tab: 1,
				gradeList: [],
				powerTemplateList: [],
				powerList: [],
				erpId: ''
			}
		},
		onLoad() {
			let user = wx.getStorageSync('token')
			this.userInfo = wx.getStorageSync('userInfo')
			this.getGradeAll()
			this.getGradeInfo()
		},
		methods: {
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
	
	.activeItem{
		background: #eee;
	}
</style>
