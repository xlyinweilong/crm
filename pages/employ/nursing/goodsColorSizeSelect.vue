<template>
	<view>
		<van-popup :show="show" position="bottom" custom-style="height: 40%;" @close="show = false">
			<van-radio-group :value="selectId">
				<van-cell-group>
					<van-cell v-for="ele in list" :title="ele.name" clickable :data-name="ele.id" @click="onClickEle(ele)">
						<van-radio slot="right-icon" :name="ele.id" />
					</van-cell>
				</van-cell-group>
			</van-radio-group>
		</van-popup>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Toast from '@/wxcomponents/vant/toast/toast'

	export default {
		components: {},
		data() {
			return {
				show: false,
				loading: false
			}
		},
		props: {
			list:{
				default:[]
			},
			selectId: {
				default: ''
			},
			selectName: {
				default: ''
			},
		},
		methods: {
			onOpen() {
				this.show = true
			},
			onClickEle(ele) {
				this.$emit('update:selectId', ele.id)
				this.$emit('update:selectName', ele.name)
				this.show = false
			}
		}
	}
</script>

<style scoped>
</style>
