<!--
 * @Author: czy
 * @Description: 买家中心/订单列表
-->
<script name="Orders" setup>
  import { useI18n } from "vue-i18n";
  import { Check, Search } from '@element-plus/icons-vue';
  import { checkResponseData, currencyFormat } from "@/util/index.js"
  import {arrToDict} from "@flylinking/core/utils/common";
  import {splitDateRange, formatDate} from "@flylinking/core/utils/dateUtil";
  import {getCleanFormData, theAll} from "@flylinking/core/utils/dataUtil";
  import { ordersStatus } from "@/util/const.js";
  import { FullScreenPrompt, Message } from '@flylinking/ui';
  import { useSettingStore } from '@/store/settingState.js'
  
  const { buyerOrderApi, homeApi } = useApi();
  const { t } = useI18n();
  const isMobile = useIsMobile()
  const emit = defineEmits(['pageChange'])
  const settingStore = useSettingStore()
  const route = useRoute()


  const gback = ref(route.query.gback)
  const backToShop = () => {
    location.href = window.decodeURIComponent(gback.value)
  }


  const activeName = ref('')
  const tabsData = ref([
    { value: theAll, label: 'orders.ordersStatusAll' },
    { value: 0, label: 'orders.ordersStatus1' },
    { value: 1, label: 'orders.ordersStatus2' },
    { value: 2, label: 'orders.ordersStatus3' },
    { value: 3, label: 'orders.ordersStatus4' },
    { value: 4, label: 'orders.ordersStatus5' },
  ])
  const tabsDict = computed(() => {
    return arrToDict(tabsData.value)
  })
  const handleClick = (val) => {
    getOrderList()
  }


  const searchFormRef = ref(null)
  const formData = ref({})
  const dataRange = computed({
    // getter
    get() {
      return [formData.value.startDateTime, formData.value.endDateTime]
    },
    // setter
    set(newValue) {
      splitDateRange(newValue, formData.value, 'startDateTime', 'endDateTime')
    }
  })
  const tableLoading = ref(true)
  const pageData = ref({
    pageSize: 5
  })
  const tableData = ref({
    pageNo: 1,
    pageSize: 5,
    total: 0,
    list: []
  })
  const getOrderList = ({ pageNo = 1, pageSize = pageData.value.pageSize } = {}) => {
    if (pageSize !== pageData.value.pageSize) pageData.value.pageSize = pageSize
    tableLoading.value = true
    const params = getCleanFormData({
      pageNo,
      pageSize,
      orderState: activeName.value,
      ...formData.value,
      startDateTime: formData.value.startDateTime ? formatDate(formData.value.startDateTime) : '',
      endDateTime: formData.value.endDateTime ? formatDate(formData.value.endDateTime) : '',
    })
    buyerOrderApi.listPage(params).then(result => {
      const res = checkResponseData(result)
      if (res) {
        tableData.value = res
      }
    }).catch(err => {
      console.log('qryGoodsList err: ', err)
    }).finally(() => {
      tableLoading.value = false
    })
  }
  const pageChange = (pageNo) => {
    console.log('pageChange')
    scrollTopByClass()
    getOrderList({ pageNo })
  }
  const pageSizeChange = (pageSize) => {
      // window.document.body.scrollTop = 0
    getOrderList({ pageSize })
  }
  const formSearch = () => {
    searchFormRef.value.hideLayer()
    getOrderList()
  }
  const formReset = () => {
    searchFormRef.value.hideLayer()
    formData.value = {}
    getOrderList()
  }
  const scrollTopByClass = () => {
    const mWraps = document.querySelectorAll('.m-wrap') || []
    const pcWraps = document.querySelectorAll('.main-wrap') || []
    mWraps[0]?.scrollTo?.(0, 0)
    pcWraps[0]?.scrollTo?.(0, 0)
  }

  const isLinkOrders = ref(false) // 导入关联订单入口tip条，点击x关闭后存localStorage不再展示
  const isHistoryLinkOrders = ref(false) // 查询是否存在未关联旧订单
  onMounted(async () => {
    const hash = window.location.hash ? window.location.hash.substring(1) : ''
    if (tabsDict.value[hash]) {
      activeName.value = Number(hash)
    } else {
      activeName.value = theAll
    }

    getOrderList()

    isLinkOrders.value = settingStore.getLinkOrders() || false
    // 查询是否存在未关联旧订单
    getHistoryLinkOrders()
  })
  const getHistoryLinkOrders = async () => {
    const result = await buyerOrderApi.existHistoricalOrder()
    isHistoryLinkOrders.value = checkResponseData(result) || false
  }

  // 隐藏导入关联订单Message
  const hideLinkOrderBtn = () => {
    settingStore.setLinkOrders(true)
    isLinkOrders.value = true
  }
  
  // 点击导入关联订单
  const showLinkOrders = ref(false)
  const saveLinkOrders = () => {
    showLinkOrders.value = false
    getOrderList()
    getHistoryLinkOrders()
  }
</script>

<template>
  <div class="orders">
    <CarouselImage system="106" class="carousel-image" />

    <el-select
            v-if="isMobile"
            v-model="activeName"
            placeholder=""
            class="select-menu select-default"
            @change="handleClick"
    >
      <el-option
              v-for="item in tabsData"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value"
      />
    </el-select>
    <el-tabs v-else v-model="activeName" class="tabs tabs-default" @tab-change="handleClick">
      <el-tab-pane v-for="item in tabsData" :key="item.value" :id="'order-' + item.value" :label="$t(item.label)" :name="item.value"></el-tab-pane>
    </el-tabs>

    <div class="orders-position">
      <SearchFormBox
            ref="searchFormRef"
            class="search-form"
            :filterLabel="$t('orders.searchFormFilterLabel')"
      >
        <el-form :model="formData" :inline="!isMobile" label-position="top" novalidate>
          <el-form-item :label="$t('orders.searchFormLabelStore')" style="width: 200px;">
            <el-input
                    v-model="formData.storeName"
                    clearable
                    :placeholder="$t('orders.searchFormPlaceholderStore')"
                    :suffix-icon="Search"
                    @keyup.enter.native="getOrderList"
                    @clear="getOrderList"
            />
          </el-form-item>
          <el-form-item :label="$t('orders.searchFormLabelOrderID')" style="width: 200px;">
            <el-input
                    v-model="formData.orderId"
                    clearable
                    :placeholder="$t('orders.searchFormLabelOrderID')"
                    :suffix-icon="Search"
                    @keyup.enter.native="getOrderList"
                    @clear="getOrderList"
            />
          </el-form-item>
          <el-form-item :label="$t('orders.searchFormLabelProducts')" style="width: 200px;">
            <el-input
                    v-model="formData.products"
                    clearable
                    :placeholder="$t('orders.searchFormLabelProducts')"
                    :suffix-icon="Search"
                    @keyup.enter.native="getOrderList"
                    @clear="getOrderList"
            />
          </el-form-item>
          <el-form-item :label="$t('orders.searchFormLabelDatetime')" style="width: 280px;">
            <el-date-picker
                    v-model="dataRange"
                    type="daterange"
                    format="YYYY-MM-DD"
                    range-separator="~"
                    :start-placeholder="$t('wallet.referralFormPlaceholderPurchaseDateStart')"
                    :end-placeholder="$t('wallet.referralFormPlaceholderPurchaseDateEnd')"
                    @change="getOrderList"
                    @clear="getOrderList"
            />
          </el-form-item>
          <el-form-item class="search-form-buttons">
            <el-button type="primary" @click="formSearch">{{ t('orders.searchFormButtonSearch') }}</el-button>
            <el-button @click="formReset">{{ t('orders.searchFormButtonReset') }}</el-button>
          </el-form-item>
        </el-form>
      </SearchFormBox>
      
      <div v-if="isHistoryLinkOrders" class="orders-import-btn">
        <el-button id="link-orders-btn" @click="showLinkOrders=true">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M11.6667 18.3334C11.6667 18.3334 12.3744 18.2323 15.3033 15.3033C18.2322 12.3744 18.2322 7.62565 15.3033 4.69672C14.2656 3.65899 12.9994 2.98893 11.6667 2.68654M11.6667 18.3334H16.6667M11.6667 18.3334L11.6667 13.3334M8.33333 1.66685C8.33333 1.66685 7.62563 1.76795 4.6967 4.69688C1.76777 7.62582 1.76777 12.3746 4.6967 15.3035C5.73443 16.3412 7.0006 17.0113 8.33333 17.3137M8.33333 1.66685L3.33333 1.66669M8.33333 1.66685L8.33333 6.66669" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="flex-center-6"></div>
          {{ t('orders.linkOrdersBtn') }}
        </el-button>
      </div>
    </div>

    <!-- 导入关联订单Message -->
    <div v-if="!isLinkOrders && isHistoryLinkOrders" class="order-list-container order-message-box">
      <message type="warn" class="message" :isClose="true" @hideBtn="hideLinkOrderBtn">
        <div class="flex-box">
          <span class="text">{{ t('orders.linkOrdersBtnTip1') }}</span>
          <div class="flex-center-6"></div>
          <a class="link" id="link-orders-btn" @click="showLinkOrders=true">{{ t('orders.linkOrdersBtnTip2') }}</a>
        </div>
      </message>
    </div>

    <OrderList
            class="order-list-container"
            :loading="tableLoading"
            :pageData="pageData"
            :tableData="tableData"
            @pageChange="pageChange"
            @pageSizeChange="pageSizeChange"
    ></OrderList>

    <!-- 全屏弹窗 -->
    <FullScreenPrompt system="106" :homeApi="homeApi" :checkResponseData="checkResponseData" :isMobile="isMobile" />
    <LinkOrders v-if="showLinkOrders" v-model="showLinkOrders" @save="saveLinkOrders" />

    <div v-if="gback" class="buoy-1780907156008 flex items-center gap2 cursor-pointer" @click="backToShop">
      <div class="mirror-x-icon lh0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1789_28792)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5303 3.46967C10.2374 3.17678 9.76268 3.17678 9.46978 3.46967L5.46978 7.46967C5.17695 7.76257 5.17691 8.23734 5.46978 8.53022L9.46978 12.5302C9.76266 12.8231 10.2374 12.8231 10.5303 12.5302C10.8232 12.2373 10.8232 11.7626 10.5303 11.4697L7.0606 7.99994L10.5303 4.53022C10.8232 4.23732 10.8232 3.76256 10.5303 3.46967Z" fill="white"/>
          </g>
          <defs>
            <clipPath id="clip0_1789_28792">
              <rect width="16" height="16" fill="white" transform="matrix(-1 0 0 1 16 0)"/>
            </clipPath>
          </defs>
        </svg>
      </div>
      <span>Continue shopping</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use "@/assets/css/element-reset/button.scss" as *;
  @use "@/assets/css/element-reset/tabs.scss" as *;
  @use "@/assets/css/element-reset/select.scss" as *;
  * {
    box-sizing: border-box;
  }
  .orders-position {
    position: relative;
  }
  .carousel-image {
    margin: 28px 0 32px;
  }
  .tabs {
    margin-bottom: 32px;
  }
  .search-form {
    padding: 0 0 8px;
  }
  .order-list-container {
    margin: 0 -32px;
  }

  .order-message-box {
    padding-left: 32px;
    background: #FFFAEB;
    .message {
      border-radius: 0;
      border: 0;
      border-top: 1px solid #D0D5DD;
      box-shadow: none;
      background: #FFFAEB;
      position: relative;
      .text {
        color: #344054;
        font-family: Inter;
        font-size: 14px;
        font-weight: 600;
      }
      .link {
        color: #475467;
        font-family: Inter;
        font-size: 14px;
        font-weight: 400;
        text-decoration: underline;
        text-underline-position: under;
        cursor: pointer;
        &:hover {
          color: #1D2939;
        }
      }
    }
    .flex-box {
      display: flex;
      align-items: center;
    }
  }
  .orders-import-btn {
    position: absolute;
    right: 0px;
    top: -78px;
    z-index: 2;
    .rtl & {
      left: 0;
      right: auto;
    }
    .el-button {
      border-radius: 8px;
      border: 1px solid  #D0D5DD;
      box-shadow: 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
      padding: 8px 12px;
      color: #344054;
      font-family: Inter;
      font-size: 14px;
      font-weight: 600;
      height: 36px;
      background: #fff;
    }
  }


  .m {
    .orders {
      padding: 0 16px;
    }
    .carousel-image {
      margin: 0 0 32px;
    }
    .select-menu {
      width: calc(100% + 16px);
      margin: 0 -8px 8px;
    }
    .search-form {
      width: calc(100% + 16px);
      padding: 0;
      margin: 0 -8px 16px;
    }
    .order-list-container {
      margin: 0 -16px;
    }
    .order-message-box {
      padding: 0;
      .flex-box {
        display: block;
      }
      .message {
        .link{
          display: block;
          margin: 0;
        }
      }
    }
    .orders-import-btn {
      position: relative;
      top: -9px;
      left: -6px;
      margin-bottom: 5px;
      .rtl & {
        left: auto;
        right: -6px;
      }
    }
  }
  .buoy-1780907156008 {
    position: fixed;
    left: 0;
    bottom: 151px;
    z-index: 11;
    padding: 4px 12px 4px 4px;
    border-radius: 0 9999px 9999px 0;
    background: #5548FF;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 2px 6px 0 rgba(0, 0, 0, 0.08);
    color: #FFF;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    .rtl & {
      left: auto;
      right: 0;
      padding: 4px 4px 4px 12px;
      border-radius: 9999px 0 0 9999px;
    }
  }
</style>
