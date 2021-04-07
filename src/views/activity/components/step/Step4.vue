<template>
	<div class="title">添加机器人</div>
	<div class="robot mt20 mb20">
		<el-button type="primary">导入Excel</el-button>

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
	</div>
</template>

<script>
import { reactive, toRefs, ref } from 'vue'
export default {
	setup(props) {
		const robotDataDiv = ref(null)

		const methods = {
			handleMousemove(event) {
                if(!event.layerX) return;
				state.showRuler = true
				let clientWidth = robotDataDiv.value.clientWidth
				state.rulerLeft = event.layerX
				state.ratio = Math.round((event.layerX / clientWidth) * 100)
			},

            handleMouseDown(event){
                state.block.push(state.rulerLeft)
            },

			//离开
			handleMouseleave(event) {
				state.showRuler = false
			},
		}

		const state = reactive({
			showRuler: false,
			rulerLeft: 0,
			ratio: 0,
            block: [],
			robotDataDiv,
			...methods,
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss" scope>
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

        .block{
            position: absolute;
            top: 0;
            height: 200px;
            z-index: 99;
            width: 1px;
            background: #333;
        }
	}
}
</style>