<template>
	<div class="app-main-wrap create-goods-wrap">
		<el-card>
			<el-page-header
				class="mb30"
				@back="$router.go(-1)"
				:content="$route.params.id ? '编辑商品' : '添加商品'"
			></el-page-header>

			<el-row :gutter="10" class="mt30" v-loading="loading">
				<el-col :xs="24" :sm="24" :md="18">
					<el-form
						label-width="160px"
						ref="addGoodsForm"
						:model="addParams"
						:rules="addRules"
					>
						<el-form-item label="商品名称" prop="displayName">
							<el-input
								class="w220"
								placeholder="请输入商品名称"
								v-model="addParams.displayName"
							></el-input>
						</el-form-item>
						<el-form-item label="销售属性" prop="goodsSkus">
							<el-button icon="el-icon-plus" @click="handleAddSkusBtn()"
								>添加属性</el-button
							>
							<el-table
								class="goods-attribute mt20"
								:data="addParams.goodsSkus"
								stripe
								border
							>
								<el-table-column
									prop="description"
									label="属性"
									:min-width="150"
								>
								</el-table-column>
								<el-table-column prop="cover" label="商品图片" :min-width="100">
									<template #default="scope">
										<el-image
											class="goods-attribute-image"
											fit="contain"
											:src="scope.row.cover"
											:preview-src-list="[scope.row.cover]"
										></el-image>
									</template>
								</el-table-column>
								<el-table-column label="视频" :min-width="200">
									<template #default="scope">
										<ul class="video-list">
											<li
												class="showUploadVideo"
												@click="handleShowUploadVideo(scope.$index)"
											>
												<i class="el-icon-plus"></i>上传
											</li>
											<li
												v-for="(item, index) in scope.row.goodsVideoRelationships"
												:key="index"
												@click="handleShowUploadVideo(scope.$index, item.goodsVideo, index)"
											>
												<el-image
													class="goods-video-cover"
													fit="cover"
													:src="item.goodsVideo.image"
												></el-image>
												<p class="title overflow">{{ item.goodsVideo.displayName }}</p>
											</li>
										</ul>
									</template>
								</el-table-column>
								<el-table-column label="操作" width="100">
									<template #default="scope">
										<p>
											<el-link
												href="javascript:;"
												type="primary"
												class="mr20"
												@click="handleAddSkusBtn(scope.row, scope.$index, true)"
												>编辑</el-link
											>
										</p>
									</template>
								</el-table-column>
							</el-table>
						</el-form-item>

						<el-form-item label="">
							<el-button @click="router.push('/material/goods')">取消</el-button>
							<el-button
								type="primary"
								@click="handleAddGoods"
								:loading="btnLoading"
								>确认</el-button
							>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</el-card>

		<!-- 添加属性 -->
		<skus ref="skus" @addSkus="handleAddSkus"></skus>

		<!-- 添加视频 -->
		<el-dialog
			:title="videoParams.edit ? '编辑视频' : '添加视频'"
			width="800px"
			:close-on-click-modal="false"
			append-to-body
			v-model="addVideoDialog"
		>
			<el-form label-width="160px">
				<el-form-item label="视频名称" prop="displayName">
					<el-input
						class="w220"
						placeholder="请输入视频名称"
						v-model="videoParams.displayName"
					></el-input>
				</el-form-item>
				<el-form-item label="视频文件" prop="displayName">
					<upload-video
						:url="videoParams.url"
						@uploadVideo="uploadVideoSuccess"
						@uploadVideoCover="uploadVideoCover"
					></upload-video>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="addVideoDialog = false">取 消</el-button>
					<el-button type="primary" @click="handleAddVideo">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { goodsCreate, goodsDetail } from '@/api/goods'

import UploadVideo from '@/components/Upload/UploadVideo'
import Skus from './components/Skus'

export default {
	components: {
		UploadVideo,
		Skus,
	},
	setup() {
		const router = useRouter()
		const route = useRoute()

		const skus = ref(null)
		const addGoodsForm = ref(null)

		onMounted(() => {
			if (route.params.id) {
				getBannerDetail()
			}
		})

		const methods = {
			//添加属性
			handleAddSkusBtn(data, index, isEdit) {
				skus.value.showDialog(data, index, isEdit)
			},

			//上传视频成功
			uploadVideoSuccess(videoInfo) {
				console.log('上传成功~')
				state.videoParams = {
					...state.videoParams,
					...videoInfo
				}
			},

			//上传视频封面成功
			uploadVideoCover(url) {
				console.log('视频封面上传成功~')
				state.videoParams.image = url
			},

			//添加商品
			handleAddGoods() {
				addGoodsForm.value.validate(valid => {
					if (valid) {
						state.btnLoading = true
						goodsCreate(state.addParams).then(res => {
							state.btnLoading = false
							ElMessage.success('操作成功~')
							router.push('/material/goods')
						})
					}
				})
			},

			//添加或修改属性
			handleAddSkus(data) {
				if (data.isEdit) {
					state.addParams.goodsSkus[data.index] = data
				} else {
					state.addParams.goodsSkus.push(data)
				}
			},
		}

		//删除商品属性
		const handleDelete = index => {
			state.addParams.goodsSkus.splice(index, 1)
			state.visible = false
		}

		//商品详情
		const getBannerDetail = () => {
			state.loading = true
			goodsDetail(route.params.id).then(res => {
				state.loading = false
				state.addParams = res.obj
			})
		}

		//显示上传视频窗口
		const handleShowUploadVideo = (skusIndex, data, index) => {
			// state.videoParams.id = id
			state.videoParams = {
				skusIndex
			}
			if(data) {
				state.videoParams = {
					...data,
					skusIndex,
					index,
					edit: true
				}
			}
			state.addVideoDialog = true
		}

		//添加商品视频
		const handleAddVideo = () => {
			if (!state.videoParams.displayName) {
				ElMessage.warning('请输入视频名称~')
				return
			} else if (!state.videoParams.url) {
				ElMessage.warning('请上传视频~')
				return
			} else if (!state.videoParams.image) {
				ElMessage.warning('视频截图上传中, 请稍后~')
				return
			}
			let { skusIndex, index } = state.videoParams
			if(!state.addParams.goodsSkus[skusIndex].goodsVideoRelationships) state.addParams.goodsSkus[skusIndex].goodsVideoRelationships = []
			if (!state.addParams.goodsSkus[skusIndex].goodsVideoRelationships.goodsVideo) state.addParams.goodsSkus[skusIndex].goodsVideoRelationships.goodsVideo = []

			if(state.videoParams.edit){
				state.addParams.goodsSkus[skusIndex].goodsVideoRelationships[index].goodsVideo = state.videoParams
			}else{
				state.addParams.goodsSkus[skusIndex].goodsVideoRelationships.push({
					goodsVideo: {
						...state.videoParams
					}
				})
			}
			state.addVideoDialog = false
		}

		const state = reactive({
			addParams: {
				goodsSkus: [], //商品规格属性
			},
			videoParams: {
				url: 'https://quiz.xfengjing.com/video/2021/04/07/dc23b770-f0ff-4697-ba51-cc4be3595367.mp4'
			}, //添加视频
			addRules: {
				displayName: [
					{ required: true, message: '请输入属性名称', trigger: 'blur' },
				],
				goodsSkus: [
					{ required: true, message: '请添加销售属性', trigger: 'blur' },
				],
			},
			loading: false,
			btnLoading: false,
			dialogVisible: false,
			addVideoDialog: false,
			visible: false,
			skus, //添加商品属性 ref
			addGoodsForm, //添加商品 ref
			...methods,
			handleDelete,
			handleShowUploadVideo,
			handleAddVideo,
			router
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss" scope>
.select-btn {
	position: absolute;
	top: 50%;
	left: 50%;
	margin-left: -35px;
	margin-top: -20px;
	z-index: 999;
	display: none;
}
.banner-select-item:hover .select-btn {
	display: block;
}

.goods-attribute {
	&-image {
		width: 80px;
		height: 80px;
	}

	.showUploadVideo {
		width: 78px;
		height: 78px;
		line-height: 78px;
		border: 1px dashed #e5e5e5;
		background: #fff;
		text-align: center;
		cursor: pointer;
		float: left;
		margin-right: 10px;
		&:hover {
			color: #1890ff;
			border-color: #1890ff;
		}
	}

	.video-list {
		display: flex;
		flex-wrap: wrap;

		li{
			margin: 0 10px 10px 0;
			cursor: pointer;
		}

		.goods-video-cover {
			width: 80px;
			height: 50px;
		}

		p.title{
			text-align: center;
			font-size: 12px;
			color: #999;
		}
	}
}
</style>