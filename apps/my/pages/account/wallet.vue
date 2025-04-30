<script setup>
import { Top } from '@element-plus/icons-vue';
import { checkResponseData, arrToDict, currencyFormat, isEMpty , errorMessage} from "@/util/index.js"
import { flagUrl } from '@/util/dataUtil'
import { useUserStore } from '@/store/userState.js'
import { useI18n } from "vue-i18n";

const router = useRouter()
const { t } = useI18n();
const { walletApi, withdrawApi, userApi } = useApi()
const userStore = useUserStore()
const isMobile = useIsMobile()
// const popoverVisible = ref(false)
const isShowErrorGialog = ref(false)
const isShowSuspendedGialog = ref(false)
const limitAmount = ref(50)
const ableBalanceAmount = ref(0)
const activeName = ref('')
const radio1 = ref('referral')
const walletInfo = reactive({
  pendingCommission: undefined,
  availableCommission: undefined,
  //
  nonUSDollar: false,
  pendingCommissionDetailList: [],
})
const tabsData = computed(() => {
  return [
    { value: 'transactions', label: t('wallet.transactions') },
    { value: 'withdraw', label: t('wallet.withdrawalRecords') }
  ]
})
const tabsDict = computed(() => {
  return arrToDict(tabsData.value)
})
const radio1Data = computed(() => {
  return [
    { value: 'referral', label: t('wallet.referral') },
    { value: 'sub-distributor-referral', label: t('wallet.subDistributorReferral') },
  ]
})

// 获取用户账号关联信息
const getHomeWalletInfo = async() => {
  const result = await walletApi.getHomeWalletInfo()
  const res = checkResponseData(result)
  if (res) {
    Object.assign(walletInfo, res)
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
// 查询可用佣金
const qryBalance = async() => {
  const result = await withdrawApi.qryBalance()
  ableBalanceAmount.value = checkResponseData(result)
}
const currencyToCountryId = ref({})
// 获取所有国家列表
const getAllCountry = async() => {
  const result = await userApi.getAllCountry()
  const res = checkResponseData(result)
  if (res) {
      res.forEach(item => item.name = item.name || item.enUs)
    const countryData = res
    currencyToCountryId.value = arrToDict(countryData, { value: 'currency', label: 'countryId' })
  }
}
const formatterAmount = (v, c) => {
  return (c || 'USD') + ' ' + currencyFormat(v)
}
const handleClick = () => {
// console.log(activeName.value)
}
const jumpToWithdraw = () => {
  lockStatus().then(() => {
    if (lockStatusData.value.isLock) {
      isShowSuspendedGialog.value = true
      return
    }
    if (!(ableBalanceAmount.value > limitAmount.value)) {
      // popoverVisible.value = !popoverVisible.value
      isShowErrorGialog.value = true
      return
    }
    router.push({
      path: '/account/withdraw'
    })
  })
}


onMounted(() => {
  userStore.getUserInfo()
  getHomeWalletInfo()
  qryBalance()
  getAllCountry()

  const hash = window.location.hash ? window.location.hash.substring(1) : ''
  if (tabsDict.value[hash]) {
      activeName.value = hash
  } else {
    activeName.value = 'transactions'
  }
})

</script>

<template>
  <div :class="{ 'page': true, 'm': isMobile }">
    <CarouselImage system="102" class="" />
    <div class="card-group">
      <div class="card">
        <div class="card-icon-container">
          <img class="card-icon" src="~@/assets/imgs/wallet.svg">
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
        <div class="card-p">{{$t('wallet.balance')}}</div>
        <div class="card-amount-container">
          <span class="card-amount">{{ formatterAmount(walletInfo.availableCommission) }}</span>
          <div class="card-amount-center"></div>
            <el-button class="button-default" @click="jumpToWithdraw">{{$t('wallet.walletWIthdrawButton')}}</el-button>
        </div>
      </div>
      <div class="card">
        <div class="card-icon-container">
          <img class="card-icon" src="~@/assets/imgs/credit-card-refresh.svg">
        </div>
        <div class="card-prompt-container">
          <el-popover
            placement="top"
            effect="dark"
            :width="309"
            :content="$t('wallet.pendingCommissionTip')"
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
        <div class="card-p">{{$t('wallet.pendingCommission')}}</div>
        <div class="card-amount-container">
          <el-popover
            placement="bottom-start"
            effect="light"
            :width="480"
            popper-class="popover-dialog"
            :disabled="!walletInfo.nonUSDollar"
          >
            <div class="statistical-box" :class="{ m: isMobile }">
              <div class="statistical-tabs-container">
                <div class="statistical-tabs header">
                  <div class="statistical-tabs-item">{{$t('wallet.pendingCommissionDetailLabelNonUSD')}}</div>
                  <div class="statistical-tabs-item">{{$t('wallet.pendingCommissionDetailLabelUSD')}}</div>
                </div>
                <div class="statistical-content">
                  <div v-for="item in walletInfo.pendingCommissionDetailList" :key="item.currency" class="statistical-tabs">
                    <div class="statistical-tabs-item">
                      <div class="icon-container">
                        <img :src="flagUrl(currencyToCountryId[item.currency])" alt="">
                      </div>
                      <span>{{ formatterAmount(item.nonUSDCommission, item.currency) }}</span>
                    </div>
                    <div class="statistical-tabs-item">
                      <div class="icon-container">
                        <img :src="flagUrl('us')" alt="">
                      </div>
                      <span>{{ formatterAmount(item.estimatedUSDAmount, 'USD') }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="statistical-p">
                {{$t('wallet.pendingCommissionDetailLabelDesc')}}
              </div>
            </div>
            <template #reference>
              <span class="card-amount" :class="{ 'tip-trigger-style': walletInfo.nonUSDollar }">
                <template v-if="walletInfo.nonUSDollar">≈</template>
                {{ formatterAmount(walletInfo.pendingCommission) }}
              </span>
            </template>
          </el-popover>
          <div class="card-amount-center"></div>
          <!-- <div class="state-label">
            <el-icon class="state-label-icon"><Top /></el-icon>
            <div class="state-label-span">100%</div>
          </div> -->
        </div>
      </div>
    </div>
    <el-select
        v-if="isMobile"
        v-model="activeName"
        placeholder=""
        class="wallet-select-menu select-default"
        @change="handleClick"
    >
      <el-option
        v-for="item in tabsData"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-tabs v-else v-model="activeName" class="tabs tabs-default" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabsData" :key="item.value" :id="'wallet-anchor-' + item.value" :label="item.label" :name="item.value"></el-tab-pane>
    </el-tabs>

    <template v-if="activeName === 'transactions'">
      <el-radio-group v-model="radio1" class="radio-group radio-group-default">
        <el-radio-button
          v-for="item in radio1Data"
          :key="item.value"
          :id="'wallet-tab-transactions-' + item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-radio-group>
      <AccountWalletReferral v-if="radio1 === 'referral'"></AccountWalletReferral>
      <AccountWalletSubDistributorReferral v-else-if="radio1 === 'sub-distributor-referral'"></AccountWalletSubDistributorReferral>
    </template>
    <AccountWalletWithdrawalRecords v-else-if="activeName === 'withdraw'"></AccountWalletWithdrawalRecords>
    <!-- <EmptyData v-else-if="activeName === 'withdraw'"></EmptyData> -->

    <AccountWithdrawNotMetDialog
        v-if="isShowErrorGialog"
        v-model="isShowErrorGialog"
        :amount="limitAmount"
    ></AccountWithdrawNotMetDialog>
    <AccountWithdrawTemporarilySuspendedDialog
        v-if="isShowSuspendedGialog"
        v-model="isShowSuspendedGialog"
        :lockTime="lockStatusData.lockTime"
    ></AccountWithdrawTemporarilySuspendedDialog>
  </div>
</template>

<style lang="scss">
  @use "@/assets/css/element-reset/popover.scss" as *;
</style>

<style lang="scss" scoped>
  @use "@/assets/css/home/statistical-box.scss" as *;
  @use "@/assets/css/element-reset/button.scss" as *;
  @use "@/assets/css/element-reset/tabs.scss" as *;
  @use "@/assets/css/element-reset/radio.scss" as *;
  @use "@/assets/css/element-reset/select.scss" as *;
* {
    box-sizing: border-box;
}
.page {
  &.m {
    padding: 0 16px;
    .card-group {
      display: block;
      margin: 24px 0 32px;
      .card {
        width: 100%;
        padding: 20px 16px;
        + .card {
          margin-top: 24px;
        }
        .card-amount {
          font-size: 30px;
          line-height: 38px;
          letter-spacing: 0;
        }
      }
    }
  }
}
.carousel {
  margin-top: 32px;
}
.card-group {
  display: flex;
  justify-content: space-between;
  margin: 32px 0;
  .card {
    width: calc(50% - 12px);
    padding: 24px;
    border-radius: 12px;
    border: 1px solid #E4E7EC;
    background: #FFF;
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    position: relative;
    .card-icon-container {
      display: inline-block;
      padding: 12px;
      border-radius: 10px;
      border: 2px solid rgba(255, 255, 255, 0.12);
      background: var(--Surface-Primary, #5548FF);
      box-shadow: 0px 0px 0px 1px rgba(16, 24, 40, 0.18) inset, 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
      margin-bottom: 20px;
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

  // rtl 兼容
  .rtl .card-group {
    .card {
      .card-prompt-container {
        left: 20px;
        right: auto;
      }
    }
  }
.state-label {
  display: inline-flex;
  align-items: center;
  padding: 1px 10px 1px 8px;
  border-radius: 22px;
  border: 1px solid #ABEFC6;
  background: #ECFDF3;
  .state-label-icon {
    margin-right: 4px;
    color: #17B26A;
    font-size: 12px;
  }
  .state-label-span {
    color: #067647;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px; /* 142.857% */
  }
}
.tabs {
  margin-bottom: 32px;
}
.wallet-select-menu {
  margin-bottom: 32px;
}
.radio-group {
  margin-bottom: 32px;
}
</style>
