<template>
    <!-- 添加属性 -->
    <el-dialog
        title="添加属性"
        width="800px"
        :close-on-click-modal="false"
        append-to-body
        v-model="dialogVisible"
    >
        <el-form
            label-width="160px"
            ref="addSkusForm"
            :model="addParams"
            :rules="rules"
        >
            <el-form-item label="属性名称" prop="description">
                <el-input
                    class="w220"
                    placeholder="请输入属性名称"
                    v-model="addParams.description"
                ></el-input>
            </el-form-item>
            <el-form-item label="宣传图片" prop="cover">
                <upload-img
                    :isArray="false"
                    :imgList="addParams.cover"
                    @uploadImgPath="uploadImageSuccess"
                ></upload-img>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddSkus"
                    >确 定</el-button
                >
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { ref, reactive, toRefs } from 'vue';
import UploadImg from '@/components/Upload/UploadImg'

export default {
    components: {
        UploadImg
    },
    emits: ['addSkus'],
    setup(props, { emit }) {
        const addSkusForm = ref(null);

        //显示添加商品规格
        const showDialog = (data, index) => {
            if(data){
                state.addParams = data
                state.addParams.index = index
            }
            state.dialogVisible = true;
        }

        //添加商品规格属性
        const handleAddSkus = () => {
            addSkusForm.value.validate((valid) => {
                if(valid){
                    emit('addSkus', state.addParams);
                    state.dialogVisible = false;
                }
            })
        }

        //图片上传成功
        const uploadImageSuccess = (e) => {
            state.addParams.cover = e;
        }

        const rules = {
            description: [{required: true, message: '请输入属性名称', trigger: 'blur' }],
            cover: [{required: true, message: '请上传图片', trigger: 'blur' }]
        }

        const state = reactive({
            addParams: {},
            dialogVisible: false,
            showDialog,
            addSkusForm, 
            rules,
            handleAddSkus, 
            uploadImageSuccess,
        })

        return toRefs(state);
    }
}
</script>