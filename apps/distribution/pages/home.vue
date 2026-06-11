<script setup name="HomePage">
import { checkResponseData, arrToDict, currencyFormat, isEMpty, accurate_add } from "@/util/index.js"
import { flagUrl } from '@/util/dataUtil'
import { Search, Plus, Warning } from '@element-plus/icons-vue'
import NoData from '@/components/svg/NoData.svg'
import { useUserStore } from '@/store/userState.js'
import { FullScreenPrompt } from '@flylinking/ui';

const { productsApi, walletApi, withdrawApi, userApi, homeApi, countryApi } = useApi();
const router = useRouter();
const userStore = useUserStore()
userStore.getUserInfo()
const isMobile = useIsMobile()

const search = ref('')
const loading = ref(false)
const isJoin = ref(false)
const showIsJoin = ref(false)
const goodsList = ref([])
const walletInfo = reactive({
  pendingCommission: undefined, // 待定佣金
  totalBalanceAmtUsd: undefined, // 可用佣金
  totalSettlementAmtUsd: undefined,  // 待结算佣金
  totalSettledAmtUsd: undefined,  // 已结算佣金
  nonUSDollar: false, //是否包含非美元金额
  pendingCommissionDetailList: [], //待确定佣金明细
})

onMounted(async () => {
  isJoinDistribution()
  await getHomeWalletInfo()
  qrySettlementAmount()
  getAllCountry()
})
// 查询是否加入过分销
const isJoinDistribution = async() => {
  const result = await productsApi.checkJoin()
  const res = checkResponseData(result)
  if(res) {
    isJoin.value = true
    showIsJoin.value = false
    getGoodsList()
  } else {
    isJoin.value = false
    showIsJoin.value = true
  }
}
// 获取商品列表
const getGoodsList = async() => {
  loading.value = true
  const body = {
    userId: userStore?.userInfo?.userId,
    pageNo: 1,
    pageSize: 12,
    searchContent: search.value
  }
  const result = await productsApi.getRecommendGoodsList(body)
  const res = checkResponseData(result)
  if(res) {
    goodsList.value = res.list
  } else {
    goodsList.value = []
  }
  loading.value = false
}
// 获取用户账号关联信息
const getHomeWalletInfo = async() => {
  const result = await walletApi.getHomeWalletInfo()
  const res = checkResponseData(result)
  if (res) {
    Object.assign(walletInfo, res)
  }
}
// 查询结算中&已结算佣金
const qrySettlementAmount = async() => {
  const result = await withdrawApi.qrySettlementAmount()
  const res = checkResponseData(result) || {}
  if (res) {
    Object.assign(walletInfo, res)
  }
}

// 动态计算佣金的总额
const totalCommission = computed(() => {
  return accurate_add(walletInfo.pendingCommission, accurate_add(walletInfo.totalBalanceAmtUsd, accurate_add(walletInfo.totalSettledAmtUsd, walletInfo.totalSettlementAmtUsd))) || 0
})

const currencyToCountryId = ref({})
// 获取所有国家列表
const getAllCountry = async() => {
  const result = await countryApi.getAllCountry()
  const res = checkResponseData(result)
  if (res) {
    res.forEach(item => item.name = item.name || item.enUs)
    const countryData = res
    currencyToCountryId.value = arrToDict(countryData, { value: 'currency', label: 'countryId' })
  }
}
const formatterAmount = (v, c) => {
  return isEMpty(v) ? '- -' : (c || 'USD') + ' ' + currencyFormat(v)
}

// 加入
const showJoin = ref(false)
const joinClick = () => {
  showJoin.value = true
}
const joinSave = () => {
  showJoin.value = false
  isJoin.value = true
  getGoodsList()
}
// 跳转页
const routerGo = path => {
  navigateTo({
    path
  })
}
</script>

<template>
  <div class="main-box">
    <div  class="home-box">
      <CarouselImage system="101" />

      <ul class="home-commossion-box" :gutter="24">
        <li>
          <p class="text">{{$t('home.totalCommission')}}</p>
          <div class="flex card-amount-box num">
            <b v-if="totalCommission" class="card-amount-curreny">≈ USD</b>
            <div class="flex-center-6"></div>
            <span class="card-amount">{{ currencyFormat(totalCommission) }}</span>
          </div>
          <div class="card-prompt-container">
            <el-popover
              placement="top"
              effect="dark"
              :width="309"
              :content="$t('home.totalCommissionTip')"
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
        </li>
        <li>
          <p class="text">{{$t('home.pendingCommission')}}</p>
          <AmountDetailsPopover
            :pending-commission="walletInfo.pendingCommission"
            :pending-commission-detail-list="walletInfo.pendingCommissionDetailList"
            :currency-to-country-id="currencyToCountryId"
            i18nLabelDesc="home.pendingCommissionDetailLabelDesc"
            statusType="Pending"
          >
            <template #default="{}">
              <div class="flex card-amount-box num">
                <b class="card-amount-curreny">≈ USD</b>
                <div class="flex-center-6"></div>
                <span class="card-amount num" :class="{'tip-trigger-style': walletInfo.pendingCommission}">
                  {{ currencyFormat(walletInfo.pendingCommission) }}
                </span>
              </div>
            </template>
          </AmountDetailsPopover>
          <div class="card-prompt-container">
            <el-popover
              placement="top"
              effect="dark"
              :width="309"
              :content="$t('home.pendingCommissionTip')"
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
        </li>
        <li>
          <p class="text">{{$t('home.availableCommission')}}</p>          
          <AmountDetailsPopover
            :disabled="walletInfo.totalBalanceAmtUsd"
            :pending-commission="walletInfo.totalBalanceAmtUsd"
            :pending-commission-detail-list="walletInfo.balanceCurrencyList"
            :currency-to-country-id="currencyToCountryId"
            i18nLabelDesc="home.pendingCommissionDetailLabelDescNew"
            statusType="Available"
          >
            <template #default="{}">
              <div class="flex card-amount-box num">
                <b class="card-amount-curreny">≈ USD</b>
                <div class="flex-center-6"></div>
                <span class="card-amount num" :class="{'tip-trigger-style': walletInfo.totalBalanceAmtUsd}">{{ currencyFormat(walletInfo.totalBalanceAmtUsd) }}</span>
              </div>
            </template>
          </AmountDetailsPopover>
        </li>
        <!-- 结算中佣金 -->
        <li>
          <p class="text">{{$t('home.toBeSettledCommission')}}</p>
          <AmountDetailsPopover
            :disabled="walletInfo.totalSettlementAmtUsd"
            :pending-commission="walletInfo.totalSettlementAmtUsd"
            :pending-commission-detail-list="walletInfo.settlementCurrencyList"
            :currency-to-country-id="currencyToCountryId"
            i18nLabelDesc="home.pendingCommissionDetailLabelDescNew"
            statusType="Unsettled"
          >
            <template #default="{}">
              <div class="flex card-amount-box num">
                <b class="card-amount-curreny">≈ USD</b>
                <div class="flex-center-6"></div>
                <span class="card-amount num" :class="{'tip-trigger-style': walletInfo.totalSettlementAmtUsd}">{{ currencyFormat(walletInfo.totalSettlementAmtUsd) }}</span>
              </div>
            </template>
          </AmountDetailsPopover>
        </li>
        <!-- 已结算佣金 -->
        <li>
          <p class="text">{{$t('home.settledCommission')}}</p> 
          <AmountDetailsPopover
            :disabled="walletInfo.totalSettledAmtUsd"
            :pending-commission="walletInfo.totalSettledAmtUsd"
            :pending-commission-detail-list="walletInfo.settledCurrencyList"
            :currency-to-country-id="currencyToCountryId"
            i18nLabelDesc="home.pendingCommissionDetailLabelDescNew"
            statusType="Settled"
          >
            <template #default="{}">
              <div class="flex card-amount-box num">
                <b class="card-amount-curreny">≈ USD</b>
                <div class="flex-center-6"></div>
                <span class="card-amount num" :class="{'tip-trigger-style': walletInfo.totalSettledAmtUsd}">{{ currencyFormat(walletInfo.totalSettledAmtUsd) }}</span>
              </div>
            </template>
          </AmountDetailsPopover>
        </li>
      </ul>

      <div class="home-products-box">
        <div class="products-box-top">
          <div class="title">{{$t('home.homeProducts')}}</div>
          <div class="products-box-top-right">
            <div><el-input v-model="search" id="home-btn-Search" :prefix-icon="Search" :placeholder="$t('home.homeSearch')" clearable @change="getGoodsList" /></div>
            <div class="float-left">
              <el-button type="primary" id="home-btn-Join" :icon="Plus" class="home-btn-Join" @click="joinClick()">{{ $t('home.homeJoin') }}</el-button>
            </div>
            <div class="float-left">
              <el-button type="primary" id="home-btn-ViewAll" @click="routerGo('/products')">{{ $t('home.homeViewAll') }}</el-button>
            </div>
          </div>
        </div>
        <div class="products-box-content products-box-content-home">
          <!-- 未加入分销时展示 -->
          <div v-if="!isJoin && showIsJoin" class="no-data-box">
            <div class="grid-box" />
            <div class="no-data-icon">
              <el-icon class="no-data-icon-Search no-data-icon-Warning"><Warning /></el-icon>
            </div>
            <p class="no-data-text">{{$t('home.homeViewJoin')}}</p>
            <p class="no-data-search-text">
              {{$t('home.homeInvitationCode')}}
              <el-link type="primary" @click="joinClick()">{{$t('home.homeJoinProgram')}}</el-link>
            </p>
            <p class="no-data-search-text">{{$t('home.homeMoreHelp')}}</p>
          </div>
          <!-- 搜索后无数据时展示 -->
          <div v-if="goodsList.length<=0 && search && isJoin" class="no-data-box">
            <div class="grid-box" />
            <div class="no-data-icon">
              <el-icon class="no-data-icon-Search"><Search /></el-icon>
            </div>
            <p class="no-data-text">{{$t('home.homeNoavailable')}}</p>
            <p class="no-data-search-text">{{$t('home.homeYourSearch')}} “{{search}}” {{$t('home.homeNotMatch')}}</p>
          </div>
          <!-- 有数据时展示 只给12条，不用分页 -->
          <div class="content-Products">
            <ProductCardSkeleton :loading="loading" :lists="goodsList" :showPagination="false" :search="search" />
          </div>
          <!-- 暂无数据时展示 -->
          <div v-if="goodsList.length<=0 && !loading && !search && isJoin" class="no-data-box">
            <div class="grid-box" />
            <div class="no-data-icon">
              <el-icon class="no-data-icon-Search"><img :src="NoData" /></el-icon>
            </div>
            <p class="no-data-text">{{$t('home.homeNoData')}}</p>
          </div>
        </div>
      </div>
    </div>



    <!-- join-->
    <JoinStore
      v-if="showJoin"
      v-model="showJoin"
      :data="[]"
      @joinSave="joinSave"
    />

    <!-- 全屏弹窗 -->
    <FullScreenPrompt system="101" :homeApi="homeApi" :checkResponseData="checkResponseData" :isMobile="isMobile" />

  </div>
</template>

<style lang="scss">
@use "@/assets/css/element-reset/popover.scss" as *;
</style>

<style scoped lang="scss">
  @use "@/assets/css/home/style.scss" as *;
  @use "@/assets/css/home/statistical-box.scss" as *;
</style>
