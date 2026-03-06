<script setup name="OpenapiRegister">
import { errorMessage, successMessage, checkResponseData } from "@/util/index.js";
import { useUserStore } from '@/store/userState.js'
const { openapiApi } = useApi()

definePageMeta({
  layout: 'noside'
});
const isMobile = useIsMobile()

const formData = ref({})
const formRef = ref(null)
const rules = () => {
  return {
    description: [
      {
        required: true,
        message: 'Please describe your business scenario and compliance commitments for using the Flylinking API',
        trigger: 'blur',
      }
    ],
    checkedCities: [
      {
        required: true,
        message: 'Please agree to all terms before submitting',
        trigger: 'blur',
      }, {
        validator: (rule, value, callback) => {
          if (!value || value.length < 3) {
            callback(new Error('Please agree to all terms before submitting'))
          } else {
            callback()
          }
        },
        trigger: 'change',
      }
    ]
  }
}

const handleBack = () => {
  window.history.back()
}
const loading = ref(false)
const handleSubmit = async() => {
  formRef.value.validate(async valid => {
    if (!valid) return
    
    loading.value = true    
    const data = {
      description: formData.value.description,
      source: 'DISTRIBUTOR'
    }
    const result = await openapiApi.developerCreate(data)
    const res = checkResponseData(result)
    if(res) {
      successMessage('Register success')
      // 将注册成功的信息传递给home页面-第一次创建成功需要弹窗展示信息
      navigateTo({
        path: '/openapi/home',
        state: { registerData: res?.apps[0] }
      })
    }
    loading.value = false
  })
}

</script>
<template>
  <div class="main-box" :class="{ m: isMobile }">
    <Header />
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules()"
      :validate-on-rule-change="false"
      class="register-box"
    >
      <h2>Developer Agreement & Policy</h2>      
      <div class="subtitle">
        <p class="mb10">Describe all of your use cases for Flylinking's data and API:</p>
        <p class="color666">We need this information for data protection and service compliance.</p>
      </div>
      <el-form-item  prop="description">
        <el-input 
          v-model="formData.description"
          type="textarea"
          :rows="6"
          placeholder="Please describe your business scenario and compliance commitments for using the Flylinking API"
        />
      </el-form-item>
      <el-form-item  prop="checkedCities">
        <div class="agreements mt20">
          <el-checkbox-group v-model="formData.checkedCities">
            <el-checkbox :value="0">You understand that you may not resell, redistribute, or misuse any data you receive via the Flylinking APIs.</el-checkbox>
            <el-checkbox :value="1">You understand that your Developer account may be terminated if you violate the Developer Agreement or any of the Incorporated Developer Terms. </el-checkbox>
            <el-checkbox :value="2">
                <span>You accept the</span>
                <el-link type="primary" underline="never" href="/legal/privacy-policy" target="_blank" class="ml6">{{$t('login.footerPrivacyPolice')}}</el-link>
                <span class="ml6">and</span>
                <el-link type="primary" underline="never" href="/legal/terms-of-usage" target="_blank" class="ml6">{{$t('login.footeTermOfUse')}}</el-link>
                <span>.</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <div class="button-group flex">
        <el-button @click="handleBack">Back</el-button>
        <div class="flex-center-16"></div>
        <el-button type="primary" :loading="loading" @click="handleSubmit">Submit</el-button>
      </div>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.register-box {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.subtitle {
  color: #333;
  margin: 30px 0 30px;
  .color666 {
    color: #666;
  }
}

.agreements {
  .el-checkbox {
    white-space: pre-wrap;
    margin: 0;
    height: auto;
    margin-bottom: 10px;
    align-items: flex-start;
    .el-checkbox__label {
        line-height: 18px;
    }
    span {
        vertical-align: middle;
    }
  }
}

.button-group {
  margin-top: 40px;
  justify-content: end;
}
</style>