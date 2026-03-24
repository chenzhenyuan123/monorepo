<script setup name="ExpandStr">
  import { useI18n } from "vue-i18n";

  const { t } = useI18n();
  const props = defineProps({
    // 默认展示的行数
    ellipsisNum: {
      type: Number,
      default: 3
    }
  })
  const attrs = useAttrs()
  const emit = defineEmits(['onUpdate:isExpand'])


  const isShowBtn = ref(false)
  const containerRef = ref()
  const spanRef = ref()
  // 是否展开
  const isExpand = ref(false)
  function adaptiveBtn() {
    nextTick(() => {
      const parentHeight = containerRef.value.offsetHeight
      const contentHeight = spanRef.value.offsetHeight
      // 判断是否展示按钮
      isShowBtn.value = contentHeight > parentHeight
    })
  }
  onMounted(() => {
    adaptiveBtn()
  })
</script>

<template>
  <div>
    <div
      ref="containerRef"
      class="expand-str-container"
      :class="{ ellipsis2: !isExpand }"
      :style="{'-webkit-line-clamp': props.ellipsisNum, 'line-clamp': props.ellipsisNum}"
    >
      <span
        ref="spanRef"
        class="expand-str"
      >
        <slot />
      </span>
    </div>
    <el-link
      v-if="isShowBtn"
      type="primary"
      underline="never"
      class="expand-str-button"
      :class="{ 'float-end': isExpand }"
      @click="isExpand = !isExpand"
    >
      <template v-if="!isExpand">
        <span>more</span>
      </template>
    </el-link>
  </div>
</template>

<style scoped lang="scss">
  .expand-str-container {
    overflow: hidden;
  }
  .expand-str-button {
    text-decoration-line: underline;
    text-decoration-style: dotted;
    text-decoration-skip-ink: none;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;
  }
</style>
