<script setup name="CarouselImage">
import { isURL, previewImg } from "@/util/index.js";
import { checkResponseData } from "@/util/index.js";
const { homeApi } = useApi();
const router = useRouter();
const isMobile = useIsMobile()
const props = defineProps({
  system: {
    type: String,
    default: '100'
  },
  height: {
    type: String,
    default: '0'
  }
})

const dataImg = ref([])
const imgHeight = ref('238px')
const interval = ref(5000)
// 获取轮播图
const getCarouselImg = async() => {
  const result = await homeApi.getBanner({system: props.system})
  const res = checkResponseData(result)
  if(res) {
    dataImg.value = res?.flywayMessageCos
    if(res?.speed) {
      interval.value = parseInt(res.speed * 1000)
    }
  }
}
onMounted(() => {
  setCarouselHeight()
  window.addEventListener('resize', () => {
    setCarouselHeight()
  })
  getCarouselImg()
})

// 设置图片高度
const setCarouselHeight = () => {
  // 注册页是高度100%
  if(props.height==='100'){
    imgHeight.value = '100%'
  } else {
    let ih = (document.body.clientWidth - 100) / 891 * 116
    if(isMobile){
      ih = (document.body.clientWidth+40) / 445 * 58
    }
    if (ih < 30) {
      ih = 30
    }
    imgHeight.value = ih + 'px'
  }
}
// 点击图片
const carouselClick = (item, index) => {
  if (item.isOperate === '0') {
    return
  }
  msgCarouselMessageClick(item)
  if (isURL(item.operateUrl)) {
    window.open(item.operateUrl)
  } else {
    navigateTo(item.operateUrl)
  }
}
// 点击图片需要记录？
const msgCarouselMessageClick = (item) => {
  homeApi.msgCarouselMessageClick({
    isClick: 1,
    messageId: item.id
  })
}
</script>

<template>
  <el-carousel
    v-if="dataImg.length > 0"
    ref="carousel"
    height="100%"
    class="carousel-container"
    :class="{ 'carousel-container-hidden-arrow': dataImg.length === 1 }"
    :style="[{'--carousel-delay': '5s'}, { height: imgHeight }]"
    trigger="click"
    :autoplay="true"
    :interval="5000"
  >
    <el-carousel-item
      v-for="(item, index) in dataImg"
      :key="index"
      @click="carouselClick(item, index)"
    >
      <PictureForOSSAndCenter :image="previewImg(item.content)" class="store-goods-module-item-image" :style="{ 
        cursor: item.isOperate !== '0' ? 'pointer' : 'default' }" />
    </el-carousel-item>
  </el-carousel>
</template>

<style scope lang="scss">
.carousel-container {
  position: relative;
  width: 100%;
  border-radius: 4px;
  .el-carousel__item {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    picture.store-goods-module-item-image {
      display: inline-block;
      width: 100%;
      height: 100%;
      img {
          height: auto;
          max-height: 100%;
          width: 100%;
          object-fit: cover;
      }
    }
  }
  .el-carousel__arrow.el-carousel__arrow--left,
  .el-carousel__arrow.el-carousel__arrow--right {
    display: none;
  }

  .el-carousel__indicators.el-carousel__indicators--horizontal {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    width: 100%;
    padding-right: 6px;
    height: 20px;
    bottom: 0px;
  }
  .el-carousel__indicator.el-carousel__indicator--horizontal {
    width: 23px;
    height: 4px;
    background: #FFFFFF66;
    border-radius: 8px;
    margin: 0 4px;
    padding: 0;
    &.is-active {
      position: relative;
      width: 23px;
      border-radius: 8px;
      overflow: hidden;
    }
    &.is-active::after {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 0;
      height: 100%;
      border-radius: 8px;
      background: #ffffff;
      opacity: 1;
      animation: progress var(--carousel-delay) ease 1 forwards;
    }
    .el-carousel__button {
      width: 0;
      height: 0;
    }
  }

  @keyframes progress {
    0% {
      transform: translateX(0);
    }

    100% {
      width: 100%;
      transform: translate(22px);
    }
  }
}
.carousel-container-hidden-arrow {
  .el-carousel__indicators.el-carousel__indicators--horizontal {
    display: none;
  }
}
</style>
