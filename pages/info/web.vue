<template>
	<view>
		<web-view :src="url" />
	</view>
</template>

<script>


	export default {
		components: {},
		computed: {
		},
		data() {
			return {
				url:''
			}
		},
		onPullDownRefresh() {
		},
		onLoad(query) {
			if (query.url) {
				this.url = decodeURIComponent(query.url)
			}
		},
		methods: {
		}
	}
</script>


<style scoped>
</style>
