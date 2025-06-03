<!--
 * @Author: czy
 * @Description: 产品页
-->
<script setup name="Products">
import { checkResponseData, scrollTo } from "@/util/index.js";
import { Search, Plus, Warning } from '@element-plus/icons-vue'
import NoData from '@/components/svg/NoData.svg'
import { useUserStore } from '@/store/userState.js'
import { FullScreenPrompt } from '@flylinking/ui';

const { productsApi, homeApi } = useApi();
const userStore = useUserStore()
userStore.getUserInfo()
const isMobile = useIsMobile()

const search = ref('')
const loading = ref(false)
const isJoin = ref(false)
const showIsJoin = ref(false)
const goodsList = ref([])
const total = ref(0)
let page = {
  pageNo: 1,
  pageSize: 12
}

onMounted(() => {
  isJoinDistribution()
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
const productsRef = ref(null)
// 获取商品列表
const getGoodsList = async() => {
  loading.value = true
  const body = {
    userId: userStore?.userInfo?.userId,
    pageNo: page.pageNo,
    pageSize: page.pageSize,
    searchContent: search.value,
    storeId: storeSearchStr.value
  }
  const result = await productsApi.getRecommendGoodsList(body)
  const res = checkResponseData(result)
  if(res) {
    goodsList.value = res.list
    total.value = res.total
  } else {
    goodsList.value = []
  }
  loading.value = false
}
// 滚动到顶部
const scrollToTop = () => {
  // main-wrap滚动到顶部
  if (productsRef.value && productsRef.value.parentNode?.parentNode) {
    productsRef.value.parentNode.parentNode.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
};
const pageChange = e => {
  page.pageNo = e
  getGoodsList()
  scrollToTop()
}
const sizeChange = e => {
  page.pageNo = 1
  page.pageSize = e
  getGoodsList()
  scrollToTop()
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

// 店铺搜索
const storeSearchStr = ref()
const storeSearchChange = e => {
  if(e && e!==storeSearchStr.value) {
    storeSearchStr.value = e
    getGoodsList()
  }
}
</script>

<template>
  <div class="main-box" ref="productsRef">
    <div  class="home-box">

      <div class="home-products-box">
        <div class="products-box-top">
          <div class="title">{{$t('home.homeProducts')}}</div>
          <div class="products-box-top-right">
            <div><el-input v-model="search" id="home-btn-Search" :prefix-icon="Search" :placeholder="$t('home.homeSearch')" clearable @change="getGoodsList" /></div>
            <div>
              <StoreListSearch @change="storeSearchChange" />
            </div>
            <div class="float-left">
              <el-button type="primary" id="home-btn-Join" :icon="Plus" class="home-btn-Join" @click="joinClick()">{{ $t('home.homeJoin') }}</el-button>
            </div>
          </div>
        </div>
        <div class="products-box-content">
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
          <!-- 有数据时展示 只给十条，不用分页 -->
          <div v-if="isJoin" class="content-Products">
            <ProductCardSkeleton
              :loading="loading"
              :lists="goodsList"
              :showPagination="total>0"
              :total="total"
              :search="search"
              :pageSize="page.pageSize"
              :pageSizes="[12, 24, 60, 100, 200]"
              @page-change="pageChange"
              @size-change="sizeChange"
            />
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
    <FullScreenPrompt system="108" :homeApi="homeApi" :checkResponseData="checkResponseData" :isMobile="isMobile" />

  </div>
</template>
<style scoped lang="scss">
@import url("@/assets/css/home/style.scss");

</style>
