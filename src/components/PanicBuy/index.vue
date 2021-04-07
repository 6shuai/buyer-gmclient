<template>
	<div class="cover">
		<el-image v-if="resData.cover" :src="resData.cover"></el-image>
	</div>

	<div class="panic-buy-content">
		<div class="state clearfix">
			<div class="text-state">
				<el-tag effect="dark">{{ resData.statusName || '草稿' }}</el-tag>
			</div>
		</div>
		<div class="goods-name">
			<div class="title">{{ resData.goodsName }}</div>
			<div class="desc">{{ resData.description }}</div>
		</div>
		<div class="goods-info">
			<div class="item">
				<span class="icon el-icon-coin"></span>
				<span class="text">￥{{ resData.marketValue }}起拍</span>
			</div>
			<div class="item">
				<span class="icon el-icon-time"></span>
				<span class="text">{{ resData.beginTime }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'

export default {
	props: ['goodsItem'],
	setup(props) {
		onMounted(() => {
			state.resData = props.goodsItem
		})

		const state = reactive({
			resData: {}
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss" scope>
.panic-buy {
	&-wrap {
		display: flex;
		flex-wrap: wrap;
		margin-left: -10px;
	}
	&-item {
		width: 282px;
		height: 282px;
		margin: 10px;
		border-radius: 10px;
		overflow: hidden;
		position: relative;
		cursor: pointer;
		&:hover {
			.cover {
				transform: scale(1.05);
			}
			.panic-buy-name {
				color: #409eff;
			}
			.delete-arraw {
				right: -40px;
				bottom: -40px;
			}
		}

		.el-card {
			width: 100%;
			height: 100%;
		}

		.el-card__body {
			padding: 0 !important;
			height: 100%;
		}

		.cover {
			width: 100%;
			height: 100%;
			transition: all 0.5s ease-in-out;
			.el-image {
				width: 100%;
				height: 100%;
			}
		}
	}

	&-content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		color: #fff;
		background: rgba(0, 0, 0, 0.7);

		.state {
			.text-state {
				float: left;
				.el-tag {
					width: 60px;
					text-align: center;
					margin-top: -2px;
					vertical-align: top;
				}
			}
		}

		.goods-name {
			margin: 15px;
			font-size: 14px;

			.title {
				font-size: 20px;
				line-height: 36px;
			}
		}

		.goods-info {
			margin: 80px 15px 0 15px;
			.item {
				width: 100%;
				overflow: hidden;
				line-height: 30px;

				span.text {
					margin-left: 10px;
				}
			}
		}

		.delete {
			position: absolute;
			bottom: 10px;
			right: 10px;
			font-size: 20px;
			&:hover {
				color: #f56c6c;
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
			border-radius: 50%;

			i {
				padding: 15px;
				font-size: 18px;
			}
		}
	}
}
</style>

