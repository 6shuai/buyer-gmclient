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
								<div class="panic-buy-wrap mt10" v-if="addParams.jumpType == 2">
									<el-card
										v-if="selectedPanicBuyData.id"
										class="panic-buy-item banner-select-item"
									>
										<panic-buy-list :goodsItem="selectedPanicBuyData"></panic-buy-list>
									</el-card>
								</div>
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
			<div v-loading="panicBuyLoading">
				<div class="panic-buy-wrap mt10" v-if="panicBuyData.length">
					<el-card
						class="panic-buy-item banner-select-item"
						v-for="item in panicBuyData"
						:key="item"
					>
						<el-button
							class="select-btn"
							type="primary"
							plain
							@click="handleSelectedPanicBuy(item)"
							>选择</el-button
						>
						<panic-buy-list :goodsItem="item"></panic-buy-list>
					</el-card>
				</div>
				<el-empty v-else description="暂无数据"></el-empty>
				<el-pagination
					v-if="panicBuyData.length"
					class="mt20"
					background
					:current-page.sync="panicBuyParams.pageNo"
					:page-size="panicBuyParams.pageSize"
					layout="total, prev, pager, next"
					@current-change="handleCurrentChange"
					:total="totalCount"
				>
				</el-pagination>
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
import { reactive, toRefs, ref, onMounted, getCurrentInstance, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { bannerCreate, bannerDetail, bannerPanicBuyList } from '@/api/banner'
import { activityPanicBuyDetail } from '@/api/activity'
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
		const { proxy } = getCurrentInstance()

		onMounted(() => {
			if (route.params.id) {
				getBannerDetail()
			}
			handleCurrentChange()
		})

		//banner详情
		const getBannerDetail = () => {
			state.loading = true
			bannerDetail(route.params.id).then(res => {
				state.loading = false
				state.addParams = res.obj
				if(state.addParams.jumpType == 2){
					panicBuyDetail(state.addParams.auctionId)
				}
			})
		}

		//获取抢购详情
		const panicBuyDetail = (auctionId) => {
			activityPanicBuyDetail(auctionId).then(res => {
				state.selectedPanicBuyData = res.obj
			})
		}

		//抢购列表
		const getPanicBuyList = () => {
			state.panicBuyLoading = true
			bannerPanicBuyList(state.panicBuyParams).then(res => {
				state.panicBuyLoading = false
				let { list, totalRecords } = res.obj
				state.panicBuyData = list
				state.totalCount = totalRecords
			})
		}

		//抢购列表 分页
		const handleCurrentChange = page => {
			state.panicBuyParams.pageNo = page
			getPanicBuyList()
		}

		//选择抢购
		const handleSelectedPanicBuy = data => {
			state.selectedPanicBuyData = {}
			nextTick(() => {
				state.selectedPanicBuyData = data
				state.addParams.auctionId = data.id
				state.dialogVisible = false
			})
		}

		//上传banner成功
		const uploadBannerSuccess = url => {
			state.addParams.image = url
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
						!state.addParams.auctionId
					) {
						ElMessage.warning('请选择抢购~')
						return
					}
					state.btnLoading = true
					bannerCreate(state.addParams).then(res => {
						state.btnLoading = false
						if (res.code == proxy.$successCode) {
							ElMessage.success('操作成功~')
							router.push('/material/banner')
						}
					})
				}
			})
		}

		const state = reactive({
			loading: false,
			btnLoading: false,
			addBannerForm,
			addParams: {
				jumpType: 1,
			},
			addRules: {
				displayName: [
					{ required: true, message: '请输入Banner名称', trigger: 'blur' },
				],
				image: [{ required: true, message: '请上传背景图片', trigger: 'blur' }],
				jumpType: [
					{ required: true, message: '请选择跳转方式', trigger: 'blur' },
				],
			},
			dialogVisible: false,
			panicBuyData: [], //抢购列表
			selectedPanicBuyData: {},
			panicBuyLoading: false,
			panicBuyParams: {
				pageNo: 1,
				pageSize: 40,
			},
			totalCount: 0,
			uploadBannerSuccess,
			handleAddBanner,
			getPanicBuyList,
			handleSelectedPanicBuy,
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