<script setup>
import { Search } from '@element-plus/icons-vue'
import { checkResponseData, currencyFormat, arrToDict } from "@/util/index.js"
const { myCouponsApi } = useApi()
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const router = useRouter()

const isMobile = useIsMobile()
const activeName = ref('MyCoupons')
const tabsData = computed(() => {
  return [
    { value: 'MyCoupons', label: t('router.MyCoupons') },
    { value: 'UsageHistory', label: t('MyCoupons.UsageHistory') }
  ]
})

const MyCouponsGroups = ref('UNUSED')

const jumpToWallet = () => {
    router.push({
        path: '/account/wallet'
    })
}

// 分页
const loading = ref(false)
const MyCouponsList = ref([]) // 权益卡列表
const MyCouponsTotal = ref({}) // 权益卡数量
const total = ref(0) // 权益卡数量
const page = reactive({
  pageSize: 6,
  pageNo: 1
})
const handleSizeChange = val => {
  page.pageSize = val
  page.pageNo = 1
  getMyCouponsList()
}
const handleCurrentChange = val => {
  if (page.pageNo === val) return
  page.pageNo = val
  getMyCouponsList()
}
const handleClick = tab => {
  activeName.value = tab
}
// 优惠券状态切换
const MyCouponsGroupsChange = (tab) => {
  MyCouponsGroups.value = tab
  page.pageNo =  1
  page.pageSize =  6
  getMyCouponsList()
}

// 获取优惠券列表
const getMyCouponsList = async() => {
  MyCouponsList.value = []
  loading.value = true
  const body = {
    status: MyCouponsGroups.value,
    pageNo: page.pageNo,
    pageSize: page.pageSize
  }
  const result = await myCouponsApi.couponListMembershipCardStatus(body)
  const res = checkResponseData(result)
  if(res) {
    MyCouponsList.value = res.cardList
    MyCouponsTotal.value = {
      unusedTotal: res.unusedTotal, // 未使用总数
      usedTotal: res.usedTotal, // 已使用总数
      expiredTotal: res.expiredTotal // 已过期总数
    }
    total.value = MyCouponsGroups.value==='UNUSED' ? res.unusedTotal : (MyCouponsGroups.value==='USED' ? res.usedTotal : res.expiredTotal)
  } else {
    MyCouponsList.value = []
  }
  loading.value = false
}

onMounted(()=>{
  getMyCouponsList()
})

</script>

<template>
  <div :class="{ 'page MyCoupons-box': true, 'm': isMobile }">
    <h3 class="MyCoupons-title">{{$t('router.MyCoupons')}}</h3>
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
    <el-tabs v-else v-model="activeName" class="tabs tabs-default" @tab-change="handleClick">
      <el-tab-pane v-for="item in tabsData" :key="item.value" :id="'MyCoupons-' + item.value" :label="item.label" :name="item.value"></el-tab-pane>
    </el-tabs>
    <!-- 我的优惠券 -->
    <div v-if="activeName==='MyCoupons'" class="mt32">
      <div>
        <el-button type="primary" class="button-default" @click="jumpToWallet">{{$t('MyCoupons.WithdrawNow')}}</el-button>
      </div>
      <el-radio-group v-model="MyCouponsGroups" class="radio-group radio-group-default MyCoupons-groups" @change="MyCouponsGroupsChange">
        <!-- 未使用优惠券 -->
        <el-radio-button id="'MyCoupons-Unused" value="UNUSED">{{$t('MyCoupons.Unused')}} ({{MyCouponsTotal.unusedTotal || 0}})</el-radio-button>
        <!-- 已使用优惠券 -->
        <el-radio-button id="'MyCoupons-Used" value="USED">{{$t('MyCoupons.Used')}} ({{MyCouponsTotal.usedTotal || 0}})</el-radio-button>
        <!-- 已过期优惠券 -->
        <el-radio-button id="'MyCoupons-Invalid" value="EXPIRED">{{$t('MyCoupons.Invalid')}} ({{MyCouponsTotal.expiredTotal || 0}})</el-radio-button>
      </el-radio-group>
      <div class="mt32">
        <div>
          <!-- 优惠券列表 -->
          <AccountMyCouponsList :membershipCardData="MyCouponsList" :isFlex="true" :isDisabled="MyCouponsGroups!=='UNUSED'" :loading="loading" :count="page.pageSize" /> 
          <div class="mt32">
            <!-- 分页 -->
            <Pagination
              v-if="MyCouponsList.length>0"
              :current-page="page.pageNo"
              :page-sizes="[6, 12, 24, 50, 100, 200]"
              :page-size="page.pageSize"
              :total="total"
              :pager-count="5"
              @update:page-size="handleSizeChange"
              @update:current-page="handleCurrentChange"
            />
          </div>
        </div>
        <!-- 暂无数据时展示 -->
        <div v-if="MyCouponsList.length<=0 && !loading" class="no-data-box">
          <EmptyData noDataTitle="MyCoupons.NoCoupon" noDataText="MyCoupons.NoCouponTips" iconType="Search" />
        </div>
      </div>
    </div>

    <!-- 使用历史 -->
    <div v-else-if="activeName==='UsageHistory'">
      <LazyAccountMyCouponsUsageHistoryList v-if="activeName==='UsageHistory'" />
    </div>

  </div>
</template>

<style lang="scss" scoped>
@import url("@/assets/css/element-reset/button.scss");
@import url("@/assets/css/element-reset/tabs.scss");
@import url("@/assets/css/element-reset/input.scss");
@import url("@/assets/css/element-reset/select.scss");
@import url("@/assets/css/element-reset/radio.scss");

.MyCoupons-box {
  margin-bottom: 40px;
  .MyCoupons-title {
    margin-bottom: 30px;
    color: var(--colors-text-text-primary-900, #101828);
    font-family: var(--Font-family-font-family-display, Inter);
    font-size: var(--Font-size-display-sm, 30px);
    font-weight: 600;
    line-height: var(--Line-height-display-sm, 38px);
  }
  .MyCoupons-groups {
    margin-top: 32px;
  }
}

.page {
  &.m {
    padding: 0 16px;
    .MyCoupons-groups {
      display: flex;
      border-radius: var(--el-border-radius-base);
      align-items: stretch;
      :deep(.el-radio-button) {
        flex: 1;
        min-width: 0;
      }
      :deep(.el-radio-button + .el-radio-button) {
        border-left: 1px solid var(--el-border-color);
      }

      :deep(.el-radio-button__inner) {
        width: 100%;
        min-height: 40px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0 !important;
        white-space: normal;
        word-break: break-word;
      }
      
      :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
        box-shadow: none !important;
        border-radius: 0;
      }
    }
  }
}
.rtl .MyCoupons-groups {
  :deep(.el-radio-button + .el-radio-button) {
    border-right: 1px solid var(--el-border-color);
    .el-radio-button__inner {
      border-left: 0;
    }
  }
}
</style>