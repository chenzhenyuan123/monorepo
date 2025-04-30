<script setup>
import { changeImageExtension } from "@/util/index.js";

// 兼容 webp

const props = defineProps({
  image: {
    type: String,
    default: ''
  },
  class: {
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
    <source :class="props.class" :srcset="imageToWebp" type="image/webp" />
    <img :class="props.class" :src="props.image" alt="" />
  </picture>
</template>
