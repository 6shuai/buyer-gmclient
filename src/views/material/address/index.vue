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
						@click="showAddLocation"
					>
						添加地址
					</el-button>
				</div>
			</div>

			<el-table class="place-list" :data="resData" stripe v-loading="loading">
				<el-table-column prop="displayName" label="领取地址" :min-width="200">
				</el-table-column>
				<el-table-column prop="placeName" label="所在商场" :min-width="100">
				</el-table-column>
				<!-- <el-table-column prop="city" label="所在城市" :min-width="150">
				</el-table-column> -->
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
			:title="addParams.id ? '编辑领取地址' : '添加领取地址'"
			width="500px"
			:close-on-click-modal="false"
			append-to-body
			v-model="addLocationDialog"
		>
			<el-form
				ref="addLocationForm"
				:model="addParams"
				:rules="rules"
				label-width="100px"
			>
				<el-form-item label="选择城市" prop="city">
					<el-select v-model="cityId" filterable placeholder="请选择城市">
						<el-option
							v-for="item in cityData"
							:key="item.cityNo"
							:label="item.cityName"
							:value="item.cityNo"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择商场" prop="placeId">
					<el-select
						v-model="addParams.placeId"
						filterable
						allow-create
						placeholder="请选择或输入商场"
					>
						<el-option
							v-for="item in placeData"
							:key="item.id"
							:label="item.placeName"
							:value="item.id"
						>
						</el-option>
						<el-pagination
							class="mt20"
							background
							:current-page.sync="placeParams.pageNo"
							layout="total, prev, pager, next"
							@current-change="handlePlaceCurrentChange"
							:total="placeTotalCount"
						>
						</el-pagination>
					</el-select>
				</el-form-item>
				<el-form-item label="领取地址" prop="displayName">
					<el-input
						placeholder="请输入领取地址"
						v-model="addParams.displayName"
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
import { reactive, toRefs, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
	activityAddressList,
	activityAddressCreate,
	placeCityList,
	placeList,
} from '@/api/activity'
import Pagination from '@/components/Pagination/index'

export default {
	components: {
		Pagination,
	},
	setup() {
		onMounted(() => {
			init()
		})

		const addLocationForm = ref(null)

		const init = () => {
			state.loading = true
			activityAddressList(state.params).then(res => {
				state.loading = false
				let { list, totalRecords } = res.obj
				state.resData = list
				state.totalCount = totalRecords
			})
		}

		//显示添加地址窗口
		const showAddLocation = () => {
			state.addParams = {}
			state.addLocationDialog = true
			if (!state.placeData.length) getPlaceList()
			if (!state.cityData.length) getCityList()
		}

		//获取商场列表
		const getPlaceList = () => {
			placeList(state.placeParams).then(res => {
				let { list, totalRecords } = res.obj
				state.placeData = list
				state.placeTotalCount = totalRecords
			})
		}

		//商场分页
		const handlePlaceCurrentChange = page => {
			state.placeParams.pageNo = page
			getPlaceList()
		}

		//获取城市列表
		const getCityList = () => {
			placeCityList().then(res => {
				state.cityData = res.obj
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
			addLocationForm.value.validate(valid => {
				if (valid) {
					state.btnLoading = true
					activityAddressCreate(state.addParams).then(res => {
						state.btnLoading = false
						ElMessage.success(state.addParams.id ? '编辑成功~' : '添加成功~')
						state.addLocationDialog = false
						init()
					})
				}
			})
		}

		//编辑领取地址
		const handleEdit = row => {
			if (!state.placeData.length) getPlaceList()
			if (!state.cityData.length) getCityList()
			state.addParams = JSON.parse(JSON.stringify(row))
			state.addLocationDialog = true
		}

		const state = reactive({
			loading: false,
			btnLoading: false,
			params: {
				pageNo: 1,
				pageSize: 40,
			},
			rules: {
				placeId: [
					{ required: true, message: '请选择所在商场', trigger: 'blur' },
				],
				displayName: [
					{ required: true, message: '请输入领取地址', trigger: 'blur' },
				],
			},
			addLocationForm,
			addLocationDialog: false,
			resData: [],
			totalCount: 0,
			addParams: {}, //添加地址参数
			cityId: null, //选中的城市id
			cityData: [], //城市列表
			placeData: [], //商场列表
			placeTotalCount: 0, //商场数据总数
			placeParams: {
				pageNo: 1,
				pageSize: 50,
			},
			handleSizeChange,
			handleCurrentChange,
			handleAddLocation,
			handleEdit,
			showAddLocation,
			handlePlaceCurrentChange,
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss">
</style>