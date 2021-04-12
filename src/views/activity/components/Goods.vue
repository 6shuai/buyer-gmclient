<template>
	<el-dialog
		title="选择商品"
		width="900px"
		custom-class="compose-text-edit"
		:close-on-click-modal="false"
		append-to-body
		v-model="selectGoodsDialog"
	>	
		<div v-loading="loading">
			<div class="activity-goods-list" v-if="resData.length">
				<el-card
					class="item"
					v-for="item in resData"
					:key="item.id"
					@click="handleSelect(item)"
				>
					<div class="goods-image">
						<el-image fit="cover" :src="item.cover"></el-image>
					</div>
					<div class="title overflow">{{ item.displayName }}</div>
				</el-card>
			</div>
			<el-empty v-else description="暂无数据"></el-empty>
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

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="selectGoodsDialog = false">关 闭</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { activityGoodsList } from '@/api/activity'

export default {
	emits: ['selectedGoods'],
	setup(props, { emit }) {
		const showDialog = () => {
			state.selectGoodsDialog = true
			if (state.resData.length) return
			getGoodsList()
		}

		const getGoodsList = () => {
			state.loading = true
			activityGoodsList(state.params).then(res => {
				state.loading = false
				let { list, totalRecords } = res.obj
				state.resData = list
				state.totalCount = totalRecords
			})
		}

		//选择商品
		const handleSelect = item => {
			emit('selectedGoods', item)
			state.selectGoodsDialog = false
		}

		//商品列表 分页
		const handleCurrentChange = page => {
			state.pageNo = page
			getGoodsList()
		}

		//每页多少条
		const handleSizeChange = size => {
			state.params.pageSize = size
			getGoodsList()
		}

		const state = reactive({
			selectGoodsDialog: false,
			loading: false,
			params: {
				pageNo: 1,
				pageSize: 40,
			},
			resData: [],
			totalCount: 0,
			showDialog,
			handleSizeChange,
			handleCurrentChange,
			handleSelect,
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss" scope>
.activity-goods-list {
	display: flex;
	flex-wrap: wrap;
	margin-left: -20px;

	.item {
		width: 260px;
		height: 250px;
		margin: 20px 0 20px 20px;
		cursor: pointer;

		&:hover .el-image {
			transform: scale(1.05);
		}

		.el-card {
			height: 100%;
		}
		.el-card__body {
			padding: 0;
		}

		.goods-image {
			width: 100%;
			height: 200px;

			.el-image {
				width: 100%;
				height: 100%;
				transition: all 0.5s ease-in-out;
			}
		}

		.title {
			padding: 0 10px;
			line-height: 50px;
			font-size: 18px;
		}
	}
}
</style>