<script setup name="ProTable">
const isMobile = useIsMobile()

const props = defineProps({
  request: {
    type: Function,
    default: () => {}
  },
  cardClick: {
    type: Function,
    default: () => {}
  },
  requestOnMounted: {
    type: Boolean,
    default: true
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  isShowEmpty: {
    type: Boolean,
    default: false
  },
  pageSize: {
    type: Number,
    default: 10
  },
  exportFileName: {
    type: String,
    default: ''
  },
  // exportFileName 是否自动加时间戳后缀
  hasTimestampSuffix: {
    type: Boolean,
    default: true
  },
  tableId: {
    type: String,
    default: ''
  },
  pagerCount: {
    type: Number,
    default: 5
  },
  maxExport: {
    type: Number,
    default: 10000
  },
  /** 跨页选择行的数据key，若不设置则表示不开启跨页选择 */
  acrossPagesSelectedKey: {
    type: String,
    default: ''
  },
  exportColumns: {
    type: Array,
    default: () => []
  },
  // 分页配置
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100, 200]
  },
  tableData: { // 静态数据
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['sizeChange', 'pageNoChange', 'pageChange'])
const slots = useSlots()

const $el = ref(null)
/** 跨页选中的数据 */
const acrossPagesSelected = ref([])
const clearSelected = () => {
  acrossPagesSelected.value = []
}

const page = reactive({
  pageSize: props.pageSize,
  total: 0,
  pageNo: 1
})
// 是否已获取数据
const isGetData = ref(false)
// 是否无数据
// 默认无数据，确认有数据后，不再改变
const isEmpryData = ref(true)
const dataList = ref([])
const loading = ref(false)
const _fetch = _page => {
  loading.value = true
  props.request(toRaw(_page || page)).then(res => {
    isGetData.value = true
    if (!res) {
      // 无数据处理
      dataList.value = []
      Object.assign(page, { total: 0, pageNo: 1 })
      return
    }
    const { list, pageSize, total, pageNo } = res
    if (isEmpryData.value && total > 0) isEmpryData.value = false
    if (!Array.isArray(list)) return
    dataList.value = list
    if (!pageSize || !pageNo) return
    Object.assign(page, { pageSize, total, pageNo })

    // 勾选跨页选中的数据
    nextTick(() => {
      const key = props.acrossPagesSelectedKey
      key && list.forEach(row => {
        const target = acrossPagesSelected.value.find(item => item[key] === row[key])
        target && $el.value.toggleRowSelection(row, true)
      })
    })
  }).finally(() => {
    emit('pageChange', page)
    loading.value = false
  })
}

defineExpose({
  query: () => _fetch({ ...page, pageNo: 1 }),
  reload: () => _fetch(),
  $el, clearSelected
})

const handleSizeChange = val => {
  page.pageSize = val
  page.pageNo = 1
  emit('sizeChange', val)
  _fetch(toRaw(page))
}
const handleCurrentChange = val => {
  if (page.pageNo === val) return
  page.pageNo = val
  emit('pageNoChange', val)
  _fetch(toRaw(page))
}

const selected = ref([])
const handleSelectionChange = val => {
  selected.value = val
}

const handleSelect = (selection, row) => {
  const key = props.acrossPagesSelectedKey
  if (!key) return
  const checked = !!selection.find(item => item[key] === row[key])
  updateSelected(checked, row, key)
}
const handleSelectAll = selection => {
  const key = props.acrossPagesSelectedKey
  if (!key) return
  const checked = selection.length > 0
  // 当部分行的数据不可选时，当前页有被选择的行则以selected.value为准
  const list = checked ? selection : dataList.value
  list.forEach(row => updateSelected(checked, row, key))
}
const updateSelected = (checked, row, key) => {
  const index = acrossPagesSelected.value.findIndex(item => item[key] === row[key])
  if (checked) {
    index === -1 && acrossPagesSelected.value.push(row)
  } else {
    index > -1 && acrossPagesSelected.value.splice(index, 1)
  }
}

const mobileTpl = reactive({
  tag: {},
  list: []
})

const setMobileTpl = () => {
  mobileTpl.tag = {}
  mobileTpl.list = []
  let nodes = []
  // 遍历子节点，将非常规类型节点放入nodes数组
  slots.default().forEach(node => {
    if (typeof node.type !== 'symbol') {
      nodes.push(node)
    } else {
      (node.children || []).length > 1 && (nodes = nodes.concat(node.children))
    }
  })

  nodes.forEach(node => {
    const { label, tag, action, type } = node.props || {}
    // 排除选择框列和操作列
    if (type !== 'selection' && action === void 0) {
      if (tag !== void 0) {
        mobileTpl.tag = { label, node }
      } else {
        if (label) {
          mobileTpl.list.push({ label, node })
        }
      }
    }
  })
}
setMobileTpl()

onMounted(() => {
  dataList.value = props.tableData
  if(!props.requestOnMounted && props.tableData.length > 0) { // 如果存在静态数据-则直接展示
    isGetData.value = true
  } else {
    props.requestOnMounted && _fetch(toRaw(page))
  }
})

</script>

<template>
  <div v-show="isGetData">
    <EmptyData v-if="isShowEmpty && isEmpryData"></EmptyData>
    <div v-else class="pro-table-wrapper" :class="{'pro-table-m': isMobile}">
      <div v-if="$slots.toolbar" class="toolbar">
        <div class="toolbar-container">
          <slot name="toolbar" :selected="selected" :data-list="dataList" :across-pages-selected="acrossPagesSelected" />
        </div>
      </div>
      <div v-if="isMobile" v-loading="loading" :element-loading-text="$t('common.loading')">
        <MobileList
          :data="dataList"
          :tag-tpl="mobileTpl.tag"
          :list-tpl="mobileTpl.list"
          @card-click="cardClick"
        />
      </div>
      <el-table
        v-else
        ref="$el"
        v-loading="loading"
        :element-loading-text="$t('common.loading')"
        highlight-current-row
        class="pro-table"
        :data="dataList"
        v-bind="$attrs"
        @selection-change="handleSelectionChange"
        @select="handleSelect"
        @select-all="handleSelectAll"
      >
        <slot />
      </el-table>
      <Pagination
        v-if="showPagination"
        :current-page="page.pageNo"
        :page-sizes="pageSizes"
        :page-size="page.pageSize"
        :total="page.total"
        :pager-count="pagerCount"
        @update:page-size="handleSizeChange"
        @update:current-page="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pro-table-wrapper{
  border-radius: 12px;
  border: 1px solid #E4E7EC;
  background: #FFF;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  overflow: hidden;
  .pro-table {
    margin-bottom: 12px;
    :deep(tr) {
      th.el-table__cell{
        background-color: #F9FAFB;
      }
    }
  }
  :deep(.el-table) {
    td.el-table__cell, th.el-table__cell.is-leaf{
      border-bottom: none;
      box-sizing: border-box;
      box-shadow: inset 0 -1px #E4E7EC;
    }
    .el-table__cell {
      padding: 0;
    }
    .cell{
      padding: 12px 24px;
      line-height: 1.2;
      min-height: 72px;
      display: flex;
      align-items: center;
      color: #475467;
    }
    th .cell{
      min-height: 42px;
    }
    .el-table__body-wrapper .el-table-column--selection>.cell, .el-table__header-wrapper .el-table-column--selection>.cell{
      height: 20px;
    }
  }
}
.flylinking-pagination{
  margin-bottom: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 16px 16px 10px 16px;
  box-shadow: inset 0 -1px #E4E7EC;
}
.toolbar-container {
  display: flex;
  align-items: center;
}

.pro-table-m{
  border: none;
  box-shadow: none;
  .toolbar{
    box-shadow: none;
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
