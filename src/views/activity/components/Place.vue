<template>
	<div class="step2-place-wrap">
		<el-button-group>
			<el-button type="primary" @click="showSelectPlace">选择商家</el-button>
			<el-button type="primary" @click="showAddLocation">新建地址</el-button>
		</el-button-group>
		<el-table class="place-list" :data="resData" stripe>
			<el-table-column prop="placeName" label="商场" :min-width="100">
			</el-table-column>
			<el-table-column prop="addressName" label="领取地址" :min-width="150">
				<template #default="scope">
					<div>
						{{ scope.row.addressName || scope.row.displayName }}
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="addresss" label="是否仅线下领取" :min-width="60">
				<template #default="scope">
					<el-switch
						v-model="scope.row.deliverType"
						:active-value="2"
						:inactive-value="1"
						@click="handleChangeDeliverType(scope.row)"
					></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="80">
				<template #default="scope">
					<el-popover
						style="margin-left: 10px"
						placement="top"
						v-model:visible="popoverRef[scope.$index]"
						width="200"
					>
						<p>此操作将删除此数据, 是否继续?</p>
						<div style="text-align: right; margin: 0">
							<el-button
								size="mini"
								type="text"
								@click="popoverRef[scope.$index]=false"
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
			title="添加商场"
			append-to-body
			:close-on-click-modal="false"
			v-model="dialogVisible"
			width="600px"
		>
			<el-form
				ref="addPlaceForm"
				:model="addPlaceParams"
				:rules="rules"
				label-width="80px"
			>
				<el-form-item label="选择城市">
					<el-select
						v-model="addPlaceParams.cityNo"
						filterable
						placeholder="请选择城市"
						class="w200"
						@change="changeSelectCity"
					>
						<el-option
							v-for="item in cityData"
							:key="item.cityNo"
							:label="item.cityName"
							:value="item.cityNo"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商场" prop="placeId">
					<el-select
						v-model="addPlaceParams.placeId"
						filterable
						allow-create
						placeholder="请选择或输入商场名称"
						class="w200"
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
							@current-change="handleCurrentChange"
							:total="placeTotalCount"
						>
						</el-pagination>
					</el-select>
					<el-link
						class="ml30"
						type="primary"
						href="javascript:;"
						@click="handleUpdate"
						>更新</el-link
					>
				</el-form-item>
				<el-form-item label="领取地址" prop="displayName">
					<el-input
						v-model="addPlaceParams.displayName"
						placeholder="请输入详细领取地址"
					></el-input>
				</el-form-item>
			</el-form>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button
						type="primary"
						:loading="btnLoading"
						@click="handleAddPlace"
						>确 定</el-button
					>
				</span>
			</template>
		</el-dialog>

		<!-- 选择商家 -->
		<select-place
			ref="selectPlace"
			@selectedPlaceData="selectedPlaceData"
		></select-place>
	</div>
</template>

<script>
import { reactive, toRefs, ref, onMounted, getCurrentInstance, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import {
	placeCityList,
	placeList,
	updatePlaceList,
	activityAddressCreate,
	activityAddressCreatePick,
	activityAddressDeletePick
} from '@/api/activity'
import SelectPlace from './SelectPlace'

export default {
	emits: ['changePlaceList'],
	props: ['list'],
	components: {
		SelectPlace,
	},
	setup(props, { emit }) {
		const addPlaceForm = ref(null)
		const selectPlace = ref(null)
		const store = useStore()
		const { proxy } = getCurrentInstance()

		onMounted(() => {
			state.resData = props.list || []
		})

		//显示选择商家
		const showSelectPlace = () => {
			selectPlace.value.showDialog(state.resData)
		}

		//选中的商家
		const selectedPlaceData = data => {
			state.resData = state.resData.concat(data)
		}

		//添加或编辑  商家地址与抢购关联内容
		const createEditPick = (data) => {
			activityAddressCreatePick(data).then(res => {
				if(res.code == proxy.$successCode){
					emit('changePlaceList', state.resData)
				}
			})
		}

		//修改是否仅线下领取
		const handleChangeDeliverType = (row) => {
			let data = [
				{
					id: row.id,
					auctionId: store.state.activity.panicBuyData.id,
					addressId: row.addressId,
					deliverType: row.deliverType
				}
			]
			createEditPick(data)
		}

		//显示新建地址 弹窗
		const showAddLocation = () => {
			state.dialogVisible = true
			state.addPlaceParams = {}
			if (state.cityData.length) return
			getPlaceList()
			placeCityList().then(res => {
				state.cityData = res.obj
			})
		}

		//选择城市
		const changeSelectCity = () => {
			state.placeParams.cityNo = state.addPlaceParams.cityNo
			getPlaceList()
		}

		//商场列表
		const getPlaceList = () => {
			placeList(state.placeParams).then(res => {
				let { list, totalRecords } = res.obj
				state.placeData = list
				state.placeTotalCount = totalRecords
			})
		}

		//更新商场列表
		const handleUpdate = () => {
			updatePlaceList().then(res => {
				getPlaceList()
			})
		}

		//商场列表  分页
		const handleCurrentChange = page => {
			state.placeParams.pageNo = page
			getPlaceList()
		}

		//添加新地址
		const handleAddPlace = () => {
			addPlaceForm.value.validate(valid => {
				if (valid) {
					state.btnLoading = true
					activityAddressCreate(state.addPlaceParams).then(res => {
						state.btnLoading = false
						state.resData.push(res.obj)
						emit('changePlaceList', state.resData)
						ElMessage.success('添加成功~')
						state.dialogVisible = false
					})
				}
			})
		}

		//删除地址
		const handleDelete = (id, index) => {
			activityAddressDeletePick(id).then(res => {
				if(res.code === proxy.$successCode){
					ElMessage.success('删除成功~')
					state.resData.splice(index, 1)
					state.popoverRef[index] = false
				}
			})
		}

		//根据placeId 查找商场
		const findPlace = (placeId) => {
			for(let i = 0; i< state.placeData.length; i++){
				let item = state.placeData[i]
				if(item.id == placeId){
					return item.placeName
				}
			}
		}

		watch(() => props.list, (nval, oval) => {
            state.resData = nval
        })

		const state = reactive({
			resData: [],
			dialogVisible: false,
			addParams: {},
			addPlaceParams: {},
			cityData: [], //城市列表
			placeData: [], //商场列表
			placeTotalCount: 0, //商场列表总数
			placeParams: {
				pageNo: 1,
				pageSize: 50,
			},
			rules: {
				placeId: [{ required: true, message: '请选择商场', trigger: 'change' }],
				displayName: [
					{ required: true, message: '请输入详细领取地址', trigger: 'blur' },
				],
			},
			btnLoading: false,     //添加商场 btn loading
			popoverRef: [],
			showSelectPlace,
			showAddLocation,
			handleUpdate,
			handleCurrentChange,
			addPlaceForm,
			selectPlace,
			handleAddPlace,
			selectedPlaceData,
			changeSelectCity,
			handleDelete,
			handleChangeDeliverType
		})

		return toRefs(state)
	},
}
</script>
