<script setup>
import { isSupportWebp, changeImageExtension } from "@/util/index.js";

const showViewer = ref(false)
const initialIndex = ref(0)
const urlList = ref([])
const supportWebp = ref(false)

/**
 * 显示大图
 */
const showImageList = (imgs = [], imgNow = '') => {
    // 无数据处理
    let arr = []
    imgs.forEach(img => {
        if (img !== undefined && img !== null && img !== '') {
            // 替换图片格式
            img = supportWebp.value ? changeImageExtension(img, '.webp') : img
            img && arr.push(img)
        }
    })
    if (!arr.length) return

    showViewer.value = true
    if (imgNow) {
    const index = imgs.findIndex(item => item === imgNow)
    initialIndex.value = index === -1 ? 0 : index
    }
    urlList.value = arr
}
/**
 * 显示大图
 */
const showImage = (img = undefined) => {
    // 无数据处理
    if (img === undefined || img === null || img === '') return

    showViewer.value = true
    initialIndex.value = 0
    urlList.value = [ img ]
}
/**
 * 隐藏大图
 */
const hideImage = () => {
    console.log('hideImage')
    showViewer.value = false
}

defineExpose({ showImageList, showImage, hideImage })

onMounted(() => {
    supportWebp.value = isSupportWebp()
    console.log('====>supportWebp:', supportWebp.value)
})
</script>

<template>
    <!-- 查看图片 -->
    <el-image-viewer
      v-if="showViewer"
      :initial-index="initialIndex"
      :url-list="urlList"
      @close="hideImage"
    />
</template>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
.radio-button {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 4px;
    border: 1px solid #D5D6D9;
    &.active {
        border-color: #4D74ED;
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.10), 0px 0px 0px 2px rgba(81, 127, 255, 0.40);
    }
    &.disabled {
        opacity: 0.4;
    }
}
</style>
