<template>
	<view>
		<div>
			<div class="cell">
				<div class="subCell borderBottom">
					<div class="text">标签名称</div>
					<div class="input"><input confirm-type="done" v-model="form.name" placeholder="家、公司等" /></div>
				</div>
			</div>
			<div class="cell">
				<div class="subCell borderBottom">
					<div class="text">收货人</div>
					<div class="input"><input confirm-type="done" v-model="form.receiver" placeholder="姓名" /></div>
				</div>
			</div>
			<div class="cell">
				<div class="subCell borderBottom">
					<div class="text">联系电话</div>
					<div class="input"><input confirm-type="done" type="number" v-model="form.mobile" placeholder="手机号" /></div>
				</div>
			</div>
			<div class="cell">
				<div class="subCell borderBottom">
					<div class="text">选择地区</div>
					<div class="input"><input @click="onOpenPop" :disabled="true" :value="form.locationStr" placeholder="地区信息" /></div>
				</div>
			</div>
			<div class="cell">
				<div class="subCell">
					<div class="text">详细地址</div>
					<div class="input">
						<div class="input"><input confirm-type="done" v-model="form.address" placeholder="街道门牌信息" /></div>
						<!-- <textarea style="width: 510rpx;position: fixed;z-index: 1;" v-model="form.address" placeholder="街道门牌信息" /> -->
					</div>
				</div>
			</div>
		</div>
		<div class="popup-button-div">
			<div style="margin-left: 15px;margin-right: 15px;height: 60px;margin-top: 15px;">
				<van-button @click="save" :loading="loading" custom-class="popup-button" size="large" color="#706000">保存</van-button>
			</div>
		</div>
		<van-popup z-index="900" :show="isShowPop" closeable position="bottom" custom-style="height:800rpx" @close="onClosePop">
			<div v-if="loadingDetail" style="text-align: center;">加载中...</div>
			<div v-if="!loadingDetail">
				<div class="popup-row">
					<div style="font-size: 30rpx;color:#303133">
						<span style="color:#706000" v-if="selectedLocation.provinceId == ''">请选择</span>
						<span @click="reChoose('province')" :style="{color:selectedLocation.cityId == '' ? '#706000':'#303133'}" v-if="selectedLocation.provinceId != ''">{{selectedLocation.provinceName}}</span>
						<span @click="reChoose('city')" :style="{color:selectedLocation.stationId == '' ? '#706000':'#303133'}" style="margin-left: 16rpx;"
						 v-if="selectedLocation.cityId != ''">{{selectedLocation.cityName}}</span>
						<span style="margin-left: 16rpx;color:#706000;" v-if="selectedLocation.stationId != ''">{{selectedLocation.stationName}}</span>
					</div>
				</div>
				<scroll-view style="height: 700rpx;" scroll-y="true">
					<div class="popup-row" v-for="l in showLocation" :key="l.id" @click="selectLocation(l)">
						<div>
							{{l.name}}
							<span style="float: right;font-size: 50rpx;color: #DCDFE6;margin-right: 20rpx;" class="iconfont icon-arrow-right"></span>
						</div>
					</div>
				</scroll-view>
			</div>
		</van-popup>
		<loginCom />
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import loginCom from '@/pages/shop/components/login'
	import Toast from '@/wxcomponents/vant/toast/toast'
	export default {
		components: {
			loginCom
		},
		data() {
			return {
				loading: false,
				form: {
					name: '',
					receiver: '',
					mobile: '',
					address: '',
					stationId: '',
					cityId: '',
					provinceId: '',
					locationStr: ''
				},
				loadingDetail: false,
				isShowPop: false,
				location: [],
				selectedLocation: {
					stationId: '',
					stationName: '',
					cityId: '',
					cityName: '',
					provinceId: '',
					provinceName: '',
					type: 'province'
				}
			}
		},
		computed: {
			showLocation() {
				if (this.selectedLocation.type == 'province') {
					return this.location.filter(l => l.type == 'province')
				} else if (this.selectedLocation.type == 'city') {
					return this.location.filter(l => l.pid == this.selectedLocation.provinceId)
				} else if (this.selectedLocation.type == 'station') {
					return this.location.filter(l => l.pid == this.selectedLocation.cityId)
				}
			}
		},
		onLoad(query) {
			if (query.id) {
				Toast.loading()
				this.$uniRequest.get('/api/small/shop/location/info', {
					data: {
						id: query.id
					}
				}).then(res => {
					this.form = res.data
					this.selectedLocation.stationId = this.form.stationId
					this.selectedLocation.cityId = this.form.cityId
					this.selectedLocation.provinceId = this.form.provinceId
					this.selectedLocation.stationName = this.form.stationName
					this.selectedLocation.cityName = this.form.cityName
					this.selectedLocation.provinceName = this.form.provinceName
					this.selectedLocation.type = 'station'
					this.form.locationStr = this.selectedLocation.provinceName + ' ' + this.selectedLocation.cityName + ' ' + this.selectedLocation
						.stationName
				}).finally(() => Toast.clear())
			}
		},
		methods: {
			onOpenPop() {
				this.isShowPop = true
				if (this.location.length == 0) {
					this.loadingDetail = true
					this.$uniRequest.get('/api/small/shop/location/location').then(res => {
						this.location = res.data.filter(l => l.isShow).map(l => {
							return {
								id: l.id,
								type: l.type,
								name: l.name,
								pid: l.pid
							}
						})
					}).finally(() => this.loadingDetail = false)
				}
			},
			onClosePop() {
				this.isShowPop = false
			},
			save() {
				if (this.form.receiver == '') {
					Toast('请输入收货人')
					return
				}
				if (this.form.mobile == '') {
					Toast('请输入联系电话')
					return
				}
				if (this.form.stationId == '') {
					Toast('请选择地区')
					return
				}
				if (this.form.address == '') {
					Toast('请输入详细地址')
					return
				}
				this.loading = true
				this.$uniRequest.post('/api/small/shop/location/save', this.form).then(res => {
					Toast('保存成功')
					uni.navigateBack()
				}).finally(() => this.loading = false)
			},
			selectLocation(location) {
				if (this.selectedLocation.type == 'province') {
					this.selectedLocation.provinceId = location.id
					this.selectedLocation.provinceName = location.name
					this.selectedLocation.type = 'city'
				} else if (this.selectedLocation.type == 'city') {
					this.selectedLocation.cityId = location.id
					this.selectedLocation.cityName = location.name
					this.selectedLocation.type = 'station'
				} else if (this.selectedLocation.type == 'station') {
					this.selectedLocation.stationId = location.id
					this.selectedLocation.stationName = location.name
					this.selectedLocation.type = 'station'
					this.form.provinceId = this.selectedLocation.provinceId
					this.form.cityId = this.selectedLocation.cityId
					this.form.stationId = this.selectedLocation.stationId
					this.form.provinceName = this.selectedLocation.provinceName
					this.form.cityName = this.selectedLocation.cityName
					this.form.stationName = this.selectedLocation.stationName
					this.form.locationStr = this.selectedLocation.provinceName + ' ' + this.selectedLocation.cityName + ' ' + this.selectedLocation
						.stationName
					this.onClosePop()
				}
			},
			reChoose(t) {
				if (t == 'province') {
					this.selectedLocation.type = 'province'
					this.selectedLocation.cityId = ''
					this.selectedLocation.stationId = ''
				} else if (t == 'city') {
					this.selectedLocation.type = 'city'
					this.selectedLocation.stationId = ''
				}
			}
		}
	}
</script>

<style>
	page {
		background-color: #F2F6FC;
	}
</style>

<style scoped>
	.cell {
		color: #303133;
		width: 750rpx;
		font-size: 32rpx;
		background-color: #ffffff;
	}

	.subCell {
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		width: 690rpx;
		display: flex;
		margin-left: 30rpx;
		margin-right: 30rpx;
	}

	.borderBottom {
		border-bottom: 1px solid #DCDFE6;
	}

	.text {
		width: 160rpx;
	}

	.input {
		width: 530rpx;
	}

	.popup-button-div {
		background-color: #FFFFFF;
		z-index: 100;
		text-align: center;
		position: fixed;
		height: 80px;
		bottom: 0px;
		width: 100%;
		border-top: 1px solid #DCDFE6;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}

	.popup-row {
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		padding-left: 24rpx;
		font-size: 36rpx;
		color: #303133;
		border-bottom: 1px solid #DCDFE6;
	}
</style>
