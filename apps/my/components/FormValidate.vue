<script setup name="FormValidate">
const { $locale } = useNuxtApp()

const formRef = ref(null);
const msgLog = reactive({});
/** 监听表单校验并缓存 */
const cacheMsg = (prop, isValid, message) => (msgLog[prop] = isValid ? void 0 : message);

// 监听语言变化
watch($locale, () => {
  // 已校验项，更新校验
  const arr = Object.keys(msgLog).filter(item => msgLog[item]) || []
  if (arr.length) {
    nextTick(() => {
      formRef.value.validateField(arr)
    })
  }
})
defineExpose({
  formRef
})
</script>

<template>
  <el-form
    :validate-on-rule-change="false"
    @validate="cacheMsg"
    v-bind="$attrs"
    ref="formRef"
  >
    <slot></slot>
  </el-form>
</template>