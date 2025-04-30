<script setup name="ProTableDemo">
const dialogVisible = ref(false)
const currentRow = ref(null) // 当前操作的表格行
const table = ref(null)
const formData = reactive({})

const reload = () => table.value.reload()
const query = () => table.value.query()

const mockData = ({pageNo}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        total: 100,
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
  <div class="pro-table-demo">
    <div style="margin-bottom: 16px;">
      <el-button @click="reload">reload</el-button>
      <el-button type="primary" @click="query">query</el-button>
    </div>
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
  </div>
</template>

<style lang="scss" scoped>
.pro-table-demo{
  margin-bottom: 32px;
}
</style>
