<template>
	<div class="rule-wrap">
		<el-button
			icon="el-icon-plus"
			plain
			type="primary"
			@click=";(addParams = {}), (dialogVisible = true)"
			>添加等级</el-button
		>

		<el-table class="place-list" :data="resData" stripe>
			<el-table-column prop="displayName" label="等级" :min-width="60">
			</el-table-column>
			<el-table-column prop="correctDigit" label="猜对位数" :min-width="60">
			</el-table-column>
			<el-table-column prop="award" label="等级奖励" :min-width="60">
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template #default="scope">
					<el-link href="javascript:;" type="primary" class="mr10"
						>编辑</el-link
					>
					<el-popover
						placement="top"
						v-model:visible="popoverRef[scope.$index]"
						width="200"
					>
						<p>此操作将删除此数据, 是否继续?</p>
						<div style="text-align: right; margin: 0">
							<el-button
								size="mini"
								type="text"
								@click="popoverRef[scope.$index] = false"
								>取消</el-button
							>
							<el-button
								type="primary"
								size="mini"
								@click="handleDelete(scope.row.id, scope.$index)"
								>确定</el-button
							>
						</div>
						<template #reference>
							<el-link href="javascript:;" type="danger">删除</el-link>
						</template>
					</el-popover>
				</template>
			</el-table-column>
		</el-table>

		<!-- 添加商场 -->
		<el-dialog
			title="添加规则"
			width="500px"
			:close-on-click-modal="false"
			append-to-body
			v-model="dialogVisible"
		>
			<el-form
				ref="addRuleForm"
				:model="addParams"
				:rules="addRules"
				label-width="80px"
			>
				<el-form-item label="等级">
					<el-input
						class="w200"
						v-model="addParams.displayName"
						placeholder="请输入规则等级"
					></el-input>
				</el-form-item>
				<el-form-item label="猜对位数" prop="correctDigit">
					<el-input-number
						controls-position="right"
						v-model="addParams.correctDigit"
						placeholder="请输入猜对的位数"
					></el-input-number>
				</el-form-item>
				<el-form-item label="等级奖励" prop="award">
					<el-input-number
						controls-position="right"
						v-model="addParams.award"
						placeholder="请输入该等级的奖励"
					></el-input-number>
				</el-form-item>
			</el-form>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="primary" :loading="btnLoading" @click="handleAddRole"
						>确 定</el-button
					>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import {
	reactive,
	ref,
	toRefs,
	onMounted,
	getCurrentInstance,
	watch,
} from 'vue'
import { ElMessage } from 'element-plus'
import {
	activityGuessRuleCreate,
	activityGuessRuleDelete,
} from '@/api/activity'
import { useStore } from 'vuex'

export default {
	props: ['list'],
	setup(props) {
		const { proxy } = getCurrentInstance()
		const store = useStore()
		const addRuleForm = ref(null)
		onMounted(() => {
			state.resData = props.list || []
		})

		//添加规则
		const handleAddRole = () => {
			state.addParams.auctionId = store.state.activity.panicBuyData.id
			state.addRuleForm.validate(valid => {
				if (valid) {
					state.btnLoading = true
					activityGuessRuleCreate(state.addParams).then(res => {
						state.btnLoading = false
						if (res.code === proxy.$successCode) {
							ElMessage.success('添加成功~')
							state.dialogVisible = false
							state.addParams.id = res.obj.id
							state.resData.push(state.addParams)
						}
					})
				}
			})
		}

		//删除竞猜规则
		const handleDelete = (id, index) => {
			activityGuessRuleDelete(id).then(res => {
				if (res.code === proxy.$successCode) {
					ElMessage.success('删除成功~')
					state.resData.splice(index, 1)
					state.popoverRef[index] = false
				}
			})
		}

		watch(
			() => props.list,
			(nval, oval) => {
				state.resData = nval
			}
		)

		const state = reactive({
			dialogVisible: false,
			resData: [],
			addParams: {},
			btnLoading: false,
			handleAddRole,
			visible: false,
			handleDelete,
			addRuleForm,
			popoverRef: [],
			addRules: {
				displayName: [
					{ required: true, message: '请输入规则等级', trigger: 'blur' },
				],
				correctDigit: [
					{ required: true, message: '请输入猜对位数', trigger: 'blur' },
				],
				award: [{ required: true, message: '请输入等级奖励', trigger: 'blur' }],
			},
		})

		return toRefs(state)
	},
}
</script>