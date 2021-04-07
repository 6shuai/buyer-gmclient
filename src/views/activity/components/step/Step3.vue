<template>
    <div class="title">支付信息</div>
    <el-row :gutter="10" class="mt30">
        <el-col :xs="24" :sm="24" :md="18">
            <el-form-item label="支付方式" prop="paymentMethod">
                <el-radio-group v-model="params.paymentMethod" size="small">
                    <el-radio :label="1">全款支付</el-radio>
                    <el-radio :label="2">支付定金</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="定金比例" prop="depositRatio">
                <el-input-number
                    :min="0"
                    controls-position="right"
                    v-model="params.depositRatio"
                    placeholder="请输入定金比例"
                ></el-input-number>
                <span>%</span>
            </el-form-item>
            <el-form-item label="订单过期时长" prop="orderExpiration">
                <el-input-number
                    :min="0"
                    controls-position="right"
                    v-model="params.orderExpiration"
                    placeholder="请输入订单过期天数"
                ></el-input-number>
            </el-form-item>
        </el-col>
    </el-row>
</template>

<script>
import { ref, watch } from 'vue';
import { useStore } from 'vuex'

export default {
    props: ['panicBuyData'],
    setup(props) {
        const store = useStore()
        let params = ref(store.state.activity.panicBuyData);

        watch(() => props.panicBuyData, (nval, oval) => {
            params = nval
        })

        return {
            params
        }
    }
}
</script>