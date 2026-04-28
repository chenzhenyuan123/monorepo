<script setup>
import { Back } from '@element-plus/icons-vue'
import { useSettingStore } from '@/store/settingState.js'
import { useI18n } from "vue-i18n";
import {currencyFormat} from "@flylinking/core/utils/dataUtil";
import {formatDate} from "@flylinking/core/utils/dateUtil";

const { t } = useI18n();
const { userApi } = useApi()
const settingStore = useSettingStore()
const router = useRouter()
const route = useRoute()
const isMobile = useIsMobile()

const isSuccess = ref(route.query.success === '1')
const withdrawNo = ref(route.query.withdrawNo)
const currency = ref(route.query.currency)
const estPaymentAmt = ref(route.query.estPaymentAmt)
const applyWithdrawTime = ref(Number(route.query.applyWithdrawTime))


const jumpToWallet = () => {
    router.push({
        path: '/account/wallet'
    })
}

onMounted(()=>{
    nextTick(() => {
        settingStore.setFormPage(true)
      settingStore.setFullPage(true)
    })
})

onUnmounted(()=>{
    settingStore.setFormPage(false)
  settingStore.setFullPage(false)
})
</script>

<template>
  <div :class="{ 'page': true, 'm': isMobile }">
    <div v-if="isSuccess" key="success" class="content">
      <div class="icon-container"><img src="@/assets/imgs/check-circle.svg" alt=""></div>
      <div
        class="black-span fw600 mb16"
        :class="[isMobile ? 'f24' : 'f30']"
      >{{ $t('withdraw.resultSuccessTitle') }}</div>
      <div class="tertiary-span f16">{{ $t('withdraw.resultSuccessP') }}</div>
      <div v-if="withdrawNo" class="tertiary-span f16 mt16">{{ $t('withdrawResult.labelWithdrawNo') }} {{ withdrawNo }}</div>
      <template v-if="currency && estPaymentAmt">
        <div class="tertiary-span mt48">{{ $t('withdrawResult.labelAmountToReceive') }}</div>
        <div class="black-span2 f24 fw500 mt4 pb8">{{ currency }} {{ currencyFormat(estPaymentAmt) }}</div>
      </template>
      <el-button type="" class="button button-default dialog-adaptive mt32" @click="jumpToWallet">{{ $t('withdraw.resultButtonBack') }}</el-button>
      <template v-if="applyWithdrawTime">
        <div class="flex items-center gap12 mt44 mb24">
          <div class="hr flex-1"></div>
          <div class="tertiary-span2 f12">{{ $t('withdrawResult.CurrentStatus') }}</div>
          <div class="hr flex-1"></div>
        </div>
        <div class="w200 full-max margin-auto">
          <div class="flex gap8 mb4">
            <div class="lh0">
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3C11.866 3 15 6.13401 15 10C15 13.866 11.866 17 8 17C4.13401 17 1 13.866 1 10C1 6.13401 4.13401 3 8 3ZM7.36621 10.9453L5.24512 8.82422L4.18457 9.88477L7.36621 13.0664L12.3154 8.11621L11.2549 7.05566L7.36621 10.9453Z" fill="#A5A4AA"/>
              </svg>
            </div>
            <div class="black-span2 fw500">{{ $t('withdrawResult.InitiateWithdrawal') }}</div>
          </div>
          <div class="flex gap8 mb4">
            <div class="lh0">
              <svg width="16" height="62" viewBox="0 0 16 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0.5V40.5" stroke="#E4E3EA" stroke-linecap="round"/>
                <path d="M8 32.5L8 40.5L12 36.5" stroke="#E4E3EA" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="tertiary-span3 f12">{{ formatDate(applyWithdrawTime) }}</div>
          </div>
          <div class="flex gap8 mb4">
            <div class="lh0">
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3C11.8661 3 15 6.1339 15 10C15 13.8661 11.8661 17 8 17C4.1339 17 1 13.8661 1 10C1 6.1339 4.1339 3 8 3ZM6.5 7V12H11V10.5H8V7H6.5Z" fill="#3369FF"/>
              </svg>
            </div>
            <div class="primary-span fw500">{{ $t('withdrawResult.transferFunds') }}</div>
          </div>
        </div>
      </template>
    </div>
    <div v-else key="error" class="content">
      <div class="icon-container"><img src="@/assets/imgs/alert-circle.svg" alt=""></div>
      <div
        class="black-span fw600 mb16"
        :class="[isMobile ? 'f24' : 'f30']"
      >{{ $t('withdraw.resultErrorTitle') }}</div>
      <div class="tertiary-span f16">{{ $t('withdraw.resultErrorP') }}</div>
      <el-button type="" class="button button-default dialog-adaptive mt32" @click="jumpToWallet">{{ $t('withdraw.resultButtonBack') }}</el-button>
    </div>
    </div>
</template>

<style lang="scss" scoped>
@import url("@/assets/css/element-reset/button.scss");
* {
    box-sizing: border-box;
}
.w200 {
  width: 200px;
}
.black-span {
  color: #101828;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  &.fw600 {
    font-weight: 600;
  }
  &.f24 {
    font-size: 24px;
    line-height: 32px; /* 155.556% */
  }
  &.f30 {
    font-size: 30px;
    line-height: 38px;
  }
}
.black-span2 {
  color: #171717;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  &.fw500 {
    font-weight: 500;
  }
  &.f24 {
    font-size: 24px;
    line-height: 34px;
  }
}
.tertiary-span {
  color: #475467;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  &.fw600 {
    font-weight: 600;
  }
  &.f16 {
    font-size: 16px;
    line-height: 24px;
  }
}
.tertiary-span2 {
  color: #D0D5DD;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  &.fw600 {
    font-weight: 600;
  }
  &.f12 {
    font-size: 12px;
    line-height: 18px;
  }
}
.tertiary-span3 {
  color: #A5A4AA;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  &.fw600 {
    font-weight: 600;
  }
  &.f12 {
    font-size: 12px;
    line-height: 18px;
  }
}
.tertiary-span4 {
  color: #817F86;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  &.f12 {
    font-size: 12px;
    line-height: 18px;
  }
}
.primary-span {
  color: #5548FF;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  &.fw500 {
    font-weight: 500;
  }
}
.hr {
  border-bottom: 1px solid #F1F2F5;
}
.page {
    padding: 32px 0;
    min-height: 50vh;
    &.m {
        padding: 16px;
    }
}
.content {
    width: 526px;
    max-width: 100%;
    margin: 0 auto;
    padding: 32px 24px;
    border-radius: 10px;
    background-color: #FFF;
    background-image: url('@/assets/imgs/bg-circle-center.svg');
    background-position: center 0;
    background-repeat: no-repeat;
    box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
    text-align: center;
}
.icon-container {
    display: inline-block;
    padding: 11px;
    border-radius: 10px;
    border: 1px solid #E4E7EC;
    background: #FFF;
    box-shadow: 0px 0px 0px 1px rgba(16, 24, 40, 0.18) inset, 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    margin-bottom: 24px;
}
</style>
