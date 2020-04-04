<template>
	<view>
		<div v-if="!loading && list.length == 0" style="text-align: center;font-size: 32rpx;color: #606266;">
			<p :style="{'margin-top': marginTop > 0 ? (marginTop+'px'):0}">
				<van-icon name="location-o" size="80rpx" color="#606266" />
			</p>
			<p style="margin-top: 18rpx;">暂无收货地址</p>
			<p>添加地址可以更方便购物哦~</p>
		</div>
		<div v-if="loading" style="text-align: center;font-size: 32rpx;color: #606266;">加载中。。。</div>
		<div v-if="!loading && list.length > 0">
			<div v-if="type == 'settle' || type == 'refund'" style="color: #ffffff;font-size: 11px;background-color: #706000;text-align: center;padding-top: 8px;padding-bottom: 8px;">
				点击选择地址
			</div>
			<div v-for="e in list" :key="e.id" style="background-color: #ffffff;margin-bottom: 10rpx;">
				<div @click="chooseLocation(e)" style="border-bottom: 1px solid #DCDFE6;font-size: 30rpx;color: #303133;">
					<div style="padding-top: 30rpx;margin-left: 28rpx;">{{e.name}}</div>
					<div style="margin-top: 30rpx;margin-left: 28rpx;">
						<span>{{e.receiver}}</span>
						<span style="margin-left: 24rpx;">{{e.mobile}}</span>
					</div>
					<div style="margin-top: 30rpx;margin-left: 28rpx; padding-bottom: 30rpx;">
						<span>{{e.provinceName}}</span>
						<span style="margin-left: 20rpx;">{{e.cityName}}</span>
						<span style="margin-left: 20rpx;">{{e.stationName}}</span>
						<span style="margin-left: 20rpx;">{{e.address}}</span>
					</div>
				</div>
				<div style="height: 60rpx;padding-top: 20rpx;color: #909399;font-size: 32rpx;">
					<div style="float: left;margin-left: 20rpx;">
						<van-checkbox checked-color="#706000" :value="e.defaultLocation" @change="onSetDefault($event,e)">设置默认</van-checkbox>
					</div>
					<div style="float: right;margin-right: 20rpx;">
						<span @click="edit(e)"><span class="iconfont icon-editor" />编辑</span>
						<span @click="deleteEle(e)"><span style="margin-left: 20rpx;" class="iconfont icon-ashbin" />删除</span>
					</div>
				</div>
			</div>
		</div>
		<div class="popup-button-div">
			<div style="margin-left: 15px;margin-right: 15px;height: 60px;margin-top: 15px;">
				<van-button @click="goPage('shop/my/location/add')" custom-class="popup-button" size="large" color="#706000">添加地址</van-button>
			</div>
		</div>
		<loginCom />
		<van-toast id="van-toast" />
		<van-dialog id="van-dialog" confirm-button-color="#706000" />
	</view>
</template>

<script>
	import loginCom from '@/pages/shop/components/login'
	import Toast from '@/wxcomponents/vant/toast/toast'
	import Dialog from '@/wxcomponents/vant/dialog/dialog'

	export default {
		components: {
			loginCom
		},
		data() {
			return {
				marginTop: 0,
				loading: false,
				list: [],
				type: '',
				eleId:''
			}
		},
		computed: {},
		onLoad(query) {
			this.type = query.type
			if(query.id){
				this.eleId = query.id
			}
			let systemInfo = wx.getSystemInfoSync()
			this.marginTop = systemInfo.windowHeight / 2 - 120
		},
		onShow() {
			this.loadLocation()
		},
		methods: {
			chooseLocation(e){
				let pages = getCurrentPages()
				let currPage = pages[pages.length - 1]   //当前页面
				let prevPage = pages[pages.length - 2]  //上一个页面
				if(this.type == 'settle'){
					prevPage.$vm.locationId = e.id
					uni.navigateBack()
				}else if(this.type == 'refund'){
					prevPage.$vm.locationId = e.id
					prevPage.$vm.id = this.eleId
					uni.navigateBack()
				}
			},
			goPage(page) {
				uni.navigateTo({
					url: '/pages/' + page
				})
			},
			loadLocation() {
				this.loading = true
				this.$uniRequest.get('/api/small/shop/location/list').then(res => {
					this.list = res.data
				}).finally(() => this.loading = false)
			},
			onSetDefault(e, location) {
				if (e.detail) {
					Toast.loading()
					location.defaultLocation = true
					this.$uniRequest.post('/api/small/shop/location/set_default', {
						id: location.id
					}).then(res => {
						this.loadLocation()
					}).finally(() => Toast.clear())

				}
			},
			deleteEle(location) {
				Dialog.confirm({
					title: '提示',
					message: '确定要删除此地址吗？'
				}).then(() => {
					Toast.loading()
					this.$uniRequest.post('/api/small/shop/location/delete', {
						id: location.id
					}).then(res => {
						this.loadLocation()
					}).finally(() => Toast.clear())
				}).catch(() => {})
			},
			edit(location) {
				uni.navigateTo({
					url: '/pages/shop/my/location/add?id=' + location.id
				})
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
</style>
