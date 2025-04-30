<!--
 * @Author: czy
 * @Description: 生成商品链接-弹窗
-->
<script setup>
import { Check } from '@element-plus/icons-vue';
import { copyToClipboard, checkResponseData } from "@/util/index.js";
const { productsApi } = useApi();

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})

const attrs = useAttrs()
const emit = defineEmits(['GenerateLinkSave'])
const close = () => {
  const fn = attrs['onUpdate:modelValue']
  fn && fn(false)
}

const showCopyText = ref(false)
const showCopyLink = ref(false)

onMounted(() => {
  getLink()
})
const goodsLinkUrl = ref('')
const goodsText = ref('')
const getLink = async() => {
  // 获取商品链接-短链
  if(props?.data?.goodsNo) {
    const result = await productsApi.generatorGoodsLink({
      goodsNo: props.data.goodsNo
    })
    const res = checkResponseData(result)
    if(res) {
      // 取商品标题+url短链
      goodsLinkUrl.value = res
      goodsText.value = `${props.data?.goodsTitle}

${goodsLinkUrl.value}`
    }
  }
}
// 提交
const submit = type => {
  if(type === 'text') {
    copyToClipboard(goodsText.value)
    showCopyText.value = true
  } else {
    copyToClipboard(goodsLinkUrl.value)
    showCopyLink.value = true
  }
  setTimeout(() => {
    close()
  }, 500)
}
</script>

<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      width="430px"
      class="dialog-box link-dialog"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div class="dialog-content">
        <h3 class="title">{{$t('products.productsGenerateLink')}}</h3>
        <p class="text">{{$t('products.productsAffiliateLink')}} <span class="direction-ltr direction-inline-block">{{data.commissionRate * 100}}%</span> {{$t('products.productsCommission')}}</p>
        <el-form label-position="top" class="link-form" novalidate>
          <el-form-item>
            <el-input type="textarea" v-model="goodsText" :rows="7" show-word-limit />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button :icon="showCopyText ? Check : ''" @click="submit('text')">{{$t('products.productsCopyLinkText')}}</el-button>
          <el-button :icon="showCopyLink ? Check : ''" type="primary" @click="submit('link')">{{$t('products.productsCopyLink')}}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import url('./style.scss')
</style>
