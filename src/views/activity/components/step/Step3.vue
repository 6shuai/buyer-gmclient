<template>
	<div class="title">添加机器人</div>
	<div class="robot mt20 mb20">
		<el-upload
			class="upload-demo"
			:data="uploadData"
			:action="action"
			accept=".xls,.xlsx"
			:show-file-list="false"
			:before-upload="handleBefore"
			:on-success="handleSuccess"
			:on-error="handleError"
		>
			<el-button type="primary">{{ uploadLoading ? '导入中...' : '导入Excel' }}</el-button>
		</el-upload>
		<!-- <el-button type="primary">柱状图模式</el-button> -->

		<div class="robot-data-wrap">
			<!-- <div
				class="robot-data"
				ref="robotDataDiv"
				@mousemove="handleMousemove"
                @mousedown="handleMouseDown"
				@mouseleave="handleMouseleave"
			>
				<div
					v-show="showRuler"
					class="ruler"
					:style="{ left: rulerLeft + 'px' }"
				>
					<div class="position">{{ ratio }}</div>
				</div>

				<div 
                    class="block"
                    v-for="item in block"
                    :key="item"
                    :style="{ left: item + 'px' }"
                    ></div>
			</div> -->
		</div>

		<div class="robot-data-wrap" v-loading="robotDataLoading">
			<el-table
				class="place-list"
				:data="robotData"
				stripe
				:show-header="false"
			>
				<el-table-column label=" " width="70">
					<template #default="scope">
						<el-image class="avatar" :src="scope.row.avatar"></el-image>
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
</template>

<script>
import {
	reactive,
	toRefs,
	ref,
	getCurrentInstance,
	nextTick,
	onMounted,
} from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { importRobotPlace } from '@/utils/index'
import { activityPanicBuyRobotList } from '@/api/activity'

export default {
	setup(props) {
		const robotDataDiv = ref(null)
		const store = useStore()
		const { proxy } = getCurrentInstance()

		const methods = {
			//上传之前
			handleBefore() {
				state.uploadData = {
					auctionId: store.state.activity.panicBuyData.id,
				}
				state.uploadLoading = true
				let promise = new Promise(resolve => {
					nextTick(function () {
						resolve(true)
					})
				})
				return promise
			},

			//上传成功
			handleSuccess(res) {
				state.uploadLoading = false
				if (res.code == proxy.$successCode) {
					ElMessage.success('上传成功~')
					methods.getRobotList()
				}
			},

			//上传失败
			handleError(res) {
				state.uploadLoading = false
				ElMessage.error('上传失败~')
			},

			//机器人列表
			getRobotList() {
				state.totalPage.auctionId = store.state.activity.panicBuyData.id
				state.robotDataLoading = true
				activityPanicBuyRobotList(state.totalPage).then(res => {
					state.robotDataLoading = false
					if (res.code === proxy.$successCode) {
						let { list, totalRecords } = res.obj
						state.robotData = list
						state.totalCount = totalRecords
					}
				})
			},

			//机器人列表  分页
			handleCurrentChange(page) {
				state.totalPage.pageSize = page
				methods.getRobotList()
			},

			handleMousemove(event) {
				if (!event.layerX) return
				state.showRuler = true
				let clientWidth = robotDataDiv.value.clientWidth
				state.rulerLeft = event.layerX
				state.ratio = Math.round((event.layerX / clientWidth) * 100)
			},

			handleMouseDown(event) {
				state.block.push(state.rulerLeft)
			},

			//离开
			handleMouseleave(event) {
				state.showRuler = false
			},
		}

		const state = reactive({
			action: importRobotPlace,
			showRuler: false,
			rulerLeft: 0,
			ratio: 0,
			block: [],
			robotDataDiv,
			uploadLoading: false,
			robotDataLoading: false,
			totalPage: {
				pageNo: 1,
				pageSize: 40,
			},
			robotData: [],
			totalCount: 0,
			...methods,
			uploadData: {},
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss" scope>
.robot {
	.robot-data-wrap {
		margin: 50px 20px 20px 20px;

		.robot-data {
			width: 100%;
			height: 200px;
			background: #999;
			position: relative;

			.ruler {
				position: absolute;
				top: 0;
				left: 0;
				height: 200px;
				width: 0;
				border-right: 1px dashed #333;

				.position {
					position: absolute;
					top: -20px;
					left: -10px;
				}
			}

			.block {
				position: absolute;
				top: 0;
				height: 200px;
				z-index: 99;
				width: 1px;
				background: #333;
			}
		}
	}

	.avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: 1px solid #e5e5e5;
	}
}
</style>