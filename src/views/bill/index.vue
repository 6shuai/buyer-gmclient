<template>
	<div class="app-main-wrap order-wrap">
		<el-card>
			<div shadow="never">
				<div class="content-top mb20 clearfix">
					<el-form inline label-width="0px">
						<el-form-item label=" ">
							<el-input
                                clearable
								class="w220"
								placeholder="请输入商品名称"
								v-model="params.goodsName"
								@change="search"
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
							<el-button 
                                type="primary" 
                                icon="el-icon-download"
                                @click="download"
                            >导出</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<el-table class="place-list" :data="resData" stripe v-loading="loading">
				<el-table-column prop="goodsName" label="商品信息" :min-width="200">
				</el-table-column>
				<el-table-column prop="serialNumber" label="订单号" :min-width="200">
				</el-table-column>
				<el-table-column prop="totalAmount" label="成交金额(元)" :min-width="100">
				</el-table-column>
				<el-table-column prop="serialNumber" label="入账金额(元)" :min-width="100">
                    <template #default="scope">
                        <p>小风景: {{ scope.row.xfengjing }}</p>
                        <p>商户: {{ scope.row.merchant }}</p>
                    </template>
				</el-table-column>
                <el-table-column prop="unpaid" label="未付金额(元)" :min-width="100">
				</el-table-column>
                <el-table-column prop="statusName" label="订单状态" :min-width="100">
				</el-table-column>
                <el-table-column prop="creationTime" label="下单时间" :min-width="150">
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

	</div>
</template>

<script>
import qs from 'qs'
import { reactive, toRefs, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getBillList } from '@/api/bill'
import Pagination from '@/components/Pagination/index'

export default {
	components: {
		Pagination,
	},
	setup() {
		const deliverGoods = ref(null)
		onMounted(() => {
			init()
		})

		const init = () => {
			state.loading = true
			getBillList(state.params).then(res => {
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

        //导出
        const download = () => {
            window.open(
				`${document.location.origin}/bill/export?${qs.stringify(state.params)}`
			);
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
			handleSizeChange,
			handleCurrentChange,
			deliverGoods,
			search,
			datePicker: [],
			init,
            download
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss">
</style>
