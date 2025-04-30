<script setup>
import { Plus } from '@element-plus/icons-vue';

const props = defineProps({
  imgUrl: {
    type: String,
    default: ''
  }
})
const bigImgRef = ref(null);
const maskRef = ref(null);

function handler(event) {
  const mask = maskRef.value;
  const bigImg = bigImgRef.value;

  let left = event.offsetX - mask.offsetWidth / 2;
  let top = event.offsetY - mask.offsetHeight / 2;

  if (left <= 0) left = 0;
  if (left >= mask.offsetWidth) left = mask.offsetWidth;
  if (top <= 0) top = 0;
  if (top >= mask.offsetHeight) top = mask.offsetHeight;

  bigImg.style.left = -2 * left + "px";
  bigImg.style.top = -2 * top + "px";

  mask.style.left = left + "px";
  mask.style.top = top + "px";
}
</script>

<template>
  <div class="zoom-img">
    <div class="event" @mousemove="handler"></div>
    <div class="pic-box">
      <div class="img-block">
        <img class="pic" :src="imgUrl" alt="" />
      </div>
      <el-icon class="zoom-in-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.5 19C15.1944 19 19 15.1944 19 10.5C19 5.8056 15.1944 2 10.5 2C5.8056 2 2 5.8056 2 10.5C2 15.1944 5.8056 19 10.5 19Z" stroke="#A9AAAD" stroke-width="1.95" stroke-linejoin="round"/>
          <path d="M14.805 10.5H6.19501" stroke="#A9AAAD" stroke-width="1.95" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10.5 6.19501V14.805" stroke="#A9AAAD" stroke-width="1.95" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16.6104 16.6109L20.853 20.8535" stroke="#A9AAAD" stroke-width="1.95" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </el-icon>
      <div class="mask" ref="maskRef">
        <el-icon><Plus /></el-icon>
      </div>
    </div>
    <div class="big">
      <img :src="imgUrl" alt="" ref="bigImgRef" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.zoom-img {
  position: relative;
  width: 100%;
  .pic-box{
    position: relative;
    border: 1px solid #D5D6D9;
    box-sizing: border-box;
    border-radius: 4px;
    overflow: hidden;
    .img-block{
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
    }
  }
  .pic{
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    cursor: zoom-in;
  }

  .zoom-in-icon{
    position: absolute;
    left: 16px;
    top: 16px;
    font-size: 24px;
  }

  .mask{
    position: absolute;
    box-shadow: rgba(34, 34, 34, 0.4) 0 0 0 2000px;
    opacity: 0;
    transition: opacity 0.3s;
    width: 50%;
    height: 50%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-icon{
      font-size: 30px;
      color: #424552;
    }
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: calc(100% + 8px);
    border-radius: 4px;
    border: 1px solid #D5D6D9;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;
    box-sizing: border-box;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover~.pic-box .mask{
    opacity: 1;
  }
  .event:hover~.big {
    display: initial;
  }
  .event:hover~.pic-box .zoom-in-icon{
    display: none;
  }
}
</style>
