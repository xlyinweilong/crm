<template>
	<view class="ticket">
		<div class="tabs_content">
			<view v-for="ele in list">
				<div @click="clickTicket(ele)" class="ticketDiv" hover-class="user-info-hover">
					<div style="position:relative">
						<div class="quanchangjuan">{{ele.title}}</div>
						<div class="jiage">
							{{ele.name}}
							<span v-if="ele.cardType == 'CASH'" style="font-size: 32rpx;margin-left: 5rpx;">元</span>
							<span v-if="ele.cardType == 'DISCOUNT'" style="font-size: 32rpx;margin-left: 5rpx;">折</span>
						</div>
						<div class="youhuima">
							<span  v-if="ele.needPay && ele.userHasGot < ele.getLimit" class="">支付{{ele.payMoney}}元领取1张</span>
							<span v-if="!ele.needPay && ele.userHasGot < ele.getLimit" class="">点击领取</span>
							<span v-if="ele.userHasGot >= ele.getLimit" class="" style="color: #909399;">已经领取</span>
						</div>
						<div class="youxiaoqi" :style="{'color:#ff807b': ele.ticketType == null || ele.ticketType == 'FULL_COURT','color:#9186ff':ele.ticketType == 'CATEGORY'}">
							<div v-if="ele.dateInfoType == 'DATE_TYPE_FIX_TIME_RANGE'">
								<div>启用:{{ele.startTime}}</div>
								<div>失效:{{ele.endTime}}</div>
							</div>
							<div v-if="ele.dateInfoType == 'DATE_TYPE_FIX_TERM'">
								领取后<span v-if="ele.fixedBeginTerm">{{ele.fixedBeginTerm}}天生效</span>{{ele.fixedTerm}}天失效
								<div v-if="ele.fixedEndTime != null">{{ele.fixedEndTime}} 统一失效</div>
							</div>
						</div>
					</div>
					<image :class="{'used': type == 2}" v-if="ele.ticketType == null || ele.ticketType == 'FULL_COURT'" style="width: 100%;" class="image" mode="widthFix" src="../../../static/images/ticket/quanchangquan.png" />
					<image :class="{'used': type == 2}" v-if="ele.ticketType == 'CATEGORY'" style="width: 100%;" class="image" mode="widthFix" src="../../../static/images/ticket/pinleiquan.png" />
					<p style="color: #000000;margin-bottom: 10rpx;">{{ele.description}}</p>
				</div>
				
				<!-- <div class="ticket_card" @click="clickTicket(ele)" hover-class="user-info-hover">
					<i-row span="22">
						<i-col span="8">
							<div class="tab_td" hover-class="user-info-hover" style="height:110rpx;margin-top: 10rpx;margin-bottom: 10rpx;border-right: 3px solid #c11920;text-align:center;"
							 @click="clickTicket(ele)">
								<span style="font-size: 100rpx;vertical-align:middle" :style="type == 2 ? 'color:#909399': 'color:#c11920'">
									<span v-if="ele.cardType == 'CASH' && ele.name.length > 4" class="price" style="font-size: 60rpx;">{{ele.name}}</span>
									<span v-if="ele.cardType == 'CASH' && ele.name.length == 4" class="price" style="font-size: 80rpx;">{{ele.name}}</span>
									<span v-if="ele.cardType == 'CASH' && ele.name.length <= 3" class="price" style="font-size: 100rpx;">{{ele.name}}</span>
									<span v-if="ele.cardType == 'DISCOUNT' && ele.name.length > 2" class="price" style="font-size: 60rpx;">{{ele.name}}</span>
									<span v-if="ele.cardType == 'DISCOUNT' && ele.name.length <= 2" class="price" style="font-size: 90rpx;">{{ele.name}}</span>
									<span class="iconfont icon-juan" style="vertical-align: text-top;font-size:30rpx;padding-top: 10rpx;"></span>
								</span>
							</div>
						</i-col>
						<i-col span="11">
							<div class="tab_td ticket_title" :style="type == 2 ? 'color:#909399': 'color:#c11920'">
								<div style="font-size: 36rpx;">{{ele.title}}</div>
								<div v-if="ele.dateInfoType == 'DATE_TYPE_FIX_TIME_RANGE'" style="font-size: 22rpx;">
									<div>启用:{{ele.startTime}}</div>
									<div>失效:{{ele.endTime}}</div>
								</div>
								<div v-if="ele.dateInfoType == 'DATE_TYPE_FIX_TERM'" style="font-size: 22rpx;">
									领取后<span v-if="ele.fixedBeginTerm">{{ele.fixedBeginTerm}}天生效</span>{{ele.fixedTerm}}天失效
									<div v-if="ele.fixedEndTime != null">{{ele.fixedEndTime}}统一失效</div>
								</div>
							</div>
						</i-col>
						<i-col span="5">
							<div style="text-align: right;">
								<span v-if="ele.userHasGot < ele.useLimit" class="lijishiyong">点击领取</span>
								<span v-if="ele.userHasGot >= ele.useLimit" class="lijishiyong" style="background-color: #909399;">已经领取</span>
							</div>
						</i-col>
					</i-row>
					<div style="border-top: 2px solid #DCDFE6;margin-top: 5rpx;padding-top: 10rpx;">
						<div>
							<p>{{ele.description}}</p>
						</div>
					</div>
				</div> -->
			</view>
			<div v-show="!loading && !noMore" @click="more" style="margin-top: 20rpx;text-align: center;">
				<div>加载更多</div>
				<div class="iconfont icon-xiangxia"></div>
			</div>
			<div v-show="loading">
				<uni-load-more status="loading" />
			</div>
			<div v-show="noMore">
				<uni-load-more status="noMore" />
			</div>
		</div>
	</view>
</template>

<script>
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import uniLoadMore from "components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				list: [],
				loading: false,
				pageIndex: 0,
				noMore: false,
				loadingPage: false
			}
		},
		onLoad() {
			this.getList()
		},
		onPullDownRefresh() {
			this.getList()
		},
		methods: {
			getTimeClass(ele){
				if(ele.ticketType == null || ele.ticketType == 'FULL_COURT'){
					return "color:#ff807b"
				}else if(ele.ticketType == 'CATEGORY'){
					return "color:#9186ff"
				}
			},
			clickTicket(ele){
				if(ele.needPay){
					this.isPayed(ele)
				}else{
					this.useThis(ele)
				}
			},
			useThis(ele,type) {
				if(type == null){
					type = "SHELF"
				}
				let user = wx.getStorageSync('token')
				this.loadingPage = true
				this.$uniRequest.get('/api/small_ticket_shelf/getCardSign', {
					data: {
						id: ele.id,
						cardId: ele.cardId
					}
				}).then(res => {
					wx.addCard({
						cardList: [{
							cardId: ele.cardId,
							cardExt: '{"nonce_str": "' + res.data.nonceStr + '","code": "", "outer_str":"'+type+'","openid": "", "timestamp": "' + res.data.timestamp +
								'", "signature":"' + res.data.signature + '"}'
						}],
						success(res) {
							console.log(res)
							//
						}
					})
				}).finally(error => this.loadingPage = false)
			},
			isPayed(ele){
				let user = wx.getStorageSync('token')
				let _this = this
				this.loadingPage = true
				this.$uniRequest.post('/api/small_procedures/pay/has_payed_order', {
					id: ele.id
				}).then(res => {
					if(res.data){
						_this.useThis(ele,"PAYED")
					}else{
						_this.zhifu(ele)
					}
				}).finally(error => this.loadingPage = false)
			},
			zhifu(ele){
				let user = wx.getStorageSync('token')
				let _this = this
				this.loadingPage = true
				this.$uniRequest.post('/api/small_procedures/pay/create_order', {
					id: ele.id
				}).then(res => {
					wx.requestPayment({
						timeStamp: res.data.timeStamp+'',
						nonceStr:res.data.nonceStr,
						package:res.data.package,
						signType:'MD5',
						paySign:res.data.paySign,
						success(res) {
							console.log("支付成功")
							//支付成功后直接跳转
							_this.useThis(ele,"PAYED")
						},
						fail(res){
							console.log("支付失败")
						}
					})
				}).finally(error => this.loadingPage = false)
			},
			getList() {
				this.pageIndex = 0
				this.list = []
				this.more()
			},
			more() {
				if (!this.loading) {
					this.loading = true
					this.pageIndex += 1
					this.$uniRequest.get('/api/small_ticket_shelf/list', {
						data: {
							pageIndex: this.pageIndex,
							pageSize: 10
						}
					}).then(res => {
						res.data.content.forEach(c => {
							if (this.list.find(l => l.id === c.id) == null) {
								c.show = false
								this.list.push(c)
							}
						})
						this.noMore = this.list.length >= res.data.totalElements
						uni.stopPullDownRefresh()
					}).finally(error => this.loading = false)
				}
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
</style>

<style scoped>
	.price {
		font-style: normal;
		font-family: 'AvantGarde';
		font-weight: 800;
		font-size: 100rpx;
		text-align: center;
		display: table-cell;
		vertical-align: middle
	}

	.ticket {
		margin: 3px 10px 0px 10px;
		border-top: 3px solid #DCDFE6;
		padding-top: 7px;
		font-family: 'msyh';
	}

	.ticket .tabs_content {}

	.ticket .ticket_card {
		padding: 10rpx 10rpx 10rpx 10rpx;
		/* border: 2px solid #73411e; */
		border: 2px solid #967056;
		margin-bottom: 15rpx;
	}

	.ticket .tab_td {
		/* height: 100rpx; */
		text-align: center;
		align-items: center;
		justify-content: center;
	}

	.ticket .ticket_title {
		margin-top: 18rpx;
		margin-left: 10rpx;
		text-align: left;
		color: #73411e;
		font-family: 'msyh';
	}

	.ticket .lijishiyong {
		background-color: #741419;
		color: #FFFFFF;
		font-size: 26rpx;
		padding: 5rpx 10rpx 5rpx 10rpx;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
		border-bottom-left-radius: 16rpx;
	}

	.go180 {
		transform: rotate(180deg);
		-ms-transform: rotate(180deg);
		-moz-transform: rotate(180deg);
		-o-transform: rotate(180deg);
	}

	.user-info-hover {
		color: #C80000;
	}
	
	.ticket .ticketDiv {
		color: #FFFFFF;
	}
	
	.ticket .user-info-hover {
		color: #C80000;
		/* background: #000000; */
		/* font-weight: bold; */
	}
	
	.ticket .quanchangjuan {
		z-index: 100;
		/* color:#FFFFFF; */
		font-size: 50rpx;
		position: absolute;
		top: 35rpx;
		left: 40rpx;
	}
	
	.ticket .jiage {
		font-family: 'AvantGarde';
		z-index: 101;
		letter-spacing: 4rpx;
		color:#FFFFFF;
		font-size: 68rpx;
		position: absolute;
		top: 55rpx;
		right: 30rpx;
	}
	
	.ticket .youhuima {
		width: 100%;
		z-index: 103;
		letter-spacing: 0rpx;
		color:#FFFFFF;
		font-size: 28rpx;
		position: absolute;
		top: 240rpx;
		left: 10rpx;
		right: 10rpx;
		text-align: center;
	}
	
	.ticket .youxiaoqi {
		font-size: 28rpx;
		position: absolute;
		z-index: 102;
		top: 122rpx;
		left: 56rpx;
	}
	
	.ticket .image {
		
	}
	
	.ticket .used{
		background: #FFFFFF;
		filter: alpha(Opacity=70);
		-moz-opacity: 0.7;
		opacity: 0.7;
	}
</style>
