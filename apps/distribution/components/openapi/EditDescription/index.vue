<script setup>
import { errorMessage, successMessage, checkResponseData } from "@/util/index.js";
import { copyToClipboard } from "@/util/index.js";
import { CopyDocument, Check } from '@element-plus/icons-vue';
const { openapiApi } = useApi()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  appData: {
    type: Object,
    default: () => ({})
  }
})

const attrs = useAttrs()
const emit = defineEmits(['cancel', 'submit'])

const cancel = () => {
    emit('cancel')
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
}

const formData = ref({})
const formRef = ref(null)
const rules = () => {
  return {
    appName: [
      {
        required: true,
        message: 'Please enter application name',
        trigger: 'blur',
      }
    ],
    description: [
      {
        required: true,
        message: 'Please enter a description for this app',
        trigger: 'blur',
      }
    ]
  }
}
onMounted(()=>{
  formData.value.description = props.appData?.description
  formData.value.appName = props.appData?.appName
})

const loading = ref(false)
const handleSubmit = async() => {
  formRef.value.validate(async valid => {
    if (!valid) return
    
    loading.value = true    
    const data = {
      description: formData.value.description,
      appName: formData.value.appName,
      id: props.appData.id,
    }
    const result = await openapiApi.appUpdate(data)
    const res = checkResponseData(result, 'NO_RETURN_DATA')
    if(res) {
      emit('submit')
    }
    loading.value = false
  })
}
</script>

<template>
  <el-dialog
    v-bind="$attrs"
    title="Edit App"
    width="600px"
    :close-on-click-modal="false"
    class="register-success-dialog"
    @close="cancel"
  >
    <div class="dialog-content">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules()"
        :validate-on-rule-change="false"
        class="register-box"
      >
        <p class="description">App name</p>
        <el-form-item prop="appName" class="mt10">
          <el-input 
            v-model="formData.appName"
            placeholder="Please enter application name"
          />
        </el-form-item>
        <p class="description">Briefly Description your app.</p>        
        <el-form-item prop="description" class="mt10">
          <el-input 
            v-model="formData.description"
            type="textarea"
            :rows="6"
            placeholder="Please enter a description for this app"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">cancel</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">confirm</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
