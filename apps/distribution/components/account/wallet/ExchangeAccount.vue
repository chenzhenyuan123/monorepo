<script setup>
  import { useI18n } from "vue-i18n";
  import { checkResponseData, currencyFormat} from "@/util/index.js"
  import {arrToDict} from "@flylinking/core/utils/common";
  import {flagUrl} from "@flylinking/core/utils/dataUtil";

  const router = useRouter()
  const { t } = useI18n();
  const { withdrawApi, countryApi } = useApi()
  const isMobile = useIsMobile()


  const isShowSuspendedGialog = ref(false)


  // 弹窗，未达到最低提现金额
  const isShowErrorGialog = ref(false)


  const balanceListData = ref([])
  // 查询可用佣金
  const qryBalanceList = () => {
    withdrawApi.qryBalanceList().then((result) => {
      const res = checkResponseData(result)
      // 不展示USD币种
      balanceListData.value = (res || []).filter(item => item.currency !== 'USD')
    })
  }


  const currencyToCountryId = ref({})
  // 获取所有国家列表
  const getAllCountry = async() => {
    const result = await countryApi.getAllCountry()
    const res = checkResponseData(result)
    if (res) {
      currencyToCountryId.value = arrToDict(res, { value: 'currency', label: 'countryId' })
    }
  }


  const lockStatusData = ref({
    isLock: undefined,
    lockTime: undefined,
  })
  // 查询提现锁状态
  const lockStatus = async() => {
    const result = await withdrawApi.lockStatus()
    const res = checkResponseData(result)
    lockStatusData.value = res || {}
  }


  const minWithdrawalAmountData = ref({
    currency: undefined,
    minWithdrawalAmount: undefined,
  })
  // 查询币种最小可提现金额
  const qryMinWithdrawalAmount = (currency) => {
    return withdrawApi.qryMinWithdrawalAmount({ currency }).then((result) => {
      const res = checkResponseData(result)
      minWithdrawalAmountData.value = res || {}
    })
  }


  const jumpToWithdraw = async (balanceItem = {}) => {
    await lockStatus()
    if (lockStatusData.value.isLock) {
      isShowSuspendedGialog.value = true
      return
    }
    await qryMinWithdrawalAmount(balanceItem.currency)
    if (!(balanceItem.availableBalance > minWithdrawalAmountData.value.minWithdrawalAmount)) {
      isShowErrorGialog.value = true
      return
    }
    router.push({
      path: '/account/withdraw',
      query: {
        currency: balanceItem.currency
      }
    })
  }

  const formatterAmount = (v, c) => {
    return (c || 'USD') + ' ' + currencyFormat(v)
  }


  onMounted(() => {
    qryBalanceList()
    getAllCountry()
  })
</script>

<template>
  <div>
    <div class="black-span fw600 mb4">{{$t('exchangeAccount.title')}}</div>
    <ExpandContent
      class="black-span"
      :class="[ isMobile ? 'mb36' : 'mb52' ]"
      :ellipsisNum="isMobile ? 3 : 10"
    >
      {{$t('exchangeAccount.p1')}}
      <div style="height: 14px;"></div>
      {{$t('exchangeAccount.p2')}}
      <div style="height: 14px;"></div>
      {{$t('exchangeAccount.p3')}}
    </ExpandContent>
    <div class="card-group flex flex-wrap gap24 mb32">
      <div v-for="item in balanceListData" :key="item.currency" class="card">
        <div class="card-icon-container flex items-center justify-center mb20">
          <div class="circle-country-icon-container">
            <img :src="flagUrl(currencyToCountryId[item.currency])" alt="">
          </div>
        </div>
        <div class="card-prompt-container">
          <el-popover
            placement="top"
            effect="dark"
            :width="309"
            :content="$t('wallet.balanceTip')"
          >
            <template #reference>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_3369_8429)">
                  <path d="M9.99984 13.3333V10M9.99984 6.66666H10.0082M18.3332 10C18.3332 14.6024 14.6022 18.3333 9.99984 18.3333C5.39746 18.3333 1.6665 14.6024 1.6665 10C1.6665 5.39762 5.39746 1.66666 9.99984 1.66666C14.6022 1.66666 18.3332 5.39762 18.3332 10Z" stroke="#98A2B3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_3369_8429">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </template>
          </el-popover>
        </div>
        <div class="card-p">{{$t('exchangeAccount.availableLabel')}}</div>
        <div class="card-amount-container">
          <span class="card-amount">{{ formatterAmount(item.availableBalance, item.currency) }}</span>
          <div class="card-amount-center"></div>
          <el-button class="button-default" @click="jumpToWithdraw(item)">{{$t('wallet.walletWIthdrawButton')}}</el-button>
        </div>
      </div>
    </div>

    <AccountWithdrawNotMetDialog
      v-if="isShowErrorGialog"
      v-model="isShowErrorGialog"
      :currency="minWithdrawalAmountData.currency"
      :amount="minWithdrawalAmountData.minWithdrawalAmount"
    ></AccountWithdrawNotMetDialog>
    <AccountWithdrawTemporarilySuspendedDialog
      v-if="isShowSuspendedGialog"
      v-model="isShowSuspendedGialog"
      :lockTime="lockStatusData.lockTime"
    ></AccountWithdrawTemporarilySuspendedDialog>
  </div>
</template>

<style lang="scss" scoped>
  @use "@/assets/css/element-reset/button.scss" as *;
  * {
    box-sizing: border-box;
  }
  .black-span {
    color: #475467;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    &.fw600 {
      font-weight: 600;
    }
  }
  .card-group {
    .card {
      width: 510px;
      max-width: 100%;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid #E4E7EC;
      background: #FFF;
      box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
      position: relative;
      .card-icon-container {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        border: 1px solid #E4E7EC;
        background: #FFF;
        box-shadow: 0px 0px 0px 1px rgba(16, 24, 40, 0.18) inset, 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
      }
      .card-prompt-container {
        position: absolute;
        right: 20px;
        top: 20px;
      }
      .card-prompt {

      }
      .card-p {
        color: #475467;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px; /* 142.857% */
        margin-bottom: 8px;
      }
      .card-amount {
        color: #101828;
        font-size: 36px;
        font-weight: 600;
        line-height: 44px; /* 122.222% */
        letter-spacing: -0.72px;
        direction: ltr;
        &.tip-trigger-style {
          text-decoration-line: underline;
          text-decoration-style: dotted;
          text-decoration-skip-ink: auto;
          text-decoration-color: #667085;
          text-decoration-thickness: auto;
          text-underline-offset: auto;
          //text-underline-position: from-font;
          text-underline-position: under;
          &:hover {
            text-decoration-style: solid;
            text-decoration-skip-ink: none;
          }
        }
      }
      .card-amount-container {
        display: flex;
        align-items: center;
        .card-amount-center {
          flex: 1;
        }
      }
    }
  }
</style>
