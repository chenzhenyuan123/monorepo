<!--
 * @Author: czy
 * @Description: 密码重置
-->
<script setup name="Password">
import { Back } from '@element-plus/icons-vue';
import { isEmail } from '@/util/validate.js'
import { checkResponseData } from "@/util/index.js";
const { contactInfoApi } = useApi();
const router = useRouter();
import { useI18n } from "vue-i18n";
import {checkEmail, checkEmailLength} from "@flylinking/core/utils/validate";
const { t } = useI18n();

definePageMeta({
  layout: 'noside'
});

const signupForm = ref({})
const signupFormRef = ref()

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
      { required: true, message: t('signup.signupValidateEmailEmpty'), trigger: 'blur' },
      { type: 'email', message: t('signup.signupValidateEmailFormat'), trigger: 'change' },
      { validator: validateEmail, trigger: 'change' },
    ]
  }
}

const showError = ref(false)
const loading = ref(false)
// 重置密码
const onSubmit = () => {
  const formEl = signupFormRef.value?.formRef
  formEl &&
    formEl.validate(async valid => {
      if (!valid) return
      
      showError.value = false
      loading.value = true
      const body = {
        email: signupForm.value.email,
        verifyType: 'resetPassword',
        userRole: 'buyer' // distributor:分销员 buyer:买家
      }
      const result = await contactInfoApi.againsendVerifyEmail(body)
      const res = checkResponseData(result, 'NO_RETURN_DATA')
      if(res) {
        navigateTo({
          path: '/email-sent',
          query: {
            email: signupForm.value.email,
            type: 'resetPassword'
          }
        })
      } else {
        showError.value = true
      }
      loading.value = false
    })
}

// 跳转首页-已登录
const routerGo = path => {
  navigateTo({
    path
  })
}

</script>
<template>
  <div class="email-verify-main">
    <Header />
    <div class="email-verify-box">
      <div class="email-verify-icon">
        <img src="~@/assets/imgs/lock.svg">
      </div>
      <h3 class="title">{{$t('password.passwordTitle')}}</h3>
      <p class="email-verify-text">{{$t('password.passwordDescription')}}</p>
      
      <FormValidate ref="signupFormRef" :model="signupForm" label-position="top" :rules="rules()" require-asterisk-position="right" class="login-box" novalidate>
        <el-form-item :label="$t('login.loginFormEmail')" prop="email">
          <el-input v-model="signupForm.email" maxlength="254" :placeholder="$t('signup.signupValidateEmailEmpty')" class="direction-ltr-input" :class="{'error':showError}" />
        </el-form-item>
      </FormValidate>
      <el-button type="primary" id="password-btn-reset" class="email-verify-btn reset-password-btn" :loading="loading" @click="onSubmit()">{{$t('password.passwordSaveButton')}}</el-button>
      <div class="signup-tip text-center margin-top30">
        <el-button link class="go-back" @click="routerGo('/login')">
          <el-icon><Back /></el-icon>
          {{$t('password.passwordBackLogin')}}
        </el-button>
      </div>
    </div>
    
    <div class="footer-main">
      <Footer />
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import url("@/assets/css/signup-login/style.scss");
.email-verify-box{
  min-height: calc(100vh - 400px);
  .reset-password-btn {
    margin: 16px 0 32px;
  }
}
</style>