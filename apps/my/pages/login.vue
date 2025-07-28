<script setup name="Login">
import { checkResponseData, errorMessage } from "@/util/index.js";
import { isEmail, isEmailPassword, specialCharacterstr } from '@/util/validate.js'
import {formatCreditCardNumber, normalCreditCardNumber} from "@/util/dataUtil";
import { useUserStore } from '@/store/userState.js'
import {checkEmail, checkEmailLength} from "@flylinking/core/utils/validate";
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


// 校验验证码
const validateCode = (rule, value, callback) => {
  if (checkResultData.errorForExceedingLimit) {
    // 3小时内输入超5次禁用的提示
    callback(new Error(t('withdraw.verifyCodeDialogValidateCodeExceedingLimit')))
  } else if (value && checkResultData.isVerify) {
    // 输入过即展示剩余几次的提示
    callback(new Error(t('withdraw.verifyCodeDialogValidateCodeError', { times: checkResultData.max - checkResultData.numberTimes })))
  } else {
    callback()
  }
}

// 校验邮件
const validateEmail = (rule, value, callback) => {
  if (!(checkEmailLength(value) && checkEmail(value))){
    callback(new Error(t('signup.signupValidateEmailFormat')))
  } else {
    callback()
  }
}

const rules = ()=>{
  return {
    email: [
      { required: true, message: t('signup.signupValidateEmailEmpty'), trigger: 'change' },
      { type: 'email', message: t('signup.signupValidateEmailFormat'), trigger: 'change' },
      { validator: validateEmail, trigger: 'change' },
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
const isMy = ref(true) // 是否为验证码登录
const isPasswordLogin = ref('') // 是否在邮件code输入页code,登录页login
// 输入邮箱发验证码
const goEmailCode = () => {
  const formEl = loginFormRef.value?.formRef
  formEl &&
    formEl.validate(async valid => {
      if (!valid) return
      sendLoginVerifyEmail()
    })
}
// 发送验证码
const sendLoginVerifyEmail = async() => {
  loading.value = true
  const result = await contactInfoApi.sendLoginVerifyEmail({
    email: loginForm.value.email,
    userRole: 'buyer' // distributor:分销员 buyer:买家
  })
  const res = checkResponseData(result)
  if(res) {
    if(loginForm.value?.code) loginForm.value.code = ''
    isPasswordLogin.value = 'code'
    clearInterval(timer.value)
    startCountdown(120)
  }
  loading.value = false
}
const checkResultData = reactive({
    numberTimes: 1, // 验证次数
    max: 5,  //  最大验证次数
    errorForExceedingLimit: false, // 超过最大验证次数-展示已禁用
    isVerify: false, // 验证结果-true展示当前已输入几次
})
// 重置code正确校验
const removeCodeVerify = () => {
    checkResultData.isVerify = false
}
// 验证码登录
const codeSubmit = () => {
  const formEl = loginFormRef.value?.formRef
  formEl &&
    formEl.validate(async valid => {
      if (!valid) return
      loading.value = true
      const body = {
        email: loginForm.value.email,
        verifyCode: normalCreditCardNumber(loginForm.value.code),
        userRole: 'buyer' // distributor:分销员 buyer:买家
      }
      const result = await contactInfoApi.loginWithVerifyCode(body)
      const res = checkResponseData(result)
      if(res) {
        if(res.isVerify && res?.loginCO) {
          if(res?.loginCO?.token) {
            userStore.setToken(res.loginCO)
            routerGo('/orders')
          }
          return
        }
        checkResultData.numberTimes = res?.numberTimes
        checkResultData.isVerify = !res.isSuccess
        checkResultData.errorForExceedingLimit = res.numberTimes===5
      } else {
        checkResultData.errorForExceedingLimit = true
      }
      loading.value = false
      formEl.validateField('code')
    })
}
// 返回邮件
const codeBack = () => { 
  isPasswordLogin.value = ''
  checkResultData.isVerify = false
  checkResultData.errorForExceedingLimit = false
  clearInterval(timer.value);
}

const onSubmit = () => {
  const formEl = loginFormRef.value?.formRef
  formEl &&
    formEl.validate(async valid => {
      if (!valid) return
      showError.value = false
      loading.value = true
      const body = {
        ...loginForm.value,
        userRole: 'buyer' // distributor:分销员 buyer:买家
      }
      const result = await contactInfoApi.userLogin(body)
      const res = checkResponseData(result)
      if(res && res?.isVerify) {
        if(res?.loginCO?.token) {
          userStore.setToken(res.loginCO)
          routerGo('/orders')
        }
      } else {
        showError.value = true
        if(res?.failReason && !res?.isVerify) errorMessage(t(`service.${res.failCode}`) || res.failReason)
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
  sendLoginVerifyEmail()
};

</script>
<template>
  <div class="main-box" :class="{ m: isMobile }">
    <div class="signup-box">
      <div v-if="!isMobile" class="left">
        <CarouselImage system="105" height="100" />
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
            onsubmit="return false;"
          >
            <template v-if="isMy && !isPasswordLogin">
              <el-form-item
                :label="$t('login.loginFormEmail')"
                prop="email"
              >
                <el-input v-model="loginForm.email" maxlength="254" :placeholder="$t('login.flyLinkAccount')" class="direction-ltr-input" :class="{'error':showError}" />
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
                <el-input v-model="loginForm.code" maxlength="254" :placeholder="$t('login.loginFormCodeplaceholder')" class="direction-ltr-input" :class="{'error':showError}"
                @input="e => { loginForm.code = formatCreditCardNumber(e);removeCodeVerify(); }" />
              </el-form-item>
              <!-- 输入过即展示剩余几次的提示 -->
              <el-form-item v-if="checkResultData.isVerify && !checkResultData.errorForExceedingLimit" label="">
                <span class="margin-right6 loginValidateCodeErrorTip">{{$t('login.loginValidateCodeErrorTip1')}}</span>
              </el-form-item>
              <!-- 3小时内输入超5次禁用的提示 -->
              <el-form-item v-if="checkResultData.errorForExceedingLimit" label="">
                <span class="margin-right6 loginValidateCodeErrorTip">{{$t('login.loginValidateCodeErrorTip2')}}</span>
              </el-form-item>
              <el-form-item v-if="!checkResultData.errorForExceedingLimit" label="">
                <span class="margin-right6">{{$t('login.receiveCode')}}</span>
                <el-link type="primary" underline="never" @click="sendAgain">
                  <span v-if="seconds>0">{{$t('withdraw.verifyCodeDialogP4_countdown', { sec: seconds })}}</span>
                  <span v-else>{{$t('email-sent.emailSentAgain')}} </span>
                  
                </el-link>
              </el-form-item>
              <el-form-item>
                <el-button v-if="!checkResultData.errorForExceedingLimit" type="primary" id="login-btn-login" class="signup-btn" :loading="loading" @click="codeSubmit()">{{ $t('login.loginAccount') }}</el-button>
                <el-button id="login-btn-login" class="signup-btn margin-top16" @click="codeBack()">{{ $t('email-sent.emailSentBack') }}</el-button>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item
                :label="$t('login.loginFormEmail')"
                prop="email"
              >
                <el-input v-model="loginForm.email" maxlength="254" :placeholder="$t('login.loginFormEmailplaceholder')" class="direction-ltr-input" :class="{'error':showError}" />
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
          <div v-if="isPasswordLogin!=='code'" class="signup-tip text-center">
            <p class="text">{{$t('login.loginhasAccount')}}</p>
            <el-link type="primary" underline="never" @click="routerGo('/signup')">{{$t('signup.signupTilte')}}</el-link>
          </div>
          <div v-if="isMy && isPasswordLogin!=='login'" class="signup-tip text-center">
            <el-link type="primary" underline="never" @click="isPasswordLogin='login'">{{$t('login.loginUsePassword')}}</el-link>
          </div>
          <div v-if="isMy && isPasswordLogin==='login'" class="signup-tip text-center">
            <el-link type="primary" underline="never" @click="isPasswordLogin=''">{{$t('login.loginUseOneTimeCode')}}</el-link>
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
.loginValidateCodeErrorTip {
  line-height: 20px;
  margin-top: 10px;
}
</style>