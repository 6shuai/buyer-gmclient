<template>
	<!-- 选择商家 -->
	<el-dialog
		title="选择商家"
		append-to-body
		:close-on-click-modal="false"
		v-model="showSelectPlaceDialog"
		width="600px"
	>
		<div v-loading="loading">
			<el-input
				class="w220 mb20"
				clearable
				placeholder="输入名称搜索"
				v-model="placeParams.displayName"
				@change="search"
			></el-input>
			<el-checkbox-group v-if="addressResData.length" v-model="checkeData">
				<el-checkbox
					class="step2-place-wrap box-card"
					v-for="(item, index) in addressResData"
					:key="index"
					:label="item.id"
					:disabled="disabled.includes(item.id)"
					border
					>{{ item.placeName }} {{ item.displayName }}</el-checkbox
				>
			</el-checkbox-group>

			<el-empty v-else description="暂无数据"></el-empty>

			<el-pagination
				class="mt20"
				background
				:current-page.sync="placeParams.pageNo"
				layout="total, prev, pager, next"
				@current-change="handleCurrentChange"
				:total="addressTotalCount"
			>
			</el-pagination>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="showSelectPlaceDialog = false">取 消</el-button>
				<el-button type="primary" :loading="btnLoading" @click="handleSelected">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { activityAddressList, activityAddressCreatePick } from '@/api/activity'

export default {
	emits: ['selectedPlaceData'],
	setup(props, { emit }) {
		const { proxy } = getCurrentInstance()
		const store = useStore()

		//select 商家领取地址列表
		const showDialog = data => {
			state.showSelectPlaceDialog = true
			state.checkeData = []
			state.disabled = []
			data.forEach(item => {
				state.disabled.push(item.id)
			})
			getPlaceList()
		}

		//获取商场地址列表
		const getPlaceList = () => {
			state.loading = true
			activityAddressList(state.placeParams).then(res => {
				state.loading = false
				let { list, totalRecords } = res.obj
				state.addressResData = list
				state.addressTotalCount = totalRecords
			})
		}

		//按照名称搜索
		const search = () => {
			state.placeParams.pageNo = 1
			getPlaceList()
		}

		const handleCurrentChange = page => {
			state.placeParams.pageNo = page
			getPlaceList()
		}

		//确定添加已选中的商家
		const handleSelected = () => {
			let data = []
			state.addressResData.forEach(item => {
				if (state.checkeData.includes(item.id)) {
					item.addressId = item.id
					data.push(item)
				}
			})
			createPick(data)
		}

		const createPick = (data) => {
			if(!data.length){
				ElMessage.warning('未选择商家~')
				return
			}
			state.btnLoading = true
			let arr = []
			data.forEach(item => {
				arr.push({
					auctionId: store.state.activity.panicBuyData.id,
					addressId: item.addressId,
					deliverType: 1
				})
			});
			activityAddressCreatePick(arr).then(res => {
				state.btnLoading = false
				if(res.code === proxy.$successCode){
					data.forEach((item, index) => {
						data[index] = {
							...item,
							...res.obj[index]
						}
					})
					ElMessage.success('添加成功~')
					emit('selectedPlaceData', data)
					state.showSelectPlaceDialog = false
				}
			})
		}

		const state = reactive({
			loading: false,
			showSelectPlaceDialog: false, //选择商家弹窗
			checkeData: [],
			placeParams: {
				pageNo: 1,
				pageSize: 50,
			},
			disabled: [], //已选过的商场 不可选择
			addressResData: [], //领取地址列表
			addressTotalCount: 0, //领取地址列表总数
			btnLoading: false,      //点击确定按钮loading
			handleCurrentChange,
			showDialog,
			handleSelected,
			search,
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss" scope>
.step2-place-wrap.box-card {
	width: 100%;
	margin-bottom: 20px;
	padding: 15px 20px 15px 20px;
	height: 50px;
}
.step2-place-wrap.el-checkbox.is-bordered + .el-checkbox.is-bordered {
	margin-left: 0;
}
</style>