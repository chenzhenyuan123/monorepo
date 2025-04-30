<!--
 * @Author: czy
 * @Description: 商品卡片-加骨架屏渲染
-->
<script setup>
import { previewImg, currencyFormat } from "@/util/index.js";
import ProductCardImg from '../svg/ProductCard-img.svg'

const props = defineProps({
  lists: {
    type: Array,
    default: () => []
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  // 分页配置
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100, 200]
  },
  pagerCount: {
    type: Number,
    default: 5
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: true
  },
  search: {
    type: String,
    default: ''
  }
})

const page = reactive({
  pageSize: props.pageSize,
  total: 0,
  pageNo: 1
})

const imageRef = ref()
  // 设置图片高度与宽度相同
const getHeight = () => {
  nextTick(()=>{
    if (imageRef?.value) {
      imageRef.value.forEach(ele => {
        const width = ele.$el.offsetWidth;
        ele.$el.style.height = `${width}px`;
      })
    }
  })
}
onMounted(()=>{
  window.addEventListener('resize', getHeight)
})
watch(
  () => props.lists,
  (value) => {
    if(value.length>0) {
      getHeight()
    }
  }
)
onUnmounted(()=>{
  window.removeEventListener("resize", getHeight);
})

const emit = defineEmits(['pageChange', 'sizeChange'])

const handleSizeChange = val => {
  page.pageSize = val
  page.pageNo = 1
  emit('sizeChange', val)
}
const handleCurrentChange = val => {
  if (page.pageNo === val) return
  page.pageNo = val
  emit('pageChange', val)
}
// 获取链接-复制
const showGenerateLink = ref(false)
const goodsGenerateLinkData = ref({})
const generateLinkClick = (item) => {
  showGenerateLink.value = true
  goodsGenerateLinkData.value = item
}
</script>

<template>
  <div>
    <div class="product-card-skeleton-box">
      <el-skeleton animated :loading="loading" :count="12" :throttle="500" class="skeleton-box">
        <template #template>
          <div class="card-skeleton-box">
            <el-skeleton-item variant="image" :src="ProductCardImg" style="height: 240px" />
            <div class="card-skeleton-text-box">
              <el-skeleton-item variant="text" />
              <el-skeleton-item variant="text" />
              <el-skeleton-item variant="text" class="width40" />
              <el-divider />
              <div class="width50">
                <el-skeleton-item variant="text" />
              </div>
              <div class="width30">
                <el-skeleton-item variant="text" />
              </div>
            </div>
          </div>
        </template>
        <template #default>
          <div
            class="card-skeleton-box"
            v-for="item in lists"
            :key="item.goodsNo"
          >
            <PictureForOSSAndCenter :image="previewImg(item.imageUrl)" ref="imageRef" class="store-goods-module-item-image"></PictureForOSSAndCenter>
            <div class="card-skeleton-text-box">
              <p class="goods-title">{{ item.goodsTitle }}</p>
              <div class="sell-price">
                <span class="sell-price">
                  {{item.saleCurrency}} {{currencyFormat(item.minSalePrice)}}{{(item.maxSalePrice&&parseFloat(item.maxSalePrice)>parseFloat(item.minSalePrice)) ? `~${currencyFormat(item.maxSalePrice)}` : ''}}
                </span>
              </div>
              <el-divider />
              <div class="card-bottom">
                <div class="commission-rate">
                  <div>{{$t('home.homeCommissionRate')}}</div>
                  <div class="commission-rate-text">
                    <b class="direction-ltr direction-inline-block">{{currencyFormat(item.commissionRate * 100)}}% </b>
                    <span>(≈{{item.saleCurrency}} {{ currencyFormat(parseFloat(item.minSalePrice)*parseFloat(item.commissionRate)) }}</span>
                    <span>{{ (item.maxSalePrice&&parseFloat(item.maxSalePrice)>parseFloat(item.minSalePrice)) ? `~${currencyFormat(parseFloat(item.maxSalePrice)*parseFloat(item.commissionRate))})` : ')' }}</span>
                  </div>
                </div>
                <div class="get-affiliate-link">
                  <el-button id="Product-get-affiliate-link" class="button" @click="generateLinkClick(item)">{{$t('home.homeGetAffiliateLink')}}</el-button>
                </div>

              </div>
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>

    <Pagination
      v-if="showPagination"
      :current-page="page.pageNo"
      :page-sizes="pageSizes"
      :page-size="page.pageSize"
      :total="total"
      :pager-count="pagerCount"
      @update:page-size="handleSizeChange"
      @update:current-page="handleCurrentChange"
    />

    <!-- 生成链接 -->
    <GenerateLink
      v-if="showGenerateLink"
      v-model="showGenerateLink"
      :data="goodsGenerateLinkData"
    />
  </div>
</template>

<style scoped lang="scss">
@import url("./style.scss");
@import url("@/assets/css/home/style.scss");
</style>
