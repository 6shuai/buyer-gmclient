<template>
	<div class="app-main-wrap goods-wrap">
		<el-card>
			<div shadow="never">
				<div class="content-top mb20 clearfix">
					<el-button
						class="created-btn"
						type="primary"
						icon="el-icon-plus"
						size="small"
						@click="router.push('/material/goods/add')"
					>
						添加商品
					</el-button>

					<el-input
						class="w220 ml30"
						placeholder="输入商品名称搜索"
						@change="search"
					></el-input>
				</div>

				<div class="goods-list" v-loading="loading">
					<el-card
						class="item"
						v-for="item in resData"
						:key="item.id"
						@click="router.push(`/material/goods/edit/${item.id}`)"
					>
						<div class="goods-image">
							<el-image fit="cover" :src="item.cover"></el-image>
						</div>
						<div class="title overflow">{{ item.displayName }}</div>
					</el-card>
				</div>
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
	</div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { goodsList } from '@/api/goods'
import Pagination from '@/components/Pagination/index'

export default {
	components: {
		Pagination,
	},
	setup() {
		onMounted(() => {
			init()
		})

		const router = useRouter()

		const init = () => {
			state.loading = true
			goodsList(state.params).then(res => {
				state.loading = false
				let { list, totalRecords } = res.obj
				state.resData = list
				state.totalCount = totalRecords
			})
		}

		const search = () => {
			state.params.pageNo = 1
			init()
		}

		//分页
		const handleCurrentChange = (page) => {
			state.pageNo = page;
			init();
		}

		//每页多少条
		const handleSizeChange = (size) => {
			state.pageSize = size;
			init();
		}

		const state = reactive({
			loading: false,
			params: {
				pageNo: 1,
				pageSize: 40,
			},
			resData: {},
			totalCount: 0,
			handleSizeChange,
			handleCurrentChange,
			router,
			search,
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss">
.goods-wrap {
	.goods-list {
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
}
</style>