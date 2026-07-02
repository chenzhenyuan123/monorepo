<script setup name="UsageHistoryList">
import { Check, Close } from '@element-plus/icons-vue';
import { checkResponseData, currencyFormat, arrToDict } from "@/util/index.js"
import { formatDate, splitDateRange } from "@/util/dateUtil.js"
const { myCouponsApi } = useApi()
import { useI18n } from "vue-i18n";
const { t } = useI18n()

const router = useRouter()
const isMobile = useIsMobile()

const table = ref(null)
const formData = reactive({})
const loading = ref(false)
const statusData = computed(() => {
  return [
    { value: 'SUCCESS', label: t('MyCoupons.status1'), type: 'success' },
    { value: 'WITHDRAWING', label: t('MyCoupons.status2'), type: 'primary' },
    { value: 'FAIL', label: t('MyCoupons.status3'), type: 'danger' }
  ]
})
const statusDataDesc = computed(() => {
  return [
    { value: 'ISSUE_SUCCESS', label: t('MyCoupons.status1'), type: 'success' },
    { value: 'WITHDRAWING', label: t('MyCoupons.status2'), type: 'primary' },
    { value: 'WITHDRAW_ACCEPT_SUCCESS', label: t('MyCoupons.status2'), type: 'primary' },
    { value: 'ISSUING', label: t('MyCoupons.status2'), type: 'primary' },
    { value: 'ISSUE_ACCEPT_SUCCESS', label: t('MyCoupons.status2'), type: 'primary' },
    { value: 'ISSUE_SUCCESS_RETURN', label: t('MyCoupons.status3'), type: 'danger' },
    { value: 'ISSUE_FAIL', label: t('MyCoupons.status3'), type: 'danger' },
    { value: 'ISSUE_ACCEPT_FAIL', label: t('MyCoupons.status3'), type: 'danger' },
    { value: 'WITHDRAW_ACCEPT_FAIL', label: t('MyCoupons.status3'), type: 'danger' }
  ]
})
const statusDict = computed(() => {
  return arrToDict(statusDataDesc.value)
})
const statusToType = computed(() => {
  return arrToDict(statusDataDesc.value, { label: 'type' })
})

const dataRange = computed({
  get() {
      return [formData.startApplyTime, formData.endApplyTime]
  },
  set(newValue) {
      splitDateRange(newValue, formData, 'startApplyTime', 'endApplyTime')
  }
})

const hasTableData = ref(false) // 是否显示表格数据
const reload = () => table.value.reload()
const query = () => table.value.query()

// 获取表格数据
const request = async({ pageNo, pageSize }) => {
  loading.value = true
  const result = await myCouponsApi.couponListUsageHistoryPage({
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
  loading.value = false
}

const totalCouponData = ref({}) // 数据统计
// 获取优惠券列表
const getCouponStatCoupon = async() => {
  const result = await myCouponsApi.couponStatCoupon()
  const res = checkResponseData(result)
  if(res) {
    totalCouponData.value = res
  } else {
    totalCouponData.value = {
      totalCouponNumber: 0
    }
  }
  loading.value = false
}

onMounted(()=>{
  getCouponStatCoupon()
})
</script>

<template>
  <div class="MyCoupons-UsageHistory">
    <!-- 使用数量>0时展示页面，否则展示暂无数据 -->
    <div v-if="totalCouponData.totalCouponNumber>0">
      <div class="mt32 mb32">
        <ul class="UsageHistory-total flex justify-between gap24">
          <li>
            <p class="text">{{$t('MyCoupons.UsedTotal')}}</p>
            <div class="flex card-amount-box num">
              <span class="card-amount num">
                {{totalCouponData.totalCouponNumber || 0}}
              </span>
            </div>
          </li>
          <li>
            <p class="text">{{$t('MyCoupons.UsedAmount')}}</p>
            <div class="flex card-amount-box num">
              <b class="card-amount-curreny">≈ USD</b>
              <div class="flex-center-6"></div>
              <span class="card-amount num">
                {{ currencyFormat(totalCouponData.totalCouponAmount) }}
              </span>
              <div class="flex-center-6"></div>
              <el-popover
                placement="top"
                effect="dark"
                :width="309"
                :content="$t('MyCoupons.UsedAmountTips')"
                popper-class="popover-download"
              >
                <template #reference>
                  <div class="popover-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" class="mirror-x-icon">
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
          </li>
        </ul>
      </div>
      <div class="UsageHistory-tips mb16">
        <h3>{{$t('invitation.history')}}</h3>
        <p>{{$t('MyCoupons.UsageHistoryTips')}}</p>
      </div>
      <TableForm class="table-container" :is-empty="!hasTableData" :loading="loading">
          <el-form v-if="!isMobile && hasTableData" ref="formRef" :model="formData" :inline="true" label-position="top" novalidate>
              <el-form-item :label="$t('MyCoupons.Datetime')" style="width: 280px;">
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
              <el-form-item :label="$t('MyCoupons.State')" style="width: 200px;">
                  <el-select
                    v-model="formData.status"
                    clearable
                    :placeholder="$t('MyCoupons.State')"
                    @change="query"
                  >
                      <el-option v-for="item in statusData" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
              </el-form-item>
          </el-form>

          <pro-table
              ref="table"
              :request="request"
              :is-show-empty="true"
          >
              <el-table-column prop="withdrawNo" :label="$t('MyCoupons.No')" min-width="220" />
              <el-table-column prop="applyTime" :label="$t('MyCoupons.Datetime')" min-width="200">
                  <template #default="{ row }">
                      <span class="direction-ltr direction-inline-block">{{ formatDate(row.applyTime) }}</span>
                  </template>
              </el-table-column>
              <el-table-column prop="applyAmt" :label="$t('MyCoupons.WithdrawalAmount')" min-width="160" align="right">
                  <template #default="{ row }">
                      {{ row.accountCurrency }} {{ currencyFormat(row.applyAmt) }}
                  </template>
              </el-table-column>
              <el-table-column prop="deductionFeeAmt" :label="$t('MyCoupons.DeductedFee')" min-width="160" align="right">
                  <template #default="{ row }">
                      {{ row.accountCurrency }} {{ currencyFormat(row.deductionFeeAmt) }}
                  </template>
              </el-table-column>
              <el-table-column prop="withdrawFee" :label="$t('MyCoupons.WithdrawalFee')" min-width="140" align="right">
                  <template #default="{ row }">
                      {{ row.accountCurrency }} {{ currencyFormat(row.withdrawFee) }}
                  </template>
              </el-table-column>
              <el-table-column prop="discountNumber" :label="$t('MyCoupons.FeeDiscount')" min-width="120" align="right">
                  <template #default="{ row }">
                      {{ row.discountNumber}}%
                  </template>
              </el-table-column>
              <el-table-column prop="statusDesc" tag :label="$t('MyCoupons.State')" min-width="120">
                <template #default="{ row }">
                  <el-tag :type="statusToType[row.status]" class="tag-default">
                    <el-icon v-if="statusToType[row.status] === 'success'" class="tag-icon"><Check /></el-icon>
                    <span v-else-if="statusToType[row.status] === 'primary'" class="tag-icon"><span class="circle"></span></span>
                    <el-icon v-else-if="statusToType[row.status] === 'danger'" class="tag-icon"><Close /></el-icon>
                    <span class="tag-span">{{ statusDict[row.status] }}</span>
                  </el-tag>
                </template>
              </el-table-column>
          </pro-table>
      </TableForm>
    </div>

    <!-- 暂无数据时展示 -->
    <div v-else-if="totalCouponData.totalCouponNumber===0" class="mt32">
      <EmptyData noDataTitle="MyCoupons.NoCouponUsageHistory" noDataText="MyCoupons.NoCouponTips" iconType="Search" />
    </div>

    <!-- 进入页面加loadding骨架屏 -->
    <div v-else>      
      <el-skeleton animated>
        <template #template>
          <ul class="UsageHistory-total flex justify-between gap24 mt32">
            <li>
              <el-skeleton-item variant="h1" class="mb16" />
              <el-skeleton-item variant="text" />
            </li>
            <li>
              <el-skeleton-item variant="h1" class="mb16" />
              <el-skeleton-item variant="text" />
            </li>
          </ul>
          <div class="UsageHistory-tips mt32">
            <el-skeleton-item variant="h3" class="mb16" />
            <el-skeleton-item variant="text" />
          </div>
        </template>
      </el-skeleton>
    </div>
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
.UsageHistory-total {
  width: 100%;
  li {
    width: calc(50% - 24px);
    padding: 24px;
    border-radius: var(--radius-xl, 12px);
    border: 1px solid var(--Colors-Border-border-secondary, #E4E7EC);
    background: var(--Colors-Background-bg-primary, #FFF);
    box-shadow: 0 1px 2px 0 var(--Colors-Effects-Shadows-shadow-xs, rgba(16, 24, 40, 0.05));
    
    .card-amount-box {
      align-items: baseline;
      .card-amount-curreny {
        color: var(--colors-text-text-primary-900, #101828);
        font-family: var(--Font-family-font-family-display, Inter);
        font-size: var(--Font-size-text-md, 16px);
        line-height: var(--Line-height-text-sm, 20px);
        font-weight: 600;
      }
      .popover-icon svg {
        width: 20px;
        margin-bottom: -1px;
      }
    }
    .num {
      color: var(--colors-text-text-primary-900, #101828);
      font-family: var(--Font-family-font-family-display, Inter);
      font-size: var(--Font-size-display-sm, 30px);
      line-height: var(--Line-height-text-sm, 20px);
      font-weight: 600;
    }
    .text {
      color: var(--colors-text-text-tertiary-600, #475467);
      font-family: var(--Font-family-font-family-body, Inter);
      font-size: var(--Font-size-text-sm, 14px);
      font-weight: 500;
      line-height: var(--Line-height-text-sm, 20px);
      margin-bottom: 8px;
    }
  }
}
.UsageHistory-tips {
  h3 {
    margin-bottom: 4px;
    color: var(--colors-text-text-primary-900, #101828);
    font-family: var(--Font-family-font-family-body, Inter);
    font-size: var(--Font-size-text-lg, 18px);
    font-weight: 600;
    line-height: var(--Line-height-text-lg, 28px);
  }
  p {
    color: var(--colors-text-text-tertiary-600, #475467);
    font-family: var(--Font-family-font-family-body, Inter);
    font-size: var(--Font-size-text-md, 16px);
    line-height: var(--Line-height-text-md, 24px);
  }
}
.m {
  .UsageHistory-total {
    li {
      padding: 12px;
      .card-amount-box {
        .card-amount-curreny {
          font-size: var(--Font-size-text-xs, 12px);
        }
        .popover-icon svg {
          width: 14px;
          margin-bottom: -4px;
        }
      }
      .num {
        font-size: var(--Font-size-text-xl, 20px);
      }
      .text {
        font-size: var(--Font-size-text-xs, 12px);
      }
    }
  }
}
.mt32 {
  margin-top: 32px;
}
</style>
