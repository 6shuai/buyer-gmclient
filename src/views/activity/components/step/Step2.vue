<template>
	<div class="title">抢购信息</div>
	<el-row :gutter="10" class="mt30">
		<el-col :xs="24" :sm="24" :md="18">
			<el-form-item label="抢购日期" prop="beginTime">
				<el-date-picker
					@change="selectedDateTime"
					v-model="params.beginTime"
					type="datetime"
					placeholder="选择日期"
				>
				</el-date-picker>
			</el-form-item>
			<el-form-item label="抢购预热时间" prop="preheatTime">
				<el-input-number
					:min="0"
					controls-position="right"
					v-model="params.preheatTime"
					placeholder="请输入抢购预热时间"
				></el-input-number>
				<span class="units">秒</span>
			</el-form-item>
			<el-form-item label="宣传片排版">
				<compose 
					ref="compose" 
					:goodsSkuId="params.goodsSkuId"
					:list="params.auctionVideos"
					@changeComponse="params.auctionVideos=$event"
				></compose>
			</el-form-item>
			<el-form-item label="抢购倒计时" prop="countdown">
				<el-input-number
					:min="0"
					controls-position="right"
					v-model="params.countdown"
					placeholder="请输入抢购倒计时"
				></el-input-number>
				<span class="units">秒</span>
			</el-form-item>
			<el-form-item label="线下领取商家">
				<place
					:list="params.auctionPickUpAddresses"
					ref="refPlace"
					@changePlaceList="params.auctionPickUpAddresses = $event"
				></place>
			</el-form-item>

			<!-- 没选择线下领取商家时  隐藏 -->
			<div v-if="params.auctionPickUpAddresses && params.auctionPickUpAddresses.length">
				<el-form-item label="线下支付方式" prop="paymentMethod">
					<el-radio-group v-model="params.paymentMethod" size="small">
						<el-radio :label="1">全款支付</el-radio>
						<el-radio :label="2">支付定金</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="定金比例" prop="depositRatio">
					<el-input-number
						:min="0"
						:max="100"
						:disabled="params.paymentMethod == 1"
						controls-position="right"
						v-model="params.depositRatio"
						placeholder="请输入定金比例"
					></el-input-number>
					<span class="units">%</span>
				</el-form-item>
				<el-form-item label="尾款收取方" prop="paymentMethod">
					<el-radio-group
						:disabled="params.paymentMethod == 1"
						v-model="params.balancePayee"
						size="small"
					>
						<el-radio :label="0">小风景收取</el-radio>
						<el-radio :label="1">商户收取</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="订单过期时长" prop="orderExpiration">
					<el-input-number
						:min="0"
						controls-position="right"
						v-model="params.orderExpiration"
						placeholder="请输入订单过期天数"
					></el-input-number>
					<span class="units">天</span>
				</el-form-item>
			</div>

			<el-form-item label="竞猜时间" prop="guessTime">
				<el-input-number
					:min="0"
					controls-position="right"
					v-model="params.guessTime"
					placeholder="请输入猜价时间"
				></el-input-number>
				<span class="units">秒</span>
			</el-form-item>
			<el-form-item label="竞猜规则">
				<rule ref="refRule" :list="params.guessRules"></rule>
			</el-form-item>
		</el-col>
	</el-row>
</template>

<script>
import { reactive, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import Compose from '../Compose'
import Place from '../Place'
import Rule from '../Rule'
import dayjs from 'dayjs'

export default {
	components: {
		Compose,
		Place,
		Rule,
	},
	props: ['panicBuyData'],
	setup(props) {
		const store = useStore()
		const refPlace = ref(null)
		const refRule = ref(null)

		const setPanicBuyData = () => {
			state.params = {
				...state.params,
				auctionPickUpAddresses: refPlace.value.resData,
				guessRules: refRule.value.resData,
			}
			store.dispatch('activity/setPanicBuyData', state.params)
		}

		const selectedDateTime = () => {
			state.params.beginTime = dayjs(state.params.beginTime).format(
				'YYYY-MM-DD HH:mm:ss'
			)
		}

		const state = reactive({
			refPlace,
			refRule,
			params: store.state.activity.panicBuyData,
			setPanicBuyData,
			selectedDateTime,
		})

		watch(
			() => props.panicBuyData,
			(nval, oval) => {
				state.params = nval
			}
		)

		return toRefs(state)
	},
}
</script>