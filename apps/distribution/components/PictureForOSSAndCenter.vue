<script setup>
import { changeImageExtension } from "@/util/index.js";

// 兼容 webp

const props = defineProps({
  image: {
    type: String,
    default: ''
  },
  // 无图/加载失败时展示的占位图
  defaultImage: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: ''
  }
})

// 无图时降级为占位图
const showImage = computed(() => {
  return props.image || props.defaultImage
});

const imageToWebp = computed(() => {
  let str = changeImageExtension(showImage.value, '.webp')
  return str
});

// 图片加载失败兜底为占位图
const onImageError = (e) => {
  if (props.defaultImage && e.target.src !== props.defaultImage) {
    e.target.src = props.defaultImage
  }
}

</script>

<template>
    <picture>
      <source :srcset="imageToWebp" type="image/webp" />
      <img :src="showImage" lazy @error="onImageError" />
  </picture>
</template>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
picture {
    position: relative;
    width: 66px;
    height: 66px;
    img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-height: 100%;
        max-width: 100%;
    }
}
</style>