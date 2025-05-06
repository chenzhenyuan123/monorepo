<!--
 * @Author: czy
 * @Description: 滑过提示框-内容溢出则滑过tip
-->
<script setup name="OverflowTip">
const isMobile = useIsMobile()

const props = defineProps({
  content: { // 内容
    type: String,
    default: ''
  },
  placement: { // 位置：默认top
    type: String,
    default: 'top'
  },
  effect: { // 风格：默认dark黑，light白
    type: String,
    default: 'dark'
  }
})
// tooltip的可控
const tooltipFlag = ref(false)
const visibilityChange = (event) =>{
  const ev = event.target
  if (ev.clientWidth < ev.scrollWidth) {
    // 实际内容高度 > 文本高度 =》内容溢出
    tooltipFlag.value = true // NameIsIncludeWord ? true : !!false
  } else {
    // 否则为不溢出
    tooltipFlag.value = false
  }
}
</script>
<template>
  <el-tooltip :disabled="!tooltipFlag || isMobile" class="item" :effect="effect" :placement="placement" :content="content">
    <span class="text" @mouseenter="visibilityChange($event)" @mouseleave="tooltipFlag=false">
      <slot />
    </span>
  </el-tooltip>
</template>
<style lang="scss" scoped>
.text {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
