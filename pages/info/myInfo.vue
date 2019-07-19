<template>
	<view>
		<van-dialog :zIndex="101" use-slot :show="showMyInfo" @close="onClose" :showConfirmButton="false"
		 :closeOnClickOverlay="true">
			<view class="myInfo">
				<div class="image-div">
					<image mode="widthFix" src="../../static/images/ticket_bg.png" />
				</div>
				<div class="gradename">
					VIP银卡会员
				</div>
				<div class="code">
					NO.<span>ZK890370</span>
				</div>
				<span class="iconfont icon-huiyuanka"></span>
				<div class="user-img">
					<image class="user-img-image" src="../../static/images/user.png" />
				</div>
				<div class="user-center">
					<div class="user-name">Hi,大隆</div>
				</div>
				<div v-show="showImage" class="barcode">
					<tki-barcode ref="barcode" :val="'1234567890'" />
				</div>
				<div class="hr">
					<hr />
				</div>
				<div class="input-div">
					<input class="input" v-model="info.name" placeholder="姓名" />
				</div>
				<div class="input-div">
					<input class="input" v-model="info.mobile" placeholder="手机" />
				</div>
				<div class="input-div">
					<input class="input" v-model="info.sex" placeholder="性别" />
				</div>
				<div class="input-div">
					<input class="input" :readonly="true" @click="showPopup = true" :value="info.birthday" placeholder="生日" />
				</div>
				<div class="input-div">
					<input class="input" v-model="info.address" placeholder="地址" />
				</div>
				<div style="margin-top: 30rpx;" class="hr">
					<hr />
				</div>
				<div class="close" @click="save">
					确定
				</div>
			</view>
		</van-dialog>
		<van-popup :z-index="102" :show="showPopup" position="bottom">
			<van-datetime-picker :min-date="minDate" :max-date="maxDate" @confirm="confirmDate" @cancel="showPopup = false" type="date" :value="birthday" :formatter="formatter"/>
		</van-popup>
	</view>
</template>

<script>
	import {format} from '@/utils/date.js'
	
	export default {
		components: {},
		props: {
			showMyInfo: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				info: {
					name: '',
					mobile: '',
					sex: '',
					birthday: '',
					address: ''
				},
				birthday:new Date().getTime(),
				maxDate:new Date().getTime(),
				minDate:new Date(1949, 10, 1).getTime(),
				showImage: false,
				showPopup: false
			}
		},
		onLoad() {

		},
		methods: {
			onClose() {
				this.showImage = false
				this.$emit('update:showMyInfo', false)
			},
			save() {
				this.onClose()
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`;
				} else if (type === 'month') {
					return `${value}月`;
				}else if (type === 'day') {
					return `${value}日`;
				}
				return value;
			},
			confirmDate(val){
				console.log(this.birthday)
				this.info.birthday = format(new Date(this.birthday),'yyyy-MM-dd')
				this.showPopup = false
			},
			openDate(){
				this.showImage = true
				if(this.info.birthday != ''){
					this.birthday = new Date(this.info.birthday).getTime()
				}
			}
		}
	}
</script>

<style>
	.myInfo .image-div {
		text-align: center;
		padding-top: 50rpx;
		padding-left: 50rpx;
		padding-right: 50rpx;
	}

	.myInfo .gradename {
		color: #FFFFFF;
		font-size: 31rpx;
		position: absolute;
		z-index: 200;
		top: 85rpx;
		left: 95rpx;
	}

	.myInfo .code {
		color: #FFFFFF;
		font-size: 22rpx;
		position: absolute;
		z-index: 200;
		top: 295rpx;
		left: 95rpx;
	}


	.myInfo .icon-huiyuanka {
		color: #FFFFFF;
		font-size: 42rpx;
		position: absolute;
		z-index: 200;
		top: 272rpx;
		right: 95rpx;
	}

	.myInfo .user-img {
		margin: 0 auto;
		position: relative;
		margin-top: 25rpx;
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

	.myInfo .user-center {
		margin-top: 20rpx;
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
</style>
