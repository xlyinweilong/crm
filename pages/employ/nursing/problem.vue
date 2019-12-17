<template>
	<view class="nursing_add">
		<div class="content">
			<van-cell-group title="凭证照片">
				<view class="form-first-bottom">
					<view class="add-container" v-for="(imageEle,index) in form.imageUrlList">
						<image @click="showImage(imageEle)" class="selectclass1" mode="aspectFill" :src="imageEle" />
						<div @click="deleteEle(index)" style="position: relative;height: 0;"><em class="close">
								<van-icon name="clear" /></em></div>
					</view>
					<view class="add-container" v-if="form.imageUrlList.length < 3">
						<div class="selectclass" @click="chooseImage">+</div>
					</view>
				</view>
			</van-cell-group>
			<van-cell-group title="问题说明">
				<van-field @change="changeProblemMessage" :value="form.problemMessage"  type="textarea"
					placeholder="请输入问题说明" autosize clearable />
			</van-cell-group>
		</div>
		<div style="position:fixed;bottom: 0;text-align: center;width: 100%;">
			<van-button @click="save('finish')" type="primary"
			 size="large">确定</van-button>
		</div>
		<van-toast id="van-toast" />
	</view>
</template>

<script>
	import Dialog from 'wxcomponents/vant/dialog/dialog'
	import uniLoadMore from "components/uni-load-more/uni-load-more.vue"
	import Toast from '@/wxcomponents/vant/toast/toast'

	export default {
		components: {
			uniLoadMore
		},
		onLoad(query) {
			this.form.id = query.id
			this.getInfo()
		},
		data() {
			return {
				form: {
					id:'',
					problemMessage: '',
					imageUrlList: []
				}
			}
		},
		methods: {
			getInfo() {
				Toast.loading('加载中...')
				this.$uniRequest.get('/api/small_procedures/nursing/bill_info', {
					data: {
						id: this.form.id
					}
				}).then(res => {
					this.billDetail = res.data
				}).finally(() => Toast.clear())
			},
			changeProblemMessage(e) {
				this.form.problemMessage = e.detail
			},
			chooseImage() {
				let _this = this
				wx.chooseImage({
					count: 3 - _this.form.imageUrlList.length,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success(res) {
						_this.form.imageUrlList = _this.form.imageUrlList.concat(res.tempFilePaths)
					}
				})
			},
			deleteEle(index) {
				this.form.imageUrlList.splice(index, 1)
			},
			showImage(url) {
				let _this = this
				wx.previewImage({
					current: url,
					urls: _this.form.imageUrlList
				})
			},
			updateIamge(successCall, i) {
				let _this = this
				if (i >= _this.form.imageUrlList.length) {
					successCall()
					return
				}
				Toast.loading('加载中...')
				wx.uploadFile({
					url: this.$baseURL + '/api/upload/upload?parent=goods',
					filePath: this.form.imageUrlList[i],
					name: 'file',
					formData: {
						'user': 'test'
					},
					success(res) {
						let json = JSON.parse(res.data)
						if (json.code == 0) {
							i = i + 1
							if (i == 1) {
								_this.form.problemGoodsUrl1 = json.data
							} else if (i == 2) {
								_this.form.problemGoodsUrl2 = json.data
							} else if (i == 3) {
								_this.form.problemGoodsUrl3 = json.data
							}
							if (i < _this.form.imageUrlList.length) {
								_this.updateIamge(successCall, i)
							} else {
								successCall()
							}
						} else {
							Toast.clear()
							Toast.fail(json.message)
						}
					},
					error(e) {
						Toast.clear()
						Toast.fail('上传失败')
					}
				})
			},
			isCanSubmit() {
				if (this.form.problemMessage == '') {
					Toast('请填写问题说明')
					return false
				}
				return true
			},
			save(t) {
				if (!this.isCanSubmit()) {
					return
				}
				Toast.loading('加载中...')
				let _this = this
				this.updateIamge(this.saveAndFinish, 0)
			},
			saveAndFinish() {
				Toast.loading('加载中...')
				this.$uniRequest.post('/api/small_procedures/nursing/problem', this.form).then(res => {
					Toast.success('操作成功')
					uni.reLaunch({
						url: '/pages/employ/nursing/wash_list'
					})
				}).finally(() => Toast.clear())
			}
		}
	}
</script>

<style>
	page {}
</style>

<style scoped>
	.form-first-bottom {
		margin-left: 30rpx;
		margin-right: 20rpx;
		margin-top: 0rpx;
		padding-bottom: 10rpx;
		width: clac(100% - 50rpx);
		display: flex;
		flex-wrap: wrap;
		padding-top: 20rpx;
	}

	.add-container {
		width: calc(34% - 18rpx);
		height: 220rpx;
		text-align: center;
		line-height: 200rpx;
		padding-top: 13rpx;
		padding-right: 13rpx;
	}

	.form-first-bottom>.add-container:nth-of-type(3n) {
		/* 选择个数是3的倍数的元素 */
		padding-right: 0;
	}

	.selectclass1 {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.selectclass {
		width: 100%;
		height: 100%;
		font-size: 100rpx;
		background-color: #E4E7ED;
		text-align: center;
		vertical-align: middle;
		padding: 0;
	}

	.content {
		padding-bottom: 150rpx;
	}

	.close {
		border-radius: 15rpx;
		box-shadow: 0 0 0 3rpx #fff;
		min-width: 50rpx;
		line-height: 50rpx;
		font-style: normal;
		background-color: #fff;
		color: #969799;
		font-size: 50rpx;
		position: absolute;
		top: -335rpx;
		right: -15rpx;
		padding: 0 3rpx;
	}
</style>
