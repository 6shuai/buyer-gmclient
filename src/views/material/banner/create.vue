<template>
	<div class="app-main-wrap">
		<el-card>
			<el-page-header
				class="mb30"
				@back="$router.go(-1)"
				:content="$route.params.id ? '编辑Banner' : '添加Banner'"
			></el-page-header>

			<el-row :gutter="10" class="mt30" v-loading="loading">
				<el-col :xs="24" :sm="24" :md="12">
					<el-form
						label-width="160px"
						ref="addBannerForm"
						:model="addParams"
						:rules="addRules"
					>
						<el-form-item label="Banner名称" prop="displayName">
							<el-input
								placeholder="请输入Banner名称"
								v-model="addParams.displayName"
							></el-input>
						</el-form-item>
						<el-form-item label="背景图片" prop="image">
							<upload-img
								:isArray="false"
								:imgList="addParams.image"
								@uploadImgPath="uploadBannerSuccess"
							></upload-img>
						</el-form-item>
						<el-form-item label="跳转方式" prop="jumpType">
							<el-radio-group v-model="addParams.jumpType">
								<el-radio :label="1">跳转链接</el-radio>
								<el-radio :label="2">跳转抢购</el-radio>
							</el-radio-group>
							<div>
								<el-input
									v-if="addParams.jumpType == 1"
									v-model="addParams.link"
									placeholder="请输入跳转链接"
								></el-input>
								<el-button
									v-if="addParams.jumpType == 2"
									type="primary"
									plain
									@click="dialogVisible = true"
								>
									选择抢购
								</el-button>
							</div>
						</el-form-item>
						<el-form-item label="">
							<el-button @click="$router.go(-1)">取消</el-button>
							<el-button
								type="primary"
								@click="handleAddBanner"
								:loading="btnLoading"
								>确认</el-button
							>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</el-card>

		<!-- 选择抢购 -->
		<el-dialog
			title="选择抢购"
			width="1000px"
			:close-on-click-modal="false"
			append-to-body
			v-model="dialogVisible"
		>
			<div class="panic-buy-wrap mt10" v-if="panicBuyList.length">
				<el-card
					class="panic-buy-item banner-select-item"
					v-for="item in panicBuyList"
					:key="item"
				>
					<el-button class="select-btn" type="primary" plain>选择</el-button>
					<panic-buy-list :hideDeleteBtn="true"></panic-buy-list>
				</el-card>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="dialogVisible = false"
						>确 定</el-button
					>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { reactive, toRefs, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { bannerCreate, bannerDetail } from '@/api/banner'
import UploadImg from '@/components/Upload/UploadImg'
import PanicBuyList from '@/components/PanicBuy/index'

export default {
	components: {
		UploadImg,
		PanicBuyList,
	},
	setup() {
		const router = useRouter()
		const route = useRoute()
		const addBannerForm = ref(null)

		onMounted(() => {
			if (route.params.id) {
				getBannerDetail()
			}
		})

		//banner详情
		const getBannerDetail = () => {
			state.loading = true
			bannerDetail(route.params.id).then(res => {
				state.loading = false
				state.addParams = res.obj
			})
		}

		//上传banner成功
		const uploadBannerSuccess = () => {
			console.log('上传成功~')
		}

		//添加banner
		const handleAddBanner = () => {
			addBannerForm.value.validate(valid => {
				if (valid) {
					if (state.addParams.jumpType == 1 && !state.addParams.link) {
						ElMessage.warning('请填写跳转链接~')
						return
					} else if (
						state.addParams.jumpType == 2 &&
						!state.addParams.actionsId
					) {
						ElMessage.warning('请选择抢购~')
						return
					}
					state.btnLoading = true
					bannerCreate(state.addParams).then(res => {
						state.btnLoading = false;
						ElMessage.success('操作成功~')
						router.push('/material/banner')
					})
				}
			})
		}

		const state = reactive({
			loading: false,
			btnLoading: false,
			addBannerForm,
			addParams: {
				type: 1,
				image: 'http://123.206.83.233:80/screenshot/2021/03/18/a1bd945c-b55c-4394-b0f3-7782f78ccb66.jpg',
			},
			addRules: {
				displayName: [
					{ required: true, message: '请输入Banner名称', trigger: 'blur' },
				],
				image: [
					{ required: true, message: '请上传背景图片', trigger: 'blur' },
				],
				jumpType: [
					{ required: true, message: '请选择跳转方式', trigger: 'blur' },
				]
			},
			dialogVisible: false,
			panicBuyList: [{}, {}], //抢购列表
			uploadBannerSuccess,
			handleAddBanner,
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
</style>