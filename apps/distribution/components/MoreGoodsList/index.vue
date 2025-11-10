<!--
 * @Author: czy
 * @Description: 订单下的更多商品信息
-->
<script setup>
import { checkResponseData, currencyFormat, arrToDict, previewImg } from "@/util/index.js"
import { accurate_toFixed, isUseless } from "@flylinking/core/utils/dataUtil";
import { useI18n } from "vue-i18n";
const isMobile = useIsMobile()

const { t } = useI18n();
const props = defineProps({
  dataList: {
    type: Array,
    default: () => ([])
  },
  positionTop: { // PC端对应的定位
    type: Number,
    default: 0
  },
  positionLeft: { // PC端对应的左边定位，不传默认在右侧
    type: String,
    default: 'auto'
  }
})

const layerRef = ref(null)
const emit = defineEmits(["change","hide"])
onMounted(() => {
  layerRef.value.show()
});

const formatterAmount = (v, c) => {
  return isUseless(v) ? '' : (c || 'USD') + ' ' + currencyFormat(v)
}

const formatterRate = (v) => {
  return isUseless(v) ? '' : (accurate_toFixed(v * 100, 2) +'%')
}
</script>
<template>
  <div>
    <Layer ref="layerRef" title="Product Commission date" class="layer" :positionTop="positionTop" :positionLeft="positionLeft" v-once @hide="$emit('hide')">
      <div class="contact-info">
        <MoreGoodsListSkuTable :dataList="dataList" />
      </div>
    </Layer>
  </div>
</template>
<style lang="scss" scoped>
.contact-info {
  padding: 0 24px;
}

.goods-popover-title {
  font-family: Inter;
  font-size: 14px;
  line-height: 20px;
  display: -webkit-box;
  display: box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制显示的行数为2 */
  overflow-wrap: anywhere;
}
</style>