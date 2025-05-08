<!--
 * @Author: czy
 * @Description: 买家中心/订单列表
-->
<script name="Orders" setup>
  import { useI18n } from "vue-i18n";
  import { Check, Search } from '@element-plus/icons-vue';
  import { checkResponseData, currencyFormat } from "@/util/index.js"
  import {arrToDict} from "@flylinking/core/utils/common";
  import {splitDateRange} from "@flylinking/core/utils/dateUtil";
  import {getCleanFormData, theAll} from "@flylinking/core/utils/dataUtil";


  const { buyerOrderApi } = useApi();
  const { t } = useI18n();
  const isMobile = useIsMobile()


  const activeName = ref('')
  const tabsData = computed(() => {
    return [
      { value: theAll, label: 'All' },
      { value: 1, label: 'Pending Payment' },
      { value: 2, label: 'Not shipped' },
      { value: 3, label: 'Shipped' },
      { value: 4, label: 'Completed' },
      { value: 5, label: 'Cancelled' },
    ]
  })
  const tabsDict = computed(() => {
    return arrToDict(tabsData.value)
  })
  const handleClick = () => {
    console.log('activeName.value: ', activeName.value)
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
    total: 1,
    list: [{ id: 1 }]
  })
  const getOrderList = ({ pageNo = 1, pageSize = pageData.value.pageSize } = {}) => {
    if (pageSize !== pageData.value.pageSize) pageData.value.pageSize = pageSize
    tableLoading.value = true
    const params = getCleanFormData({
      pageNo,
      pageSize,
      orderState: activeName.value,
      ...formData.value
    })
    buyerOrderApi.listPage(params).then(result => {
      const res = checkResponseData(result)
      if (res) {
        // tableData.value = res
      }
    }).catch(err => {
      console.log('qryGoodsList err: ', err)
    }).finally(() => {
      tableLoading.value = false
    })
  }
  const pageChange = (pageNo) => {
    getOrderList({ pageNo })
  }
  const pageSizeChange = (pageSize) => {
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


  onMounted(async () => {
    const hash = window.location.hash ? window.location.hash.substring(1) : ''
    if (tabsDict.value[hash]) {
      activeName.value = hash
    } else {
      activeName.value = theAll
    }

    getOrderList()
  })
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
              :label="item.label"
              :value="item.value"
      />
    </el-select>
    <el-tabs v-else v-model="activeName" class="tabs tabs-default" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabsData" :key="item.value" :id="'order-' + item.value" :label="item.label" :name="item.value"></el-tab-pane>
    </el-tabs>

    <SearchFormBox
            ref="searchFormRef"
            class="search-form"
            filterLabel="Filter orders"
    >
      <el-form :model="formData" :inline="!isMobile" label-position="top" novalidate>
        <el-form-item label="Store" style="width: 200px;">
          <el-input
                  v-model="formData.storeName"
                  clearable
                  placeholder="Store name"
                  :suffix-icon="Search"
                  @keyup.enter.native="getOrderList"
                  @clear="getOrderList"
          />
        </el-form-item>
        <el-form-item label="Order ID" style="width: 200px;">
          <el-input
                  v-model="formData.orderId"
                  clearable
                  placeholder="Order ID"
                  :suffix-icon="Search"
                  @keyup.enter.native="getOrderList"
                  @clear="getOrderList"
          />
        </el-form-item>
        <el-form-item label="Products" style="width: 200px;">
          <el-input
                  v-model="formData.products"
                  clearable
                  placeholder="Products"
                  :suffix-icon="Search"
                  @keyup.enter.native="getOrderList"
                  @clear="getOrderList"
          />
        </el-form-item>
        <el-form-item label="Datetime" style="width: 280px;">
          <el-date-picker
                  v-model="dataRange"
                  type="daterange"
                  format="YYYY-MM-DD"
                  range-separator="~"
                  :start-placeholder="$t('wallet.referralFormPlaceholderPurchaseDateStart')"
                  :end-placeholder="$t('wallet.referralFormPlaceholderPurchaseDateEnd')"
                  @change="getOrderList"
          />
        </el-form-item>
        <el-form-item class="search-form-buttons">
          <el-button type="primary" @click="formSearch">Search</el-button>
          <el-button @click="formReset">Reset</el-button>
        </el-form-item>
      </el-form>
    </SearchFormBox>

    <OrderList
            class="order-list-container"
            :loading="tableLoading"
            :pageData="pageData"
            :tableData="tableData"
            @pageChange="pageChange"
            @pageSizeChange="pageSizeChange"
    ></OrderList>

<!--    <NuxtLink :to="`/orders/${order.id}`">-->
<!--      {{ order.title }}-->
<!--    </NuxtLink>-->
  </div>
</template>

<style lang="scss" scoped>
  @use "@/assets/css/element-reset/button.scss" as *;
  @use "@/assets/css/element-reset/tabs.scss" as *;
  @use "@/assets/css/element-reset/select.scss" as *;
  * {
    box-sizing: border-box;
  }
  .orders {}
  .carousel-image {
    margin: 28px 0 32px;
  }
  .tabs {
    margin-bottom: 32px;
  }
  .search-form {
    padding: 0 18px 8px;
  }
  .order-list-container {
    margin: 0 -32px;
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
  }
</style>
