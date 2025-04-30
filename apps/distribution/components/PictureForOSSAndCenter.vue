<script setup>
import { changeImageExtension } from "@/util/index.js";

// 兼容 webp

const props = defineProps({
  image: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: ''
  }
})

const imageToWebp = computed(() => {
  let str = changeImageExtension(props.image, '.webp')
  return str
});

</script>

<template>
    <picture>
      <source :srcset="imageToWebp" type="image/webp" />
      <img :src="props.image" lazy />
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