<template>
	<div class="promotional-componse-wrap">
		<el-button-group>
			<el-button type="primary" @click="textEditDialog = true"
				>插入合成语音</el-button
			>
			<el-button type="primary" @click="showVideoList">插入宣传视频</el-button>
		</el-button-group>

		<div class="timeline" v-if="resData.length">
			<div class="start">0:00</div>
			<div class="timeline-content clearfix">
				<draggable
					class="dragArea"
					group="article"
					v-model="resData"
					@end="changePromotionalVideo"
					item-key="id"
				>
					<template #item="{ element, index }">
						<div
							:style="{ width: element.width + '%' }"
							class="item"
							:title="element.displayName"
						>
							<div class="timeline-title">
								<div class="image">
									<el-image :src="element.image"></el-image>
									<!-- 删除 -->
									<div
										class="el-icon-circle-close"
										title="删除"
										@click="handleDeleteVideo(index)"
									></div>
								</div>
								<p class="name">{{ element.displayName }}</p>
							</div>
							<div class="progress"></div>
							<div class="duration">{{ formatSeconds(element.duration) }}</div>
						</div>
					</template>
				</draggable>
			</div>
			<div class="end">{{ formatSeconds(totalDuration) }}</div>
		</div>

		<!-- 合成语音 -->
		<el-dialog
			title="文本编辑"
			width="600px"
			custom-class="compose-text-edit"
			:close-on-click-modal="false"
			append-to-body
			v-model="textEditDialog"
		>
			<div class="text-wrap">
				<el-input
					type="textarea"
					resize="none"
					:autosize="{ minRows: 6, maxRows: 20 }"
					placeholder="请输入需要转换成语音的文字"
					v-model="text"
				></el-input>
				<p class="text-count">已输入{{ text.length }}</p>
			</div>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="textEditDialog = false">取 消</el-button>
					<el-button type="primary" @click="textEditDialog = false"
						>确 定</el-button
					>
				</span>
			</template>
		</el-dialog>

		<!-- 选择宣传视频 -->
		<el-dialog
			title="选择视频"
			width="600px"
			custom-class="compose-select-video"
			:close-on-click-modal="false"
			append-to-body
			v-model="selectVideoDialog"
		>
			<ul class="video-wrap" v-loading="videoLoading">
				<li
					v-for="item in videoData"
					@click="selectedVideo(item)"
					:key="item.id"
				>
					<el-image fit="cover" :src="item.image"></el-image>
					<p class="title overflow">{{ item.displayName }}</p>
				</li>
			</ul>
			<el-empty v-if="!videoData.length" description="暂无视频"></el-empty>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="selectVideoDialog = false">取 消</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { reactive, toRefs, computed, watch } from 'vue'
import { activityGoodsVideoList } from '@/api/activity'
import { ElMessageBox } from 'element-plus'
import draggable from 'vuedraggable'

export default {
	emits: ['changeComponse'],
	props: ['goodsSkuId', 'list'],
	components: {
		draggable,
	},
	setup(props, { emit }) {
		const getVideoList = () => {
			state.videoLoading = true
			activityGoodsVideoList(props.goodsSkuId).then(res => {
				state.videoLoading = false
				state.videoData = res.obj
			})
		}

		//显示视频列表
		const showVideoList = () => {
			console.log('显示视频列表')
			state.selectVideoDialog = true
			getVideoList()
		}

		//选择视频
		const selectedVideo = data => {
			state.resData.push(data)
			state.selectVideoDialog = false
			findRatio()
		}

        //删除视频
        const handleDeleteVideo = index => {
            ElMessageBox.confirm(`此操作将删除【${state.resData[index].displayName}】, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                state.resData.splice(index, 1)
                findRatio()
            }).catch(() => {

            })
        }

		//排版占比
		const findRatio = type => {
			state.totalDuration = 0
			state.resData.forEach(item => {
				state.totalDuration += Number(item.duration)
			})

			for (let i = 0; i < state.resData.length; i++) {
				state.resData[i].width = percentage(
					state.resData[i].duration,
					state.totalDuration
				)
			}
			changePromotionalVideo(type)
		}

		//宣传片排版改变时
		const changePromotionalVideo = type => {
			let data = []
			state.resData.forEach((item, index) => {
				data.push({
					goodsVideoId: item.goodsVideoId || item.id,
					orderIndex: index,
				})
			})

			if (type != 'edit') {
				console.log('qaq')
				emit('changeComponse', data)
			}
		}

		//百分比
		const percentage = (num, total) => {
			if (num == 0 || total == 0) {
				return 0
			}
			return ((num / total) * 10000).toFixed(2) / 100.0 // 小数点后两位百分比
		}

		//秒转成分秒
		const formatSeconds = value => {
			let secondTime = parseInt(value) // 秒
			let minuteTime = 0 // 分
			let hourTime = 0 // 小时
			if (secondTime > 60) {
				minuteTime = parseInt(secondTime / 60)
				secondTime = parseInt(secondTime % 60)
				if (minuteTime > 60) {
					hourTime = parseInt(minuteTime / 60)
					minuteTime = parseInt(minuteTime % 60)
				}
			}
			let result =
				'' +
				(parseInt(secondTime) < 10
					? '0' + parseInt(secondTime)
					: parseInt(secondTime))

			result =
				'' +
				(parseInt(minuteTime) < 10
					? '0' + parseInt(minuteTime)
					: parseInt(minuteTime)) +
				':' +
				result

			return result
		}

		watch(
			() => props.list,
			(nval, oval) => {
				if (state.resData.length) return
				state.resData = JSON.parse(JSON.stringify(nval))
				findRatio('edit')
			}
		)

		const state = reactive({
			videoLoading: false,
			totalDuration: 0,
			resData: [],
			textEditDialog: false,
			selectVideoDialog: false,
			text: '',
			videoData: [], //视频列表
			showVideoList,
			selectedVideo,
			formatSeconds,
			changePromotionalVideo,
            handleDeleteVideo
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss" scope>
.promotional-componse-wrap {
	.timeline {
		padding: 20px 0;
		display: flex;
		.start {
			width: 30px;
			margin-top: 80px;
		}
		.end {
			width: 50px;
			margin-top: 80px;
		}

		&-content {
			width: calc(100% - 80px);

			.item {
				width: 100%;
				cursor: pointer;
				float: left;
				.timeline-title {
					width: 100%;
					height: 90px;
					text-align: center;

					.image {
						width: 48px;
						height: 48px;
						display: inline-block;
						position: relative;

						.el-image {
							width: 40px;
							height: 40px;
							border-radius: 50%;
							border: 1px solid #e5e5e5;
						}

						.el-icon-circle-close {
							font-size: 22px;
							color: #ff2e63;
							background: #fff;
							position: absolute;
							top: -6px;
							right: -6px;
							border-radius: 50%;
							display: none;
						}
					}

					p {
						line-height: 20px;
					}
				}

				.progress {
					width: 100%;
					height: 20px;
					background: #409eff;
					border-radius: 6px;
				}

				.duration {
					text-align: center;
				}

				&:hover {
					.progress {
						background: #1784f5;
					}
					.timeline-title .image .el-icon-circle-close {
						display: block;
					}
				}
			}
		}
	}
}

.compose-text-edit {
	.text-wrap {
		border: 1px solid #e5e5e5;
		border-radius: 4px;

		.text-count {
			text-align: right;
			padding-right: 10px;
			color: #999;
		}
	}

	.el-textarea__inner {
		border: none;
	}
}

.compose-select-video {
	.video-wrap {
		display: flex;
		flex-wrap: wrap;
		margin-left: -10px;
		li {
			width: 150px;
			margin-left: 15px;
			margin-bottom: 20px;
			cursor: pointer;
			.el-image {
				width: 150px;
				height: 150px;
				border: 1px solid #e5e5e5;
				border-radius: 4px;
				overflow: hidden;
			}

			&:hover .el-image {
				border-color: #409eff;
			}

			p.title {
				text-align: center;
			}
		}
	}
}
</style>