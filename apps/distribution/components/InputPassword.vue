<!--
 * @Author: czy
 * @Description: 密码框-点击展示明文和密文
-->
<template>
  <div class="input-password-container">
    <el-input ref="inputRef" :type="flag?'text':'password'" v-bind="$attrs" @focus="focused" @blur="blured" >
      <template #suffix>
        <el-icon :class="{'password-icon': flag}" @click="flag=!flag">
          <View v-if="flag" />
          <Hide v-else />
        </el-icon>
      </template>
    </el-input>
  </div>
</template>
<script setup name="login">
import { View, Hide } from '@element-plus/icons-vue';
const flag = ref(false)

const isFocused = ref(false);
const emit = defineEmits(['isFocusedChange'])
const focused = () => {
  isFocused.value = true;
  emit('isFocusedChange', isFocused.value)
}
const blured = () => {
  isFocused.value = false;
  emit('isFocusedChange', isFocused.value)
}

</script>
<style lang="scss" scoped>
  .input-password-container {
    width: 100%;
  }
  .el-icon {
    cursor: pointer;
    font-size: 16px;
    color: #344054;
  }
</style>