<script setup name="signupSend">
import { Back } from '@element-plus/icons-vue';
import { checkResponseData, errorMessage, successMessage } from "@/util/index.js";
const { contactInfoApi } = useApi();
const router = useRouter();
const route = useRoute();
const isMobile = useIsMobile()

definePageMeta({
  layout: 'noside'
});
const routerGo = () => {
  navigateTo({
    path: route.query.type==='resetPassword' ? '/password' : 'signup'
  })
}
const seconds = ref(120);
const timer = ref(null);
// 定时器
const startCountdown = (val) => {
  seconds.value = val;
  timer.value = setInterval(() => {
    if (seconds.value > 0) {
      seconds.value--;
    } else {
      clearInterval(timer.value);
    }
  }, 1000);
};
// 重新发送邮件
const sendAgain = async() => {
  if (seconds.value > 0) {
    return;
  }
  const result = await contactInfoApi.againsendVerifyEmail({email: route.query.email, verifyType: route.query.type})
  const res = checkResponseData(result, 'NO_RETURN_DATA')
  if(res) {
    startCountdown(120)
  }
};
const email = ref('')
const emailType = ref('')
onMounted(() => {
  startCountdown(120)
  email.value = route.query?.email
  emailType.value = route.query?.type
});
onUnmounted(() => {
  clearInterval(timer.value);
});

</script>
<template>
  <div class="main-box" :class="{ m: isMobile }">
    <div class="login-box">
      <Header />
      <div class="signup-right-box">
        <div class="grid-box" />
        <div class="icon-box">
          <img src="~@/assets/imgs/email.svg" />
        </div>
        <h4 class="signup-title text-center">{{$t('email-sent.emailSentTitle')}}</h4>
        <div class="signup-tip text-center">
          <p class="text font-size16">
            <span v-if="emailType==='password'">{{$t('email-sent.emailSentpasswordReset')}} </span>
            <span v-else>{{$t('email-sent.emailSentEmail')}} </span>
            <b class="font-weight600">{{email}}</b>
          </p>
        </div>
        <div class="signup-tip text-center margin-top30">
          <p class="text">{{$t('email-sent.emailSentNoReceive')}}</p>
          <el-link type="primary" :underline="false" class="font-weight600" :class="{'defalt-color': seconds>0}" @click="sendAgain">
            {{$t('email-sent.emailSentAgain')}} 
            <span v-if="seconds>0" class="margin-left4"> ({{$t('email-sent.emailSentSecs', {sec: seconds})}})</span>
          </el-link>
        </div>
        <div class="signup-tip text-center margin-top30">
          <el-button link class="go-back" @click="routerGo()">
            <el-icon><Back /></el-icon>
            <span v-if="emailType==='password'">{{$t('password.passwordBackLogin')}}</span>
            <span v-else>{{$t('email-sent.emailSentBack')}}</span>
          </el-button>
        </div>
      </div>
      
      <div class="footer-main">
        <Footer />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import url("@/assets/css/global.scss");
@import url("@/assets/css/signup-login/style.scss");

.login-box {
  width: 100%;
  min-width: 360px;
  max-width: 1440px;
  margin: 0 auto;
  .font-size16 {
    font-size: 16px;
  }
  .signup-right-box {
    max-width: 360px;
    padding: 0;
    margin: 96px auto 96px;
    min-height: calc(100vh - 400px);
    .message {
      margin-bottom: 32px;
    }
    .defalt-color.el-link{
      color: #667085;
      cursor: auto;
    }
    .go-back {
      color: #475467;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      .el-icon {
        color: #475467;
        font-size: 20px;
        margin-right: 6px;
      }
    }
    .font-weight600{
      font-weight: 600;
    }
  }
  .margin-top30 {
    margin-top: 30px;
  }
  .margin-left4 {
    margin-left: 4px;
  }
  .icon-box {
    margin: 0 auto 24px;
    display: flex;
    width: 28px;
    height: 28px;
    padding: 14px;
    background: #fff;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    border: 1px solid #E4E7EC;
    box-shadow: 0px 0px 0px 1px rgba(16, 24, 40, 0.18) inset, 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  }
}
.m .login-box {
  min-width: 100%;
  max-width: 100%;
  .signup-right-box {
    max-width: 100%;
    padding: 32px 16px;
    margin: 0;
  }
}
.text-center {
  text-align: center;
}

</style>