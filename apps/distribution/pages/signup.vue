<script setup name="Signup">
import { checkResponseData } from "@/util/index.js";
import { isEmail, isEmailPassword, specialCharacterstr } from '@/util/validate.js'
const { contactInfoApi } = useApi();
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const isMobile = useIsMobile()

definePageMeta({
  layout: 'noside'
});

const signupForm = ref({})
const signupFormRef = ref()
const isFocused = ref(false)
// 校验邮箱格式
const validateEmail = (rule, value, callback) => {
  if (!isEmail(value)) {
    callback(new Error(t('signup.signupValidateEmailFormat')))
  } else {
    callback()
  }
}
// 校验密码格式
const validatePassword = (rule, value, callback) => {
  if(!value) callback(new Error(t('signup.signupValidatePasswordFormat')))
  const pattern = specialCharacterstr.split('').find(item => value.includes(item))
  if (!(isEmailPassword(value) && pattern)) {
    callback(new Error(t('signup.signupValidatePasswordFormat')))
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
      { required: true, message: t('signup.signupValidatePasswordRequired'), trigger: 'change' },
      { validator: validatePassword, trigger: 'blur' }
    ]
  }
}
const showError = ref(false)
const loading = ref(false)
const onSubmit = formEl => {
  formEl &&
    formEl.validate(async valid => {
      if (!valid) return
      // 如果路由参数上存在邀请码、店铺code要传递
      if(route.query?.store) {
        signupForm.value.storeCode = route.query.store
      }
      if(route.query?.code) {
        signupForm.value.invitationCode = route.query.code
      }
      showError.value = false
      loading.value = true
      const result = await contactInfoApi.userRegister(signupForm.value)
      const res = checkResponseData(result, 'NO_RETURN_DATA')
      if(res) {
          navigateTo({
            path: '/email-sent',
            query: {
              email: signupForm.value.email,
              type: 'register'
            }
          })
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
        <CarouselImage system="100" height="100" />
      </div>
      <div class="right">
        <Header />
        <div class="signup-right-box">
          <h4 class="signup-title">{{ $t('signup.signupTilte') }}</h4>
          <div class="signup-tip">
            <p class="text">{{ $t('signup.signupHaveAccount') }}</p>
            <el-link type="primary" underline="never" @click="routerGo('/login')">{{ $t('login.loginFormSaveButton')}}</el-link>
          </div>
          <el-form ref="signupFormRef" :model="signupForm" label-position="top" require-asterisk-position="right" :rules="rules()" class="login-box" novalidate>
            <el-form-item :label="$t('login.loginFormEmail')" prop="email">
              <el-input v-model="signupForm.email" type="email" maxlength="254" :placeholder="$t('signup.signupValidateEmailEmpty')" :class="{'error':showError}" />
            </el-form-item>
            <el-form-item :label="$t('login.loginFormPassword')" prop="loginPassword">
              <InputPassword v-model="signupForm.loginPassword" :placeholder="$t('signup.signupValidatePasswordEmpty')" maxlength="20" minlength="8" :class="{'error':showError}" @isFocusedChange="(e)=>isFocused=e" />
              <!-- <p v-if="!signupForm.loginPassword && isFocused" class="text margin-top6">{{$t('signup.signupValidatePasswordTip')}}</p> -->
            </el-form-item>
            <el-form-item>
              <PasswordValidator :data="signupForm.loginPassword" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" id="signup-btn-getStarted" class="signup-btn" :loading="loading" @click="onSubmit(signupFormRef)">{{$t('signup.signupFormSaveButton')}}</el-button>
            </el-form-item>
          </el-form>
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
        margin: 32px auto;
      }
    }
  }
}

</style>
