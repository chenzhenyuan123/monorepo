<!--
 * @Author: czy
 * @Description: 密码重置-确认页
-->
<script setup name="PasswordReset">
import { Lock, Back, CircleCheck } from '@element-plus/icons-vue';
import { specialCharacterstr, isEmailPassword } from '@/util/validate.js'
import { checkResponseData } from "@/util/index.js";
const { contactInfoApi } = useApi();
const router = useRouter();
const route = useRoute();
const { $t: t } = useNuxtApp();
import { useUserStore } from '@/store/userState.js'
const userStore = useUserStore()
const isMobile = useIsMobile()

definePageMeta({
  layout: 'noside'
});

const loadingPage = ref(true)
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
      routerGo('/orders')
    }
  }, 1000);
};

const signupForm = ref({})
const signupFormRef = ref()
// 校验密码格式
const validatePassword = (rule, value, callback) => {
  if(!value) callback(new Error(t('password-reset.passwordResetShort')))
  const pattern = specialCharacterstr.split('').find(item => value.includes(item))
  if(value.length < 8) {
    callback(new Error(t('password-reset.passwordResetShort')))
  } else if (!(isEmailPassword(value) && pattern)) {
    callback(new Error(t('password-reset.passwordResetWeak')))
  } else {
    callback()
  }
}
// 校验密码格式
const validatePassword2 = (rule, value, callback) => {
  if (signupForm.value.password !== value) {
    callback(new Error(t('password-reset.passwordValidateInconsistent')))
  } else {
    callback()
  }
}
const rules = ()=>{
  return {
    password: [
      { required: true, message: t('password-reset.passwordValidateRequired'), trigger: 'change' },
      { validator: validatePassword, trigger: 'blur' }
    ],
    password2: [
      { required: true, message: t('password-reset.passwordValidatedEmpty'), trigger: 'change' },
      { validator: validatePassword2, trigger: 'blur' }
    ]
  }
}
const showError = ref(false)
// 跳转首页
const onSubmit = formEl => {
  formEl &&
    formEl.validate(async valid => {
      if (!valid) return

      showError.value = false
      const body = {
        email: route.query?.email,
        loginPassword: signupForm.value.password2
      }
      const result = await contactInfoApi.resetPassword(body)
      const res = checkResponseData(result, 'NO_RETURN_DATA')

      if(res) {
        if(result?.data?.token) {
          userStore.setToken(result.data)
        }
        loadingPage.value = false
        startCountdown(5)
      } else {
        showError.value = true
      }
    })
}
const routerGo = (path) => {
  navigateTo({
    path
  })
}

</script>
<template>
  <div class="email-verify-main" :class="{'m': isMobile}">
    <Header />
    <div v-if="loadingPage" class="email-verify-box">
      <div class="email-verify-icon">
        <el-icon><Lock /></el-icon>
      </div>
      <h3 class="title">{{$t('password-reset.passwordResetTitle')}}</h3>
      <p class="email-verify-text">{{$t('password-reset.passwordResetDescription')}}</p>
      <el-form ref="signupFormRef" :model="signupForm" label-position="top" :rules="rules()" require-asterisk-position="right" class="login-box" novalidate>
        <el-form-item :label="$t('password-reset.passwordResetNewPassword')" prop="password">
          <InputPassword v-model="signupForm.password" :placeholder="$t('password-reset.passwordValidateRequired')" maxlength="20" minlength="8" :class="{'error':showError}"  />
        </el-form-item>
        <el-form-item :label="$t('password-reset.passwordResetConfirmPassword')" prop="password2">
          <InputPassword v-model="signupForm.password2" :placeholder="$t('password-reset.passwordValidatedEmpty')" maxlength="20" minlength="8" :class="{'error':showError}"  />
          <p v-if="!signupForm.password" class="text margin-top6">{{$t('signup.signupValidatePasswordTip')}}</p>
        </el-form-item>
        <el-form-item>
          <PasswordValidator :data="signupForm.password" />
        </el-form-item>
      </el-form>
      <el-button type="primary" id="password-reset-btn-confirm" class="email-verify-btn" @click="onSubmit(signupFormRef)">{{$t('password-reset.passwordResetConfirm')}}</el-button>
      <div class="signup-tip text-center margin-top30">
        <el-button link class="go-back" @click="routerGo('/login')">
          <el-icon><Back /></el-icon>
          {{$t('password.passwordBackLogin')}}
        </el-button>
      </div>
    </div>
    <div v-else class="email-verify-box">
      <div class="grid-box" />
      <div class="email-verify-icon">
        <el-icon class="email-verify-icon-CircleCheck"><CircleCheck /></el-icon>
      </div>
      <h3 class="title">{{$t('email-verify.emailVerifySuccessTitlePassword')}}</h3>
      <p class="email-verify-text">{{$t('email-verify.emailVerifySuccessRedirect')}}</p>
      <el-button type="primary" id="password-reset-btn-login" class="email-verify-btn" @click="routerGo('/home')">{{$t('email-verify.emailVerifyContinue')}}</el-button>
      <p class="email-verify-text1">{{$t('email-verify.emailVerifyRedirecting', {sec: seconds})}}</p>
    </div>
    
    <div class="footer-main">
      <Footer />
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import url("@/assets/css/signup-login/style.scss");
.email-verify-box {
  margin: 96px auto 140px;
}
.m .email-verify-box {
  max-width: calc(100% - 32px)
}
</style>
<style lang="scss">
@import url("@/assets/css/global.scss");
</style>