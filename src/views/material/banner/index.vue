<template>
	<div class="app-main-wrap banner-wrap">
		<el-card>
			<div shadow="never">
				<div class="content-top mb20 clearfix">
					<el-button
						class="created-btn"
						type="primary"
						icon="el-icon-plus"
						size="small"
						@click="router.push('/material/banner/add')"
					>
						创建Banner
					</el-button>
				</div>

				<el-table class="place-list" :data="resData" stripe v-loading="loading">
					<el-table-column prop="displayName" label="名称" :min-width="150">
					</el-table-column>
					<el-table-column prop="addresss" label="图片" :min-width="200">
						<template #default="scope">
							<el-image
								class="banner-img"
								fit="cover"
								:src="scope.row.image"
								:preview-src-list="[scope.row.image]"
							></el-image>
						</template>
					</el-table-column>
					<el-table-column prop="link" label="跳转" :min-width="150">
						<template #default="scope">
							<div v-if="scope.row.jumpType == 1"> 
								{{ scope.row.link }}
							</div>
							<div v-else>
								{{ scope.row.auctionName }}
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="130">
						<template #default="scope">
							<el-link
								href="javascript:;"
								@click.stop="handleEdit(scope.row.id)"
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
import { reactive, toRefs, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { bannerList, bannerDelete } from '@/api/banner'
export default {
	setup() {
		onMounted(() => {
			init()
		})

		const router = useRouter()

		//编辑
		const handleEdit = id => {
			router.push(`/material/banner/edit/${id}`)
		}

		const init = () => {
			state.loading = true
			bannerList(state.params).then(res => {
				state.loading = false
				let { list, totalRecords } = res.obj
				state.resData = list
				state.totalCount = totalRecords
			})
		}

		//删除
		const handleDeleteBanner = id => {
			bannerDelete(id).then(res => {
				ElMessage.success('删除成功~')
				init()
			})
		}

		const search = () => {
			console.log('search')
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
				pageSize: 40
			},
			resData: [],
			totalCount: 0,
			router,
			handleEdit,
			search,
			handleDeleteBanner,
			handleCurrentChange,
			handleSizeChange
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss">
.banner-wrap {
	.banner-img {
		cursor: pointer;
		max-width: 300px;
	}
}
</style>