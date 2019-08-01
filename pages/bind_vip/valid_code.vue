<template>
	<view>
		<div style="margin-top: 40rpx;">
			<h4 style="text-align: center;margin-bottom: 10rpx;">请输入验证码</h4>
			<DigitalKeyboard @change="contToggle" @closeKeyboard="closeKeyboard" :keyBoardSwitch="keyBoardSwitch" :decimalPoint="true" />
		</div>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'
	import DigitalKeyboard from '@/components/digital-keyboard/digital-keyboard'

	export default {
		components: {
			DigitalKeyboard
		},
		data() {
			return {
				arr:['','','','','',''],
			    code:'',
			    codeLength:null,
			    length:6,
			    keyBoardSwitch:false
			}
		},
		methods: {
			finish(e) {
				//注册
				console.log(e)
				Toast.fail('验证码错误')
			},
			showKeyboard(){
				this.codeLength=this.code.length==6?5:this.code.length;
				this.keyBoardSwitch=true;
			},
			hiddenKeyboard(){
				this.keyBoardSwitch=false;
				this.codeLength=null;
			},
			closeKeyboard(value){
				console.log(value);
			},
			contToggle(k){
				let len=this.code.length;
				if(k===''){
					this.code=this.code.substring(0,len-1);
					this.codeLength=this.code.length;
					return;
				}
				this.codeLength=len+1;
				this.code+=k.toString();
				if(this.length===len+1){
					this.keyBoardSwitch=false;
					return;
				}
			}
		}
	};
</script>

<style lang="scss">
	page,.content{
		width: 100vw;
		min-height: 100vh;
		margin: 0;
		box-sizing: border-box;
	}
	.input-row{
		width: 600upx;
		margin: 0 auto;
		padding: 30upx 0;
		box-sizing: border-box;
		font-size: 24px;
		text-align: center;
		.item{
			float: left;
			width: 80upx;
			height: 80upx;
			line-height: 80upx;
			border-radius: 10upx;
			margin:0 10upx;
			border: 1px solid #C8C8C8;
			background: #fff;
			box-sizing: border-box;
		}
		.item-active{
			position: relative;
			border: 1px solid #f4000a;
			transform: scale(1.2);
			--webkit-transform: scale(1.2);
		}
	}
</style>