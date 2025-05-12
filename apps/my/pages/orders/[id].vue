<!--
 * @Author: czy
 * @Description: 买家中心/订单列表/订单详情
-->
<script name="OrdersDeatil" setup>
import { checkResponseData, successMessage, currencyFormat, formatInTable, previewImg } from "@/util/index.js";
import { contactData } from "@/components/ContactInfo/const.js";
import { ordersStatus } from "@/util/const.js";
import { formatDate } from "@flylinking/core/utils/dateUtil"
const { buyerOrderApi } = useApi();
  
const route = useRoute();
const isMobile = useIsMobile()

const orderInfo = ref({
  goodsList: [],
  orderDetailCO: {},
  shipping: {}
})
onMounted(() => { 
  getInfo()
})
// 获取订单详情数据
const getInfo = async () => {
  const result = await buyerOrderApi.orderDetail({orderId: route.params?.id})
  const res = checkResponseData(result)
  if(res) {
    orderInfo.value = Object.assign(res)
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
</script>
<template>
  <div class="orders-detail-box" :class="{'m': isMobile}">
    <div class="header-back">
      <NuxtLink to="/orders">
        <i class="Flylink icon-arrow-left"></i>{{$t('router.Orders')}}
      </NuxtLink>
    </div>
    <div class="order-detail-title">
      <div v-if="orderInfo.orderDetailCO.buyerOrderStatus" class="order-detail-title-header">
        <el-tag class="orders-status-tag" :class="formatInTable(ordersStatus, orderInfo.orderDetailCO.buyerOrderStatus, 'value', 'tag')">{{$t(formatInTable(ordersStatus, orderInfo.orderDetailCO.buyerOrderStatus))}}</el-tag>
      </div>
      <h3 v-if="orderInfo.goodsList.length>0" class="title">{{orderInfo.goodsList[0].goodsTitle}}</h3>
      <!-- 待付款：发起支付Pay Now buyerOrderStatus0
           待发货：联系卖家Contact Seller buyerOrderStatus1
           已发货：查看物流Track Shipment，确认收货Mark as Received buyerOrderStatus2 -->
      <div class="order-detail-title-fotter">
        <a v-if="orderInfo.orderDetailCO.buyerOrderStatus===0 && orderInfo.orderDetailCO.payNowUrl" :href="orderInfo.orderDetailCO.payNowUrl" target="_blank"><el-button type="primary" id="Pay-Now-btn">{{$t('orders.ordersPayNow')}}</el-button></a>
        <div v-if="orderInfo.orderDetailCO.buyerOrderStatus===1" class="order-detail-title-fotter-button">
          <el-button type="primary" id="Contact-seller-btn" @click="showContactInfo2=true">{{$t('orders.ordersContactSeller')}}</el-button>
          <!-- 联系方式弹窗 -->
          <ContactInfo v-if="showContactInfo2" :contactInfo="orderInfo.orderDetailCO" left="0" @hide="showContactInfo2=false" />
        </div>
        <el-button v-if="orderInfo.orderDetailCO.buyerOrderStatus===2" id="Mark-as-Received-btn" @click="showReceived=true">{{$t('orders.ordersMarkAsReceived')}}</el-button>
        <a v-if="orderInfo.orderDetailCO.buyerOrderStatus===2 && orderInfo.orderDetailCO.logisticsCode" :href="`https://t.17track.net/en#nums=${orderInfo.orderDetailCO.logisticsCode}`" target="_blank">
          <el-button type="primary" id="Track-Shipment-btn">{{$t('orders.ordersTrackShipment')}}</el-button>
        </a>
      </div>
    </div>
    <div class="order-detail-content">
      <div class="right">
        <div class="order-text">
          <b>{{$t('wallet.subReferralTableLabelOrderID')}}:</b>
          <p>{{orderInfo.orderDetailCO.id}}</p>
        </div>
        <div class="order-text">
          <b>{{$t('orders.ordersCreateTime')}}:</b>
          <p>{{formatDate(orderInfo.orderDetailCO.createTime)}}</p>
        </div>
        <div class="order-text">
          <b>{{$t('orders.ordersShipmentTrackNo')}}</b>
          <p v-if="orderInfo.orderDetailCO.logisticsCode">
            <a :href="`https://t.17track.net/en#nums=${orderInfo.orderDetailCO.logisticsCode}`" target="_blank" class="shipment-tag-a">
              <span class="ellipsis">{{orderInfo.orderDetailCO.logisticsCode}}</span>
              <i class="Flylink icon-share-04"></i>
            </a>
          </p>
        </div>
        <el-divider class="divider" />
        <div class="order-text Contact" id="contact-info-click" @click="showContactInfo=true">
          <b>{{$t('orders.ordersContactSeller')}}</b>
          <div class="order-text-icon">
            <div v-for="item in contactData" :key="item.value" v-show="orderInfo.orderDetailCO[item.value]" class="contact-info-item-icon">
              <img v-if="orderInfo.orderDetailCO[item.value]" :src="item.icon" lazy />
            </div>
          </div>
          
          <!-- 联系方式弹窗 -->
          <ContactInfo v-if="showContactInfo" :contactInfo="orderInfo.orderDetailCO" @hide="showContactInfo=false" />
        </div>
      </div>
      <div class="left ">
        <div class="order-detail-content-top">
          <div class="header">
            <i class="Flylink icon-Shop"></i>
            <span class="goods-text">{{orderInfo.orderDetailCO.sellerBusinessName}}</span>
            <i class="Flylink icon-chevron-right"></i>
          </div>
          <dl v-for="kv in orderInfo.goodsList" :key="kv.id" class="goods-content">
            <dt class="goods-name">
              <div class="goods-imgs">
                <PictureForOSSAndCenter :image="previewImg(kv.mainPicture)" ref="imageRef" class="store-goods-module-item-image"></PictureForOSSAndCenter>
              </div>
              <div class="goods-attr">
                <p class="goods-sku ellipsis">
                  {{$t('orders.ordersSkuCode')}}: 
                  <span class="goods-sku-code ellipsis">{{kv.skuCode}}</span>
                </p>
                <div class="goods-spu ellipsis2" v-html="kv.skuDesc" />
              </div>
            </dt>
            <dd class="goods-quantity">
              <span>{{kv.paymentCurrency}} {{currencyFormat(kv.paymentAmount)}}</span>
              <span class="quantity">× {{ kv.quantity || '0' }}</span>
            </dd>
          </dl>
          <div class="goods-details-bottom">
            <div class="goods-details-text">
              <div class="goods-details-text1">
                {{$t('orders.ordersSubtotal')}}
              </div>
              <div class="goods-details-text2">
                {{orderInfo.orderDetailCO.paymentCurrency}} {{currencyFormat(orderInfo.orderDetailCO.goodsAmount)}}
              </div>
            </div>
            <div class="goods-details-text">
              <div class="goods-details-text1">
                {{$t('orders.ordersShipping')}}
              </div>
              <div v-if="orderInfo.orderDetailCO.shippingFeeAmount || orderInfo.orderDetailCO.shippingFeeAmount===0" class="goods-details-text2">
                <h2 class="deliver-h2">
                  <span class="decoration" v-if="orderInfo.orderDetailCO.discountedShippingAmount>0">{{orderInfo.orderDetailCO.paymentCurrency}} {{currencyFormat(orderInfo.orderDetailCO.discountedShippingAmount)}}</span>
                  <span v-else-if="orderInfo.orderDetailCO.shippingFeeAmount>0">{{orderInfo.orderDetailCO.paymentCurrency}} {{currencyFormat(orderInfo.orderDetailCO.shippingFeeAmount)}}</span>
                  <span class="active" v-else>{{$t('orders.ordersFreeShipping')}}</span>
                </h2>
              </div>
            </div>
            <!-- 存在邮费并且达到包邮 -->
            <div v-if="orderInfo.orderDetailCO.freeShippingThreshold && orderInfo.orderDetailCO.discountedShippingAmount>0" class="goods-details-text">
              <div class="goods-details-text2 deliver-p active">
                {{$t('orders.ordersFreeShippingLimit', {curreny: orderInfo.orderDetailCO.paymentCurrency, amt: currencyFormat(orderInfo.orderDetailCO.freeShippingThreshold)})}}
              </div>
            </div>
            <div class="goods-details-text">
              <div class="goods-details-text1">
                {{$t('orders.ordersTotal')}}
              </div>
              <div class="goods-details-text2">
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
          </div>
        </div>
      </div>
    </div>
    
    <!-- 已完成收货-->
    <ShipmentReceived v-if="showReceived" v-model="showReceived" :data="orderInfo.orderDetailCO" @save="receivedSave" />
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/css/element-reset/tag.scss" as *;
@use "@/assets/css/orders/style" as *;
</style>
<style lang="scss">
.main-container .main-wrap.main-wrap-orders-id, .main-container .m-wrap.main-wrap-orders-id {
  background: linear-gradient(0deg, var(--Colors-Background-bg-secondary, #F9FAFB) 0%, var(--Colors-Background-bg-secondary, #F9FAFB) 100%), var(--Colors-Background-bg-primary, #FFF);
  border-top: 1px solid #E4E7EC;
}
.main-container .m-wrap.main-wrap-orders-id {
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.2) inset, 0px 5px 10px -5px rgba(0, 0, 0, 0.1) inset;
}

.rtl .order-detail-content .left .goods-content .goods-name {
  display: flex;
  margin: 0;
  .goods-imgs {
    margin: 0;
    margin-left: 20px;
  }
}
</style>