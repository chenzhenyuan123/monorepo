<script setup name="Login">
import { checkResponseData } from "@/util/index.js";
import { isEmail, isEmailPassword, specialCharacterstr } from '@/util/validate.js'
import { useUserStore } from '@/store/userState.js'
const { contactInfoApi } = useApi();

const { $t: t } = useNuxtApp();
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
  if (!isEmail(value)) {
    callback(new Error(t('signup.signupValidateEmailFormat')))
  } else {
    callback()
  }
}
const rules = ()=>{
  return {
    email: [
      { required: true, message: t('signup.signupValidateEmailEmpty'), trigger: 'change' },
      { validator: validateEmail, trigger: 'blur' }
    ],
    loginPassword: [
      { required: true, message: t('signup.signupValidatePasswordRequired'), trigger: 'change' }
    ]
  }
}
const showError = ref(false)
const loading = ref(false)
const onSubmit = formEl => {
  formEl &&
    formEl.validate(async valid => {
      if (!valid) return
      showError.value = false
      loading.value = true
      const result = await contactInfoApi.userLogin(loginForm.value)
      const res = checkResponseData(result)
      if(res) {
        if(res?.token) {
          // 如果是join页面携带的storeId，需要跳转join页面加入分销员
          if(route.query?.store) {
            routerGo('/join')
          } else {
            routerGo('/home')
          }
          userStore.setToken(res)
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
          <h4 class="signup-title text-center">{{$t('login.loginTilte')}}</h4>
          <div class="signup-tip text-center">
            <p class="text font-size16">{{$t('login.loginWelcome')}}</p>
          </div>
          <el-form ref="loginFormRef" :model="loginForm" label-position="top" :rules="rules()" require-asterisk-position="right" class="login-box" novalidate>
            <el-form-item
              :label="$t('login.loginFormEmail')"
              prop="email"
            >
              <el-input v-model="loginForm.email" maxlength="254" :class="{'error':showError}" />
            </el-form-item>
            <el-form-item :label="$t('login.loginFormPassword')" prop="loginPassword">
              <InputPassword v-model="loginForm.loginPassword" maxlength="20" minlength="8" :class="{'error':showError}" />
            </el-form-item>
            <el-form-item class="remember-box">
              <el-link type="primary" underline="never" @click="routerGo('/password')">{{$t('login.loginForgotPassword')}}</el-link>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" id="login-btn-login" class="signup-btn" :loading="loading" @click="onSubmit(loginFormRef)">{{ $t('login.loginFormSaveButton') }}</el-button>
            </el-form-item>
          </el-form>
          <div class="signup-tip text-center margin-top30">
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