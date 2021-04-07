<template>
	<div class="app-main-wrap">
		<el-card>
			<el-page-header
				class="mb20"
				@back="$router.go(-1)"
				content="创建抢购"
			></el-page-header>
			<el-steps :active="stepNum" finish-status="success" simple>
				<el-step title="商品信息"></el-step>
				<el-step title="抢购信息"></el-step>
				<el-step title="支付信息"></el-step>
				<el-step title="添加机器人"></el-step>
			</el-steps>

			<div class="add-auction-form" v-loading="loading">
				<el-form
					label-width="160px"
					ref="addAuctionForm"
				>
					<div class="add-item" v-show="stepNum == 0">
						<step-1 ref="step1" :panicBuyData="resData"></step-1>
					</div>

					<div class="add-item" v-show="stepNum == 1">
						<step-2 ref="step2" :panicBuyData="resData"></step-2>
					</div>

					<div class="add-item" v-show="stepNum == 2">
						<step-3 ref="step3" :panicBuyData="resData"></step-3>
					</div>

					<div class="add-item" v-show="stepNum == 3">
						<step-4 ref="step4" :panicBuyData="resData"></step-4>
					</div>
				</el-form>

				<div class="step-btn">
					<el-button v-show="stepNum" @click="setCurrentStep('prev')"
						>上一步</el-button
					>
					<el-button
						v-show="stepNum != 3"
						type="primary"
						@click="setCurrentStep('next')"
						>下一步</el-button
					>
					<el-button 
						v-show="stepNum == 3" 
						type="primary"
						@click="handleCreate"
					>完成</el-button>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
import { reactive, toRefs, ref, getCurrentInstance, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { activityPanicBuyCreate, activityPanicBuyDetail } from '@/api/activity'
import Step1 from '../components/step/Step1';
import Step2 from '../components/step/Step2';
import Step3 from '../components/step/Step3';
import Step4 from '../components/step/Step4';

export default {
	setup(props) {
		const route = useRoute()
		const store = useStore()
		const [step1, step2, step3, step4] = [ref(null), ref(null), ref(null), ref(null)]
		const { proxy } = getCurrentInstance()

		onMounted(() => {
			if(route.params.goodsId){
				getDetail()
			}	
		})

		//当前步骤
		const setCurrentStep = type => {
			let { stepNum } = state;
			if (type == 'prev' && stepNum > 0) {
				state.stepNum -= 1
			} else if (type == 'next' && stepNum < 3) {
				switch (state.stepNum) {
					case 0:
						step1.value.setPanicBuyData()
						break;
					case 1:
						step2.value.setPanicBuyData()
						break;
					case 2:
						step3.value.setPanicBuyData()
						break;
					default:
						break;
				}
				
				createPanicBuy()
			}
		}

		//创建抢购 点击完成
		const handleCreate = () => {

		}

		//添加抢购
		const createPanicBuy = () => {
			state.btnLoading = true
			let data = {
				activityId: route.params.id,
				...store.state.activity.panicBuyData,
				editStep: state.stepNum
			}
			activityPanicBuyCreate(data).then(res => {
				state.btnLoading = false;
				if(res.code === proxy.$successCode){
					ElMessage.success('操作成功~')
					store.dispatch('activity/setPanicBuyData', { id: res.obj })
					state.stepNum += 1
				}
			})
		}

		//查询抢购详情
		const getDetail = () => {
			state.loading = true
			activityPanicBuyDetail(route.params.goodsId).then(res => {
				if(res.code === proxy.$successCode){
					state.resData = res.obj
					state.stepNum = res.obj.editStep
					store.dispatch('activity/setPanicBuyData', res.obj)
					state.loading = false
					if(state.resData.goodsId){
						step1.value.goodsSkuList(state.resData.goodsId)
					}
				}
			})
		}

		const state = reactive({
			loading: false,
			stepNum: 0,
			resData: {},
			setCurrentStep,
			step1,
			step2,
			step3,
			step4,
			handleCreate
		})

		return toRefs(state)
	},
	components: {
        Step1,
		Step2,
		Step3,
		Step4,
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
	}
}
</style>