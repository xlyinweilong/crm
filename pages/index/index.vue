<template>
	<view class="content">
		<section class="aui-flexView">
			<section class="aui-scrollView">
				<div class="aui-head-chang">
					<div class="aui-flex">
						<div class="aui-user-img">
							<image :lazy-load="true" src="../../static/images/user.png" />
						</div>
						<div class="aui-flex-box">
							<h2>李嘉桦</h2>
						</div>
						<div class="aui-btn">
							<button>
								<i class="icon icon-in"></i> 每日签到
							</button>
						</div>
					</div>
				</div>
				<div class="aui-head-top">
					<div class="aui-flex">
						<view class="aui-sml-img">
							<image class="aui-sml-img" :lazy-load="true" src="../../static/images/sd.png" />
						</view>
						<div class="aui-flex-box">
							<h3>钻石卡
								<!-- <img src="@/static/images/ar.png" alt=""> -->
							</h3>
							<!-- <p>可享95折</p> -->
						</div>
						<div class="aui-day">积分:30000</div>
					</div>
				</div>
				<div class="aui-white-box">
					<div class="aui-flex">
						<div class="aui-flex-box">
							<h2>我的订单</h2>
						</div>
						<div class="aui-arrow">
							<span>查看全部</span>
						</div>
					</div>
					<view>
						<i-grid style="text-align: center;">
							<i-grid-item>
								<div>
									<i-icon type="barrage_fill" size="38" />
								</div>
								<div>二维码</div>
							</i-grid-item>
							<i-grid-item>
								<div>
									<i-icon type="interactive" size="38" />
								</div>
								<div>附近门店</div>
							</i-grid-item>
							<i-grid-item>
								<div>
									<i-icon type="barrage_fill" size="38" />
								</div>
								<div>优惠领劵</div>
							</i-grid-item>
						</i-grid>
						<i-grid style="text-align: center;">
							<i-grid-item>
								<div>
									<i-icon type="feedback" size="38" />
								</div>
								<div>积分记录</div>
							</i-grid-item>
							<i-grid-item>
								<div>
									<i-icon type="barrage_fill" size="38" />
								</div>
								<div>订单</div>
							</i-grid-item>
							<i-grid-item>
								<div>
									<i-icon type="coupons_fill" size="38" />
								</div>
								<div>我的卡卷</div>
							</i-grid-item>
						</i-grid>
						<i-grid style="text-align: center;">
							<i-grid-item>
								<div>
									<i-icon type="emoji" size="38" />
								</div>
								<div>会员权益</div>
							</i-grid-item>
							<i-grid-item>
								<div>
									<i-icon type="collection" size="38" />
								</div>
								<div>我的顾问</div>
							</i-grid-item>
							<i-grid-item>
								<div>
									<i-icon type="dynamic_fill" size="38" />
								</div>
								<div>意见反馈</div>
							</i-grid-item>
						</i-grid>
					</view>

				</div>
				<div class="aui-white-box">
					<div class="aui-flex">
						<div class="aui-flex-box">
							<h2>我的资产</h2>
						</div>
					</div>
					<i-row style="text-align: center;font-size: 32rpx;">
						<i-col span="6" i-class="col-class" style="font-size: 32rpx;">
							<div>
								<h1>30000</h1>
								<h2>积分</h2>
							</div>
						</i-col>
						<i-col span="6" i-class="col-class">
							<h1>0</h1>
							<h2>赏金</h2>
						</i-col>
						<i-col span="6" i-class="col-class">
						</i-col>
						<i-col span="6" i-class="col-class">
						</i-col>
					</i-row>
				</div>
			</section>
		</section>
	</view>
</template>

<script>
	import '@/static/css/style.css'

	export default {
		components: {},
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style scoped>

</style>
