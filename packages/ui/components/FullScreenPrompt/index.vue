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

const contentBr = computed(() => {
  return data.value?.content?.replace(/\n/g, "<br>")
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
  data.value && data.value?.category === 2 && getImage(data.value?.content)
  data.value && data.value?.category === 2 && getBtnImage(data.value?.buttonPicture)
}
// 保存-确认
const save = () => {
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
const imgClick = () => {
  if (data.value.comfirmButtonView === 0) { // 如果设置了可url-则跳转页面
    toPage()
    cancel()
  }
}
// 获取图片地址
const getImage = (url) => {
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
      height.value = 'auto'
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
    if(props.isMobile) { // 移动端高度自适应
      btnWidth.value = 'calc(100% - 24px)'
      btnHeight.value = 'auto'
    }
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
    :width="isMobile ? 'calc(100% - 16px)' : data.category === 2 ? width : '509px'"
    title=""
    :close-on-click-modal="false"
    :show-close="false"
    :before-close="cancel"
    class="custom-class"
    ref="fullDialogRef"
    :class="{ 'm': isMobile }"
  >
    <div v-if="data.category === 2" :style="{ width, height }" class="container container-img">
      <template v-if="data.content">
        <img :src="previewImg(data.content)" :class="{ cursor: data.comfirmButtonView === 0 }" alt="fullimg" lazy @click="imgClick">
        <div v-if="data.comfirmButtonView === 1" class="btn-bg" :style="{ bottom: data.buttonDistance + 'px' }" @click="save">
          <div v-if="!data.buttonPicture" :style="{ background: data.buttonColour ? ('#' + data.buttonColour) : '#3369FF' }" class="text-btn">
            {{ data.confirmButton }}
          </div>
          <div v-else class="btn" :style="{ height: btnHeight }">
            <img v-if="data.buttonPicture" class="btn-img" :style="{ width: btnWidth }" :src="previewImg(data.buttonPicture)" lazy alt="fullimg">
            <div class="btn-img-text">{{ data.confirmButton }}</div>
          </div>
        </div>
      </template>
    </div>
    <div v-if="data.category === 2 && data.closeButtonView" class="close-custom-bg" @click="cancel">
      <el-icon class="close-custom"><Close /></el-icon>
    </div>
    <div v-if="data.category === 1" class="container">
      <div class="title">
        {{ data.title }}
      </div>
      <div class="content" v-html="contentBr" />
      <div class="btns">
        <el-button v-if="data.cancelButtonView === 1" @click="cancel">{{ data.cancelButton }}</el-button>
        <div class="flex-center-12" style="height: 12px;"></div>
        <el-button type="primary" @click="save">{{ data.confirmButton }}</el-button>
      </div>
      <el-icon v-if="data.closeButtonView" class="close-custom" @click="cancel"><Close /></el-icon>
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
.container {
  position: relative;
  border-radius: 4px;
  box-shadow: 0 4px 20px 0 #00000026;
  padding: 0 16px;
  background: #fff;
  .title {
    font-weight: 600;
    font-size: 20px;
    color: #222;
    line-height: 30px;
    padding: 16px 0
  }
  .content {
    padding: 24px 0 48px;
    font-size: 14px;
    color: #686a6c;
    line-height: 24px;
    min-height: 24px;
    max-height: 300px;
    overflow: auto;
    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9) 80%, transparent 100%);
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9) 80%, transparent 100%);
  }
  .btns {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: 24px;
    .el-button {
      height: 38px;
      max-width: 100%;
      white-space: normal;
    }
  }
  img {
    position: relative;
    border-radius: 12px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
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
  left: 0;
  bottom: -70px;
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  .close-custom {
    cursor: pointer;
    width: 24px;
    height: 24px;
    background: rgba(0, 0, 0, 0.4);
    padding: 12px;
    text-align: center;
    font-size: 24px;
    color: #fff;
    border-radius: 50%;
    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
}
.container-img {
  padding: 0;
  background: transparent;
  .btn-bg {
    cursor: pointer;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .text-btn { 
      flex: 1;
      margin: 0 24px;
      max-width: 352px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      background: #5548FF;
      color: #fff;
      font-weight: 600;
      &:hover {
        background: #887fff;
      }
    }
    .btn { 
      // cursor: pointer;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-weight: 600;
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
}

.m {
  .container {
    .title {
      width: calc(100% - 16px);
    }
  }
}
</style>