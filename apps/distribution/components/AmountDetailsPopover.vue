<script setup>
import { flagUrl } from '@/util/dataUtil'
import { currencyFormat } from "@/util/index.js"
import { useI18n } from "vue-i18n"
const { t } = useI18n()
const isMobile = useIsMobile()

const props = defineProps({
  disabled: { // 是否禁用
    type: Boolean,
    default: true
  },
  pendingCommissionDetailList: {// 佣金金额数据列表数组
    type: Array,
    default: () => []
  },
  currencyToCountryId: { // 货币到国家ID的映射对象
    type: Object,
    default: () => ({})
  },
  i18nLabelDesc: { // 国际化文案1-描述
    type: String,
    default: 'home.pendingCommissionDetailLabelDesc'
  },
  statusType: { // 国际化文案2-状态
    type: String,
    default: 'home.pendingCommissionDetailLabelNonUSD'
  }
})

const formatterAmount = (v, c) => {
  return (c || 'USD') + ' ' + currencyFormat(v)
}

// 判断是否是第一个非USD项
const isFirstNonUSD = (index) => {
  return props.pendingCommissionDetailList.findIndex(item => item.currency !== 'USD') === index
}
</script>

<template>
  <el-popover
    placement="bottom-start"
    effect="light"
    :width="480"
    popper-class="popover-dialog"
    :disabled="!disabled"
  >
    <div class="amount-details-popover-box" :class="{ m: isMobile }">
      <div v-for="(item, index) in pendingCommissionDetailList" :key="item.currency">
        <div v-if="item.currency==='USD'" class="flex justify-between mb12">
          <div class="amount-details-text">{{ $t('home.PendingUSDCommission', {type: $t(`home.SettledStatus${statusType}`)}) }}</div>
          <div class="txt-right amount-currency">{{ formatterAmount(item.amount || item.commissionAmount, item.currency) }}</div>
        </div>
        <div v-else class="flex justify-between">
          <div class="amount-details-text"><span v-if="isFirstNonUSD(index)">{{ $t('home.PendingNonUSDCommission', {type: $t(`home.SettledStatus${statusType}`)}) }}</span></div>
          <div class="mb12">
            <div class="txt-right amount-currency">{{ formatterAmount(item.amount || item.commissionAmount, item.currency) }}</div>
            <div class="txt-right amount-USD">(≈ {{ formatterAmount(item.amountUsd || item.estimatedUSDAmount, 'USD') }})</div>
          </div>
        </div>
      </div>
      <div class="statistical-p">
        <span v-if="statusType==='Pending'">{{ $t(i18nLabelDesc) }}</span>
        <span v-else>{{ $t(i18nLabelDesc, {type: $t(`home.SettledStatus${statusType}`)}) }}</span>
      </div>
    </div>
    <template #reference>
      <slot />
    </template>
  </el-popover>
</template>

<style lang="scss" scoped>
@use "@/assets/css/home/statistical-box.scss" as *;

.tip-trigger-style {
  text-decoration-line: underline;
  text-decoration-style: dotted;
  text-decoration-skip-ink: auto;
  text-decoration-color: #667085;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: under;
}
</style>
