<template>
	<view>
		<view class="myInfo">
			<div v-if="cardImageUrl != null && cardImageUrl != ''" class="image-div">
				<image class="image" mode="widthFix" :src="baseUrl + cardImageUrl" />
				<div class="gradename">
					{{gradeName}}
				</div>
				<div class="code">
					NO.<span>{{cardCode}}</span>
				</div>
				<span class="iconfont icon-huiyuanka"></span>
			</div>
			<div class="button">
				<span class="left" @click="goPage('bind_vip/bind_vip')">会员卡绑定</span>
				<span class="right marginLeft" @click="goPage('info/changeVipCard')">切换当前会员</span>
			</div>
			<div class="user-img">
				<image class="user-img-image" :src="avatarUrl" />
			</div>
			<div class="user-center">
				<div class="user-name">
					Hi,{{nickName}}<br />
					{{gradeName}}:{{cardCode}}
				</div>
			</div>
			<div class="inputDivFirst">
				<van-cell-group custom-class="cellGroup">
					<van-field input-class="input" custom-style="background-color: #F8F8F8;" title-width="40px" :value="info.nickname"
					 :maxlength="20" label="昵称" @change="changeNickname" />
				</van-cell-group>
			</div>
			<!-- <div class="inputDiv">
				<van-cell-group custom-class="cellGroup">
					<van-field input-class="input" custom-style="background-color: #F8F8F8;" title-width="40px" :value="info.name"
					 :maxlength="20" label="姓名" @change="changeName" />
				</van-cell-group>
			</div> -->
			<!-- <div class="inputDiv">
				<van-cell-group custom-class="cellGroup">
					<van-cell @click="onOpenSex" custom-style="background-color: #F8F8F8;" title-width="40px" :border="false" title="性别"
					 is-link :value="info.sex" />
				</van-cell-group>

			</div> -->
			<div class="inputDiv">
				<van-cell-group custom-class="cellGroup">
					<van-cell @click="showBirthday = true" custom-style="background-color: #F8F8F8;" title-width="120px" :border="false"
					 is-link :value="info.birthday">
						<view slot="title">
							<span class="van-cell-text" style="margin-right: 8rpx;">生日</span>
							<van-tag type="danger">
								<!-- <van-icon size="28rpx" name="gift-o" /> -->会有小惊喜</van-tag>
						</view>
					</van-cell>
				</van-cell-group>
			</div>
			<div class="inputDiv" v-for="field in fieldList">
				<van-cell-group custom-class="cellGroup">
					<van-field v-if="field.fieldType === 'string'" input-class="input" custom-style="background-color: #F8F8F8;"
					 title-width="40px" :value="info['diy' + field.fieldIndex]" :maxlength="field.valueMaxLength" :label="field.fieldName"
					 @change="changeStringDiy" @focus="focusStringDiy(field)" />
					<van-cell v-if="field.fieldType === 'radio'" @click="onOpenDiy(field)" custom-style="background-color: #F8F8F8;" title-width="40px" :border="false" 
					:title="field.fieldName" is-link :value="info['diy' + field.fieldIndex]" />
				</van-cell-group>
			</div>
			<button :loading="loading" type="primary" class="submit" @click="saveDate">确认修改</button>
		</view>
		<van-popup :show="showBirthday" :safe-area-inset-bottom="false" position="bottom" z-index="201" @close="onClose">
			<van-datetime-picker type="date" :value="birthday" :min-date="minDate" :max-date="maxDate" @cancel="onClose"
			 @confirm="confirm" />
		</van-popup>
		<van-popup :show="showSex" :safe-area-inset-bottom="false" position="bottom" z-index="201" @close="onCloseSex">
			<van-cell-group>
				<van-cell>
					<span @click="onCloseSex" style="color:#1989fa;float: left;">取消</span>
					<span @click="saveSex" style="color:#1989fa">确定</span>
				</van-cell>
				<van-radio-group :value="sex">
					<van-cell @click="sex = '1'" center clickable>
						<van-radio name="1" checked-color="#07c160">男</van-radio>
					</van-cell>
					<van-cell @click="sex = '0'" center clickable>
						<van-radio name="0" checked-color="#07c160">女</van-radio>
					</van-cell>
				</van-radio-group>
			</van-cell-group>
		</van-popup>
		<van-popup :show="showDiy" :safe-area-inset-bottom="false" position="bottom" z-index="201" @close="onCloseDiy">
			<van-cell-group>
				<van-cell>
					<span @click="onCloseDiy" style="color:#1989fa;float: left;">取消</span>
					<span @click="saveDiy" style="color:#1989fa">确定</span>
				</van-cell>
				<van-radio-group :value="tempRadioDiy">
					<van-cell v-for="temp in tempRadioDiyList" @click="clickTemp(temp)" center clickable>
						<van-radio :name="temp" checked-color="#07c160">{{temp}}</van-radio>
					</van-cell>
				</van-radio-group>
			</van-cell-group>
		</van-popup>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				cardImageUrl: '',
				gradeName: '',
				avatarUrl: '',
				nickName: '',
				cardCode: '',
				baseUrl: this.$baseURL + '/static/images/card/',
				info: {
					nickname: "",
					name: "",
					sex: "",
					birthday: "",
					diy1:"",
					diy2:"",
					diy3:"",
					diy4:"",
					diy5:"",
					diy6:"",
					diy7:"",
					diy8:"",
					diy9:"",
					diy10:""
				},
				fieldList: [],
				showBirthday: false,
				birthday: new Date().getTime(),
				maxDate: new Date().getTime(),
				minDate: new Date(1960, 1, 1).getTime(),
				showSex: false,
				sex: "1",
				loading: false,
				activityIndex: -1,
				activityField: null,
				showDiy:false,
				tempRadioDiy:null,
				tempRadioDiyList:[]
			}
		},
		onLoad() {
			this.init()
		},
		onPullDownRefresh() {
			this.init()
		},
		methods: {
			init() {
				let user = wx.getStorageSync('token')
				this.avatarUrl = user.avatarUrl
				this.nickName = user.nickName
				if (user.cardList.length > 0 && user.defaultVipErpId) {
					this.cardCode = user.cardList.find(c => c.vipErpId == user.defaultVipErpId).vipCode
				}
				let grade = wx.getStorageSync('grade')
				if (grade != null) {
					this.cardImageUrl = grade.cardImageUrl
					this.gradeName = grade.name
				}
				let fieldList = wx.getStorageSync('fieldList')
				if (fieldList != null) {
					this.fieldList = fieldList
				}
				this.info.name = user.name == null ? "" : user.name
				this.info.nickname = this.nickName == null ? "" : this.nickName
				this.info.birthday = this.getText(user.birthdayStr)
				this.info.diy1 = this.getNotNull(user.diy1)
				this.info.diy2 = this.getNotNull(user.diy2)
				this.info.diy3 = this.getNotNull(user.diy3)
				this.info.diy4 = this.getNotNull(user.diy4)
				this.info.diy5 = this.getNotNull(user.diy5)
				this.info.diy6 = this.getNotNull(user.diy6)
				this.info.diy7 = this.getNotNull(user.diy7)
				this.info.diy8 = this.getNotNull(user.diy8)
				this.info.diy9 = this.getNotNull(user.diy9)
				this.info.diy10 = this.getNotNull(user.diy10)
				this.info.sex = this.getText(user.sexStr)
				if (user.birthday != null) {
					this.birthday = user.birthday
				}
				this.setSex(user.sex)
				this.getGradeInfo()
			},
			changeNickname(e) {
				this.info.nickname = e.detail
			},
			changeName(e) {
				this.info.name = e.detail
			},
			setSex(sex) {
				if (sex != null) {
					this.sex = (sex == "1") ? '1' : '0'
				}
			},
			getText(str) {
				return str == null || str == "" ? "暂无数据" : str
			},
			getNotNull(str) {
				return str == null ? "" : str
			},
			onClose() {
				this.showBirthday = false
			},
			onOpenSex() {
				let user = wx.getStorageSync('token')
				this.setSex(user.sex)
				this.showSex = true
			},
			onCloseSex() {
				this.showSex = false
			},
			onOpenDiy(field) {
				this.activityField = field
				this.activityIndex = field.fieldIndex
				this.tempRadioDiy = this.info['diy' + this.activityIndex]
				this.tempRadioDiyList = field.valueOptions.split(",")
				// let user = wx.getStorageSync('token')
				// this.setSex(user.sex)
				this.showDiy = true
			},
			onCloseDiy() {
				this.showDiy = false
			},
			clickTemp(temp){
				this.tempRadioDiy = temp
			},
			saveDiy(){
				this.info['diy' + this.activityIndex] = this.tempRadioDiy
				this.onCloseDiy()
			},
			getGradeInfo() {
				this.$uniRequest.get('/api/small_procedures/vip_grade/info').then(res => {
					this.cardImageUrl = res.data.cardImageUrl
					this.gradeName = res.data.name
					wx.setStorageSync('grade', res.data)
					this.getDiyUserInfoField()
					// uni.stopPullDownRefresh()
				})
			},
			getDiyUserInfoField() {
				this.$uniRequest.get('/api/diy_user_info_field/list', {
					data: {
						pageIndex: 1,
						pageSize: 100
					}
				}).then(res => {
					this.fieldList = res.data.content
					wx.setStorageSync('fieldList', this.fieldList)
					uni.stopPullDownRefresh()
				})
			},
			confirm(e) {
				wx.showLoading({
					title: '保存中',
				})
				this.$uniRequest.post('/api/small_procedures/user/save', {
					birthday: e.detail
				}).then(res => {
					let user = wx.getStorageSync('token')
					user.birthdayStr = res.data.birthdayStr
					user.birthday = res.data.birthday
					wx.setStorageSync('token', user)
					this.info.birthday = this.getText(user.birthdayStr)
					this.birthday = user.birthday
					this.onClose()
				})
			},
			saveSex() {
				wx.showLoading({
					title: '保存中',
				})
				this.$uniRequest.post('/api/small_procedures/user/save', {
					sex: this.sex
				}).then(res => {
					let user = wx.getStorageSync('token')
					user.sexStr = res.data.sexStr
					user.sex = res.data.sex
					wx.setStorageSync('token', user)
					this.info.sex = this.getText(user.sexStr)
					this.onCloseSex()
				})
			},
			saveDate() {
				this.loading = true
				this.$uniRequest.post('/api/small_procedures/user/save', {
					nickName: this.info.nickname,
					name: this.info.name,
					diy1:this.info.diy1,diy2:this.info.diy2,diy3:this.info.diy3,
					diy4:this.info.diy4,diy5:this.info.diy5,diy6:this.info.diy6,
					diy7:this.info.diy7,diy8:this.info.diy8,diy9:this.info.diy9,
					diy10:this.info.diy10
				}).then(res => {
					let user = wx.getStorageSync('token')
					user.nickName = this.info.nickname
					user.diy1 = this.info.diy1
					user.diy2 = this.info.diy2
					user.diy3 = this.info.diy3
					user.diy4 = this.info.diy4
					user.diy5 = this.info.diy5
					user.diy6 = this.info.diy6
					user.diy7 = this.info.diy7
					user.diy8 = this.info.diy8
					user.diy9 = this.info.diy9
					user.diy10 = this.info.diy10
					this.nickName = this.info.nickname
					if(res.data.isGodUserInfoIntegral){
						user.isGodUserInfoIntegral = true
					}
					wx.setStorageSync('token', user)
					wx.showToast({
						title: '修改成功',
						icon: 'none'
					})
				}).finally(() => this.loading = false)
			},
			goPage(page) {
				uni.navigateTo({
					url: '/pages/' + page
				})
			},
			focusStringDiy(field) {
				this.activityField = field
				this.activityIndex = field.fieldIndex
			},
			changeStringDiy(e) {
				this.info['diy' + this.activityIndex] = e.detail
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
	.myInfo .value-class {
		flex: none !important;
	}

	.myInfo .image-div {
		text-align: center;
		margin-top: 50rpx;
	}

	.myInfo .image {
		width: 520rpx;
		height: 310rpx;
	}

	.myInfo .gradename {
		color: #FFFFFF;
		font-size: 31rpx;
		position: absolute;
		z-index: 200;
		top: 85rpx;
		left: 155rpx;
	}

	.myInfo .code {
		color: #FFFFFF;
		font-size: 20rpx;
		position: absolute;
		z-index: 200;
		top: 305rpx;
		left: 145rpx;
	}


	.myInfo .icon-huiyuanka {
		color: #FFFFFF;
		font-size: 38rpx;
		position: absolute;
		z-index: 200;
		top: 295rpx;
		right: 135rpx;
	}

	.myInfo .user-img {
		margin: 0 auto;
		position: relative;
		margin-top: 30rpx;
		width: 105rpx;
		height: 105rpx;
		border-radius: 100%;
		overflow: hidden;
		border: 2rpx solid rgba(255, 255, 255, 0.7);
	}

	.myInfo .user-img .user-img-image {
		width: 105rpx;
		height: 105rpx;
	}

	.myInfo .user-name {
		font-weight: 500;
	}

	.myInfo .user-center {
		font-size: 25rpx;
		margin-top: 5rpx;
		text-align: center;
	}

	.myInfo .hr {
		padding-top: 20rpx;
		padding-bottom: 10rpx;
		padding-left: 45rpx;
		padding-right: 45rpx;
	}

	.myInfo hr {
		height: 1px;
		border: none;
		border-top: 1px solid #000000;
	}

	.myInfo .close {
		margin-top: 10rpx;
		text-align: center;
		font-size: 30rpx;
		font-weight: bold;
		color: #BF0000;
		padding-bottom: 28rpx;
	}

	.myInfo .input-div {
		margin-top: 5rpx;
		padding-left: 45rpx;
		padding-right: 45rpx;
	}

	.myInfo .input {
		height: 60rpx;
		border-color: #878787;
		border-style: solid;
		border-top-width: 0rpx;
		border-right-width: 0rpx;
		border-bottom-width: 1rpx;
		border-left-width: 0rpx;
		padding-left: 10rpx;
	}

	.myInfo .button {
		margin-top: 10rpx;
		text-align: center;
		font-size: 23rpx;
	}

	.myInfo .marginLeft {
		margin-left: 80rpx;
	}

	.myInfo .left {
		font-weight: 800;
		color: #000000;
		border-bottom: 3rpx solid #000000;
	}

	.myInfo .right {
		font-weight: 800;
		color: #C80000;
		border-bottom: 3rpx solid #C80000;
	}

	.myInfo .inputClass {
		background-color: #F8F8F8;
	}

	.myInfo .cellGroup {}

	.myInfo .inputDivFirst {
		margin: 60rpx 40rpx 0rpx 40rpx;
		border-color: #878787;
		border-style: solid;
		border-top-width: 1rpx;
		border-right-width: 0rpx;
		border-bottom-width: 1rpx;
		border-left-width: 0rpx;
	}

	.myInfo .inputDiv {
		margin-left: 40rpx;
		margin-right: 40rpx;
		border-color: #878787;
		border-style: solid;
		border-top-width: 0rpx;
		border-right-width: 0rpx;
		border-bottom-width: 1rpx;
		border-left-width: 0rpx;
	}

	.myInfo .submit {
		font-size: 28rpx;
		border-radius: 2em;
		margin: 45rpx 60rpx 0 60rpx;
		background: #AE0000;
	}
</style>
