<template>
	<div class="app-main-wrap detail-wrap auction-detail">
		<el-card>
			<el-page-header
				class="mb20"
				@back="$router.go(-1)"
				content="抢购详情"
			></el-page-header>
			
            <div class="info" v-loading="loading">
                <div class="title">{{ resData.goodsName }}</div>
                <div class="goods">
					<div class="goods-img">
						<el-image fit="cover" :src="resData.cover"></el-image>
					</div>
					<div class="goods-desc">
						<div class="goods-name">{{ resData.goodsName }}</div>
						<ul class="item">
							<li>
								<span class="label">规格</span>
								<span>{{ resData.description }}</span>
							</li>
							<li>
								<span class="label">活动时间</span>
								<span>{{ resData.beginTime }}</span>
							</li>
							<li>
								<span class="label">起拍价格</span>
								<span>{{ resData.marketValue }}</span>
							</li>
							<li>
								<span class="label">数量</span>
								<span>{{ resData.inventory }}</span>
							</li>
						</ul>
						<ul class="item">
							<li>
								<span class="label">活动商场</span>
								<span v-for="item in resData.auctionPickUpAddresses" :key="item.id">{{ item.placeName }}</span>
							</li>
						</ul>
					</div>
					<div class="goods-operation">
						<div class="switch">
							<el-switch
								:active-value="1"
								:inactive-value="2"
								v-model="resData.online"
								@click.stop="handleChangeOnline(resData.id, resData.online)"
							></el-switch>
						</div>
						<el-button icon="el-icon-edit" type="primary" @click="handleEditClick">编辑</el-button>
					</div>
				</div>
            </div>

			<div class="data-wrap">
				<el-tabs v-model="activeName" @tab-click="handleTabClick">
					<el-tab-pane label="机器人管理" name="robot"></el-tab-pane>
					<el-tab-pane label="活动数据" name="data"></el-tab-pane>
				</el-tabs>

				<!-- 机器人管理 -->
				<div class="robot-wrap" v-if="activeName=='robot'">
					<div class="robot-data-wrap" v-loading="robotDataLoading">
						<el-table
							class="place-list"
							:data="robotData"
							stripe
							:show-header="false"
						>
							<el-table-column label=" " width="70">
								<template #default="scope">
									<el-image class="robot-avatar" :src="scope.row.avatar"></el-image>
								</template>
							</el-table-column>
							<el-table-column prop="nickname" label=" " :min-width="200">
							</el-table-column>
							<el-table-column prop="price" label=" " width="150"> </el-table-column>
						</el-table>

						<el-pagination
							class="mt20"
							background
							:current-page.sync="totalPage.pageNo"
							:page-size="totalPage.pageSize"
							layout="total, prev, pager, next"
							@current-change="handleCurrentChange"
							:total="totalCount"
						>
						</el-pagination>
					</div>
				</div>

				<!-- 活动数据 -->
				<div class="activity-data" v-if="activeName=='data'">
					<h3>概览</h3>
					<ul class="overview">
						<li>
							<p class="value">1214</p>
							<p class="label">参与人数</p>
						</li>

						<li>
							<p class="value">1214</p>
							<p class="label">参与人数</p>
						</li>
						<li>
							<p class="value">1214</p>
							<p class="label">参与人数</p>
						</li>
						<li>
							<p class="value">1214</p>
							<p class="label">参与人数</p>
						</li>
					</ul>

					<h3>热度曲线</h3>
					<div class="hot-charts">

					</div>

					<h3>订单数据</h3>
					<el-table class="order-list" :data="orderData" stripe>
						<el-table-column prop="place" label=" " :width="60">

						</el-table-column>
						<el-table-column prop="addresss" label="头像" :min-width="60">
						</el-table-column>
						<el-table-column prop="addresss" label="昵称" :min-width="60">
						</el-table-column>
						<el-table-column prop="addresss" label="所在商场" :min-width="60">
						</el-table-column>
						<el-table-column prop="addresss" label="购买时间" :min-width="60">
						</el-table-column>
						<el-table-column prop="addresss" label="购买价格" :min-width="60">
						</el-table-column>
					</el-table>
				</div>

			</div>

		</el-card>
	</div>
</template>

<script>
import { reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElAlert, ElMessage } from 'element-plus'
import { activityPanicBuyUpdateState, activityPanicBuyDetail, activityPanicBuyRobotList } from '@/api/activity'

export default {
	setup() {
		const route = useRoute()
		const router = useRouter()
		const { proxy } = getCurrentInstance()
		const routeParams = route.params.id
		const [ id, goodsId ] = [routeParams.split('-')[0], routeParams.split('-')[1]]

		onMounted(() => {
			getDetail()	
			getRobotList()
		})

		const handleTabClick = () => {
			console.log(state.activeName);
		}

		//查询抢购详情
		const getDetail = () => {
			state.loading = true
			activityPanicBuyDetail(goodsId).then(res => {
				if(res.code === proxy.$successCode){
					state.resData = res.obj
					if(state.resData.status == 3 || state.resData.status == 4){
						state.resData.online = 1
					}else{
						state.resData.online = 2
					}
					state.loading = false
				}
			})
		}

		//机器人列表
		const getRobotList = () => {
			state.totalPage.auctionId = goodsId
			state.robotDataLoading = true
			activityPanicBuyRobotList(state.totalPage).then(res => {
				state.robotDataLoading = false
				if (res.code === proxy.$successCode) {
					let { list, totalRecords } = res.obj
					state.robotData = list
					state.totalCount = totalRecords
				}
			})
		}

		//机器人列表  分页
		const handleCurrentChange = (page) => {
			state.totalPage.pageSize = page
			getRobotList()
		}

		//修改抢购上下线
		const handleChangeOnline = (id, online) => {
			let data = {
				id,
				online,
			}
			activityPanicBuyUpdateState(data).then(res => {
				if(res.code === proxy.$successCode){
					ElMessage.success('操作成功~')
				}
			})
		}


		//点击编辑按钮
		const handleEditClick = () => {
			router.push(`/activity/panicBuy/${id}/edit/${goodsId}`)
		}

		const state = reactive({
			loading: false,
			resData: {},
			activeName: 'robot',
			robotData: [],
			totalCount: 0,
			robotDataLoading: false,
			totalPage: {
				pageNo: 1,
				pageSize: 40
			},
			handleTabClick,
			handleEditClick,
			handleChangeOnline,
			handleCurrentChange
		})

		return toRefs(state)
	}
}
</script>

<style lang="scss" scope>
	.auction-detail{
		.info{
			padding: 20px 0;

			.title{
				font-size: 26px;
				text-align: center;
				line-height: 50px;
			}

			.goods{
				padding: 0 20px;
				display: flex;

				&-img{
					width: 200px;
					.el-image{
						width: 150px;
						height: 150px;
					}
				}

				&-operation{
					width: 100px;
					.el-button{
						margin-top: 50px;
					}
				}

				&-desc{
					width: calc(100% - 300px);
					.goods-name{
						font-size: 24px;
						line-height: 50px;
						color: #888;
					}

					.item{
						display: flex;
						margin-left: -30px;
						padding: 15px 0;
						li{
							margin-left: 30px;
							.label{
								color: #999;
								margin-right: 10px;
							}
						}
					}
				}
			}

		}

		.robot-avatar{
			width: 50px;
			height: 50px;
			border: 1px solid #e5e5e5;
			border-radius: 50%;
		}

		.data-wrap{
			.activity-data{
				h3{
					color: #999;
					padding: 20px 0;
				}

				.overview{
					display: flex;
					li{
						padding: 0 30px;
						text-align: center;
						border-right: 1px solid #e5e5e5;

						&:last-child{
							border: none;
						}

						p.value{
							font-size: 40px;
							color: #888;
							line-height: 50px;
						}

						p.label{
							line-height: 30px;
							color: #717171;
						}
					}
				}
			}
		}
	}
</style>