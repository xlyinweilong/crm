<template>
	<view>
		<van-nav-bar
		custom-class="nav-bar-class"
		title-class="nav-bar-title"
		  :title="title"
		  left-text="返回"
		  @click-left="onClickLeft"
		/>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
			}
		},
		props: {
			title: {
				default: ''
			}
		},
		onLoad(query) {},
		methods: {
			onClickLeft(e) {
				// this.active = e.detail
			},
			onClickRight(e){
				
			}
		}
	}
</script>

<style>
		.nav-bar-class{
			color: #706000;
		}
		
		.nav-bar-title{
			color: #706000;
		}
</style>
