<!--
 * @Description: 有退款时展示
-->
<script setup>
import { currencyFormat, copyToClipboard, successMessage } from "@/util/index.js";
import { formatDate } from "@flylinking/core/utils/dateUtil"
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const isMobile = useIsMobile()

const props = defineProps({
  refundList: { // 退款数据
    type: Array,
    default: () => []
  }
})
const showRAN = ref(false)
// ARN查看
const ARNclick = () => {
  showRAN.value = true
}
// 复制
function copyStr(str) {
  if (str) {
    const isCopy = copyToClipboard(str)
    if (isCopy) {
      successMessage(t('invitation.inviteDialogButtonCopied'))
      return true
    }
  }
}
</script>

<template>
  <div v-if="refundList.length" class="order-detail-refund-box">
    <div class="header header-title">{{$t('orders.refundHistory')}}</div>
    <div class="order-detail-refund-content">
      <!-- 退款信息循环 -->
      <div class="mb16" v-for="item in refundList" :key="item.refundOrderId">
        <div class="order-detail-refund-title flex items-center gap4">
          <span>{{$t('orders.refundAmount')}}:</span>
          <span class="amount">{{ item.refundCurrency }} {{currencyFormat( item.refundAmount )}}</span>
        </div>
        <div class="margin-top" :class="{'flex items-center': !isMobile}">
          <div class="payWith">{{ item.payMethod }} ...{{ item.cardLast4 }}</div>
          <div v-if="!isMobile" class="vertical" />
          <div class="flex items-center gap4" :class="{'margin-top': isMobile}">
            <span>ARN: {{ item.arn || $t('orders.refundNotAvailable')}}</span>
            <span v-if="item.arn" class="copy-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="mt2" @click="copyStr(item.arn)">
                <path d="M5 2H9.73333C11.2268 2 11.9735 2 12.544 2.29065C13.0457 2.54631 13.4537 2.95426 13.7094 3.45603C14 4.02646 14 4.77319 14 6.26667V11M4.13333 14H9.53333C10.2801 14 10.6534 14 10.9387 13.8547C11.1895 13.7268 11.3935 13.5229 11.5213 13.272C11.6667 12.9868 11.6667 12.6134 11.6667 11.8667V6.46667C11.6667 5.71993 11.6667 5.34656 11.5213 5.06135C11.3935 4.81046 11.1895 4.60649 10.9387 4.47866C10.6534 4.33333 10.2801 4.33333 9.53333 4.33333H4.13333C3.3866 4.33333 3.01323 4.33333 2.72801 4.47866C2.47713 4.60649 2.27316 4.81046 2.14532 5.06135C2 5.34656 2 5.71993 2 6.46667V11.8667C2 12.6134 2 12.9868 2.14532 13.272C2.27316 13.5229 2.47713 13.7268 2.72801 13.8547C3.01323 14 3.3866 14 4.13333 14Z" stroke="#667085" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
        <div class="margin-top">{{$t('orders.refundTime')}}: {{formatDate(item.refundTime)}} (UTC+8)</div>
      </div>
      <div class="order-detail-refund-fotter">
        <div class="text">
          <i18n-t keypath="orders.refundTips1" tag="span">
            <template #highlight1>
              <span class="highlight">{{$t('orders.refundTips2')}}</span>
            </template>
            <template #highlight2>
              <span class="highlight">{{$t('orders.refundTips3')}}</span>
            </template>
          </i18n-t>               
        </div>
        <div class="mt4 btn">
          <el-link type="primary" :underline="false" @click="ARNclick()">
            {{$t('orders.refundTips6')}}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="ml4">
              <g clip-path="url(#clip0_9582_68698)">
                <path d="M6.05992 5.99998C6.21665 5.55442 6.52602 5.17872 6.93322 4.9394C7.34042 4.70009 7.81918 4.6126 8.2847 4.69245C8.75022 4.7723 9.17246 5.01433 9.47664 5.37566C9.78081 5.737 9.94729 6.19433 9.94658 6.66665C9.94658 7.99998 7.94658 8.66665 7.94658 8.66665M7.99992 11.3333H8.00659M14.6666 7.99998C14.6666 11.6819 11.6818 14.6666 7.99992 14.6666C4.31802 14.6666 1.33325 11.6819 1.33325 7.99998C1.33325 4.31808 4.31802 1.33331 7.99992 1.33331C11.6818 1.33331 14.6666 4.31808 14.6666 7.99998Z" stroke="#5548FF" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_9582_68698">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </el-link>                
        </div>
      </div>
    </div>
    
    <!-- RAN说明-->
    <OrderARNDialog v-if="showRAN" v-model="showRAN" />
  </div>
</template>

<style lang="scss" scoped>
// 退款详情样式
.order-detail-refund-box {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 24px;
  .header-title {
    overflow: hidden;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--Colors-Border-border-secondary, #E4E7EC);
    color: var(--colors-text-text-primary-900, #101828);
    text-overflow: ellipsis;
    font-family: var(--Font-family-font-family-body, Inter);
    font-size: var(--Font-size-text-lg, 18px);
    font-style: normal;
    font-weight: 600;
    line-height: var(--Line-height-text-lg, 28px);
  }
  .order-detail-refund-content {
    padding: 16px 20px;
    color: var(--colors-text-text-tertiary-600, #475467);
    font-family: var(--Font-family-font-family-body, Inter);
    font-size: var(--Font-size-text-sm, 14px);
    font-weight: 400;
    line-height: var(--Line-height-text-sm, 20px);
    .margin-top {
      margin-top: 8px;
    }
    .order-detail-refund-title {
      color: var(--colors-text-text-primary-900, #101828);
      font-family: var(--Font-family-font-family-body, Inter);
      font-size: var(--Font-size-text-md, 16px);
      font-weight: 600;
      line-height: var(--Line-height-text-md, 24px);
      .amount {
        font-family: var(--font-family-Number, "IBM Plex Sans Condensed");
      }
    }
    .payWith {
      color: var(--colors-text-text-primary-900, #101828);
      font-size: 14px;
    }
    .vertical {
      width: 1px;
      height: 14px;
      background: var(--colors-text-text-tertiary-600, #475467);
      margin: 0px 12px;
    }
    .copy-btn {
      cursor: pointer;
      height: 20px;
      svg {
        color: #667085;
        &:hover {
          color: #5548FF;
        }
      }
    }
    .order-detail-refund-fotter {
      border-top: 1px solid #E4E7EC;
      padding-top: 16px;
      .btn .el-link {
        color: var(--Text-Primary, #5548FF);
        font-size: var(--Font-size-text-xs, 14px);
        font-style: normal;
        font-weight: 600;
      }
    }
  }
}
.m .order-detail-refund-box {
  margin-bottom: 16px;
  .header-title {
    font-size: 16px;
  }
  .order-detail-refund-content {
    font-size: 12px;
    .margin-top {
      margin-top: 4px;
    }
    .order-detail-refund-title {
      font-size: 14px;
    }
    .order-detail-refund-fotter {
      .btn .el-link {
        font-size: 12px;
        font-weight: 500;
        svg {
          width: 14px;
        }
      }
    }
  }
}
// 高亮色
.highlight {
  color: var(--Colors-Text-text-brand-tertiary_alt, #5548FF);
}
</style>
