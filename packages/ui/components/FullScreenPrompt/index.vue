<!--
 * @Author: czy
 * @Description: 全屏消息弹窗
-->
<script name="FullScreenPrompt" setup>
import { Close } from '@element-plus/icons-vue';
import { previewImg } from '@flylinking/core/utils/urlUtil'

const props = defineProps({
  // 101:分销员首页  102:分销员钱包页  108:分销员产品列表页
  system: {
    type: String,
    default: ''
  },
  homeApi: {
    type: Object,
    required: true
  },
  checkResponseData: {
    type: Function,
    required: true
  },
  isMobile: {
    type: Boolean,
    default: false
  }
})
const visible = ref(false) // 弹窗显示状态
const data = ref({}) // 弹窗数据
const btnHeight = ref('0') // 按钮高度
const btnWidth = ref('0') // 按钮宽度
const width = ref('0')  // 弹窗宽度
const height = ref('0') // 弹窗高度
const msgs = ref([]) // 消息列表
const fullDialogRef = ref()

// 走马灯相关状态
const carouselRef = ref(null) // Carousel组件引用
const popChirldPicturesIndex = ref(0) // 当前图片索引

// 是否展示下一步按钮
const showNext = computed(() => {
  return data.value?.category === 2 && 
         data.value?.popChirldPictureCos?.length > 1 && 
         popChirldPicturesIndex.value < (data.value?.popChirldPictureCos?.length - 1)
})
// 是否展示操作类按钮
const showBtns = computed(() => {
  if (data.value?.category === 1) { // 文字类
    return data.value?.comfirmButtonView === 1
  } else { // 图文类
    return data.value?.comfirmButtonView === 1 || 
           data.value?.popChirldPictureCos?.length > 1
  }
})

const varCss = computed(() => {
  return {
    '--carousel-delay': '5s'
  }
})

onMounted(() => {
  getData()
});
// 获取弹窗数据
const getData = async() => {
  const result = await props.homeApi?.getPopMessage({ system: props.system })
  const res = props.checkResponseData(result)
  if (res) {
    // 保存数据
    msgs.value = res || []
    setData()
  }
}
// 设置弹窗数据
const setData = () => {
  if (msgs.value?.length === 0) {
    return
  }
  visible.value = true
  data.value = msgs.value[0]
  // 根据不同类型加载图片
  if (data.value?.category === 2) {
    if (data.value?.popChirldPictureCos?.length > 0) {
      // 有走马灯数据，加载第一张图片
      getImage(data.value.popChirldPictureCos[0]?.pictureUrl)
    } else if (data.value?.content) {
      // 兼容旧的单图模式
      getImage(data.value?.content)
    }
    
    if (data.value?.buttonPicture) {
      getBtnImage(data.value?.buttonPicture)
    }
  }
}

// Carousel切换方法
const carouselChange = (index) => {
  popChirldPicturesIndex.value = index
}
// 上一步
const prev = () => {
  if (carouselRef.value) {
    carouselRef.value.prev()
  }
}
// 下一步
const next = () => {
  if (carouselRef.value) {
    carouselRef.value.next()
  }
}

// 保存-确认, 下一步
const save = () => {
  if (showNext.value) {
    next()
    return
  }
  
  if (data.value?.confirmButtonAction === 1) {
    toPage()
  }
  cancel()
}
// 关闭
const cancel = async() => {
  visible.value = false
  const result = await props.homeApi?.clickPopMessage({ isClick: 1, messageId: data.value?.id })
  const res = props.checkResponseData(result, 'NO_RETURN_DATA')
  if (res) {
    msgs.value.shift()
    setData()
  }
}
// 图片点击
const imgClick = (index) => {
  if (data.value?.comfirmButtonView === 0) { // 如果设置了可url-则跳转页面
    toPage()
    cancel()
  }
}
// 获取图片地址
const getImage = (url) => {
  if (!url) return
  
  const tImamge = new Image()
  tImamge.src = previewImg(url)
  tImamge.onload = () => {
    const clientHeight = fullDialogRef.value?.$el?.parentElement?.clientHeight || 700
    const rate = 2
    let w = tImamge.width / rate
    let h = tImamge.height / rate
    const maxH = clientHeight - 200
    const maxW = w / h * maxH
    w = w > maxW ? maxW : w
    h = h > maxH ? maxH : h
    width.value = w + 'px'
    height.value = h + 'px'
    if(props.isMobile) { // 移动端高度自适应
      width.value = '100%'
      // 获取容器实际宽度（100%对应的像素值）
      const containerWidth = fullDialogRef.value?.$el?.parentElement?.clientWidth || window.innerWidth - 24
      // 根据图片宽高比计算实际显示高度
      const displayHeight = containerWidth * (tImamge.height / tImamge.width)
      // 限制最大高度
      const finalHeight = displayHeight > maxH ? maxH : displayHeight
      height.value = finalHeight + 'px'
    }
  }
}

// 获取按钮的图片地址
const getBtnImage = (url) => {
  const tImamge = new Image()
  tImamge.src = previewImg(url)
  tImamge.onload = () => {
    const rate = 2
    btnWidth.value = tImamge.width / rate + 'px'
    btnHeight.value = tImamge.height / rate + 'px'
    // if(props.isMobile) { // 移动端高度自适应
    //   btnWidth.value = 'calc(100% - 24px)'
    //   btnHeight.value = 'auto'
    // }
  }
}

const router = useRouter()
// 设置了打开链接时，跳转链接
const toPage = () => {
  if (/^(https|http):/.test(data.value.confirmUrl)) {
    window.open(data.value.confirmUrl)
  } else {
    router.push(data.value.confirmUrl)
  }
}

</script>
<template>
  <el-dialog
    v-if="data"
    v-model="visible"
    :width="isMobile ? 'calc(100% - 16px)' : data.category === 2 ? width : '800px'"
    title=""
    :close-on-click-modal="false"
    :show-close="false"
    :before-close="cancel"
    class="custom-class"
    ref="fullDialogRef"
    :class="{ 'm': isMobile }"
    :align-center="true"
  >
    <div class="container" :class="{ 'container-img': data.category === 2 }" :style="{ width: data.category === 2 ? width : 'calc(100% - 48px)' }">
      <div v-if="data.category === 2" :style="{ width }">
        <el-carousel
          v-if="data.popChirldPictureCos && data.popChirldPictureCos.length > 0"
          ref="carouselRef"
          height="100%"
          class="screen-carousel-container"
          :class="{ 'hidden-arrow': data.popChirldPictureCos && data.popChirldPictureCos.length === 1 }"
          :style="[varCss, { height: height }]"
          trigger="click"
          :autoplay="false"
          @change="carouselChange"
        >
          <el-carousel-item
            v-for="(item, index) in data.popChirldPictureCos"
            :key="''+index"
          >
            <img :src="previewImg(item.pictureUrl)" alt="fullimg" lazy :style="{ height: height }" @click="imgClick(index)">
          </el-carousel-item>
        </el-carousel>
        <div v-if="data.popChirldPictureCos && data.popChirldPictureCos.length > 0 && data.popChirldPictureCos[popChirldPicturesIndex] && (data.popChirldPictureCos[popChirldPicturesIndex].pictureTitle || data.popChirldPictureCos[popChirldPicturesIndex].pictureContent)" class="image-text">
          <div v-if="data.popChirldPictureCos[popChirldPicturesIndex].pictureTitle" class="image-title">
            {{ data.popChirldPictureCos[popChirldPicturesIndex].pictureTitle }}
          </div>
          <div v-if="data.popChirldPictureCos[popChirldPicturesIndex].pictureContent" class="image-content">
            {{ data.popChirldPictureCos[popChirldPicturesIndex].pictureContent }}
          </div>
        </div>
        <div v-if="data.closeButtonView === 1" class="close-custom-bg" @click="cancel">
          <img src="https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1726038462676_modal-close.svg" alt="">
        </div>
      </div>
      <div v-else>
        <div class="title">
          {{ data.title }}
        </div>
        <div class="content" v-html="data.content" />
        <el-icon v-if="data.closeButtonView === 1" class="close-custom" @click="cancel"><Close /></el-icon>
      </div>
      <!-- 按钮 -->
      <div v-if="showBtns" class="btns">
        <el-button v-if="data.category === 2 && popChirldPicturesIndex > 0" type="text" @click="prev">{{ $t('fullScreenPrompt.PreStep') }}</el-button>
        <el-button v-if="data.category === 1 && data.closeButtonView === 1" type="text" @click="cancel">{{ $t('fullScreenPrompt.cancel') }}</el-button>
        <div v-if="data.comfirmButtonView === 1 || showNext" class="btn-bg" @click="save">
          <el-button v-if="!data.buttonPicture" :style="{ background: data.buttonColour ? '#' + data.buttonColour : '#5548ff' }" type="primary" class="text-btn">
            {{ !showNext ? data.confirmButton : $t('fullScreenPrompt.nextStep') }}
          </el-button>
          <div v-else class="btn" :style="{ height: btnHeight }">
            <img v-if="data.buttonPicture" class="btn-img" :style="{ width: btnWidth }" :src="previewImg(data.buttonPicture)" alt="">
            <el-button type="primary" class="btn-img-text">{{ !showNext ? data.confirmButton : $t('fullScreenPrompt.nextStep') }}</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<style lang="scss">
.el-dialog.custom-class {
  background: transparent;
  box-shadow: none;
  backdrop-filter: blur(8px);
  padding: 0;
  .el-dialog__body {
    padding: 0;
    overflow: hidden;
  }
  .el-dialog__header {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.custom-class {
  backdrop-filter: blur(8px);
}
.container {
  position: relative;
  border-radius: 24px;
  box-shadow: 0 4px 20px 0 #00000026;
  padding: 0 24px;
  background: #fff;
  overflow: hidden;
  .title {
    font-weight: 600;
    font-size: 20px;
    color: #222;
    line-height: 30px;
    padding: 20px 0
  }
  .image-text {
    margin: 16px 24px 0 24px;
    .image-title {
      color: #171717;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
    }
    .image-content {
      margin: 8px 0 24px;
      color: #171717;
      font-size: 14px;
      line-height: 20px;
    }
  }
  .content {
    margin: 0 0 24px;
    font-size: 14px;
    line-height: 24px;
    min-height: 24px;
    max-height: 400px;
    overflow-y: auto;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 24px 0 24px;
    .btn-bg {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      .text-btn {
        padding: 10px 16px;
        flex: 1;
        margin-left: 16px;
        max-width: 352px;
        min-width: 44px;
        height: 40px;
        background: #5548ff;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        // border-radius: 8px;
        // color: #fff;
        // font-weight: 600;
      }
      .btn {
        // cursor: pointer;
        position: relative;
        flex: 1;
        padding: 10px 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-weight: 600;
        min-width: 44px;
        .btn-img {
          position: relative;
          border-radius: 0;
        }
        .btn-img-text {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .el-button--text {
      background: #fff;
      padding: 10px 16px;
      border: 1px solid #d0d5dd;
      border-radius: 8px;
      box-shadow: inset 0 0 0 1px #1018282e, inset 0 -2px #1018280d, 0 1px 2px #1018280d;
      color: #344054;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      height: 40px;
      min-width: 44px;
    }
  }
  .cursor {
    cursor: pointer;
  }
  .close-custom {
    cursor: pointer;
    position: absolute;
    right: 8px;
    top: 14px;
    font-size: 16px;
    padding: 10px;
  }
}
.close-custom-bg {
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
}
.container-img {
  padding: 0;
  .btns {
    margin: 24px;
  }
}
// 新增：走马灯容器样式
.screen-carousel-container {
  position: relative;
  width: 100%;
  height: 116px;
  // border-radius: 12px;
  // margin-bottom: 16px;
  ::v-deep {
    .el-carousel__item {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: auto;
        max-height: 100%;
        cursor: pointer;
        object-fit: cover;
      }
      background-size: cover;
      background-repeat: no-repeat;
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
        background: #ffffff;
      }
      .el-carousel__button {
        width: 0;
        height: 0;
      }
    }
  }
}

.hidden-arrow {
  ::v-deep {
    .el-carousel__indicators.el-carousel__indicators--horizontal {
      display: none;
    }
  }
}

.m {
  .container {
    .title {
      width: calc(100% - 16px);
    }
  }
}
</style>