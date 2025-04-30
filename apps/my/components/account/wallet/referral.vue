<script setup name="AccountWalletReferral">
import { Check, Search } from '@element-plus/icons-vue';
import { checkResponseData, isEMpty, currencyFormat, arrToDict, previewImg } from "@/util/index.js"
import { formatDate, splitDateRange } from "@/util/dateUtil.js"
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { clientApi } = useApi()
const isMobile = useIsMobile()
const dialogVisible = ref(false)
const currentRow = ref(null) // 当前操作的表格行
const table = ref(null)
const formData = reactive({
    commissionType: 1
})
const dataRange = computed({
    // getter
    get() {
        return [formData.createTimeStr, formData.createTimeEnd]
    },
    // setter
    set(newValue) {
        splitDateRange(newValue, formData, 'createTimeStr', 'createTimeEnd')
    }
})
const commissionStatusData = computed(() => {
  return [
    { value: 1, label: t('wallet.dataCommissionStatusConfirmed'), type: 'success' },
    { value: 2, label: t('wallet.dataCommissionStatusPending'), type: 'primary' },
  ]
})
const commissionStatusDict = computed(() => {
  return arrToDict(commissionStatusData.value)
})
const commissionStatusToType = computed(() => {
  return arrToDict(commissionStatusData.value, { label: 'type' })
})

const hasTableData = ref(false)
const reload = () => table.value.reload()
const query = () => table.value.query()

// 获取表格数据
const request = async({ pageNo, pageSize }) => {
  const result = await clientApi.orders_listPage({
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
</script>

<template>
    <TableForm class="table-container" :is-empty="!hasTableData">
        <el-form v-if="!isMobile && hasTableData" ref="formRef" :model="formData" :inline="true" label-position="top" novalidate>
            <el-form-item :label="$t('wallet.referralFormLabelPurchaseDate')" style="width: 280px;">
                <el-date-picker
                  v-model="dataRange"
                  type="daterange"
                  format="YYYY-MM-DD"
                  range-separator="~"
                  :start-placeholder="$t('wallet.referralFormPlaceholderPurchaseDateStart')"
                  :end-placeholder="$t('wallet.referralFormPlaceholderPurchaseDateEnd')"
                  @change="query"
                />
            </el-form-item>
            <el-form-item :label="$t('wallet.referralFormLabelOrderNumber')" style="width: 255px;">
                <el-input
                  v-model="formData.orderId"
                  clearable
                  :placeholder="$t('wallet.referralFormPlaceholderOrderNumber')"
                  :suffix-icon="Search"
                  @keyup.enter.native="query"
                  @clear="query"
                />
            </el-form-item>
            <el-form-item :label="$t('wallet.referralFormLabelPaymentStatus')" style="width: 200px;">
                <el-select
                  v-model="formData.commissionStatus"
                  clearable
                  :placeholder="$t('wallet.referralFormPlaceholderPaymentStatus')"
                  @change="query"
                >
                    <el-option v-for="item in commissionStatusData" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('wallet.referralFormLabelStore')" style="width: 220px;">
                <el-input
                  v-model="formData.storeName"
                  clearable
                  :placeholder="$t('wallet.referralFormPlaceholderStore')"
                  :suffix-icon="Search"
                  @keyup.enter.native="query"
                  @clear="query"
                />
            </el-form-item>
            <el-form-item :label="$t('wallet.referralFormLabelProduct')" style="width: 220px;">
                <el-input
                  v-model="formData.goodsName"
                  clearable
                  :placeholder="$t('wallet.referralFormPlaceholderProduct')"
                  :suffix-icon="Search"
                  @keyup.enter.native="query"
                  @clear="query"
                />
            </el-form-item>
        </el-form>

        <pro-table
            ref="table"
            :request="request"
            :is-show-empty="true"
        >
            <el-table-column prop="orderId" :label="$t('wallet.referralTableLabelOrderID')" min-width="536">
                <template #default="{ row }">
                    <template v-if="isMobile">{{ row.orderId }}</template>
                    <div v-else class="goods-container">
                        <el-image :src="previewImg(row.mainPicture)" alt="" class="goods-img" fit="contain"></el-image>
                        <div class="goods-info">
                            <div class="goods-info-h1" :title="row.goodsName">{{ row.goodsName }}</div>
                            <div class="goods-info-p">{{ $t('wallet.referralTableLabelOrderID') }}: {{ row.orderId }}</div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="orderAmt" :label="$t('wallet.referralTableLabelOrderSubtotal')" min-width="300" align="right">
                <template #default="{ row }">
                    {{ formatterAmount(row.orderAmt, row.orderCurrency) }}
                </template>
            </el-table-column>
            <el-table-column prop="commission" :label="$t('wallet.referralTableLabelCommissionPayment')" min-width="300" align="right">
                <template #default="{ row }">
                    {{ formatterAmount(row.commission, row.commissionCurrency) }}
                </template>
            </el-table-column>
            <el-table-column prop="commission" :label="$t('wallet.referralTableLabelCommissionSettlement')" min-width="300" align="right">
                <template #default="{ row }">
                    {{ formatterAmount(row.settlementCommission, row.settlementCommissionCurrency) }}
                </template>
            </el-table-column>
            <el-table-column prop="storeName" :label="$t('wallet.referralTableLabelStore')" min-width="160" align="right" />
            <el-table-column prop="storeId" :label="$t('wallet.referralTableLabelStoreID')" min-width="160" align="right" />
            <el-table-column prop="purchaseTime" :label="$t('wallet.referralTableLabelDatetimeOfPurchase')" min-width="200">
                <template #default="{ row }">
                    <span class="direction-ltr direction-inline-block">{{ formatDate(row.purchaseTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="commissionStatus" tag :label="$t('wallet.referralTableLabelState')" min-width="200">
            <template #default="{ row }">
                <el-tag v-if="row.commissionStatus" :type="commissionStatusToType[row.commissionStatus]" class="tag-default">
                    <el-icon v-if="row.commissionStatus === 1" class="tag-icon"><Check /></el-icon>
                    <span v-else-if="row.commissionStatus === 2" class="tag-icon"><span class="circle"></span></span>
                    <span class="tag-span">{{ commissionStatusDict[row.commissionStatus] }}</span>
                </el-tag>
            </template>
            </el-table-column>
        </pro-table>
    </TableForm>
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
.goods-container {
    display: flex;
    align-items: center;
    .goods-img {
        width: 40px;
        height: 40px;
        min-width: 40px;
        min-height: 40px;
        border-radius: 4px;
        background: lightgray 50% / cover no-repeat;
        margin-right: 12px;
    }
    .goods-info {
        .goods-info-h1 {
            width: 436px;
            color: #101828;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: 20px; /* 142.857% */
        }
        .goods-info-p {
            color: #475467;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px; /* 142.857% */
        }
    }
}
</style>
