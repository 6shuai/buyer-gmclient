<template>
	<div class="title">商品信息</div>
	<el-row :gutter="10" class="mt30 goods-info">
		<el-col :xs="24" :sm="24" :md="18">
            <el-form-item label="商品配置">
                <span class="mr30" v-show="params.goodsName">{{ params.goodsName }}</span>
                <el-button 
                    plain 
                    type="primary" 
                    icon="el-icon-arrow-down"
                    size="small"
                    @click="selectGoods.showDialog()"
                    >选择商品</el-button
                >
            </el-form-item>
            <el-form-item label="商品属性" prop="goodsSkuId">
                <el-select
                    v-model="params.goodsSkuId"
                    filterable
                    placeholder="请选择商品属性"
                    style="width: 220px"
                    @change="handleSelectGoodsSku"
                >
                    <el-option
                        v-for="item in goodsSkuData"
                        :key="item.id"
                        :label="item.description"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品封面">
                <img class="goods-img" :src="params.cover">
            </el-form-item>
            <el-form-item label="商品市场价" prop="marketValue">
                <el-input-number
                    :min="0"
                    controls-position="right"
                    v-model="params.marketValue"
                    placeholder="请输入商品市场价"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="机器人起拍价格" prop="robotStartingPrice">
                <el-input-number
                    :min="0"
                    controls-position="right"
                    v-model="params.robotStartingPrice"
                    placeholder="请输入机器人起拍价格"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="每分钟下降金额" prop="priceDeclineRate">
                <el-input-number
                    :min="0"
                    controls-position="right"
                    v-model="params.priceDeclineRate"
                    placeholder="请输入每分钟下降金额"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="下降时间间隔" prop="priceDeclineFrequency">
                <el-input-number
                    :min="0"
                    controls-position="right"
                    v-model="params.priceDeclineFrequency"
                    placeholder="请输入多少时间下降一次价格"
                ></el-input-number>
                <span class="units">秒</span>
            </el-form-item>
            <el-form-item label="最低抢购价格" prop="floorPrice">
                <el-input-number
                    :min="0"
                    controls-position="right"
                    v-model="params.floorPrice"
                    placeholder="请输入商品最低抢购价格"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="数量" prop="inventory">
                <el-input-number
                    :min="0"
                    controls-position="right"
                    v-model="params.inventory"
                    placeholder="请输入数量"
                ></el-input-number>
            </el-form-item>
		</el-col>
	</el-row>
    
    <!-- 选择商品 -->
    <select-goods ref="selectGoods" @selectedGoods="selectedGoods"></select-goods>

</template>

<script>
import { reactive, toRefs, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { activityGoodsSkuList } from '@/api/activity'
import SelectGoods from '../Goods'

export default {
	components: {
        SelectGoods
	},
    props: ['panicBuyData'],
	setup(props) {
		const selectGoods = ref(null)
        const store = useStore()

        const methods = {
            //选择商品
            selectedGoods(data){
                state.params.goodsName = data.displayName;
                state.params.goodsSkuId = '';
                methods.goodsSkuList(data.id)
            },

            //商品属性列表
            goodsSkuList(id){
                activityGoodsSkuList(id).then(res => {
                    state.goodsSkuData = res.obj;
                })
            },

            //选择商品属性
            handleSelectGoodsSku(){
                state.goodsSkuData.forEach(item => {
                    if(item.id == state.params.goodsSkuId){
                        state.params.cover = item.cover;
                    }
                })
            },

            setPanicBuyData(){
                store.dispatch('activity/setPanicBuyData', state.params)
            }
            
        }


        const state = reactive({
            params: {},
            selectGoods,
            goodsSkuData: [],     //商品规格
            ...methods
        })

        watch(() => props.panicBuyData, (nval, oval) => {
            console.log('-------------------------------------------------------', nval)
            state.params = nval
        })
        
		return toRefs(state)
	},
}
</script>

<style lang="scss" scope>
    .goods-info{
        .goods-img{
            height: 200px;
        }
    }
</style>