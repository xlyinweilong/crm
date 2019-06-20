<template>
	<view class="content">
		<section class="aui-flexView">
			<section class="aui-scrollView">
				<div class="aui-head-chang">
					<div class="aui-flex">
						<div class="aui-user-img">
							<img src="@/static/images/user.png" alt="">

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
						<div class="aui-sml-img">
							<img src="@/static/images/sd.png" alt="">
						</div>
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
					<view>
						<i-grid>
							<i-grid-item>
								<i-grid-icon>
									<image src="../images/icon-vip.png" />
								</i-grid-icon>
								<i-grid-label>Grid</i-grid-label>
							</i-grid-item>
							<i-grid-item>Grid</i-grid-item>
							<i-grid-item>Grid</i-grid-item>
						</i-grid>
					</view>
					<!-- <div class="aui-flex"> -->
					<!-- <div class="aui-flex-box">
							<h2>我的订单</h2>
						</div>
						<div class="aui-arrow">
							<span>查看全部</span>
						</div> -->
					<!-- </div> -->
					<div class="aui-palace">
						<a href="javascript:;" class="aui-palace-grid">
							<div class="aui-palace-grid-icon">
								<img src="@/static/images/nav-001.png" alt="">
							</div>
							<!-- <uni-icon type="contact" size="30">待付款</uni-icon> -->
							<div class="aui-palace-grid-text">
								<h2>二维码</h2>
							</div>
						</a>
						<a href="javascript:;" class="aui-palace-grid">
							<div class="aui-palace-grid-icon">
								<img src="images/nav-002.png" alt="">
							</div>
							<div class="aui-palace-grid-text">
								<h2>订单</h2>
							</div>
						</a>
						<a href="javascript:;" class="aui-palace-grid">
							<div class="aui-palace-grid-icon">
								<img src="images/nav-003.png" alt="">
							</div>
							<div class="aui-palace-grid-text">
								<h2>优惠卷</h2>
							</div>
						</a>
						<a href="javascript:;" class="aui-palace-grid">
							<div class="aui-palace-grid-icon">
								<img src="images/nav-004.png" alt="">
							</div>
							<div class="aui-palace-grid-text">
								<h2>积分明细</h2>
							</div>
						</a>
						<a href="javascript:;" class="aui-palace-grid">
							<div class="aui-palace-grid-icon">
								<img src="images/nav-005.png" alt="">
							</div>
							<div class="aui-palace-grid-text">
								<h2>附近门店</h2>
							</div>
						</a>
					</div>
				</div>
				<div class="aui-white-box">
					<div class="aui-flex">
						<div class="aui-flex-box">
							<h2>我的资产</h2>
						</div>
					</div>
					<div class="aui-palace aui-palace-one">
						<a href="javascript:;" class="aui-palace-grid">
							<div class="aui-palace-grid-text">
								<p><em>￥</em>0</p>
								<h2>回馈金</h2>
							</div>
						</a>
						<a href="javascript:;" class="aui-palace-grid">
							<div class="aui-palace-grid-text">
								<p>12</p>
								<h2>优惠券</h2>
							</div>
						</a>
						<a href="javascript:;" class="aui-palace-grid">
							<div class="aui-palace-grid-text">
								<p>12</p>
								<h2>积分</h2>
							</div>
						</a>
						<a href="javascript:;" class="aui-palace-grid">
							<div class="aui-palace-grid-text">
								<p>12</p>
								<h2>红包</h2>
							</div>
						</a>
					</div>
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

<style>

</style>
