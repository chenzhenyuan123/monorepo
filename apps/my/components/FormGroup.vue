<script setup name="FormGroup">
import {formGroupContextKey} from "@flylinking/core/utils/const";

const groupData = ref([])
provide(formGroupContextKey, groupData)
</script>

<template>
  <el-form-item>
    <slot/>
  </el-form-item>
</template>

<style scoped lang="scss">
</style>
