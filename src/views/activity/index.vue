<template>
	<div class="app-main-wrap auction">
		<el-card>
			<div shadow="never">
				<div class="content-top mb20 clearfix">
					<el-button
						class="created-btn"
						type="primary"
						icon="el-icon-plus"
						size="small"
						@click="addActivityDialog = true"
					>
						创建活动
					</el-button>

					<el-input
						clearable
						class="w200 ml20"
						placeholder="输入活动名称搜索"
						v-model="params.displayName"
						@change="search"
					></el-input>

					<el-date-picker
						class="ml20"
						@change="search"
						v-model="datePicker"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
					>
					</el-date-picker>
				</div>

				<el-table
					class="place-list"
					:data="resData"
					stripe
					v-loading="tabLoading"
				>
					<el-table-column prop="displayName" label="活动名称" :min-width="200">
					</el-table-column>
					<el-table-column prop="beginTime" label="活动日期" :min-width="100">
						<template #default="scope">
							{{ scope.row.beginTime || '待添加' }}
						</template>
					</el-table-column>
					<el-table-column prop="goodsName" label="关联拍卖" :min-width="150">
						<template #default="scope">
							{{ scope.row.goodsName || '待添加' }}
						</template>
					</el-table-column>
					<el-table-column label="操作" width="100">
						<template #default="scope">
							<el-link
								href="javascript:;"
								@click.stop="handleShowDetail(scope.row.id)"
								class="mr20"
								type="primary"
								>活动详情</el-link
							>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<el-pagination
				class="mt20"
				background
				:current-page.sync="params.pageNo"
				:page-sizes="[40, 60, 100]"
				layout="total, prev, pager, next, jumper"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:total="totalCount"
			>
			</el-pagination>
		</el-card>

		<el-dialog
			title="活动名称"
			width="500px"
			:close-on-click-modal="false"
			append-to-body
			v-model="addActivityDialog"
		>
			<el-form label-width="100px">
				<el-form-item label="活动名称">
					<el-input
						placeholder="请输入活动名称"
						v-model="addParams.displayName"
					></el-input>
				</el-form-item>
			</el-form>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="addActivityDialog = false">取 消</el-button>
					<el-button type="primary" @click="handleCreate" :loading="btnLoading"
						>确 定</el-button
					>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import dayjs from 'dayjs'
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { activityList, activityCreate } from '@/api/activity'

export default {
	setup() {
		const router = useRouter()
		onMounted(() => {
			init()
		})

		//活动列表
		const init = () => {
			state.tabLoading = true
			activityList(state.params).then(res => {
				let { list, totalRecords } = res.obj
				state.tabLoading = false
				state.resData = list
				state.totalCount = totalRecords
			})
		}

		//分页
		const handleCurrentChange = page => {
			state.params.pageNo = page
			init()
		}

		//每页多少条
		const handleSizeChange = size => {
			state.params.pageSize = size
			init()
		}

		const search = () => {
			state.params.startTime = state.datePicker && state.datePicker[0]
				? dayjs(state.datePicker[0]).format('YYYY-MM-DD HH:mm:ss')
				: null
			state.params.endTime = state.datePicker && state.datePicker[1]
				? dayjs(state.datePicker[1]).format('YYYY-MM-DD HH:mm:ss')
				: null
			state.params.pageNo = 1
			init()
		}

		//创建活动
		const handleCreate = () => {
			if (!state.addParams.displayName) {
				ElMessage.warning('请输入活动名称~')
				return
			}
			state.btnLoading = true
			activityCreate(state.addParams).then(res => {
				state.btnLoading = false
				ElMessage.success('创建活动成功~')
				state.addActivityDialog = false
			})
		}

		//删除活动
		const handleDeletePond = () => {
			state.resData.splice(0, 1)
		}

		//查看详情
		const handleShowDetail = (id) => {
			router.push(`/activity/panicBuy/${id}`)
		}

		const state = reactive({
			tabLoading: false,
			datePicker: [],
			params: {
				pageNo: 1,
				pageSize: 40,
			},
			resData: [],
			totalCount: 0,
			addParams: {},
			btnLoading: false,
			addActivityDialog: false,
			handleShowDetail,
			search,
			handleDeletePond,
			handleCreate,
			handleCurrentChange,
			handleSizeChange,
		})

		return toRefs(state)
	},
}
</script>
