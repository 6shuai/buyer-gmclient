<template>
    <el-dialog
        title="商品发货"
        width="500px"
        :close-on-click-modal="false"
        append-to-body
        v-model="deliverGoodsDialog"
    >
        <el-form
            label-width="100px"
            ref="expressForm"
            :model="addParams"
            :rules="expressRules"
        >
            <el-form-item label="快递公司" prop="expressCompany">
                <el-select
                    v-model="addParams.expressCompany"
                    filterable
                    placeholder="请选择快递公司"
                >
                    <el-option
                        v-for="item in expressData"
                        :key="item.id"
                        :label="item.companyName"
                        :value="item.companyName"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="快递单号" prop="expressNo">
                <el-input
                    placeholder="请输入快递单号"
                    v-model="addParams.expressNo"
                ></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="deliverGoodsDialog = false">取 消</el-button>
                <el-button
                    type="primary"
                    :loading="btnLoading"
                    @click="handleDeliverGoods"
                    >确 认</el-button
                >
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { reactive, toRefs, ref, getCurrentInstance } from 'vue'
import { expressCompanyList, orderExpress } from '@/api/order'
import { ElMessage } from 'element-plus'

export default {
    emits: ['deliverGoodsSuccess'],
    setup(props, { emit }) {
        const expressForm = ref(null)
        const { proxy } = getCurrentInstance()
        const showDialog = (id) => {
            if(!state.expressData.length) getExpressList()
            state.deliverGoodsDialog = true;
            state.addParams.id = id
        }

        //获取快递公司列表
        const getExpressList = () => {
            expressCompanyList().then(res => {
                state.expressData = res.obj;
            })
        }

        //提交快递发货信息
        const handleDeliverGoods = () => {
            state.expressForm.validate((valid) => {
                if(valid){
                    state.btnLoading = true
                    orderExpress(state.addParams).then(res => {
                        state.btnLoading = false
                        if(res.code === proxy.$successCode){
                            ElMessage.success('操作成功~')
                            state.deliverGoodsDialog = false;
                            emit('deliverGoodsSuccess')
                        }
                    })
                }
            })
        }

        const state = reactive({
            deliverGoodsDialog: false,
            expressData: [],      //快递公司列表
            addParams: {},
            btnLoading: false,
            showDialog,
            handleDeliverGoods,
            expressForm,
            expressRules: {
                expressCompany: [
					{ required: true, message: '请选择快递公司', trigger: 'change' }
				],
                expressNo: [
					{ required: true, message: '请输入快递单号', trigger: 'blur' }
				],
            }
        })

        return toRefs(state)
    }
}
</script>