<!--
 * @Author: czy
 * @Description: 分销员佣金列表
-->
<script setup>
import { checkResponseData, currencyFormat, arrToDict, previewImg } from "@/util/index.js"
import { accurate_toFixed, isUseless } from "@flylinking/core/utils/dataUtil";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  dataList: {
    type: Array,
    default: () => ([])
  },
  type: {
    type: String,
    default: 'payment'
  }
})

const formatterAmount = (v, c) => {
  return isUseless(v) ? '' : (c || 'USD') + ' ' + currencyFormat(v)
}

</script>
<template>
  <pro-table
      :requestOnMounted="false"
      :showPagination="false"
      class="goods-pro-table"
      :tableData="dataList"
      :max-height="400"
  >
      <el-table-column prop="userNo" :label="$t('wallet.subReferralTableLabelDistributorID')" min-width="120">
        <template #default="{ row }">
          {{ row.userNo }}
        </template>
      </el-table-column>
      <el-table-column prop="userEmail" :label="$t('wallet.subReferralTableLabelDistributor')" min-width="140">
        <template #default="{ row }">
          {{ row.userEmail }}
        </template>
      </el-table-column>
      <el-table-column v-if="type==='payment'" prop="commissionAmt" :label="$t('wallet.subReferralTableLabelCommissionPayment')" min-width="160" align="right">
          <template #default="{ row }">
            {{ formatterAmount(row.commissionAmt, row.paymentCurrency) }}
          </template>
      </el-table-column>
      <el-table-column v-if="type==='settlement'" prop="settlementCommission" :label="$t('wallet.subReferralTableLabelCommissionSettlement')" min-width="160" align="right">
          <template #default="{ row }">
            {{ formatterAmount(row.settlementCommission, row.settlementCommissionCurrency) }}
          </template>
      </el-table-column>
  </pro-table>
</template>

<style lang="scss" scoped>
.goods-container {
  display: flex;
  width: 100%;
  .goods-img {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    border-radius: 4px;
    background: lightgray 50% / cover no-repeat;
  }
  .goods-info {
    width: calc(100% - 52px);
    .goods-info-h1 {
      color: #101828;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px; /* 142.857% */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .goods-info-p {
      color: #475467;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 142.857% */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 4px;
    }
  }
}
.goods-pro-table {
  ::v-deep {
    .pro-table-wrapper {
      border-radius: 8px;
    }
  }
}
</style>