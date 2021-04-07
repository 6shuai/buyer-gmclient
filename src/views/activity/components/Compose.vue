<template>
	<div class="promotional-componse-wrap">
		<el-button-group>
			<el-button type="primary" @click="textEditDialog = true"
				>插入合成语音</el-button
			>
			<el-button type="primary" @click="showVideoList"
				>插入宣传视频</el-button
			>
		</el-button-group>

        <div class="timeline">
            <div class="start">0:00</div>
            <div class="timeline-content clearfix">
                <draggable 
                    class="dragArea"
                    group="article"
                    v-model="resData"
                    item-key="id"
                >   
                    <template #item="{element}">
                        <div :style="{width: element.width+'%'}" class="item">
                            <div class="timeline-title">
                                title{{element.id}}
                            </div>
                            <div class="progress"></div>
                            <div class="duration">1:15</div>
                        </div>
                    </template>
                </draggable>
            </div>
            <div class="end">5:00</div>
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
			<ul class="video-wrap" v-if="videoData.length">
                <li v-for="item in videoData" :key="item.id">
                    <el-image fit="cover" :src="item.image"></el-image>
                    <p class="title overflow">{{ item.displayName }}</p>
                </li>
			</ul>
            <el-empty v-else description="暂无视频"></el-empty>

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="selectVideoDialog = false">取 消</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { activityGoodsVideoList } from '@/api/activity'
import draggable  from 'vuedraggable'

export default {
    props: ['goodsSkuId'],
    components: {
        draggable  
    },
	setup(props) {
        const getVideoList = () => {
            activityGoodsVideoList(props.goodsSkuId).then(res => {
                state.videoData = res.obj;
            })
        }

        const showVideoList = () => {
            state.selectVideoDialog = true;
            getVideoList()
        }

		const state = reactive({
            resData: [
                { id: 1, width: 20 },
                { id: 2, width: 50 },
                { id: 3, width: 30 }
            ],
			textEditDialog: false,
			selectVideoDialog: false,
			text: '',
            videoData: [],            //视频列表
            showVideoList,
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss" scope>
.promotional-componse-wrap{
    .timeline{
        padding: 20px 0;
        display: flex;
        .start{
            width: 30px;
            margin-top: 70px;
        }
        .end{
            width: 50px;
            margin-top: 70px;
        }

        &-content{
            width: calc(100% - 80px);

            .item{
                width: 100%;
                cursor: pointer;
                float: left;
                .timeline-title{
                    width: 100%;
                    height: 80px;
                    text-align: center;
                }
                
                .progress{
                    width: 100%;
                    height: 20px;
                    background: #409eff;
                    border-radius: 2px;
                }

                .duration{
                    text-align: center;
                }

                &:hover .progress{
                    background: #1784f5;
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

.compose-select-video{
    .video-wrap{
        display: flex;
        flex-wrap: wrap;
        margin-left: -10px;
        li{
            width: 150px;
            margin-left: 15px;
            margin-bottom: 20px;
            cursor: pointer;
            .el-image{
                width: 150px;
                height: 150px;
                border: 1px solid #e5e5e5;
                border-radius: 4px;
                overflow: hidden;
            }

            &:hover .el-image{
                border-color: #409eff;
            }
            
            p.title{
                text-align: center;
            }
        }
    }
}
</style>