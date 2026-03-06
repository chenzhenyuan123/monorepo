<script setup name="OpenapiHome">
import { errorMessage, successMessage, checkResponseData } from "@/util/index.js";
import { EditPen } from '@element-plus/icons-vue';
const { openapiApi } = useApi()
const isMobile = useIsMobile()
const appData = ref({
  apps: []
})
const appDataObj = ref({}) // 当前要展示的apps
const isShowreAppDialog = ref(false)
const registerData = ref({})
onMounted(()=>{
  getInfo()

  // 只在客户端检查 state
  if (process.client) {
    const state = window.history.state
    if (state?.registerData) {
      // 显示弹窗
      registerData.value = state.registerData
      isShowreAppDialog.value = true
      
      // 清除 state，确保刷新后不再弹窗
      window.history.replaceState({}, '')
    }
  }
})
const getInfo = async() => {
  const result = await openapiApi.developerQuery()
  const res = checkResponseData(result)
  if(res) {
    appData.value = res || {apps:[]}
    appDataObj. value = res?.apps[0]
  }
}

// 重生app-token
const regenerateClick = (id) => {
  ElMessageBox({
    title: 'Regenerate OAuth 2.0 Client Secret',
    message: h('div', {class: 'mt10 mb20'}, [
      h('h4', {class: 'mb10'}, 'Are you sure you want to regenerate?'),
      h('div', null, "If you regenerate your OAuth 2.0 Client Secret, you'll need to update your code to continue working with the API."),
    ]),
    showCancelButton: true,
    confirmButtonText: 'Regenerate',
    cancelButtonText: 'Cancel',
    beforeClose: async(action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        const result = await openapiApi.getAppRegenerateKey({id})
        const res = checkResponseData(result)
        if(res) {
          registerData.value = res
          isShowreAppDialog.value = true
        }
        instance.confirmButtonLoading = false
        done()
      } else {
        done()
      }
    },
  })
}

// 编辑app备注
const isShowEditDescription = ref(false)
const editDescriptionClick = app => {
  isShowEditDescription.value = true
  registerData.value = app
}
</script>
<template>
  <div class="main-box openapi-home-box mb50" :class="{ m: isMobile }">
    <div class="content">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <div class="title-box">
              <span>App details</span>
            </div>
          </div>
        </template>
        <!-- 如果存在多个apps，得支持点击展示详情 -->
        <div class="form-section" v-for="item in appData.apps" :key="item.developerId">
          <div class="form-item">
            <label>NAME</label>
            <div class="value-text">{{ item.appName }}</div>
          </div>
          <div class="form-item">
            <label>APP ID</label>
            <div class="value-text">{{ item.id }}</div>
          </div>
          <div class="form-item">
            <div class="flex justify-between">
            <label>DESCRIPTION</label>
            <div class="btn-color">
              <el-button link :icon="EditPen" @click="editDescriptionClick(item)">Edit</el-button>
            </div>
          </div>
            <div class="value-text">{{ item.description }}</div>
          </div>
        </div>
      </el-card>

      <div class="mt40" v-if="appDataObj.clientId">
        <h3 class="mb12">OAuth 2.0 Client ID and Client Secret</h3>

        <div class="form-item">
          <label>Client ID</label>
          <div class="value-text">{{ appDataObj.clientId }}</div>
        </div>
        <div class="form-item flex justify-between items-end">
          <div class=" ">
            <label>Client Secret</label>
            <div class="value-text">{{ appDataObj.clientSecretMask }}</div>
          </div>
          <el-button @click="regenerateClick(appDataObj.id)">Regenerate</el-button>
        </div>
      </div>

    </div>

    <!-- 重新生成appKey -->
    <OpenapiCreatedSuccessInfo
      v-if="isShowreAppDialog"
      v-model="isShowreAppDialog"
      :appData="registerData"
      @cancel="isShowreAppDialog=false;getInfo()"
    ></OpenapiCreatedSuccessInfo>
    <!-- 更新app备注 -->
    <OpenapiEditDescription
      v-if="isShowEditDescription"
      v-model="isShowEditDescription"
      :appData="registerData"
      @cancel="isShowEditDescription=false"
      @submit="isShowEditDescription=false;getInfo()"
    ></OpenapiEditDescription>
  </div>
</template>

<style scoped lang="scss">
.header {
  padding: 20px 0;
  h2 {
    font-size: 28px;
    color: #333;
  }
}

.content {
  max-width: 1000px;
  margin: 10px auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .title-box {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 500;
  }
}

.form-item {
  background: #f5f5f5;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 4px;
  label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #666;
    margin-bottom: 8px;
  }
}

.m.openapi-home-box {
  padding: 0 20px;
}
</style>