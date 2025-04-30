<script setup name="ProTableDemo">
import { Search } from '@element-plus/icons-vue';
const isMobile = useIsMobile()
const dialogVisible = ref(false)
const currentRow = ref(null) // 当前操作的表格行
const table = ref(null)
const formData = reactive({})
const dataRange = computed({
  // getter
  get() {
    return [formData.time_begin, formData.time_end]
  },
  // setter
  set(newValue) {
    splitDateRange(newValue, formData, 'time_begin', 'time_end')
  }
})

const hasTableData = ref(false)
const reload = () => table.value.reload()
const query = () => table.value.query()

const mockData = ({pageNo}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const total = 100
      if(total > 0) hasTableData.value = true
      resolve({
        total,
        list: [
          {code: 234+'_'+pageNo, status: 1},
          {code: 1234+'_'+pageNo, status: 1},
          {code: 345+'_'+pageNo, status: 0}
        ]
      })
    }, 500);
  })
}

// 获取表格数据
const request = async({ pageNo, pageSize }) => {
  const res = await mockData({
    ...formData,
    pageNo,
    pageSize
  })

  if (res) {
    const { total, list = [] } = res
    return {
      list,
      pageSize,
      total,
      pageNo
    }
  }
}

const formatterCode = (r,c,v) => {
  return 'CODE_'+v
}
</script>

<template>
  <TableForm class="pro-table-demo" :is-empty="!hasTableData">
    <el-form v-if="!isMobile && hasTableData" ref="formRef" :model="formData" :inline="true" label-position="top" novalidate>
      <el-form-item label="Withdrawal number" style="width: 220px;">
        <el-input
          v-model="formData.orderId"
          clearable
          placeholder="Order number"
          :suffix-icon="Search"
          @keyup.enter.native="query"
          @clear="query"
        />
      </el-form-item>
      <el-form-item label="Datetime" style="width: 280px;">
        <el-date-picker
          v-model="dataRange"
          type="daterange"
          format="YYYY-MM-DD"
          range-separator="~"
          start-placeholder="start date"
          end-placeholder="end date"
          @change="query"
        />
      </el-form-item>
      <el-form-item label="Status" style="width: 200px;">
        <el-select v-model="formData.selectValue" clearable placeholder="Status" @change="query">
          <el-option label="all" value="" />
          <el-option label="item.label" value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="Amount" style="width: 220px;">
        <el-input
          v-model="formData.orderId"
          clearable
          placeholder="Amount"
          :suffix-icon="Search"
          @keyup.enter.native="query"
          @clear="query"
        />
      </el-form-item>
      <el-form-item label="AmountRange" style="width: 280px;">
        <div class="el-date-editor el-date-editor--daterange el-input__wrapper el-range-editor el-tooltip__trigger el-tooltip__trigger" aria-controls="el-id-1024-418" aria-expanded="false" aria-haspopup="dialog">
          <i class="el-icon el-input__icon el-range__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
              <path fill="currentColor" d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64"></path>
            </svg>
          </i>
          <input
            autocomplete="off"
            name=""
            placeholder="min"
            class="el-range-input"
            :value="formData.minAmount"
          >
          <span class="el-range-separator">~</span>
          <input
            autocomplete="off"
            name=""
            placeholder="max"
            class="el-range-input"
            :value="formData.maxAmount"
          >
          <i class="el-icon el-input__icon el-range__close-icon el-range__close-icon--hidden" >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
              <path fill="currentColor" d="m466.752 512-90.496-90.496a32 32 0 0 1 45.248-45.248L512 466.752l90.496-90.496a32 32 0 1 1 45.248 45.248L557.248 512l90.496 90.496a32 32 0 1 1-45.248 45.248L512 557.248l-90.496 90.496a32 32 0 0 1-45.248-45.248z"></path>
              <path fill="currentColor" d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"></path>
            </svg>
          </i>
        </div>
      </el-form-item>
    </el-form>

    <pro-table ref="table" :request="request">
      <template #toolbar>
        <el-button type="primary">
          新增
        </el-button>
      </template>
      <el-table-column type="selection" width="40" />
      <el-table-column prop="code" label="行内格式化" min-width="150" :formatter="formatterCode" />
      <el-table-column prop="status" tag label="状态" min-width="150">
        <template #default="{ row }">
          <el-tag>{{ row.status === 1 ? '启用' : '停用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column action class-name="operation-col" label="操作" width="100" fixed="right" align="center">
        <template #default="{ row }">
          <el-link type="primary" @click="test(row)">
            编辑
          </el-link>
        </template>
      </el-table-column>
    </pro-table>
  </TableForm>
</template>

<style lang="scss" scoped>
.pro-table-demo{
  margin-bottom: 32px;
}
</style>
