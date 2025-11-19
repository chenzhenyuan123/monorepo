<script setup name="AccountWalletWithdrawalRecords">
import { Check, Close, Search } from '@element-plus/icons-vue';
import { checkResponseData, isEMpty, currencyFormat, arrToDict, downloadByA } from "@/util/index.js"
import { formatDate, splitDateRange } from "@/util/dateUtil.js"
import { useI18n } from "vue-i18n";

const router = useRouter()
const { t } = useI18n()
const { withdrawApi } = useApi()
const isMobile = useIsMobile()
const dialogVisible = ref(false)
const currentRow = ref(null) // 当前操作的表格行
const table = ref(null)
const formData = reactive({
})
const dataRange = computed({
    // getter
    get() {
        return [formData.startApplyTime, formData.endApplyTime]
    },
    // setter
    set(newValue) {
        splitDateRange(newValue, formData, 'startApplyTime', 'endApplyTime')
    }
})
const selectStatusData = computed(() => {
  return [
    { value: 'WITHDRAWING', label: t('wallet.dataWithdrawStatusProccessing'), type: 'primary' },
    { value: 'SUCCESS', label: t('wallet.dataWithdrawStatusSuccess'), type: 'success' },
    { value: 'FAIL', label: t('wallet.dataWithdrawStatusFailed'), type: 'danger' },
  ]
})
const statusData = computed(() => {
  return [
    { value: 'WITHDRAWING', label: t('wallet.dataWithdrawStatusProccessing'), type: 'primary' },
    { value: 'WITHDRAW_ACCEPT_FAIL', label: t('wallet.dataWithdrawStatusFailed'), type: 'danger' },
    { value: 'WITHDRAW_ACCEPT_SUCCESS', label: t('wallet.dataWithdrawStatusProccessing'), type: 'primary' },
    { value: 'ISSUING', label: t('wallet.dataWithdrawStatusProccessing'), type: 'primary' },
    { value: 'ISSUE_ACCEPT_FAIL', label: t('wallet.dataWithdrawStatusProccessing'), type: 'primary' },
    { value: 'ISSUE_ACCEPT_SUCCESS', label: t('wallet.dataWithdrawStatusProccessing'), type: 'primary' },
    { value: 'ISSUE_SUCCESS', label: t('wallet.dataWithdrawStatusSuccess'), type: 'success' },
    { value: 'ISSUE_FAIL', label: t('wallet.dataWithdrawStatusFailed'), type: 'danger' },
    { value: 'ISSUE_SUCCESS_RETURN', label: t('wallet.dataWithdrawStatusFailed'), type: 'danger' },
  ]
})
const statusDict = computed(() => {
  return arrToDict(statusData.value)
})
const statusToType = computed(() => {
  return arrToDict(statusData.value, { label: 'type' })
})

const hasTableData = ref(false)
const reload = () => table.value.reload()
const query = () => table.value.query()

// 获取表格数据
const request = async({ pageNo, pageSize }) => {
  const result = await withdrawApi.listPage({
    ...formData,
    pageNo,
    pageSize
  })

  const res = checkResponseData(result)

  if (res) {
    const { total, list = [] } = res
    if(total > 0) hasTableData.value = true
    return {
      list,
      pageSize,
      total,
      pageNo
    }
  }
}

const formatterAmount = (v, c) => {
    return isEMpty(v) ? '' : (c || 'USD') + ' ' + currencyFormat(v)
}
const jumpToDetail = (r) => {
    router.push({
        path: '/account/withdraw/details',
        query: {
            id: r.id
        }
    })
}
</script>

<template>
  <div class="download-wrapper">
    <div class="download-container">
      <el-link
        type="primary"
        class="download-btn"
        id="Affiliate-terms-download"
        underline="never"
        @click="downloadByA({
          url: 'https://flylink-cdn-oss-prod.inflyway.com/flylink/flylink-terms-of-use.pdf',
          name: 'flylink-terms-of-use.pdf'
        })"
      >
        {{$t('wallet.downloadText')}}
      </el-link>
        <div class="flex-center-6"></div>
      <el-popover
        placement="top"
        effect="dark"
        :width="309"
        :content="$t('wallet.downloadTip')"
        popper-class="popover-download"
      >
        <template #reference>
          <div class="popover-download-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clip-path="url(#clip0_3374_7392)">
              <path d="M7.57533 7.49999C7.77125 6.94305 8.15795 6.47341 8.66695 6.17427C9.17596 5.87512 9.77441 5.76577 10.3563 5.86558C10.9382 5.96539 11.466 6.26793 11.8462 6.7196C12.2264 7.17127 12.4345 7.74293 12.4337 8.33332C12.4337 9.99999 9.93366 10.8333 9.93366 10.8333M10.0003 14.1667H10.0087M18.3337 9.99999C18.3337 14.6024 14.6027 18.3333 10.0003 18.3333C5.39795 18.3333 1.66699 14.6024 1.66699 9.99999C1.66699 5.39762 5.39795 1.66666 10.0003 1.66666C14.6027 1.66666 18.3337 5.39762 18.3337 9.99999Z" stroke="#98A2B3" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
              <clipPath id="clip0_3374_7392">
              <rect width="20" height="20" fill="white"/>
              </clipPath>
              </defs>
            </svg>
          </div>
        </template>
      </el-popover>
    </div>
    <TableForm class="table-container" :is-empty="!hasTableData">
        <el-form v-if="!isMobile && hasTableData" ref="formRef" :model="formData" :inline="true" label-position="top" novalidate>
            <el-form-item :label="$t('wallet.withdrawalRecordsFormLabelWithdrawalNumber')" style="width: 220px;">
                <el-input
                  v-model="formData.withdrawNo"
                  clearable
                  :placeholder="$t('wallet.withdrawalRecordsFormPlaceholderWithdrawalNumber')"
                  :suffix-icon="Search"
                  @keyup.enter.native="query"
                  @clear="query"
                />
            </el-form-item>
            <el-form-item :label="$t('wallet.withdrawalRecordsFormLabelDatetime')" style="width: 280px;">
                <el-date-picker
                  v-model="dataRange"
                  type="daterange"
                  format="YYYY-MM-DD"
                  range-separator="~"
                  :start-placeholder="$t('wallet.withdrawalRecordsFormPlaceholderDatetimeStart')"
                  :end-placeholder="$t('wallet.withdrawalRecordsFormPlaceholderDatetimeEnd')"
                  @change="query"
                />
            </el-form-item>
            <el-form-item :label="$t('wallet.withdrawalRecordsFormLabelStatus')" style="width: 200px;">
                <el-select
                  v-model="formData.status"
                  clearable
                  :placeholder="$t('wallet.withdrawalRecordsFormPlaceholderStatus')"
                  @change="query"
                >
                    <el-option v-for="item in selectStatusData" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('wallet.withdrawalRecordsFormLabelAmount')" style="width: 220px;">
                <el-input
                  v-model="formData.applyAmt"
                  clearable
                  :placeholder="$t('wallet.withdrawalRecordsFormPlaceholderAmount')"
                  :suffix-icon="Search"
                  @keyup.enter.native="query"
                  @clear="query"
                />
            </el-form-item>
        </el-form>

        <pro-table
            ref="table"
            :request="request"
            :card-click="jumpToDetail"
            :is-show-empty="true"
        >
            <el-table-column prop="withdrawNo" :label="$t('wallet.withdrawalRecordsTableLabelNo')" min-width="271" />
            <el-table-column prop="applyTime" :label="$t('wallet.withdrawalRecordsTableLabelDatetime')" min-width="200">
                <template #default="{ row }">
                    <span class="direction-ltr direction-inline-block">{{ formatDate(row.applyTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="applyAmt" :label="$t('wallet.withdrawalRecordsTableLabelAmount')" min-width="300" align="right">
                <template #default="{ row }">
                    {{ formatterAmount(row.applyAmt, row.withdrawCurrency) }}
                </template>
            </el-table-column>
            <el-table-column prop="withdrawMethod" :label="$t('wallet.withdrawalRecordsTableLabelMethod')" min-width="160" />
            <el-table-column prop="withdrawFee" :label="$t('wallet.withdrawalRecordsTableLabelWithdrawalFee')" min-width="300" align="right">
                <template #default="{ row }">
                    {{ formatterAmount(row.withdrawFee, row.withdrawCurrency) }}
                </template>
            </el-table-column>
            <el-table-column prop="status" tag :label="$t('wallet.withdrawalRecordsTableLabelState')" min-width="200">
            <template #default="{ row }">
                <el-tag v-if="row.status" :type="statusToType[row.status]" class="tag-default">
                    <el-icon v-if="statusToType[row.status] === 'success'" class="tag-icon"><Check /></el-icon>
                    <span v-else-if="statusToType[row.status] === 'primary'" class="tag-icon"><span class="circle"></span></span>
                    <el-icon v-else-if="statusToType[row.status] === 'danger'" class="tag-icon"><Close /></el-icon>
                    <span class="tag-span">{{ statusDict[row.status] }}</span>
                </el-tag>
            </template>
            </el-table-column>
            <el-table-column action class-name="operation-col" :label="$t('wallet.withdrawalRecordsTableLabelActions')" min-width="100" fixed="right">
                <template #default="{ row }">
                <el-link type="primary" @click="jumpToDetail(row)">
                    {{ $t('wallet.actionsDetails') }}
                </el-link>
                </template>
            </el-table-column>
        </pro-table>
    </TableForm>
  </div>
</template>

<style lang="scss" scoped>
@import url("@/assets/css/element-reset/tag.scss");
.table-container {
    margin-bottom: 32px;
}
.circle {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 4px;
    background-color: #6172F3;
    margin: 0 1px 0 3px;
}
.download-wrapper {
  position: relative;
}
// 下载文件
.download-container {
    display: flex;
    align-items: center;
    justify-content: right;
  position: absolute;
  top: -60px;
  right: 12px;
    .rtl & {
        left: 12px;
        right: auto;
        justify-content: left;
    }
  .download-btn {
    color: #443ACC;
    font-family: Inter;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    text-decoration: none;
    .iconfont {
      margin-left: 6px;
    }
  }
  .popover-download-icon {
    display: block;
      line-height: 0;
  }
}
.m {
  .download-container {
    margin-bottom: 24px;
    position: relative;
    top: 0;
    right: 0;
  }
}
</style>
