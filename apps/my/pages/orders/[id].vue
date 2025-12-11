<!--
 * @Author: czy
 * @Description: 买家中心/订单列表/订单详情
-->
<script name="OrdersDeatil" setup>
import { checkResponseData, successMessage, currencyFormat, formatInTable, previewImg } from "@/util/index.js";
import { contactData } from "@/components/ContactInfo/const.js";
import { ordersStatus } from "@/util/const.js";
import { formatDate } from "@flylinking/core/utils/dateUtil"
import {previewFlylinkStoreUrl} from "@flylinking/core/utils/urlUtil"
const { buyerOrderApi } = useApi();
  
const route = useRoute();
const isMobile = useIsMobile()

const orderInfo = ref({
  goodsSpuList: [], // 商品列表信息
  orderDetailCO: {}, // 订单信息
  shipping: {}, // 收货地址
  tradeOrderLogisticsList: [] // 物流信息
})


// 是否，可确认收货
const isReceivedAble = ref(false)
// 限制收货天数
const limitDaysForReceived = ref(5)
let TForReceivedAble
const clearTForReceivedAble = () => {
  clearTimeout(TForReceivedAble)
}


onMounted(() => {
  getInfo()
})
onUnmounted(() => {
  clearTForReceivedAble()
})


// 获取订单详情数据
const getInfo = async () => {
  const result = await buyerOrderApi.orderDetail({orderId: route.params?.id})
  const res = checkResponseData(result)
  if(res) {
    orderInfo.value = Object.assign(res)
    // 更新状态（默认为 发货 之后，加5个自然日「S+5」之后，方可确认收货）
    const shippingTime = orderInfo.value.orderDetailCO.shippingTime
    if (shippingTime) {
      const nowTime = new Date().getTime()
      const limitTime = shippingTime + limitDaysForReceived.value * 24 * 60 * 60 * 1000
      isReceivedAble.value = nowTime > limitTime
      if (!isReceivedAble.value) {
        TForReceivedAble = setTimeout(() => {
          isReceivedAble.value = true
          clearTForReceivedAble()
        }, limitTime - nowTime)
      }
    }
  }
}


// 联系人弹窗
const showContactInfo = ref(false) 
const showContactInfo2 = ref(false) 

// 确认已收货-完成订单
const showReceived = ref(false)
const receivedSave = () => {
  getInfo()
  showReceived.value = false
}
// 跳转店铺首页
const jumpToShop = () => {
    const url = 's/' + orderInfo.value.orderDetailCO?.sellerStoreId
    window.open(previewFlylinkStoreUrl(url), '_blank')
}
const getSrc = (imgName) => {
  return new URL(`../../assets/imgs/contact-icon/${imgName}.svg`, import.meta.url).href
}
</script>
<template>
  <div class="orders-detail-box" :class="{'m': isMobile}">
    <div class="header-back">
      <NuxtLink to="/orders" class="header-back-link">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon-arrow-left" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15.8334 9.99999H4.16675M4.16675 9.99999L10.0001 15.8333M4.16675 9.99999L10.0001 4.16666" stroke="#5548FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{$t('router.Orders')}}</span>
      </NuxtLink>
    </div>
    <div class="order-detail-title">
      <h3 class="title">{{$t(formatInTable(ordersStatus, orderInfo.orderDetailCO.buyerOrderStatus))}}</h3>
      <!-- 待付款的展示订单有效期 -->
      <h3 v-if="orderInfo.orderDetailCO.buyerOrderStatus===0 && orderInfo.orderDetailCO.expireTime" class="text">{{$t('orders.ordersValidityPeriod')}}: {{formatDate(orderInfo.orderDetailCO.expireTime)}}</h3>
      <!-- 待付款：发起支付Pay Now buyerOrderStatus0
           待发货：联系卖家Contact Seller buyerOrderStatus1
           已发货：查看物流Track Shipment，确认收货Mark as Received buyerOrderStatus2 
           再次购买：已完成3 和 已取消4 buyerOrderStatus-->
      <div class="order-detail-title-fotter">
        <a v-if="orderInfo.orderDetailCO.buyerOrderStatus===0 && orderInfo.orderDetailCO.payNowUrl" :href="orderInfo.orderDetailCO.payNowUrl" target="_blank">
          <el-button type="primary" id="Pay-Now-btn">{{$t('orders.ordersPayNow')}}</el-button>
        </a>
        <div v-if="orderInfo.orderDetailCO.buyerOrderStatus===0 && orderInfo.orderDetailCO.payNowUrl" class="flex-center-12"></div>

        <div v-if="orderInfo.orderDetailCO.buyerOrderStatus===1" class="position">
          <el-button type="primary" id="Contact-seller-btn" @click="showContactInfo2=true">{{$t('orders.ordersContactSeller')}}</el-button>
          <!-- 联系方式弹窗 -->
          <ContactInfo v-if="showContactInfo2" :contactInfo="orderInfo.orderDetailCO" left="0" @hide="showContactInfo2=false" />
        </div>
        <div v-if="orderInfo.orderDetailCO.buyerOrderStatus===1" class="flex-center-12"></div>

        <a v-if="orderInfo.orderDetailCO.buyerOrderStatus===2 && orderInfo.tradeOrderLogisticsList.length>0" :href="`https://t.17track.net/en#nums=${orderInfo.tradeOrderLogisticsList[0].logisticsCode}${orderInfo.tradeOrderLogisticsList[0].logisticsProviderCode ? '&fc='+orderInfo.tradeOrderLogisticsList[0].logisticsProviderCode : ''}`" target="_blank">
          <el-button type="primary" id="Track-Shipment-btn">{{$t('orders.ordersTrackShipment')}}</el-button>
        </a>
        <div v-if="orderInfo.orderDetailCO.buyerOrderStatus===2 && orderInfo.orderDetailCO.logisticsCode" class="flex-center-12"></div>
        
        <a v-if="([3,4].includes(orderInfo.orderDetailCO.buyerOrderStatus)) && orderInfo.orderDetailCO.orderLinkurl" :href="orderInfo.orderDetailCO.orderLinkurl" target="_blank">
          <el-button type="primary" id="Buy-Again-btn">{{$t('orders.ordersBuyAgain')}}</el-button>
        </a>
        <div v-if="([3,4].includes(orderInfo.orderDetailCO.buyerOrderStatus)) && orderInfo.orderDetailCO.orderLinkurl" class="flex-center-12"></div>

        <el-tooltip
          v-if="orderInfo.orderDetailCO.buyerOrderStatus===2"
          :disabled="isReceivedAble"
          popper-class="popper-1758164827863"
          effect="light"
          placement="top"
          :content="$t('orders.ordersMarkAsReceivedDisabledTip',{num:limitDaysForReceived})"
        >
          <el-button id="Mark-as-Received-btn" :disabled="!isReceivedAble" @click="showReceived=true">{{$t('orders.ordersMarkAsReceived')}}</el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="order-detail-content">
      <div class="right">
        <div v-if="orderInfo.orderDetailCO.buyerOrderStatus>=0" class="order-text">
          <b>{{$t('wallet.withdrawalRecordsFormLabelStatus')}}:</b>
          <p><el-tag class="orders-status-tag" :class="formatInTable(ordersStatus, orderInfo.orderDetailCO.buyerOrderStatus, 'value', 'tag')">{{$t(formatInTable(ordersStatus, orderInfo.orderDetailCO.buyerOrderStatus))}}</el-tag></p>
        </div>
        <div class="order-text">
          <b>{{$t('wallet.subReferralTableLabelOrderID')}}:</b>
          <p>{{orderInfo.orderDetailCO.flylinkOrderId}}</p>
        </div>
        <div class="order-text">
          <b>{{$t('orders.ordersCreateTime')}}:</b>
          <p>{{formatDate(orderInfo.orderDetailCO.createTime)}} (UTC+8)</p>
        </div>
        <div v-if="orderInfo.orderDetailCO.logisticsCode" class="order-text">
          <b>{{$t('orders.ordersShipmentTrackNo')}}</b>
          <p>
            <a
              v-for="item in orderInfo.tradeOrderLogisticsList"
              :key="item.id"
              :href="`https://t.17track.net/en#nums=${item.logisticsCode}${item.logisticsProviderCode ? '&fc='+item.logisticsProviderCode : ''}`"
              target="_blank"
              class="shipment-tag-a"
             >
              <span class="ellipsis">{{item.logisticsCode}}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <g clip-path="url(#clip0_5855_4663)">
                  <path d="M10.5 4.5L10.5 1.5M10.5 1.5H7.5M10.5 1.5L6.5 5.5M5 2.5H3.9C3.05992 2.5 2.63988 2.5 2.31901 2.66349C2.03677 2.8073 1.8073 3.03677 1.66349 3.31901C1.5 3.63988 1.5 4.05992 1.5 4.9V8.1C1.5 8.94008 1.5 9.36012 1.66349 9.68099C1.8073 9.96323 2.03677 10.1927 2.31901 10.3365C2.63988 10.5 3.05992 10.5 3.9 10.5H7.1C7.94008 10.5 8.36012 10.5 8.68099 10.3365C8.96323 10.1927 9.1927 9.96323 9.33651 9.68099C9.5 9.36012 9.5 8.94008 9.5 8.1V7" stroke="#5548FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                  <clipPath id="clip0_5855_4663">
                    <rect width="12" height="12" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </a>
          </p>
        </div>
        <el-divider class="divider" />
        <div class="order-text Contact" id="contact-info-click" @click="showContactInfo=true">
          <b>{{$t('orders.ordersContactSeller')}}</b>
          <div class="order-text-icon">
            <div v-for="item in contactData" :key="item.value" v-show="orderInfo.orderDetailCO[item.value]" class="contact-info-item-icon">
              <img v-if="orderInfo.orderDetailCO[item.value]" :src="getSrc(item.icon.replace('.svg', ''))" loading="lazy" />
            </div>
          </div>
          
          <!-- 联系方式弹窗 -->
          <ContactInfo v-if="showContactInfo" :contactInfo="orderInfo.orderDetailCO" @hide="showContactInfo=false" />
        </div>
      </div>
      <div class="left ">
        <div class="order-detail-content-top">
          <div class="header" @click="jumpToShop()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 17.5V13C12.5 12.5333 12.5 12.2999 12.4092 12.1217C12.3293 11.9649 12.2018 11.8374 12.045 11.7575C11.8667 11.6667 11.6334 11.6667 11.1667 11.6667H8.83333C8.36662 11.6667 8.13327 11.6667 7.95501 11.7575C7.79821 11.8374 7.67072 11.9649 7.59083 12.1217C7.5 12.2999 7.5 12.5333 7.5 13V17.5M2.5 5.83333C2.5 7.21404 3.61929 8.33333 5 8.33333C6.38071 8.33333 7.5 7.21404 7.5 5.83333C7.5 7.21404 8.61929 8.33333 10 8.33333C11.3807 8.33333 12.5 7.21404 12.5 5.83333C12.5 7.21404 13.6193 8.33333 15 8.33333C16.3807 8.33333 17.5 7.21404 17.5 5.83333M5.16667 17.5H14.8333C15.7668 17.5 16.2335 17.5 16.59 17.3183C16.9036 17.1586 17.1586 16.9036 17.3183 16.59C17.5 16.2335 17.5 15.7668 17.5 14.8333V5.16667C17.5 4.23325 17.5 3.76654 17.3183 3.41002C17.1586 3.09641 16.9036 2.84144 16.59 2.68166C16.2335 2.5 15.7668 2.5 14.8333 2.5H5.16667C4.23325 2.5 3.76654 2.5 3.41002 2.68166C3.09641 2.84144 2.84144 3.09641 2.68166 3.41002C2.5 3.76654 2.5 4.23325 2.5 5.16667V14.8333C2.5 15.7668 2.5 16.2335 2.68166 16.59C2.84144 16.9036 3.09641 17.1586 3.41002 17.3183C3.76654 17.5 4.23325 17.5 5.16667 17.5Z" stroke="#475467" stroke-width="1.44444" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="goods-text">{{orderInfo.orderDetailCO.sellerBusinessName}}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M6.75 13.5L11.25 9L6.75 4.5" stroke="#475467" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div v-for="(kv, i) in orderInfo.goodsSpuList" :key="i" class="goods-content-box">
            <div v-for="kvSku in kv.orderGoodsSkuCOList" :key="kvSku.id" class="goods-content">
              <div class="goods-name flex-box">
                <div class="goods-imgs">
                  <PictureForOSSAndCenter :image="previewImg(kvSku.mainPicture)" ref="imageRef" class="store-goods-module-item-image"></PictureForOSSAndCenter>
                </div>
                <div :class="`flex-center-${isMobile?'12':'20'}`"></div>
                <div class="goods-attr">
                  <div class="goods-spu ellipsis2 mb8">{{kvSku.goodsTitle}}</div>
                  <div v-if="kvSku.skuDesc" class="goods-sku ellipsis mb8" v-html="kvSku.skuDesc" />
                  <div v-else class="goods-sku ellipsis mb8">{{$t('orders.orderSkuDesc')}}</div>
                  <div class="goods-sku flex-box direction-ltr direction-flex-left" :class="{'no-flex-box': isMobile}">
                    <span class="goods-sku">{{$t('orders.ordersGoodsNo')}}: {{kvSku.flylinkGoodsNo}}</span>
                    <div class="flex-center-8"></div>
                    <span v-if="kvSku.skuId" class="goods-sku" :class="{'goods-sku-mobile': isMobile}">{{$t('orders.ordersSkuCode')}}:<br v-if="isMobile" /> {{kvSku.skuId}}</span>
                  </div>
                </div>
              </div>
              <div :class="`flex-center-${isMobile?'12':'20'}`"></div>
              <div class="goods-quantity direction-text-align-right">
                <span>{{kvSku.paymentCurrency}} {{currencyFormat(kvSku.paymentAmount)}}</span>
                <p class="quantity">× {{ kvSku.quantity || '0' }}</p>
              </div>
            </div>
            <div class="Subtotal-info-li">
              <div class="flex-center-80"></div>
              <span class="Subtotal-info-li-label">{{$t('orders.ordersSubtotal')}}</span>
              <div class="flex-center"></div>
              <div class="Subtotal-info-li-value">{{kv.paymentCurrency}} {{currencyFormat(kv.totalPrice)}}</div>
            </div>
          </div>
          <div class="goods-details-bottom">
            <div class="goods-details-text">
              <div class="goods-details-text1">
                {{$t('orders.ordersSubtotal')}}
              </div>
              <div class="goods-details-text2">
                {{orderInfo.orderDetailCO.paymentCurrency}} {{currencyFormat(orderInfo.orderDetailCO.goodsAmount)}}
              </div>
            </div>
            <template v-if="orderInfo.orderDetailCO.transSource === 'QUICK_ORDER'">
              <div class="goods-details-text">
                <div class="goods-details-text1">
                  {{$t('orders.ordersShipping')}}
                </div>
                <div class="goods-details-text2">
                  {{orderInfo.orderDetailCO.paymentCurrency}} {{currencyFormat(orderInfo.orderDetailCO.shippingFeeAmount)}}
                </div>
              </div>
              <div v-if="orderInfo.orderDetailCO.transSource==='QUICK_ORDER'" class="goods-details-text">
                <div class="goods-details-text1">
                  {{$t('orders.ordersMargin')}}
                </div>
                <div class="goods-details-text2">
                  {{orderInfo.orderDetailCO.paymentCurrency}} {{currencyFormat(orderInfo.orderDetailCO.marginAmount)}}
                </div>
              </div>
            </template>
            <div v-else class="goods-details-text">
              <div class="goods-details-text1">
                {{$t('orders.ordersShipping')}}
              </div>
              <div v-if="orderInfo.orderDetailCO.shippingFeeAmount >= 0" class="goods-details-text2">
                <h2 class="deliver-h2">
                  <span class="decoration" v-if="orderInfo.orderDetailCO.discountedShippingAmount>0">{{orderInfo.orderDetailCO.paymentCurrency}} {{currencyFormat(orderInfo.orderDetailCO.discountedShippingAmount)}}</span>
                  <span v-else-if="orderInfo.orderDetailCO.shippingFeeAmount>0">{{orderInfo.orderDetailCO.paymentCurrency}} {{currencyFormat(orderInfo.orderDetailCO.shippingFeeAmount)}}</span>
                  <span class="active" v-else>{{$t('orders.ordersFreeShipping')}}</span>
                </h2>
              </div>
            </div>
            <!-- 存在邮费并且达到包邮 -->
            <div v-if="orderInfo.orderDetailCO.freeShippingThreshold && orderInfo.orderDetailCO.discountedShippingAmount>0" class="goods-details-text">
              <div class="goods-details-text2 deliver-p active  font-size16">
                {{$t('orders.ordersFreeShippingLimit', {curreny: orderInfo.orderDetailCO.paymentCurrency, amt: currencyFormat(orderInfo.orderDetailCO.freeShippingThreshold)})}}
              </div>
            </div>
            <div class="goods-details-text">
              <div class="goods-details-text1">
                {{$t('orders.ordersTotal')}}
              </div>
              <div class="goods-details-text2 font-size24">
                {{orderInfo.orderDetailCO.paymentCurrency}}  {{currencyFormat(orderInfo.orderDetailCO.paymentAmount)}}
              </div>
            </div>
          </div>
        </div>
        <div class="shipping-box">
          <div class="shipping-title">{{$t('orders.ordersShippingInformation')}}</div>
          <div class="shipping-content">
            <dl>
              <dt>{{$t('orders.ordersContact')}}:</dt>
              <dd>
                <p>{{ orderInfo.shipping.firstName || '--' }} {{ orderInfo.shipping.lastName }}</p>
                <p>{{ orderInfo.shipping.email || '--' }}</p>
                <p>+{{orderInfo.shipping.callingCode}} {{ orderInfo.shipping.phone || '--' }}</p>
              </dd>
            </dl>
            <dl>
              <dt>{{$t('orders.ordersAddressLine')}}:</dt>
              <dd>
                <p>{{ orderInfo.shipping.addressLine || '--' }}</p>
                <p>{{ orderInfo.shipping.addressLineTwo }}</p>
              </dd>
            </dl>
            <dl>
              <dt>{{$t('orders.ordersCity')}}:</dt>
              <dd>
                <p>{{ orderInfo.shipping.city || '--' }}</p>
              </dd>
            </dl>
            <dl>
              <dt>{{$t('orders.ordersState')}}:</dt>
              <dd>
                <p>{{ orderInfo.shipping.state || '--' }}</p>
              </dd>
            </dl>
            <dl>
              <dt>{{$t('orders.ordersCountry')}}:</dt>
              <dd>
                <p>{{ orderInfo.shipping.country || '--' }}</p>
              </dd>
            </dl>
            <dl>
              <dt>{{$t('orders.ordersPostalCode')}}:</dt>
              <dd>
                <p>{{ orderInfo.shipping.zipcode || '--' }}</p>
              </dd>
            </dl>
            <dl class="margin-top36">
              <dt>{{$t('orders.orderVatID')}}:</dt>
              <dd>
                <p>{{ orderInfo.shipping.vatNo || '--' }}</p>
              </dd>
            </dl>
            <dl>
              <dt>{{$t('orders.orderNotes')}}:</dt>
              <dd>
                <p>{{ orderInfo.orderDetailCO.buyerMessage || '--' }}</p>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 已完成收货-->
    <ShipmentReceived v-if="showReceived" v-model="showReceived" :data="orderInfo.orderDetailCO" @save="receivedSave" />
  </div>
</template>

<style lang="scss">
  @use "@/assets/css/element-reset/popover.scss" as *;
</style>

<style lang="scss" scoped>
@use "@/assets/css/element-reset/tag.scss" as *;
@use "@/assets/css/orders/style" as *;
</style>
<style lang="scss">
.main-container .main-wrap.main-wrap-orders-id, .main-container .m-wrap.main-wrap-orders-id {
  background: linear-gradient(0deg, #F9FAFB 0%, #F9FAFB 100%), #FFF;
  border-top: 1px solid #E4E7EC;
}
.main-container .m-wrap.main-wrap-orders-id {
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2) inset, 0px 5px 10px -5px rgba(0, 0, 0, 0.1) inset;
}

.rtl .order-detail-content .left .goods-content .goods-name {
  display: flex;
}
</style>