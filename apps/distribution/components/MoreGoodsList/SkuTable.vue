<!--
 * @Author: czy
 * @Description: 多sku列表
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
  }
})

const isMobile = useIsMobile()
const formatterAmount = (v, c) => {
  return isUseless(v) ? '' : (c || 'USD') + ' ' + currencyFormat(v)
}

const formatterRate = (v) => {
  return isUseless(v) ? '' : (accurate_toFixed(v * 100, 2) +'%')
}

const getClassName = () => {
  return isMobile ? 'goods-Mobile-box' : ''
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
      <el-table-column prop="goodsTitle" :label="$t('wallet.referralTableLabelProductName')" min-width="250" :class-name="isMobile ? {'goods-Mobile-box': isMobile} : ''">
          <template #default="{ row }">
              <div class="goods-container">
                <el-image :src="previewImg(row.mainPicture)" alt="" class="goods-img" fit="contain"></el-image>
                <div class="flex-center-12"></div>
                <div class="goods-info">
                    <div class="goods-info-h1" :title="row.goodsTitle">{{ row.goodsTitle }}</div>
                    <div v-if="!isMobile" class="goods-info-p">{{$t('orders.ordersSkuCode')}}: {{ row.skuId }}</div>
                    <div v-if="!isMobile" class="goods-info-p"><span v-html="row.skuDesc"></span></div>
                </div>
            </div>
          </template>
      </el-table-column>
      <el-table-column v-if="isMobile" prop="skuId" label="SKU" min-width="100">
        <template #default="{ row }">
          {{ row.skuId }}
        </template>
      </el-table-column>
      <el-table-column v-if="isMobile" prop="skuDesc" :label="$t('wallet.referralTableLabelVariant')" min-width="100">
        <template #default="{ row }">
          <span v-html="row.skuDesc"></span>
        </template>
      </el-table-column>
      <el-table-column prop="goodsCommissionRate" :label="$t('wallet.referralTableLabelProductCommissionRate')" min-width="100" align="right">
          <template #default="{ row }">
            {{ formatterRate(row.goodsCommissionRate) }}
          </template>
      </el-table-column>
      <el-table-column prop="commissionAmt" :label="$t('wallet.referralTableLabelCommissionPayment')" min-width="140" align="right">
          <template #default="{ row }">
              {{ formatterAmount(row.commissionAmt, row.paymentCurrency) }}
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
</style>