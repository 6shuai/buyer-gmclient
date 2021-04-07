<template>
	<div class="app-main-wrap location-wrap">
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
						添加地址
					</el-button>
				</div>
			</div>

			<el-table class="place-list" :data="resData" stripe v-loading="loading">
				<el-table-column prop="displayName" label="领取地址" :min-width="200">
				</el-table-column>
				<el-table-column prop="place" label="所在商场" :min-width="100">
				</el-table-column>
				<el-table-column prop="city" label="所在城市" :min-width="150">
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
							<p>此操作将删除【{{ scope.row.displayName }}】, 是否继续?</p>
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

		<!-- 添加领取地址 -->
		<el-dialog
			title="添加领取地址"
			width="500px"
			:close-on-click-modal="false"
			append-to-body
			v-model="addLocationDialog"
		>
			<el-form 
				ref="addLocationForm"
				:model="addParams"
				:rules="rules"
				label-width="100px">
				<el-form-item label="选择城市" prop="city">
					<el-select
						v-model="addParams.city"
						filterable
						placeholder="请选择城市"
					>
						<el-option
							v-for="item in [{ value: 1, label: '北京' }]"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择商场" prop="place">
					<el-select
						v-model="addParams.place"
						filterable
						allow-create
						placeholder="请选择或输入商场"
					>
						<el-option
							v-for="item in [{ value: 1, label: '万达' }]"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="领取地址" prop="loaction">
					<el-input placeholder="请输入领取地址"></el-input>
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
import { reactive, toRefs, onMounted, ref } from 'vue'
import { locationList, locationCreate } from '@/api/location'
import { ElMessage } from 'element-plus'
import Pagination from '@/components/Pagination/index'

export default {
	components: {
		Pagination,
	},
	setup() {
		onMounted(() => {
			// init()
		})

		const addLocationForm = ref(null);

		const init = () => {
			state.loading = true
			locationList(state.params).then(res => {
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

		//添加领取地址
		const handleAddLocation = () => {
			addLocationForm.value.validate((valid) => {
				if(valid){
					state.btnLoading = true
					locationCreate(state.addParams).then(res => {
						state.btnLoading = false
						ElMessage.success('添加成功')
					})
				}
			})
		}
        
        //编辑领取地址
        const handleEdit = row => {
            state.addParams = row;
            state.addLocationDialog = true;
        }

		const state = reactive({
			loading: false,
			btnLoading: false,
			params: {
				pageNo: 1,
				pageSize: 40,
			},
			rules: {
				city: [
					{ required: true, message: '请选择城市', trigger: 'blur' },
				],
				place: [
					{ required: true, message: '请选择所在商场', trigger: 'blur' },
				],
				loaction: [
					{ required: true, message: '请输入领取地址', trigger: 'blur' },
				],
			},
			addLocationForm,
			addLocationDialog: false,
			addParams: {}, //添加地址参数
			resData: [],
			totalCount: 0,
			handleSizeChange,
			handleCurrentChange,
			handleAddLocation,
            handleEdit
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss">
</style>