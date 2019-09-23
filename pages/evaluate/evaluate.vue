<template>
	<view class="evaluate">
		<van-tabs sticky @click="onClick">
			<van-tab :title="'待评价'+totalCount.count1">
				<evaluateInfo ref="evaluateInfo1"  @setTotal="setTotal1"/>
			</van-tab>
			<van-tab :title="'已评价'+totalCount.count2">
				<evaluateInfo ref="evaluateInfo2" status="evaluated" @setTotal="setTotal2" />
			</van-tab>
		</van-tabs>
	</view>
</template>

<script>
	import evaluateInfo from 'pages/evaluate/evaluate_info'
	
	export default {
		components: {
			evaluateInfo
		},
		data() {
			return {
				totalCount:{
					count1:'',
					count2:''
				}
			}
		},
		onLoad() {
			this.$refs.evaluateInfo1.getList()
			this.$refs.evaluateInfo2.getList()
		},
		methods: {
			onClick(e){
				if(e.detail.index === 0){
					this.$refs.evaluateInfo1.getList()
				}else if(e.detail.index === 1){
					this.$refs.evaluateInfo2.getList()
				}
			},
			setTotal1(e){
				this.totalCount.count1 = e
			},
			setTotal2(e){
				this.totalCount.count2 = e
			}
		}
	}
</script>

<style>
	page {
		background-color: #cccccc;
	}
</style>

<style scoped>
	.evaluate {
		text-align: center;
	}

	.evaluate .cell {
		margin: 20rpx 15rpx 0rpx 15rpx;
		padding: 15rpx;
		background-color: #FFFFFF;
	}

	.evaluate .channelImage {
		width: 200rpx;
		height: 200rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.evaluate .info {
		margin-top: 10rpx;
		text-align: left;
		color: #675500;
	}

	.evaluate .jinxingpingjia {
		background-color: #741419;
		color: #FFFFFF;
		font-size: 26rpx;
		padding: 5rpx 15rpx 5rpx 15rpx;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
		border-bottom-left-radius: 16rpx;
	}
</style>
