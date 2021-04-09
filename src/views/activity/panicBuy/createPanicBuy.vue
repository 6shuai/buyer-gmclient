<template>
	<div class="app-main-wrap">
		<el-card>
			<el-page-header
				class="mb20"
				@back="goBack"
				:content="resData.id ? '编辑抢购' : '创建抢购'"
			></el-page-header>
			<div v-loading="loading">
				<el-steps
					v-if="!hideStep"
					:active="stepNum"
					finish-status="success"
					simple
				>
					<el-step title="商品信息"></el-step>
					<el-step title="抢购信息"></el-step>
					<el-step title="添加机器人"></el-step>
				</el-steps>

				<div class="add-auction-form">
					<el-form label-width="160px" ref="addAuctionForm">
						<div class="add-item" v-show="stepNum == 0 || hideStep">
							<step-1 ref="step1" :panicBuyData="resData"></step-1>
						</div>

						<div class="add-item" v-show="stepNum == 1 || hideStep">
							<step-2 ref="step2" :panicBuyData="resData"></step-2>
						</div>

						<div class="add-item" v-show="stepNum == 2 || hideStep">
							<step-3 ref="step3" :panicBuyData="resData"></step-3>
						</div>
					</el-form>

					<div class="step-btn">
						<el-button
							v-show="stepNum && !hideStep"
							@click="setCurrentStep('prev')"
							>上一步</el-button
						>
						<el-button
							v-show="stepNum != 2 && !hideStep"
							type="primary"
							:loading="btnLoading"
							@click="setCurrentStep('next')"
							>下一步</el-button
						>
						<el-button
							v-show="hideStep"
							@click="goBack"
							>取 消</el-button
						>
						<el-button
							v-show="stepNum == 2 || hideStep"
							type="primary"
							:loading="btnLoading"
							@click="handleCreate"
							>提 交</el-button
						>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
import { reactive, toRefs, ref, getCurrentInstance, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { activityPanicBuyCreate, activityPanicBuyDetail } from '@/api/activity'
import Step1 from '../components/step/Step1'
import Step2 from '../components/step/Step2'
import Step3 from '../components/step/Step3'

export default {
	setup(props) {
		const route = useRoute()
		const router = useRouter()
		const store = useStore()
		const [step1, step2, step3] = [ref(null), ref(null), ref(null)]
		const { proxy } = getCurrentInstance()

		onMounted(() => {
			if (route.params.goodsId) {
				getDetail()
			}
		})

		//返回上一步
		const goBack = () => {
			router.push(`/activity/panicBuy/${route.params.id}`)
		}

		//当前步骤
		const setCurrentStep = type => {
			let { stepNum } = state
			if (type == 'prev' && stepNum > 0) {
				state.stepNum -= 1
			} else if (type == 'next' && stepNum < 3) {
				switch (state.stepNum) {
					case 0:
						step1.value.setPanicBuyData()
						break
					case 1:
						step2.value.setPanicBuyData()
						break
					default:
						break
				}

				createPanicBuy()
			}
		}

		//创建抢购 点击完成
		const handleCreate = () => {
			state.btnLoading = true
			step1.value.setPanicBuyData()
			step2.value.setPanicBuyData()
			nextTick(() => {
				let data = {
					activityId: route.params.id,
					...store.state.activity.panicBuyData,
					editStep: 3,
				}
				activityPanicBuyCreate(data).then(res => {
					state.btnLoading = false
					if (res.code === proxy.$successCode) {
						goBack()
					}
				})
			})
		}

		//添加抢购
		const createPanicBuy = () => {
			state.btnLoading = true
			let data = {
				activityId: route.params.id,
				...store.state.activity.panicBuyData,
				editStep: state.stepNum + 1,
			}
			activityPanicBuyCreate(data).then(res => {
				state.btnLoading = false
				if (res.code === proxy.$successCode) {
					store.dispatch('activity/setPanicBuyData', { id: res.obj })
					state.stepNum += 1
				}
			})
		}

		//查询抢购详情
		const getDetail = () => {
			state.loading = true
			activityPanicBuyDetail(route.params.goodsId).then(res => {
				if (res.code === proxy.$successCode) {
					state.resData = res.obj
					let { editStep } = res.obj
					if (!editStep) {
						state.hideStep = true
					} else {
						state.stepNum = editStep > 2 ? 2 : editStep
					}
					store.dispatch('activity/setPanicBuyData', res.obj)
					state.loading = false
					if (state.resData.goodsId) {
						step1.value.goodsSkuList(state.resData.goodsId)
					}
					step3.value.getRobotList()
				}
			})
		}

		const state = reactive({
			loading: false,
			btnLoading: false,
			hideStep: false, //全部填写完成之后, 不再显示步骤
			stepNum: 0,
			resData: {},
			route,
			router,
			setCurrentStep,
			step1,
			step2,
			step3,
			handleCreate,
			goBack
		})

		return toRefs(state)
	},
	components: {
		Step1,
		Step2,
		Step3,
	},
}
Step1
</script>

<style lang="scss" scope>
.app-main-wrap {
	.add-auction-form {
		.title {
			background: #f5efef;
			line-height: 30px;
			padding: 10px;
			margin-top: 20px;
		}

		.step-btn {
			padding: 20px 0;
			width: 400px;
			text-align: center;
			button {
				margin: 0 20px;
			}
		}

		.el-table {
			margin-top: 10px;
			border: 1px solid #e5e5e5;
			border-radius: 4px;
		}

		.units {
			padding-left: 10px;
			color: #ff2e63;
		}
	}
}
</style>
