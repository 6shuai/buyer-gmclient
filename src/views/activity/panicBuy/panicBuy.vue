<template>
	<div class="app-main-wrap panic-buy">
		<el-card shadow="never">
			<el-page-header
				class="mb20"
				@back="$router.go(-1)"
				content="活动详情"
			></el-page-header>

			<el-form label-width="80px" v-loading="loading">
				<el-form-item label="活动名称">
					<div class="view" v-show="!showEdit">
						<span>{{ activity.displayName }}</span>
						<el-link
							class="ml20"
							type="primary"
							href="javascript:;"
							@click="showEdit = true"
							>编辑</el-link
						>
					</div>
					<div class="edit-name" v-show="showEdit">
						<el-input
							class="w220"
							v-model="activity.displayName"
							@blur="handleEidtName"
						></el-input>
					</div>
				</el-form-item>
				<el-form-item label="关联抢购">
					<el-button
						class="created-btn"
						type="primary"
						icon="el-icon-plus"
						size="small"
						@click="router.push(`/activity/panicBuy/${route.params.id}/add`)"
					>
						创建抢购
					</el-button>
					<div class="panic-buy-wrap mt10" v-if="resData.length">
						<el-card
							class="panic-buy-item"
							v-for="(item, index) in resData"
							:key="item.id"
							@click.prevent.stop="
								router.push(
									item.status == 1 || !item.status
										? `/activity/panicBuy/${route.params.id}/edit/${item.id}`
										: `/activity/panicBuy/detail/${route.params.id}-${item.id}`
								)
							"
						>
							<panic-buy-list :goodsItem="item"></panic-buy-list>
							<div class="switch-state">
								<el-switch
									v-if="item.status && (item.status != 1 && item.status != 4)"
									:active-value="1"
									:inactive-value="2"
									v-model="item.online"
									@click.stop="handleChangeOnline(item.id, item.online)"
								></el-switch>
							</div>

							<div
								class="delete-arraw"
								v-if="item.status != 4"
								title="删除"
								@click.stop="handleDelete(item.id, index)"
							>
								<i class="el-icon-delete"></i>
							</div>
						</el-card>
					</div>

					<el-empty v-if="!resData.length" description="暂无数据"></el-empty>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import { reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
	activityDetail,
	activityCreate,
	activityPanicBuyUpdateState,
	activityPanicBuyDelete,
} from '@/api/activity'
import PanicBuyList from '@/components/PanicBuy/index'

export default {
	components: {
		PanicBuyList,
	},
	setup(props) {
		const route = useRoute()
		const router = useRouter()
		const { proxy } = getCurrentInstance()

		onMounted(() => {
			methods.init()
		})

		const methods = {
			init() {
				state.loading = true
				activityDetail(route.params.id).then(res => {
					state.loading = false
					let { displayName, id, auctions } = res.obj
					state.activity = {
						displayName,
						id,
					}

					auctions.forEach(item => {
						if(item.status == 3 || item.status == 4){
							item.online = 1
						}else{
							item.online = 2
						}
					})

					state.resData = auctions
				})
			},

			//编辑活动名称
			handleEidtName() {
				activityCreate(state.activity).then(res => {
					ElMessage.success('编辑成功~')
					state.showEdit = false
				})
			},

			//修改抢购上下线
			handleChangeOnline(id, online) {
				let data = {
					id,
					online,
				}
				activityPanicBuyUpdateState(data).then(res => {})
			},

			//删除抢购
			handleDelete(id, index){
				ElMessageBox.confirm(`此操作将删除【${state.resData[index].goodsName}】, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					activityPanicBuyDelete(id).then(res => {
						if(res.code === proxy.$successCode){
							ElMessage.success('删除成功~')
							state.resData.splice(index, 1)
						}
					})
				}).catch(() => {

				})
			}
		}

		//status 1草稿  2待发布  3未开始  4进行中  5已完成

		const state = reactive({
			router,
			route,
			loading: false,
			showEdit: false, //是否显示编辑活动名称
			activity: {},
			resData: [],
			...methods,
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss" scope>
.panic-buy-item {
	position: relative;
	.switch-state {
		position: absolute;
		top: 5px;
		right: 5px;
		.el-switch {
			vertical-align: top;
		}
	}

	.delete-arraw {
		transition: all 0.5s ease-in-out;
		position: absolute;
		bottom: -80px;
		right: -80px;
		width: 80px;
		height: 80px;
		background: #f56c6c;
		color: #fff;
		border-radius: 50%;

		i {
			padding: 15px;
			font-size: 18px;
		}
	}
}
</style>