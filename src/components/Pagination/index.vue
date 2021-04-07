<template>
	<div :class="{ hidden: hidden }" class="pagination-container">
		<el-pagination
			:background="background"
			:current-page.sync="currentPage"
			:page-size.sync="pageSize"
			:layout="layout"
			:page-sizes="pageSizes"
			:total="total"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>
	</div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'
import { reactive, toRefs, computed } from 'vue'

export default {
  name: 'Pagination',
  emits: ['update:page', 'update:limit'],
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 40
    },
    pageSizes: {
      type: Array,
      default() {
        return [40, 60, 100]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const currentPage = computed({
		get() {
			return props.page
		},
		set(val) {
			// emit('update:page', val)
		}
	})
	
	const pageSize = computed({
		get() {
			return props.limit
		},
		set(val) {
			// emit('update:limit', val)
		}
	})

	const handleSizeChange = () => {
		// emit('pagination', { page: state.currentPage, limit: val })
		if (state.autoScroll) {
			scrollTo(0, 800)
		}
	}

	const handleCurrentChange = () => {
		// emit('pagination', { page: val, limit: state.pageSize })
		if (state.autoScroll) {
			scrollTo(0, 800)
		}
	}

	const state = reactive({
		currentPage,
		pageSize,
		handleSizeChange,
		handleCurrentChange
	})

	return toRefs(state)

  }
}
</script>

<style scoped>
.pagination-container {
	background: #fff;
	padding: 32px 16px;
}
.pagination-container.hidden {
	display: none;
}
</style>
