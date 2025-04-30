<script setup name="HomePage">
import { checkResponseData, arrToDict, currencyFormat, isEMpty, accurate_add } from "@/util/index.js"
import { flagUrl } from '@/util/dataUtil'
import { Search, Plus, Warning } from '@element-plus/icons-vue'
import NoData from '@/components/svg/NoData.svg'
import { useUserStore } from '@/store/userState.js'
const { productsApi, walletApi, withdrawApi, userApi } = useApi();
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
  totalCommission: undefined,
  pendingCommission: undefined,
  availableCommission: undefined,
  toBeSettledCommission: undefined,
  settledCommission: undefined,
  //
  nonUSDollar: false,
  pendingCommissionDetailList: [],
})

const totalCommission = computed(() => {
  return accurate_add(walletInfo.totalCommission, accurate_add(walletInfo.toBeSettledCommission, walletInfo.settledCommission))
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
    Object.assign(walletInfo, {
      toBeSettledCommission: res.settlementAmt,
      settledCommission: res.settledAmt,
    })
  }
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
          <h3 class="num">
            <template v-if="walletInfo.nonUSDollar">≈</template>
            {{ formatterAmount(totalCommission) }}
          </h3>
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
                  <div class="statistical-tabs-item">{{$t('home.pendingCommissionDetailLabelNonUSD')}}</div>
                  <div class="statistical-tabs-item">{{$t('home.pendingCommissionDetailLabelUSD')}}</div>
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
                {{$t('home.pendingCommissionDetailLabelDesc')}}
              </div>
            </div>
            <template #reference>
              <h3 class="num" :class="{ 'tip-trigger-style': walletInfo.nonUSDollar }">
                <template v-if="walletInfo.nonUSDollar">≈</template>
                {{ formatterAmount(walletInfo.pendingCommission) }}
              </h3>
            </template>
          </el-popover>
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
          <h3 class="num">{{ formatterAmount(walletInfo.availableCommission) }}</h3>
        </li>
        <!-- 结算中佣金 -->
        <li>
          <p class="text">{{$t('home.toBeSettledCommission')}}</p>
          <h3 class="num">{{ formatterAmount(walletInfo.toBeSettledCommission) }}</h3>
        </li>
        <!-- 已结算佣金 -->
        <li>
          <p class="text">{{$t('home.settledCommission')}}</p>
          <h3 class="num">{{ formatterAmount(walletInfo.settledCommission) }}</h3>
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

  </div>
</template>

<style lang="scss">
@use "@/assets/css/element-reset/popover.scss" as *;
</style>

<style scoped lang="scss">
  @use "@/assets/css/home/style.scss" as *;
  @use "@/assets/css/home/statistical-box.scss" as *;
</style>
