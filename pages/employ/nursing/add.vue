<template>
	<view class="nursing_add">
		<div class="content">
			<van-cell-group title="宝贝照片">
				<view class="form-first-bottom">
					<view class="add-container" v-for="(imageEle,index) in form.imageUrlList">
						<image @click="showImage(imageEle,form.imageUrlList)" class="selectclass1" mode="aspectFill" :src="imageEle" />
						<div @click="deleteEle(form,index)" style="position: relative;height: 0;"><em class="close">
								<van-icon name="clear" /></em></div>
					</view>
					<view class="add-container" v-if="form.imageUrlList.length < 3">
						<div class="selectclass" @click="chooseImage(form)">+</div>
					</view>
				</view>
			</van-cell-group>
			<van-cell-group title="焕新品类">
				<van-cell title="焕新品类" required :value="form.categoryName" is-link @click="openCategorySelect" />
				<van-cell title="焕新价格" :value="form.categoryPrice" />
				<van-cell title="客户余额" :value="userBalance" />
			</van-cell-group>
			<div style="margin:15rpx 10rpx 0 10rpx">
				<van-button @click="form.showProblem = !form.showProblem" type="info" size="large" v-text="form.showProblem ? '关闭问题':'增加问题'"></van-button>
			</div>
			<div class="content" v-show="form.showProblem">
				<van-cell-group title="凭证照片">
					<view class="form-first-bottom">
						<view class="add-container" v-for="(imageEle,index) in problem.imageUrlList">
							<image @click="showImage(imageEle,problem.imageUrlList)" class="selectclass1" mode="aspectFill" :src="imageEle" />
							<div @click="deleteEle(problem,index)" style="position: relative;height: 0;"><em class="close">
									<van-icon name="clear" /></em></div>
						</view>
						<view class="add-container" v-if="problem.imageUrlList.length < 3">
							<div class="selectclass" @click="chooseImage(problem)">+</div>
						</view>
					</view>
				</van-cell-group>
				<van-cell-group>
					<van-field @change="changeProblemMessage" :value="problem.problemMessage" type="textarea" placeholder="请输入问题说明"
					 autosize clearable />
				</van-cell-group>
			</div>
		</div>
		<div style="position:fixed;bottom: 0;text-align: center;width: 100%;">
			<van-row>
				<van-col span="12">
					<van-button @click="save('finish')" type="primary" :disabled="(form.type == 'goodsType' && form.goodsId == '') || (form.type == 'other' && form.changeOtherGoodName == '')"
					 size="large">完成货品添加</van-button>
				</van-col>
				<van-col span="12">
					<van-button @click="save('next')" plain type="primary" :disabled="(form.type == 'goodsType' && form.goodsId == '') || (form.type == 'other' && form.changeOtherGoodName == '')"
					 size="large">继续添加货品</van-button>
				</van-col>
			</van-row>
		</div>
		<van-popup :show="show" position="bottom" custom-style="height: 40%;" @close="show = false">
			<van-cell-group>
				<van-field :value="search" placeholder="输入搜索" @change="onChangeSearch" />
			</van-cell-group>
			<van-radio-group :value="form.categoryId">
				<van-cell-group>
					<van-cell v-for="ele in filterCategoryList" :title="ele.name" clickable :data-name="ele.id" @click="onClickCategoryEle(ele)">
						<van-radio slot="right-icon" :name="ele.id" />
					</van-cell>
				</van-cell-group>
			</van-radio-group>
		</van-popup>
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
			this.form.billId = query.billId
			this.userBalance = query.balance
			this.loadAllCategory()
		},
		data() {
			return {
				search: '',
				show: false,
				categoryList: [],
				problem: {
					imageUrlList: [],
					imageUrlUploadList: [],
					problemMessage: ''
				},
				form: {
					categoryName: '',
					categoryId: '',
					settlePrice: 0,
					price: 0,
					imageUrlList: [],
					imageUrlUploadList: [],
					problemMessage: '',
					problemImageUrlList: [],
					problemImageUrlUploadList: [],
					showProblem: false,
					goodsUrl1: '',
					goodsUrl2: '',
					goodsUrl3: '',
					problemGoodsUrl1: '',
					problemGoodsUrl2: '',
					problemGoodsUrl3: ''
				},
				userBalance: 0
			}
		},
		computed: {
			filterCategoryList() {
				return this.categoryList.filter(f => this.search == '' || f.name.indexOf(this.search) > -1)
			}
		},
		methods: {
			changeProblemMessage(e) {
				this.problem.problemMessage = e.detail
			},
			onChangeSearch(e) {
				this.search = e.detail
			},
			openCategorySelect(e) {
				this.show = true
			},
			onClickCategoryEle(ele) {
				this.form.categoryId = ele.id
				this.form.categoryName = ele.name
				this.form.categoryPrice = ele.price
				this.form.settlePrice = ele.settlePrice
				this.show = false
			},
			loadAllCategory() {
				this.$uniRequest.get('/api/nursing_category_config/all').then(res => {
					this.categoryList = res.data
				}).finally(() => {})
			},
			chooseImage(ele) {
				let _this = this
				wx.chooseImage({
					count: 3 - ele.imageUrlList.length,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success(res) {
						let _res = res
						//上传到服务器
						Toast.loading('上传中...')
						_this.uploadImage(_res.tempFilePaths, ele, 0)
					}
				})
			},
			uploadImage(path, ele, i) {
				let _this = this
				wx.uploadFile({
					url: _this.$baseURL + '/api/upload/upload?parent=goods',
					filePath: path[i],
					name: 'file',
					formData: {
						'user': 'test'
					},
					success(res) {
						let json = JSON.parse(res.data)
						if (json.code == 0) {
							ele.imageUrlList = ele.imageUrlList.concat(path[i])
							ele.imageUrlUploadList = ele.imageUrlUploadList.concat(json.data)
							i = i + 1
							if (i < path.length) {
								_this.uploadImage(path, ele, i)
							} else {
								Toast.clear()
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
			deleteEle(ele, index) {
				ele.imageUrlList.splice(index, 1)
				ele.imageUrlUploadList.splice(index, 1)
			},
			showImage(url, list) {
				wx.previewImage({
					current: url,
					urls: list
				})
			},
			updateIamge(successCall, i) {
				let _this = this
				if (i >= _this.form.imageUrlList.length) {
					successCall()
					return
				}
				wx.uploadFile({
					url: _this.$baseURL + '/api/upload/upload?parent=goods',
					filePath: _this.form.imageUrlList[i],
					name: 'file',
					formData: {
						'user': 'test'
					},
					success(res) {
						let json = JSON.parse(res.data)
						if (json.code == 0) {
							i = i + 1
							if (i == 1) {
								_this.form.goodsUrl1 = json.data
							} else if (i == 2) {
								_this.form.goodsUrl2 = json.data
							} else if (i == 3) {
								_this.form.goodsUrl3 = json.data
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
				if (this.form.categoryId == '') {
					Toast('请选择焕新品类')
					return false
				}
				return true
			},
			save(t) {
				if (!this.isCanSubmit()) {
					return
				}
				//整理数据
				for (let i = 0; i < this.form.imageUrlUploadList.length; i++) {
					this.form['goodsUrl' + (i + 1)] = this.form.imageUrlUploadList[i]
				}
				for (let i = 0; i < this.problem.imageUrlUploadList.length; i++) {
					this.form['problemGoodsUrl' + (i + 1)] = this.problem.imageUrlUploadList[i]
				}
				this.form.problemMessage = this.problem.problemMessage
				Toast.loading('加载中...')
				let _this = this
				if (t == "next") {
					this.saveAndNext()
					// this.updateIamge(this.saveAndNext, 0)
				} else {
					this.saveAndFinish()
					// this.updateIamge(this.saveAndFinish, 0)
				}
			},
			saveAndNext() {
				this.$uniRequest.post('/api/small_procedures/nursing/add_goods', this.form).then(res => {
					Toast.success('操作成功')
					uni.redirectTo({
						url: '/pages/employ/nursing/add?billId=' + this.form.billId + '&balance=' + this.userBalance
					})
				}).finally(() => Toast.clear())
			},
			saveAndFinish() {
				this.$uniRequest.post('/api/small_procedures/nursing/add_goods', this.form).then(res => {
					Toast.success('操作成功')
					uni.redirectTo({
						url: '/pages/employ/nursing/list'
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
