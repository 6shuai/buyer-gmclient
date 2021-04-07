<template>
	<el-button icon="el-icon-plus" plain type="primary" @click="showDialog"
		>选择Banner</el-button
	>
	<el-dialog
		title="选择Banner"
		width="1010px"
		custom-class="goods-banner-wrap"
		:close-on-click-modal="false"
		append-to-body
		v-model="selectBannerDialog"
	>
		<div v-loading="loading">
            <p>
                <el-input
                    class="ml20 mb20 w220"
                    clearable
                    placeholder="请输入Banner名称"
                    v-model="params.displayName"
                    @change="search"
                ></el-input>
            </p>

			<el-card 
                class="item" 
                :class="{ active: selectedId == item.id }"
                v-for="item in bannerList" 
                @click="selectedId=item.id"
                :key="item">
				<el-image fit="contain" :src="item.image"></el-image>
				<p class="title overflow">{{ item.displayName }}</p>
			</el-card>

			<el-pagination
				class="mt20"
				background
				:current-page.sync="params.pageNo"
				layout="total, prev, pager, next"
				@current-change="handleCurrentChange"
				:total="totalCount"
			>
			</el-pagination>
		</div>
		<el-empty
			v-if="!bannerList.length && !loading"
			description="暂无数据"
		></el-empty>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="selectBannerDialog = false">取 消</el-button>
                <el-button type="primary" @click="handleSelected">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { activityGoodsBannerList } from '@/api/activity'

export default {
	setup(props) {
		const store = useStore()
		const showDialog = () => {
			state.loading = true
			state.selectBannerDialog = true
			getBannerList()
		}

		//banner 列表
		const getBannerList = () => {
			activityGoodsBannerList(state.params).then(res => {
				state.loading = false
				let { list, totalRecords } = res.obj
				state.bannerList = list
				state.totalCount = totalRecords
			})
		}

		//分页
		const handleCurrentChange = page => {
			state.params.pageNo = page
			getBannerList()
		}

        //按名称搜索
        const search = () => {
            state.params.pageNo = 1;
            getBannerList()
        }

        //选定banner 点击确定按钮
        const handleSelected = () => {
			store.dispatch('activity/setPanicBuyData', { bannerId: state.selectedId })
            state.selectBannerDialog = false;
        }

		const state = reactive({
			loading: false,
			selectBannerDialog: false,
			params: {
				pageNo: 1,
			},
            selectedId: null,
			bannerList: [],
			totalCount: 0,
			showDialog,
			handleCurrentChange,
            search,
            handleSelected
		})

		return toRefs(state)
	},
}
</script>

<style lang="scss" scope>
.goods-banner-wrap {
	.item {
		width: 300px;
		height: 170px;
		display: inline-block;
		margin: 0 0 20px 20px;
		border: 1px solid #fff;
		border-radius: 4px;
		cursor: pointer;

		&:hover {
			border-color: #f38181;
		}

        &.active {
            border-color: #f38181;
        }

		.el-card {
			width: 100%;
			height: 100%;

			.el-card__body {
				padding: 0;
			}
		}

		.el-image {
			width: 100%;
			max-height: 150px;
		}

		p.title {
			padding: 10px;
			font-size: 16px;
		}
	}
}
</style>