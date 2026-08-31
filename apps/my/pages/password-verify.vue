<!--
 * @Author: czy
 * @Description: 重置密码确认页
-->
<script setup name="EmailVerify">
import { CircleCheck, Warning, Back } from '@element-plus/icons-vue';
import { checkResponseData, errorMessage } from '@/util/index.js';
const { contactInfoApi } = useApi();
const router = useRouter();
const route = useRoute();

definePageMeta({
  layout: 'noside'
});

const loadingPage = ref(true);

const routeEmailData = ref({});
const status = ref(false);
const GetcheckVerifyCode = async () => {
  const body = {
    email: routeEmailData.value?.email,
    code: routeEmailData.value?.code,
    verifyType: 'resetPassword',
    userRole: 'buyer' // distributor:分销员 buyer:买家
  };

  const result = await contactInfoApi.checkVerifyCode(body);
  const res = checkResponseData(result, 'NO_RETURN_DATA');
  if (res) {
    status.value = true;
    onSubmit();
  } else {
    status.value = false;
  }
  loadingPage.value = false;
};
// 跳转首页-已登录
const onSubmit = () => {
  navigateTo({
    path: '/password-reset',
    query: {
      email: routeEmailData.value.email,
      code: routeEmailData.value.code
    }
  });
};

onMounted(() => {
  routeEmailData.value = Object.assign({}, route.query);
  if (routeEmailData.value.email && routeEmailData.value.code) {
    GetcheckVerifyCode();
  }
});
</script>
<template>
  <div class="email-verify-main">
    <Header />
    <div
      v-if="loadingPage"
      class="email-verify-box"
    >
      <div
        v-loading="loadingPage"
        :element-loading-text="$t('common.loading')"
        class="custom-loading-svg"
        style="height: 160px"
      />
      <p class="email-verify-text">{{ $t('email-verify.emailVerifyLoddingDescription') }}</p>
    </div>
    <div v-else>
      <!-- <div v-if="status" class="email-verify-box">
        <div class="grid-box" />
        <div class="email-verify-icon">
          <el-icon class="email-verify-icon-CircleCheck"><CircleCheck /></el-icon>
        </div>
        <h3 class="title">{{$t('email-verify.emailVerifySuccessTitlePassword')}}</h3>
        <p class="email-verify-text">{{$t('email-verify.emailVerifySuccessRedirect')}}</p>
        <el-button type="primary" id="email-verify-btn-login" class="email-verify-btn" @click="onSubmit()">{{$t('email-verify.emailVerifyContinue')}}</el-button>
        <p class="email-verify-text1">{{$t('email-verify.emailVerifyRedirecting', {sec: seconds})}}</p>
      </div> -->
      <div
        v-if="!status"
        class="email-verify-box"
      >
        <div class="grid-box" />
        <div class="email-verify-icon">
          <el-icon class="email-verify-icon-Warning"><Warning /></el-icon>
        </div>
        <h3 class="title">{{ $t('email-verify.emailVerifyErrorTitle') }}</h3>
        <p class="email-verify-text">{{ $t('email-verify.emailVerifyErrorStep') }}</p>

        <ul class="email-verify-error-box">
          <li>
            <b>{{ $t('email-verify.emailVerifyErrorDescription1') }}</b>
            <span>{{ $t('email-verify.emailVerifyErrorDescription1Text') }}</span>
          </li>
          <li>
            <b>{{ $t('email-verify.emailVerifyErrorDescription2') }}</b>
            <span>{{ $t('email-verify.emailVerifyErrorDescription2Text') }}</span>
          </li>
          <li>
            <b>{{ $t('email-verify.emailVerifyErrorDescription3') }}</b>
            <span>{{ $t('email-verify.emailVerifyErrorDescription3Text') }}</span>
          </li>
        </ul>

        <div class="signup-tip text-center margin-top30">
          <el-button
            link
            class="go-back"
            @click="routerGo('/signup')"
          >
            <el-icon><Back /></el-icon>
            {{ $t('email-sent.emailSentBack') }}
          </el-button>
        </div>
      </div>
    </div>

    <div class="footer-main">
      <Footer />
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import url('@/assets/css/signup-login/style.scss');
.email-verify-box {
  min-height: calc(100vh - 400px);
  max-width: 380px;
}
</style>
