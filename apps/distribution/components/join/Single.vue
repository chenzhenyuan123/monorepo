<script setup name="JoinSingle">
import { CircleCheck, Warning } from '@element-plus/icons-vue';
const { joinApi } = useApi();
import { checkResponseData, successMessage, errorMessage, currencyFormat } from "@/util/index.js";
import { toLogout } from '@/util/auth.js'
import { useUserStore } from '@/store/userState.js'
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const isMobile = useIsMobile()
const userStore = useUserStore()
userStore.getUserInfo()

const storeData = ref({
  storeId: route.query?.store,
  invitationCode: route.query?.code
})
const loading = ref(false)
onMounted(() => {
  if(route.query?.store) {
    getStoreInfo()
  }
})
const storeInfo = ref({})
const storeError = ref(false)
// 获取当前店铺的信息
const getStoreInfo = async() => {
  const result = await joinApi.getStoreDistributionSettings({storeId: storeData.value.storeId})
  const res = checkResponseData(result)
  if(res) {
    storeInfo.value = res
  } else {
    storeError.value = true
  }
}

const seconds = ref(5);
const timer = ref(null);
// 定时器
const startCountdown = (val) => {
  seconds.value = val;
  timer.value = setInterval(() => {
    if (seconds.value > 0) {
      seconds.value--;
    } else {
      clearInterval(timer.value);
      routerGo('/home')
    }
  }, 1000);
};
// 是否成功加入
const issuccess = ref(false)
const joinResultData = ref({
  total: 0,
  successCount: 0,
  failCount: 0,
})
const onSubmit = async() => {
  if(!storeData.value.storeId) { // 不存在店铺ID，不允许提交
    errorMessage(t('join.joinNoStore'))
    return
  }
  if(!userStore.userInfo?.token) { // 不存在token，跳转登录页
    toLogout()
    return
  }
  loading.value = true
  const result = await joinApi.joinStore(storeData.value)
  const res = checkResponseData(result) || {}
  joinResultData.value = { ...res }
  if(joinResultData.value.successCount > 0) {
    issuccess.value = true
    startCountdown(5)
  } else {
    if(result?.code === '000401') {
      return
    }
    storeError.value = true
  }
  loading.value = false
}

const routerGo = (path) => {
  navigateTo({
    path
  })
}
</script>
<template>
  <div class="main-box" :class="{ m: isMobile }">
    <div class="email-verify-main">
      <Header />
      <div class="email-verify-box join-box">
        <div class="circle-box">
          <div class="circle-box1">
            <div class="circle-box2">
              <div class="circle-box3">
                <div class="circle-box4"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="join-icon-box">
          <img v-if="!issuccess && !storeError" src="~@/assets/imgs/user-join.svg" />
          <el-icon v-if="!storeError && issuccess" class="email-verify-icon-CircleCheck"><CircleCheck /></el-icon>
          <el-icon v-if="storeError" class="email-verify-icon-Warning"><Warning /></el-icon>
        </div>
        <h3 class="title">
          <span v-if="!issuccess && !storeError">{{$t('join.joinSaveButton')}}</span>
          <span v-if="!storeError && issuccess">{{$t('join.joinTitleSuccess')}}</span>
          <span v-if="!storeError" class="store-name">
            <el-tooltip
              v-if="storeInfo.storeName"
              class="box-item"
              effect="dark"
              :content="storeInfo.storeName"
            >
              {{storeInfo.storeName}}'s
            </el-tooltip>
          </span>
          <span v-if="!storeError">{{$t('join.joinTitle')}}</span>
        </h3>
        <template v-if="!issuccess && !storeError">
          <ul class="email-verify-error-box">
            <template v-if="storeInfo.ver === 1">
              <li>
                <span>{{$t('join.joinDescription1', {rate: (storeInfo.storeCommissionRate ? currencyFormat(storeInfo.storeCommissionRate * 100) : 0)})}}</span>
              </li>
              <li>
                <span>{{$t('join.joinDescription3')}}</span>
              </li>
              <li>
                <span>{{$t('join.joinDescription4')}}</span>
              </li>
              <li v-if="storeData.invitationCode">
                <span>{{$t('join.joinDescription5')}}</span>
              </li>
            </template>
            <template v-else-if="storeInfo.distributorDefaultCommissionRate">
              <li>
                <span>{{$t('join.joinDescriptionV2_1')}}</span>
              </li>
              <li>
                <span>{{$t('join.joinDescriptionV2_2', {rate: (storeInfo.distributorDefaultCommissionRate ? currencyFormat(storeInfo.distributorDefaultCommissionRate * 100) : 0)})}}</span>
              </li>
              <li>
                <span>{{$t('join.joinDescriptionV2_3')}}</span>
              </li>
              <li>
                <span>{{$t('join.joinDescriptionV2_4')}}</span>
              </li>
              <li>
                <span>{{$t('join.joinDescriptionV2_5')}}</span>
              </li>
              <li>
                <span>{{$t('join.joinDescriptionV2_6')}}</span>
              </li>
              <li>
                <span>{{$t('join.joinDescriptionV2_7')}}</span>
              </li>
            </template>
          </ul>
          <el-button type="primary" id="join-btn-Join" class="email-verify-btn" :loading="loading" :disabled="!storeInfo.storeId" @click="onSubmit()">{{$t('join.joinSaveButton')}}</el-button>
        </template>
        <template v-if="!storeError && issuccess">
          <p class="email-verify-text1">{{$t('join.joinPromotion', {storeName: (storeInfo.storeName+"'s")})}}</p>
          <el-button type="primary" id="email-verify-btn-login" class="email-verify-btn" @click="routerGo('/home')">{{$t('join.joinSuccessSaveButton')}}</el-button>
          <p class="email-verify-text1 margin-top0">{{$t('email-verify.emailVerifyRedirecting', {sec: seconds})}}</p>
        </template>
        <template v-if="storeError">
          <h3 class="title">{{$t('join.joinErrorTitle')}}</h3>
          <p class="email-verify-text1">{{$t('join.joinErrorTip')}}</p>
          <el-button type="primary" id="join-error-btn-goHome" class="email-verify-btn" @click="routerGo('/home')">{{$t('join.joinErrorGoHome')}}</el-button>
        </template>
      </div>
      
      <div class="footer-main">
        <Footer />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import url("@/assets/css/signup-login/style.scss");
.email-verify-main {
  display: flex;
}
.join-box {
  max-width: 526px;
  margin: 32px auto 132px;
  padding: 16px 24px;
  border-radius: 10px;
  box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
  position: relative;
  overflow: hidden;
  .email-verify-text {
    /*text-align: left*/
  }
  .email-verify-error-box{
    margin: 16px 0 16px 22px;
    .rtl & {
      margin: 16px 22px 16px 0;
    }
    li {
      font-size: 16px;
      padding-left: 4px;
      list-style: decimal;
      &::after {
        width: 0;
      }
    }
  }
  .join-icon-box {
    width: 24px;
    height: 24px;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #E4E7EC;
    /* Shadows/shadow-xs-skeuemorphic */
    box-shadow: 0px 0px 0px 1px rgba(16, 24, 40, 0.18) inset, 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    margin: 32px auto 24px;
    .email-verify-icon-CircleCheck {
      color: #079455;
      font-size: 24px
    }
    .email-verify-icon-Warning {
      color: #F04438;
      font-size: 24px
    }
    .margin-top0 {
      margin-top: 0;
    }
  }
  .circle-box {
    width: 288px;
    height: 288px;
    border-radius: 288px;
    border: 1px solid rgb(228 231 236 / 20%);
    position: absolute;
    left: calc(50% - 149px);
    top: -77px;
    z-index: 0;
    .circle-box1 {
      width: 240px;
      height: 240px;
      border-radius: 240px;
      border: 1px solid rgb(228 231 236 / 40%);
      position: absolute;
      left: calc(50% - 120px);
      top: 24px;
    }
    .circle-box2 {
      width: 192px;
      height: 192px;
      border-radius: 192px;
      border: 1px solid rgb(228 231 236 / 60%);
      position: absolute;
      left: calc(50% - 96px);
      top: 24px;
    }
    .circle-box3 {
      width: 144px;
      height: 144px;
      border-radius: 144px;
      border: 1px solid rgb(228 231 236 / 80%);
      position: absolute;
      left: calc(50% - 72px);
      top: 24px;
    }
    .circle-box4 {
      width: 96px;
      height: 96px;
      border-radius: 96px;
      border: 1px solid #E4E7EC;
      position: absolute;
      left: calc(50% - 48px);
      top: 24px;
    }
  }
  .title {
    position: relative;
    z-index: 1;
    overflow: hidden;
    display: table;
    margin: 0 auto;
    text-align: center;
    span{
      display: block;
      float: left;
      margin-right: 6px;
    }
    &:last-child {
      margin-right: 0;
    }
    .store-name {
      max-width: 230px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.m .join-box {
  width: calc(100% - 80px);
  margin: 16px auto;
  .title {
    font-size: 24px;
  }
}
</style>