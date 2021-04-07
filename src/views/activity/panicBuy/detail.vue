<template>
	<div class="app-main-wrap detail-wrap auction-detail">
		<el-card>
			<el-page-header
				class="mb20"
				@back="$router.go(-1)"
				content="抢购详情"
			></el-page-header>
			
            <div class="info">
                <div class="title">madongdong</div>
                <div class="goods">
					<div class="goods-img">
						<el-image fit="cover" src=""></el-image>
					</div>
					<div class="goods-desc">
						<div class="goods-name">madongdong</div>
						<ul class="item">
							<li>
								<span class="label">规格</span>
								<span>Nintendo Switch 国行灰色</span>
							</li>
							<li>
								<span class="label">活动时间</span>
								<span>2020年11月11日 20:30</span>
							</li>
							<li>
								<span class="label">起拍价格</span>
								<span>￥2,999</span>
							</li>
							<li>
								<span class="label">数量</span>
								<span>41</span>
							</li>
						</ul>
						<ul class="item">
							<li>
								<span class="label">活动商场</span>
								<span>北京 朝阳大悦城等2个商场</span>
							</li>
						</ul>
					</div>
					<div class="goods-operation">
						<div class="switch">
							<el-switch></el-switch>
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

				<div class="robot-wrap" v-if="activeName=='robot'">
					<el-button type="primary">查看数据</el-button>
				</div>

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
import { reactive, toRefs } from 'vue'
import { ElAlert } from 'element-plus'

export default {
	setup() {
		const handleTabClick = () => {
			console.log(state.activeName);
		}

		//点击编辑按钮
		const handleEditClick = () => {
			ElAlert('这是一段内容', '信息名称', {
				confirmButtonText: '确定'
			});
		}

		const state = reactive({
			activeName: 'robot',
			handleTabClick,
			handleEditClick
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