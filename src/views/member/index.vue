<template>
	<div class="app-main-wrap member-wrap">
		<el-card>
			<div shadow="never">
				<div class="content-top mb20 clearfix">
					<el-button
						class="created-btn"
						type="primary"
						icon="el-icon-plus"
						size="small"
						@click=";(addParams = {}), (addLocationDialog = true)"
					>
						创建账号
					</el-button>
				</div>
			</div>

			<el-table class="place-list" :data="resData" stripe v-loading="loading">
				<el-table-column prop="nickname" label="用户昵称" :min-width="120">
				</el-table-column>
				<el-table-column prop="username" label="登录账号" :min-width="120">
				</el-table-column>
				<el-table-column prop="city" label="所属部门" :min-width="100">
				</el-table-column>
				<el-table-column prop="enabled" label="状态" width="100">
					<template #default="scope">
						<el-switch
							:active-value="true"
							:inactive-value="false"
							v-model="scope.row.enabled"
							@change="handleChangeState(scope.$index)"
						></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="130">
					<template #default="scope">
						<el-link
							href="javascript:;"
							@click.stop="handleEdit(scope.row)"
							class="mr20"
							type="primary"
							>编辑</el-link
						>
						<el-popover placement="top" :width="200">
							<p>此操作将删除账号【{{ scope.row.displayName }}】, 是否继续?</p>
							<div style="text-align: right; margin: 0">
								<el-button size="mini" type="text">取消</el-button>
								<el-button
									type="primary"
									size="mini"
									@click="handleDeleteBanner(scope.row.id)"
									>确定</el-button
								>
							</div>
							<template #reference>
								<el-link type="danger" href="javascript:;">删除</el-link>
							</template>
						</el-popover>
					</template>
				</el-table-column>
			</el-table>

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

		<!-- 添加员工信息 -->
		<el-dialog
			title="添加用户"
			width="500px"
			:close-on-click-modal="false"
			append-to-body
			v-model="addLocationDialog"
		>
			<el-form label-width="100px">
				<el-form-item label="姓名">
					<el-input
						placeholder="请输入用户姓名"
						v-model="addParams.nickname"
					></el-input>
				</el-form-item>
				<el-form-item label="所在部门">
					<el-input
						placeholder="请输入用户所在部门"
						v-model="addParams.name"
					></el-input>
				</el-form-item>
				<el-form-item label="账号">
					<el-input
						placeholder="请输入登录账号"
						v-model="addParams.name"
					></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input
						type="password"
						placeholder="请输入密码"
						v-model="addParams.password"
					></el-input>
				</el-form-item>
				<el-form-item label="确认密码">
					<el-input
						type="password"
						placeholder="请输入确认密码"
						v-model="addParams.password"
					></el-input>
				</el-form-item>
			</el-form>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="addLocationDialog = false">取 消</el-button>
					<el-button
						type="primary"
						:loading="btnLoading"
						@click="handleAddLocation"
						>确 定</el-button
					>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMemberList } from '@/api/user'
import Pagination from '@/components/Pagination/index'

export default {
	components: {
		Pagination,
	},
	setup() {
		onMounted(() => {
			init()
		})

		const init = () => {
			state.loading = true
			getMemberList(state.params).then(res => {
				state.loading = false
				let { list, totalRecords } = res.obj
				state.resData = list
				state.totalCount = totalRecords
			})
		}

		//分页
		const handleCurrentChange = page => {
			state.pageNo = page
			init()
		}

		//每页多少条
		const handleSizeChange = size => {
			state.pageSize = size
			init()
		}

		//添加用户
		const handleAddLocation = () => {
			state.btnLoading = true
			// locationCreate(state.addParams).then(res => {
			// 	state.btnLoading = false
			// 	ElMessage.success('添加成功')
			// })
		}

		//编辑用户信息
		const handleEdit = row => {
			state.addParams = row
			state.addLocationDialog = true
		}

		//修改用户状态
		const handleChangeState = index => {
			console.log(index)
		}

		const state = reactive({
			loading: false,
			btnLoading: false,
			params: {
				pageNo: 1,
				pageSize: 40,
			},
			addLocationDialog: false,
			addParams: {}, //添加用户参数
			resData: [],
			totalCount: 0,
			handleSizeChange,
			handleCurrentChange,
			handleAddLocation,
			handleEdit,
			handleChangeState,
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss">
</style>