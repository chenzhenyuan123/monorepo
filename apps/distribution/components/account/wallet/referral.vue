<script setup name="AccountWalletReferral">
import { Check, Search } from '@element-plus/icons-vue';
import { checkResponseData, currencyFormat, arrToDict, previewImg } from "@/util/index.js"
import { formatDate, splitDateRange } from "@/util/dateUtil.js"
import { useI18n } from "vue-i18n";
import {accurate_toFixed, isUseless} from "@flylinking/core/utils/dataUtil";

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
    { value: 3, label: t('wallet.dataCommissionStatusNotEligible'), type: 'warning' }
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
  return isUseless(v) ? '' : (c || 'USD') + ' ' + currencyFormat(v)
}

const formatterRate = (v) => {
  return isUseless(v) ? '' : (accurate_toFixed(v * 100, 2) +'%')
}


// 物流弹窗
const isShowTrackShipmentDialog = ref(false)
const idForTrackShipmentDialog = ref()
const showTrackShipmentDialog = (orderId) => {
    idForTrackShipmentDialog.value = orderId
    isShowTrackShipmentDialog.value = true
}

// 弹窗获取商品信息
const showPopover = async(row) => {
  const result = await clientApi.qrySkuCommissionList({
    orderId: row.orderId
  })
  const res = checkResponseData(result)
  if(res) {
    row.goodsList = res || []
    row.showMore = true
  }
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
            <el-form-item :label="$t('wallet.subReferralFormLabelBuyerEmail')" style="width: 220px;">
              <el-input
                v-model="formData.buyerEmail"
                clearable
                :placeholder="$t('wallet.subReferralFormLabelBuyerEmail')"
                :suffix-icon="Search"
                @keyup.enter.native="query"
                @clear="query"
              />
          </el-form-item>
            <!-- <el-form-item :label="$t('wallet.referralFormLabelProduct')" style="width: 220px;">
                <el-input
                  v-model="formData.goodsName"
                  clearable
                  :placeholder="$t('wallet.referralFormPlaceholderProduct')"
                  :suffix-icon="Search"
                  @keyup.enter.native="query"
                  @clear="query"
                />
            </el-form-item> -->
        </el-form>

        <pro-table
            ref="table"
            :request="request"
            :is-show-empty="true"
        >
            <el-table-column prop="orderId" :label="$t('wallet.referralTableLabelOrderID')" min-width="300">
                <template #default="{ row }">
                  <template v-if="isMobile">{{ row.orderId }}</template>
                  <div v-else class="goods-container">
                      <el-image :src="previewImg(row.mainPicture)" alt="" class="goods-img" fit="contain"></el-image>
                      <div class="flex-center-12"></div>
                      <div class="goods-info">
                          <div class="goods-info-h1" :title="row.goodsTitle">{{ row.goodsTitle }}</div>
                          <div class="goods-info-p">{{ $t('wallet.subReferralTableLabelOrderID') }}: {{ row.orderId }}</div>
                      </div>
                  </div>
                </template>
            </el-table-column>
            <el-table-column prop="orderAmt" :label="$t('wallet.referralTableLabelOrderSubtotal')" min-width="160" align="right">
                <template #default="{ row }">
                    {{ formatterAmount(row.orderAmt, row.orderCurrency) }}
                </template>
            </el-table-column>
            <el-table-column prop="goodsCommissionRate" :label="$t('wallet.referralTableLabelProductCommissionRate')" min-width="160" align="right">
                <template #default="{ row }">
                  <div v-if="row.distributionDetailNumber" class="width100">
                    <div v-if="isMobile">
                      <span class="card-amount tip-trigger-style" @click="showPopover(row)">
                        {{ $t('wallet.referralTableLabelItemInfo',{num: row.distributionDetailNumber}) }}
                      </span>
                      <MoreGoodsList v-if="row.showMore" :dataList="row.goodsList" left="0" @hide="row.showMore=false" />
                    </div>
                    <div v-else>
                      <el-popover
                        placement="bottom-start"
                        effect="light"
                        :width="620"
                        popper-class="popover-dialog goods-popover-box"
                        @show="showPopover(row)"
                      >
                          <div class="statistical-box goods-statistical-box">
                            <MoreGoodsListSkuTable v-if="row.goodsList" :dataList="row.goodsList" />
                          </div>
                          <template #reference>
                            <span class="card-amount tip-trigger-style">
                              {{ $t('wallet.referralTableLabelItemInfo',{num: row.distributionDetailNumber}) }}
                          </span>
                          </template>
                      </el-popover>
                    </div>
                  </div>
                  <div v-else>{{ formatterRate(row.goodsCommissionRate) }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="distributorCommissionRate" :label="$t('wallet.referralTableLabelProgramCommissionRate')" min-width="200" align="right">
                <template #default="{ row }">
                    {{ formatterRate(row.distributorCommissionRate) }}
                </template>
            </el-table-column>
            <el-table-column prop="commission" :label="$t('wallet.referralTableLabelCommissionPayment')" min-width="200" align="right">
                <template #default="{ row }">
                    {{ formatterAmount(row.commission, row.commissionCurrency) }}
                </template>
            </el-table-column>
            <el-table-column prop="settlementCommission" :label="$t('wallet.referralTableLabelCommissionSettlement')" min-width="200" align="right">
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
            <el-table-column prop="buyerEmail" :label="$t('wallet.subReferralFormLabelBuyerEmail')" min-width="180" />
            <el-table-column prop="shippingStatus" :label="$t('wallet.referralTableLabelShippingStatus')" min-width="120">
                <template #default="{ row }">
                    <el-link type="primary" @click="showTrackShipmentDialog(row.orderId)">{{ $t('wallet.dataShippingStatus') }}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="commissionStatus" tag :label="$t('wallet.referralTableLabelState')" min-width="120">
              <template #default="{ row }">
                  <el-tag v-if="row.commissionStatus" :type="commissionStatusToType[row.commissionStatus]" class="tag-default">
                      <el-icon v-if="row.commissionStatus === 1" class="tag-icon"><Check /></el-icon>
                      <span v-else-if="row.commissionStatus === 2" class="tag-icon"><span class="circle"></span></span>
                      <span class="tag-span">{{ commissionStatusDict[row.commissionStatus] }}</span>
                  </el-tag>
              </template>
            </el-table-column>
          <el-table-column prop="estimatedSettlementDate" :label="$t('wallet.referralTableLabelEstimatedCommissionPostingDate')" min-width="200">
            <template #header="scope">
              <el-popover
                placement="top"
                effect="dark"
                :width="300"
                popper-class="popper-1778494207979"
              >
                <div>
                  <div>{{ $t('wallet.referralTableLabelTipEstimatedDateP1') }}</div>
                  <div><span class="red-span">-</span> {{ $t('wallet.referralTableLabelTipEstimatedDateP2Part1') }}<span class="red-span">{{ $t('wallet.referralTableLabelTipEstimatedDateP2Part2') }}</span>{{ $t('wallet.referralTableLabelTipEstimatedDateP2Part3') }}</div>
                  <div><span class="red-span">-</span> {{ $t('wallet.referralTableLabelTipEstimatedDateP3Part1') }}<span class="red-span">{{ $t('wallet.referralTableLabelTipEstimatedDateP3Part2') }}</span>{{ $t('wallet.referralTableLabelTipEstimatedDateP3Part3') }}</div>
                </div>
                <template #reference>
                  <div>{{ scope.column.label }}</div>
                </template>
              </el-popover>
            </template>
            <template #default="{ row }">
              <span class="direction-ltr direction-inline-block">{{ row.estimatedSettlementDate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="settlementDate" :label="$t('wallet.referralTableLabelActualCommissionPostingDate')" min-width="200">
            <template #header="scope">
              <el-popover
                placement="top"
                effect="dark"
                :width="300"
                popper-class="popper-1778494207979"
              >
                <div>{{ $t('wallet.referralTableLabelTipActualDateP') }}</div>
                <template #reference>
                  <div>{{ scope.column.label }}</div>
                </template>
              </el-popover>
            </template>
            <template #default="{ row }">
              <span class="direction-ltr direction-inline-block">{{ row.settlementDate }}</span>
            </template>
          </el-table-column>
        </pro-table>

        <AccountWalletTrackShipmentDialog
          v-if="isShowTrackShipmentDialog"
          v-model="isShowTrackShipmentDialog"
          :orderId="idForTrackShipmentDialog"
        ></AccountWalletTrackShipmentDialog>
    </TableForm>
</template>

<style lang="scss">
  @use "@/assets/css/element-reset/popover.scss" as *;
</style>

<style lang="scss" scoped>
@import url("@/assets/css/element-reset/tag.scss");
.table-container {
    margin-bottom: 32px;
}
.red-span {
  color: #D92D20;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  &.fw500 {
    font-weight: 500;
  }
  &.f16 {
    font-size: 16px;
    line-height: 24px;
  }
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
.position-fixed {
  position: fixed;
}
.card-amount {
    color: #475467;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    letter-spacing: -0.72px;
    direction: ltr;
    font-family: Inter;
    &.tip-trigger-style {
        text-decoration-line: underline;
        text-decoration-style: dotted;
        text-decoration-skip-ink: none;
        text-decoration-thickness: 10.5%;
        text-underline-offset: 25%;
        text-underline-position: from-font;
        &:hover {
        text-decoration-style: solid;
        text-decoration-skip-ink: none;
        }
    }
}

.goods-statistical-box {
  border-radius: 8px;
  overflow: hidden;
}
.goods-popover-title {
  font-family: Inter;
  font-size: 14px;
  line-height: 20px;
  display: -webkit-box;
  display: box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制显示的行数为2 */
  overflow-wrap: anywhere;
}
.goods-pro-table {
  max-height: 400px;
  overflow-y: auto;
  :deep(tr) {
      th.el-table__cell{
          background-color: #F9FAFB;
      }
  }
  ::v-deep {
      .pro-table-wrapper {
          border-radius: 8px;
      }
  }
}
.width100 {
    flex-shrink: 0;
    width: 100%;
}
</style>
