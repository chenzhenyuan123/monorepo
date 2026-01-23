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

const isRTL = useState('isRTL', () => {
  return false
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
// 更新分页
const setPage = _page => {
  if(_page && _page?.pageNo) {
    page.pageSize = _page.pageSize
    page.pageNo = _page.pageNo
  }
}

const emit = defineEmits(['pageChange', 'sizeChange'])
defineExpose({ setPage })

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
                  <div class="flex-box">
                    <div>{{$t('home.homeCommissionRate')}}</div>
                    <div class="flex-center-4"></div>
                    <el-popover
                            v-if="item.goodsCommissionRate && item.distributorCommissionRate"
                            width="320"
                            :offset="0"
                            popper-class="popover-1753155721553"
                            :placement="isRTL ? 'top-end' : 'top-start'"
                            :show-arrow="false"
                    >
                      <b>{{$t('productCard.commissionRateTipP1')}}</b>
                      <br>
                      <b>{{$t('productCard.commissionRateTipP2')}}</b>
                      <br>
                      {{$t('productCard.commissionRateTipP3')}}
                      <template #reference>
                        <div class="pointer lh0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <g clip-path="url(#clip0_4201_12069)">
                              <path d="M7.99992 10.9964V8.32975M7.99992 5.66309H8.00659M14.6666 8.32975C14.6666 12.0117 11.6818 14.9964 7.99992 14.9964C4.31802 14.9964 1.33325 12.0117 1.33325 8.32975C1.33325 4.64785 4.31802 1.66309 7.99992 1.66309C11.6818 1.66309 14.6666 4.64785 14.6666 8.32975Z" stroke="#667085" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_4201_12069">
                                <rect width="16" height="16" fill="white" transform="translate(0 0.32959)"/>
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </template>
                    </el-popover>
                  </div>
                  <div class="commission-rate-text">

                    <el-popover
                            width="320"
                            :offset="0"
                            popper-class="popover-1753155721553"
                            :placement="isRTL ? 'bottom-end' : 'bottom-start'"
                            :show-arrow="false"
                    >
                      <div class="li flex-box">
                        <div class="label">{{$t('productCard.rateTipLabel1')}}</div>
                        <div class="flex-center"></div>
                        <div class="value bold">{{ currencyFormat(item.commissionRate * 100) }}%</div>
                      </div>
                      <template v-if="item.goodsCommissionRate && item.distributorCommissionRate">
                        <div class="li flex-box mt12">
                          <div class="label">{{$t('productCard.rateTipLabel2')}}</div>
                          <div class="flex-center"></div>
                          <div class="value">{{ currencyFormat(item.goodsCommissionRate * 100) }}%</div>
                        </div>
                        <div class="li flex-box mt12">
                          <div class="label">{{$t('productCard.rateTipLabel3')}}</div>
                          <div class="flex-center"></div>
                          <div class="value">{{ currencyFormat(item.distributorCommissionRate * 100) }}%</div>
                        </div>
                      </template>
                      <div v-if="item.shareCommissionRate" class="li flex-box mt12">
                        <div class="label">{{$t('productCard.rateTipLabel4')}}</div>
                        <div class="flex-center"></div>
                        <div class="value">{{ currencyFormat(item.shareCommissionRate * 100) }}%</div>
                      </div>
                      <template #reference>
                        <b class="underline-dotted pointer direction-ltr direction-inline-block">{{currencyFormat(item.commissionRate * 100)}}% </b>
                      </template>
                    </el-popover>
                    <span>(≈{{item.saleCurrency}} {{ currencyFormat(parseFloat(item.minSalePrice)*parseFloat(item.commissionRate)) }}</span>
                    <span>{{ (item.maxSalePrice&&parseFloat(item.maxSalePrice)>parseFloat(item.minSalePrice)) ? `~${currencyFormat(parseFloat(item.maxSalePrice)*parseFloat(item.commissionRate))})` : ')' }}</span>
                  </div>
                </div>
                <div class="get-affiliate-link">
                  <el-button id="Product-get-affiliate-link" class="button" @click="generateLinkClick(item)">{{$t('home.homeGetAffiliateLink')}}</el-button>
                </div>
                <div v-if="item.storeName" class="store-name-box">
                  <div class="store-name-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                      <path d="M11.25 16.2877V12.2377C11.25 11.8177 11.25 11.6077 11.1683 11.4472C11.0963 11.3061 10.9816 11.1914 10.8405 11.1195C10.6801 11.0377 10.47 11.0377 10.05 11.0377H7.95C7.52996 11.0377 7.31994 11.0377 7.15951 11.1195C7.01839 11.1914 6.90365 11.3061 6.83175 11.4472C6.75 11.6077 6.75 11.8177 6.75 12.2377V16.2877M2.25 5.78772C2.25 7.03036 3.25736 8.03772 4.5 8.03772C5.74264 8.03772 6.75 7.03036 6.75 5.78772C6.75 7.03036 7.75736 8.03772 9 8.03772C10.2426 8.03772 11.25 7.03036 11.25 5.78772C11.25 7.03036 12.2574 8.03772 13.5 8.03772C14.7426 8.03772 15.75 7.03036 15.75 5.78772M4.65 16.2877H13.35C14.1901 16.2877 14.6101 16.2877 14.931 16.1242C15.2132 15.9804 15.4427 15.7509 15.5865 15.4687C15.75 15.1478 15.75 14.7278 15.75 13.8877V5.18772C15.75 4.34764 15.75 3.9276 15.5865 3.60673C15.4427 3.32449 15.2132 3.09502 14.931 2.95121C14.6101 2.78772 14.1901 2.78772 13.35 2.78772H4.65C3.80992 2.78772 3.38988 2.78772 3.06901 2.95121C2.78677 3.09502 2.5573 3.32449 2.41349 3.60673C2.25 3.9276 2.25 4.34764 2.25 5.18772V13.8877C2.25 14.7278 2.25 15.1478 2.41349 15.4687C2.5573 15.7509 2.78677 15.9804 3.06901 16.1242C3.38988 16.2877 3.80992 16.2877 4.65 16.2877Z" stroke="#98A2B3" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="store-name">{{item.storeName}}</div>
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

<style lang="scss">
  .popover-1753155721553.el-popover.el-popper {
    box-sizing: border-box;
    padding: 14px 16px;
    border-radius: 8px;
    border: 1px solid #E4E7EC;
    background: #FFF;
    box-shadow: 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03);
    color: #344054;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    .li {
      .label {
        color: #344054;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
      }
      .value {
        max-width: 200px;
        color: #667085;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px;
        &.bold {
          font-weight: 600;
        }
      }
    }
  }
</style>
<style scoped lang="scss">
@import url("./style.scss");
@import url("@/assets/css/home/style.scss");
</style>
