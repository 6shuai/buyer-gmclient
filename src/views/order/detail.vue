<template>
	<div class="app-main-wrap order-detail-wrap">
		<el-card>
			<el-page-header
				class="mb30"
				@back="$router.go(-1)"
				content="订单详情"
			></el-page-header>

			<el-form label-width="160px" v-loading="loading">
				<div class="title">用户信息</div>
				<el-form-item label="头像">
					<el-image class="heade-img" fit="cover" :src="resData.headimgurl"></el-image>
				</el-form-item>
				<el-form-item label="昵称">{{ resData.contactName }}</el-form-item>

				<div class="title">商品信息</div>
				<el-form-item label="商品名称"> {{ resData.goodsName }} </el-form-item>
				<el-form-item label="商品图片">
					<el-image class="goods-img" fit="cover" :src="resData.cover"></el-image>
				</el-form-item>
				<el-form-item label="商品规格"> {{ resData.description }} </el-form-item>
				<el-form-item label="起拍价格"> {{ resData.marketValue }} 元</el-form-item>

				<div class="title">物流信息</div>
				<el-form-item label="领取方式"> {{ resData.receiveType==1 ? '线下' : '线上' }} </el-form-item>
				<el-form-item label="订单状态">
                    <span>{{ resData.statusName }}</span>
                    <el-link
						v-if="resData.status==2"
                        class="ml20"
                        type="primary"
                        href="javascript:;"
                        @click="deliverGoods.showDialog(route.params.id)"
                        >发货</el-link
                    >
                </el-form-item>
				<el-form-item label="收货地址">{{ resData.cityName }}{{ resData.areaName }}{{ resData.address }}</el-form-item>

				<div class="title">支付信息</div>
				<!-- 支付方式 1表示全款支付；2表示定金支付 -->
				<el-form-item label="支付方式"> {{ resData.paymentMethod==1 ? '全款支付' : '定金支付' }} </el-form-item>
				<el-form-item label="抢购价格"> {{ resData.totalAmount || 0 }} 元</el-form-item>
				<el-form-item label="优惠金额"> {{ (resData.marketValue - resData.totalAmount) || 0 }} 元</el-form-item>
				<el-form-item label="定金金额"> {{ (resData.totalAmount * (resData.depositRatio / 100)) || 0 }} 元</el-form-item>
				<el-form-item label="尾款金额"> {{ (resData.totalAmount - (resData.totalAmount * (resData.depositRatio / 100))) || 0 }} 元</el-form-item>

				<div class="title">订单信息</div>
				<el-form-item label="订单编号"> {{ resData.serialNumber }} </el-form-item>
				<el-form-item label="创建时间"> {{ resData.creationTime }} </el-form-item>
				<el-form-item label="定金付款时间"> {{ resData.depositTime }} </el-form-item>
				<el-form-item label="付款完成时间"> {{ resData.totalTime }} </el-form-item>
			</el-form>
		</el-card>
        
        <!-- 发货 -->
		<deliver-goods ref="deliverGoods" @deliverGoodsSuccess="resData.status=3"></deliver-goods>

	</div>
</template>

<script>
import { reactive, toRefs, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { orderDetail } from '@/api/order'
import DeliverGoods from './components/DeliverGoods'

export default {
	components: {
        DeliverGoods
	},
	setup() {
        const deliverGoods = ref(null)
		const route = useRoute()

		onMounted(() => {
			getDetail()	
		})

		const getDetail = () => {
			state.loading = true
			orderDetail(route.params.id).then(res => {
				state.loading = false
				state.resData = res.obj;
			})
		}

		const state = reactive({
			resData: {},
			loading: false,
            deliverGoods,
			route
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss" scope>
.order-detail-wrap {
	.title {
		background: #f5efef;
		line-height: 30px;
		padding: 10px;
		margin: 20px 0;
	}

    .heade-img{
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }

    .goods-img{
        max-width: 500px;
    }
}
</style>