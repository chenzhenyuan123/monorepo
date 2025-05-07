<script setup name="Login">
import { checkResponseData } from "@/util/index.js";
import { isEmail, isEmailPassword, specialCharacterstr } from '@/util/validate.js'
import {formatCreditCardNumber, normalCreditCardNumber} from "@/util/dataUtil";
import { useUserStore } from '@/store/userState.js'
const { contactInfoApi } = useApi();

const { $locale, $t: t } = useNuxtApp();
const userStore = useUserStore()
const router = useRouter();
const route = useRoute();
const isMobile = useIsMobile()
definePageMeta({
  layout: 'noside'
})

const loginForm = ref({})
const loginFormRef = ref()

// 校验邮箱格式
const validateEmail = (rule, value, callback) => {
  if (!isEmail(value) && value) {
    callback(new Error(t('signup.signupValidateEmailFormat')))
  } else {
    callback()
  }
}
// 校验验证码
const validateCode = (rule, value, callback) => {
  if (checkResultData.errorForExceedingLimit || createCodeData.createCodeError) {
    // 3小时内输入超5次禁用的提示
    callback(new Error(t('withdraw.verifyCodeDialogValidateCodeExceedingLimit')))
  } else if (value && checkResultData.isVerify === false) {
    // 输入过即展示剩余几次的提示
    callback(new Error(t('withdraw.verifyCodeDialogValidateCodeError', { times: checkResultData.max - checkResultData.numberTimes })))
  } else {
    callback()
  }
}
const rules = ()=>{
  return {
    email: [
      { required: true, message: t('signup.signupValidateEmailEmpty'), trigger: 'change' },
      { validator: validateEmail, trigger: 'change' }
    ],
    loginPassword: [
      { required: true, message: t('signup.signupValidatePasswordRequired'), trigger: 'change' }
    ],
    code: [
      { required: true, message: t('login.loginValidateCodeRequired'), trigger: 'change' },
      { validator: validateCode, trigger: 'change' }
    ]
  }
}
const showError = ref(false)
const loading = ref(false)
const isMy = ref(true) // 是否为买家中心
const isPasswordLogin = ref('') // 是否在邮件code输入页code,登录页login
// 输入邮箱发验证码
const goEmailCode = () => {
  const formEl = loginFormRef.value?.formRef
  formEl &&
    formEl.validate(async valid => {
      if (!valid) return

      isPasswordLogin.value = 'code'
      startCountdown(120)
    })
}
const createCodeData = reactive({
    loading: false,
    createCodeError: false,
})
const checkResultData = reactive({
    loading: false,
    code: '',
    numberTimes: 1,
    max: 5,
    errorForExceedingLimit: false,
    isVerify: undefined,
    checkCode: undefined,
})
// 重置code正确校验
const removeCodeVerify = () => {
    checkResultData.isVerify = undefined
}
const codeSubmit = () => {
  const formEl = loginFormRef.value?.formRef
  formEl &&
    formEl.validate(async valid => {
      if (!valid) return
      // loading.value = true
      // 验证码校验，成功则登录
    })
  }

const onSubmit = () => {
  const formEl = loginFormRef.value?.formRef
  formEl &&
    formEl.validate(async valid => {
      if (!valid) return
      showError.value = false
      loading.value = true
      const result = await contactInfoApi.userLogin(loginForm.value)
      const res = checkResponseData(result)
      if(res) {
        if(res?.token) {
          userStore.setToken(res)
          // 如果是买家中心，跳转订单页面
          routerGo('/orders')
        }
      } else {
        showError.value = true
      }
      loading.value = false
      
    })
}
const routerGo = (path) => {
  navigateTo({
    path,
    query: route.query
  })
}
// 倒计时
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
  // const result = await contactInfoApi.againsendVerifyEmail({email: route.query.email, verifyType: route.query.type})
  // const res = checkResponseData(result, 'NO_RETURN_DATA')
  // if(res) {
  //   startCountdown(120)
  // }
};

</script>
<template>
  <div class="main-box" :class="{ m: isMobile }">
    <div class="signup-box">
      <div v-if="!isMobile" class="left">
        <CarouselImage system="103" height="100" />
      </div>
      <div class="right">
        <Header />
        <div class="signup-right-box">
          <template v-if="isMy && !isPasswordLogin">
            <h4 class="signup-title text-center">{{$t('login.loginToTitle')}}</h4>
          </template>
          <template v-else-if="isPasswordLogin==='code'">
            <h4 class="signup-title text-center">{{$t('login.enterOneTimeCode')}}</h4>
            <div class="signup-tip text-center">
              <p class="text font-size16">{{$t('login.oneCodeTo', {email: loginForm.email})}}</p>
            </div>
          </template>
          <template v-else>
            <h4 class="signup-title text-center">{{$t('login.loginTilte')}}</h4>
            <div class="signup-tip text-center">
              <p class="text font-size16">{{$t('login.loginWelcome')}}</p>
            </div>
          </template>
          <FormValidate
            ref="loginFormRef"
            :model="loginForm"
            label-position="top"
            :rules="rules()"
            :validate-on-rule-change="false"
            require-asterisk-position="right"
            class="login-box"
            novalidate
          >
            <template v-if="isMy && !isPasswordLogin">
              <el-form-item
                :label="$t('login.flyLinkAccount')"
                prop="email"
              >
                <el-input v-model="loginForm.email" maxlength="254" :placeholder="$t('login.flyLinkAccount')" :class="{'error':showError}" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" id="login-btn-login" class="signup-btn" :loading="loading" @click="goEmailCode()">{{ $t('email-verify.emailVerifyContinue') }}</el-button>
              </el-form-item>
            </template>
            <template v-else-if="isPasswordLogin==='code'">
              <el-form-item
                :label="$t('login.loginFormCodeplaceholder')"
                prop="code"
              >
                <el-input v-model="loginForm.code" maxlength="254" :placeholder="$t('login.loginFormCodeplaceholder')" :class="{'error':showError}"
                @input="e => { loginForm.code = formatCreditCardNumber(e);removeCodeVerify(); }" />
                <span v-if="showError" class="margin-right6">{{$t('login.loginValidateCodeErrorTip3')}}</span>
              </el-form-item>
              <!-- 输入过即展示剩余几次的提示 -->
              <!-- <el-form-item label="">
                <span class="margin-right6">{{$t('login.loginValidateCodeErrorTip1')}}</span>
              </el-form-item> -->
              <!-- 3小时内输入超5次禁用的提示 -->
              <!-- <el-form-item label="">
                <span class="margin-right6">{{$t('login.loginValidateCodeErrorTip2')}}</span>
              </el-form-item> -->
              <el-form-item label="">
                <span class="margin-right6">{{$t('login.receiveCode')}}</span>
                <el-link type="primary" underline="never" @click="sendAgain">
                  <span v-if="seconds>0">{{$t('withdraw.verifyCodeDialogP4_countdown', { sec: seconds })}}</span>
                  <span v-else>{{$t('email-sent.emailSentAgain')}} </span>
                  
                </el-link>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" id="login-btn-login" class="signup-btn" :loading="loading" @click="codeSubmit()">{{ $t('login.loginAccount') }}</el-button>
                <el-button id="login-btn-login" class="signup-btn margin-top16" @click="isPasswordLogin=''">{{ $t('email-sent.emailSentBack') }}</el-button>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item
                :label="$t('login.loginFormEmail')"
                prop="email"
              >
                <el-input v-model="loginForm.email" maxlength="254" :placeholder="$t('login.loginFormEmailplaceholder')" :class="{'error':showError}" />
              </el-form-item>
              <el-form-item :label="$t('login.loginFormPassword')" prop="loginPassword">
                <InputPassword v-model="loginForm.loginPassword" maxlength="20" minlength="8" :class="{'error':showError}" />
              </el-form-item>
              <el-form-item class="remember-box">
                <el-link type="primary" underline="never" @click="routerGo('/password')">{{$t('login.loginForgotPassword')}}</el-link>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" id="login-btn-login" class="signup-btn" :loading="loading" @click="onSubmit()">{{ $t('login.loginFormSaveButton') }}</el-button>
              </el-form-item>
            </template>
          </FormValidate>
          <div v-if="isMy && isPasswordLogin!=='login'" class="signup-tip text-center">
            <el-link type="primary" underline="never" @click="isPasswordLogin='login'">{{$t('login.loginUsePassword')}}</el-link>
          </div>
          <div v-if="isMy && isPasswordLogin==='login'" class="signup-tip text-center">
            <el-link type="primary" underline="never" @click="isPasswordLogin=''">{{$t('login.loginUseOneTimeCode')}}</el-link>
          </div>
          <div v-if="!isMy" class="signup-tip text-center">
            <p class="text">{{$t('login.loginhasAccount')}}</p>
            <el-link type="primary" underline="never" @click="routerGo('/signup')">{{$t('signup.signupTilte')}}</el-link>
          </div>
        </div>
        
        <div class="padding32">
          <Footer />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import url("@/assets/css/signup-login/style.scss");

.signup-box {
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  min-height: 100%;
  .left {
    flex: 31;
    .carousel-container {
      border-radius: 0;
    }
  }
  :deep(.left .carousel-container) {
    .el-carousel__container .store-goods-module-item-image img {
      height: 100%;
    }
  }
  .right {
    flex: 20;
    min-width: 480px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    .signup-right-box {
      width: 360px;
      padding: 0;
      margin: 150px auto 32px;
    }
  }
}
// 移动端样式
.m {
  .signup-box{
    .left {
      width: 0;
    }
    .right {
      flex: 1;
      min-width: 100%;
      max-width: 100%;
      .signup-right-box {
        padding: 32px 16px;
        width: calc(100% - 32px);
        min-height: 400px;
        margin: 32px auto 0;
      }
    }
  }
}
.text-center {
  text-align: center;
}
</style>