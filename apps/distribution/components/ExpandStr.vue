<script setup name="ExpandStr">
  import { useI18n } from "vue-i18n";

  const { t } = useI18n();
  const props = defineProps({
    str: {
      type: String,
      default: ''
    },
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
  watch(props.str, () => {
    adaptiveBtn()
  })
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
  <div
    ref="containerRef"
    class="expand-str-container"
    :class="{ ellipsis2: !isExpand }"
    :style="{'-webkit-line-clamp': props.ellipsisNum, 'line-clamp': props.ellipsisNum}"
  >
    <span
      ref="spanRef"
      class="expand-str"
    >{{ props.str }}</span>
    <div
      v-if="isShowBtn"
      class="expand-str-button flex-box"
      :class="{ 'float-end': isExpand }"
      @click="isExpand = !isExpand"
    >
      <template v-if="isExpand">
        <span>{{$t('ExpandStr.btnCollapse')}}</span>
        <div class="flex-center-4"></div>
        <div class="lh0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_6931_5383)">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.80262 5.46979C8.09551 5.1769 8.57027 5.1769 8.86317 5.46979L12.8632 9.46979C13.156 9.76269 13.1561 10.2375 12.8632 10.5303C12.5703 10.8231 12.0955 10.8232 11.8026 10.5303L8.33289 7.06061L4.86317 10.5303C4.57027 10.8231 4.09548 10.8232 3.80262 10.5303C3.50977 10.2375 3.50984 9.76269 3.80262 9.46979L7.80262 5.46979Z" fill="#A5A4AA"/>
            </g>
            <defs>
              <clipPath id="clip0_6931_5383">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
      </template>
      <template v-else>
      <span>...</span>
      <div class="flex-center-12"></div>
        <span>{{$t('ExpandStr.btnExpand')}}</span>
        <div class="flex-center-4"></div>
        <div class="lh0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_6931_12196)">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.8026 5.46991C12.0955 5.17702 12.5703 5.17702 12.8632 5.46991C13.156 5.76281 13.1561 6.23757 12.8632 6.53046L8.86316 10.5305C8.57026 10.8232 8.09547 10.8233 7.80261 10.5305L3.80261 6.53046C3.50976 6.23761 3.50985 5.76282 3.80261 5.46991C4.09551 5.17702 4.57027 5.17702 4.86316 5.46991L8.33289 8.93964L11.8026 5.46991Z" fill="#A5A4AA"/>
            </g>
            <defs>
              <clipPath id="clip0_6931_12196">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .expand-str-container {
    position: relative;
    overflow: hidden;
    .expand-str-button {
      position: absolute;
      right: 0;
      bottom: 0;
      background-color: #ffffff;
      cursor: pointer;
      &.float-end {
        position: static;
        float: right;
      }
      .rtl & {
        left: 0;
        right: auto;
        &.float-end {
          float: left;
        }
      }
    }
  }
</style>
