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
						@click="addParams={enabled: true};addMemberDialog=true"
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
				<el-table-column label="所属部门" :min-width="100">
					<template #default="scope">
						<el-tag 
							size="mini"
							v-for="item in scope.row.roleId" 
							:key="item"
						>{{ findRole(item) }}</el-tag>
					</template>
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
				<el-table-column label="操作" width="90">
					<template #default="scope">
						<el-link
							href="javascript:;"
							@click.stop="handleEdit(scope.row)"
							class="mr20"
							type="primary"
							>编辑</el-link
						>
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
			v-model="addMemberDialog"
		>
			<el-form
				ref="addMemberForm"
				:model="addParams"
				:rules="addRules"
				label-width="100px"
			>
				<el-form-item label="头像" prop="avatar">
					<upload-img
						:isArray="false"
						:imgList="addParams.avatar"
						@uploadImgPath="uploadImageSuccess"
					></upload-img>
				</el-form-item>
				<el-form-item label="姓名" prop="nickname">
					<el-input
						placeholder="请输入用户姓名"
						v-model="addParams.nickname"
					></el-input>
				</el-form-item>
				<el-form-item label="所在部门" prop="roleId">
					<el-select v-model="addParams.roleId" multiple placeholder="请选择">
						<el-option
							v-for="item in roleData"
							:key="item.id"
							:label="item.displayName"
							:value="item.id"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="账号" prop="username">
					<el-input
						placeholder="请输入登录账号"
						v-model="addParams.username"
					></el-input>
				</el-form-item>
				<el-form-item label="密码" :prop="addParams.id ? '' : 'password'">
					<el-link
						type="primary"
						href="javascript:;"
						@click="
							pwParams = {};
							setPasswordDialog = true
						"
						>设置</el-link
					>
				</el-form-item>
			</el-form>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="addMemberDialog = false">取 消</el-button>
					<el-button
						type="primary"
						:loading="btnLoading"
						@click="handleAddMember"
						>确 定</el-button
					>
				</span>
			</template>
		</el-dialog>

		<!-- 设置密码 -->
		<el-dialog
			title="设置密码"
			width="500px"
			:close-on-click-modal="false"
			append-to-body
			v-model="setPasswordDialog"
		>
			<el-form label-width="100px">
				<el-form-item label="密码">
					<el-input
						type="password"
						placeholder="请输入密码"
						v-model="pwParams.password"
					></el-input>
				</el-form-item>
				<el-form-item label="确认密码">
					<el-input
						type="password"
						placeholder="请输入确认密码"
						v-model="pwParams.confimPassword"
					></el-input>
				</el-form-item>
			</el-form>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="setPasswordDialog = false">取 消</el-button>
					<el-button type="primary" :loading="pwLoading" @click="handleSetPw"
						>确 定</el-button
					>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { reactive, ref, toRefs, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { getMemberList, getRoleList, memberCreate, memberChangePassword } from '@/api/user'
import Pagination from '@/components/Pagination/index'
import UploadImg from '@/components/Upload/UploadImg'

export default {
	components: {
		Pagination,
		UploadImg,
	},
	setup() {
		onMounted(() => {
			init()
			roleList()
		})

		const addMemberForm = ref(null)
		const { proxy } = getCurrentInstance()

		const init = () => {
			state.loading = true
			getMemberList(state.params).then(res => {
				state.loading = false
				let { list, totalRecords } = res.obj
				state.resData = list
				state.totalCount = totalRecords
			})
		}

		const findRole = id => {
			let result;
			state.roleData.forEach(item => {
				if(item.id == id){
					result = item.displayName
				}
			})
			return result
		}

		//角色列表
		const roleList = () => {
			getRoleList().then(res => {
				state.roleData = res.obj
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

		//头像上传成功
		const uploadImageSuccess = e => {
			state.addParams.avatar = e
		}

		//设置密码
		const handleSetPw = () => {
			if (!state.pwParams.password) {
				ElMessage.warning('请输入密码~')
				return
			} else if (!state.pwParams.confimPassword) {
				ElMessage.warning('请输入确认密码~')
				return
			} else if (state.pwParams.password != state.pwParams.confimPassword) {
				ElMessage.warning('两次密码不一致~')
				return
			}
			state.addParams = {
				...state.addParams,
				...state.pwParams,
			}
			
			if(state.addParams.id){
				state.pwLoading = true
				let data = {
					id: state.addParams.id,
					password: state.pwParams.password 
				}
				memberChangePassword(data).then(res => {
					state.pwLoading = false
					if(res.code === proxy.$successCode){
						ElMessage.success('修改密码成功~')
						state.setPasswordDialog = false
					}
				})
			}else{
				state.setPasswordDialog = false
			}
		}

		//添加用户
		const handleAddMember = () => {
			state.addMemberForm.validate(valid => {
				if (valid) {
					state.btnLoading = true
					memberCreate(state.addParams).then(res => {
						state.btnLoading = false
						if (res.code == proxy.$successCode) {
							ElMessage.success('添加成功~')
							state.addMemberDialog = false
							init()
						}
					})
				}
			})
		}

		//编辑用户信息
		const handleEdit = row => {
			state.addParams = row
			state.addMemberDialog = true
		}

		//修改用户状态
		const handleChangeState = index => {
			memberCreate(state.resData[index]).then(res => {
				state.btnLoading = false
				if (res.code == proxy.$successCode) {
					ElMessage.success('操作成功~')
				}
			})
		}

		const state = reactive({
			loading: false,
			btnLoading: false,
			params: {
				pageNo: 1,
				pageSize: 40,
			},
			addMemberDialog: false,
			setPasswordDialog: false,
			addParams: {}, //添加用户参数
			resData: [],
			totalCount: 0,
			pwParams: {}, //设置密码
			pwLoading: false,
			roleData: [], //所在部门列表
			addMemberForm,
			handleSizeChange,
			handleCurrentChange,
			handleAddMember,
			handleEdit,
			handleChangeState,
			uploadImageSuccess,
			addRules: {
				avatar: [{ required: true, message: '请上传头像~', trigger: 'change' }],
				nickname: [{ required: true, message: '请输入姓名~', trigger: 'blur' }],
				username: [{ required: true, message: '请输入账号~', trigger: 'blur' }],
				password: [{ required: true, message: '请输入密码~', trigger: 'blur' }],
			},
			handleSetPw,
			findRole,
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss">
</style>