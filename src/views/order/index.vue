<template>
	<div class="app-main-wrap order-wrap">
		<el-card>
			<div shadow="never">
				<div class="content-top mb20 clearfix">
					<el-form inline label-width="0px">
						<el-form-item label=" ">
							<el-input
								class="w220"
								placeholder="请输入活动名称"
								v-model="params.activityName"
								@input="search"
							></el-input>
						</el-form-item>
						<el-form-item label=" ">
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
						</el-form-item>
						<el-form-item label=" ">
							<el-select
								v-model="params.status"
								clearable
								placeholder="请选择订单状态"
								class="w220 mr30"
								@change="search"
							>
								<el-option
									v-for="item in statusData"
									:key="item.id"
									:label="item.displayName"
									:value="item.id"
								>
								</el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<el-table class="place-list" :data="resData" stripe v-loading="loading">
				<el-table-column prop="activityName" label="活动名称" :min-width="200">
				</el-table-column>
				<el-table-column prop="name" label="用户名称" :min-width="100">
				</el-table-column>
				<el-table-column prop="goodsName" label="商品名称" :min-width="150">
				</el-table-column>
				<el-table-column prop="serialNumber" label="订单号" :min-width="150">
				</el-table-column>
				<el-table-column label="收货信息" :min-width="200">
					<template #default="scope">
						<div>
							{{ scope.row.cityName }}{{ scope.row.areaName
							}}{{ scope.row.address }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="statusName" label="订单状态" :min-width="90">
				</el-table-column>
				<el-table-column label="操作" width="130">
					<template #default="scope">
						<el-link
							href="javascript:;"
							class="mr20"
							type="primary"
							@click="router.push(`/order/detail/${scope.row.id}`)"
							>查看详情</el-link
						>
						<el-link
							v-if="scope.row.status==2"
							href="javascript:;"
							type="primary"
							@click="deliverGoods.showDialog(scope.row.id)"
							>发货</el-link
						>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination
				class="mt20"
				background
				:current-page.sync="params.pageNo"
				:page-sizes="[40, 60, 100]"
				:page-size="params.pageSize"
				layout="total, prev, pager, next, jumper"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:total="totalCount"
			>
			</el-pagination>
		</el-card>

		<!-- 发货 -->
		<deliver-goods ref="deliverGoods" @deliverGoodsSuccess="init"></deliver-goods>
	</div>
</template>

<script>
import { reactive, toRefs, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { orderList, orderStatusList } from '@/api/order'
import Pagination from '@/components/Pagination/index'
import DeliverGoods from './components/DeliverGoods'

export default {
	components: {
		Pagination,
		DeliverGoods,
	},
	setup() {
		const deliverGoods = ref(null)
		onMounted(() => {
			init()
			getStatusList()
		})

		const init = () => {
			state.loading = true
			orderList(state.params).then(res => {
				state.loading = false
				let { list, totalRecords } = res.obj
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

		//按条件搜索
		const search = () => {
			state.params.pageNo = 1
			state.params.startTime = state.datePicker && state.datePicker[0]
				? dayjs(state.datePicker[0]).format('YYYY-MM-DD HH:mm:ss')
				: null
			state.params.endTime = state.datePicker && state.datePicker[1]
				? dayjs(state.datePicker[1]).format('YYYY-MM-DD HH:mm:ss')
				: null
			init()
		}

		//获取订单所有状态
		const getStatusList = () => {
			orderStatusList().then(res => {
				state.statusData = res.obj
			})
		}

		const state = reactive({
			router: useRouter(),
			loading: false,
			params: {
				pageNo: 1,
				pageSize: 40,
			},
			resData: [],
			totalCount: 0,
			statusData: [],
			getStatusList,
			handleSizeChange,
			handleCurrentChange,
			deliverGoods,
			search,
			datePicker: [],
			init
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss">
</style>