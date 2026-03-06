<script setup>
import { copyToClipboard } from "@/util/index.js";
import { CopyDocument, Check } from '@element-plus/icons-vue';

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
const emit = defineEmits(['cancel'])

const cancel = () => {
    emit('cancel')
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
}

// 复制功能
const copiedIndex = ref(null)
const copyClick = (text, index) => {
    copyToClipboard(text)
    copiedIndex.value = index
}
</script>

<template>
  <el-dialog
    v-bind="$attrs"
    title="Application Created Successfully"
    width="600px"
    :close-on-click-modal="false"
    class="register-success-dialog"
    @close="cancel"
  >
    <div class="dialog-content">
      <p class="description">
        Your application <strong>{{ appData.appName }}</strong> has been created successfully. 
        Please save these credentials securely - they won't be shown again.
      </p>

      <div class="credentials-section mt20">
        <div class="form-item">
          <div class="flex justify-between">
            <label>Client ID</label>
            <div class="btn-color">
              <el-button link :icon="copiedIndex===1 ? Check : CopyDocument" @click="copyClick(appData.clientId, 1)">copy</el-button>
            </div>
          </div>
          <div class="value-text">{{ appData.clientId }}</div>
        </div>
        <div class="form-item">
          <div class="flex justify-between">
            <label>Client Secret</label>
            <div class="btn-color">
              <el-button link :icon="copiedIndex===3 ? Check : CopyDocument" @click="copyClick(appData.clientSecret, 3)">copy</el-button>
            </div>
          </div>
          <div class="value-text">{{ appData.clientSecret }}</div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">Close</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
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
  .btn-color .el-button{
    color: #5548ff;
  }
}
</style>
