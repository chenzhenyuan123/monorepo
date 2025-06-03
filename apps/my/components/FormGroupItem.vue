<script setup name="FormGroupItem">
import {formGroupContextKey, myFormLogKey} from "@flylinking/core/utils/const";

const props = defineProps({
  prop: {
    type: String
  }
});

const groupData = inject(formGroupContextKey)
const msgLog = inject(myFormLogKey)

onMounted(() => {
  props.prop && groupData.value.push(props.prop)
})

const isShowErr = (prop) => {
  const group = groupData.value;
  const index = group.findIndex((p) => p === prop);
  for (let i = 0; i <= index; i++) {
    const msg = msgLog[group[i]];
    if (msg === "" || !!msg) {
      return i === index && group[i] === prop;
    }
  }
};
</script>

<template>
  <el-form-item
          :prop="prop"
    :class="{'show-err': isShowErr(prop)}"
  >
    <slot />
  </el-form-item>
</template>

<style scoped lang="scss">
  .el-form-item {
    &.show-err {
      :deep(.el-form-item__error) {
        display: block;
      }
    }
    :deep(.el-form-item__content) {
      position: static;
    }
    :deep(.el-form-item__error) {
      display: none;
    }
  }
</style>
