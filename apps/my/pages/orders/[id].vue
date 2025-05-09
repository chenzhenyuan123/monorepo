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
  console.log(res)
  if(res) {
    orderInfo.value = Object.assign(res)
  }
}

// 联系人弹窗
const showContactInfo = ref(false) 
const contactSellerRef = ref(null) // 弹窗ref
const contactInfoRef = ref(null) // 弹窗ref
const contactInfoScrollHeight = ref(0) // 弹窗top位置
const positionLeft = ref('auto') // 弹窗left位置  aoto靠右
const contactInfoClick = (ref, type) => {
  const rect = ref.getBoundingClientRect();
  contactInfoScrollHeight.value = parseInt(rect?.top) + rect?.height
  showContactInfo.value = true
  positionLeft.value = (rect?.left&&type) ? `${rect.left}px` : 'auto'
}

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
        <el-tag :class="formatInTable(ordersStatus, orderInfo.orderDetailCO.buyerOrderStatus, 'value', 'tag')">{{$t(formatInTable(ordersStatus, orderInfo.orderDetailCO.buyerOrderStatus))}}</el-tag>
      </div>
      <h3 v-if="orderInfo.goodsList.length>0" class="title">{{orderInfo.goodsList[0].goodsTitle}}</h3>
      <!-- 待付款：发起支付Pay Now buyerOrderStatus0
           待发货：联系卖家Contact Seller buyerOrderStatus1
           已发货：查看物流Track Shipment，确认收货Mark as Received buyerOrderStatus2 -->
      <div class="order-detail-title-fotter">
        <a v-if="orderInfo.orderDetailCO.buyerOrderStatus===0" :href="orderInfo.orderDetailCO.payNowUrl" target="_blank"><el-button type="primary" id="Pay-Now-btn">{{$t('orders.ordersPayNow')}}</el-button></a>
        <div v-if="orderInfo.orderDetailCO.buyerOrderStatus===1" ref="contactSellerRef" class="order-detail-title-fotter-button">
          <el-button type="primary" id="Contact-seller-btn" @click="contactInfoClick(contactSellerRef, 'left')">{{$t('orders.ordersContactSeller')}}</el-button>
        </div>
        <el-button v-if="orderInfo.orderDetailCO.buyerOrderStatus===2" id="Mark-as-Received-btn" @click="showReceived=true">{{$t('orders.ordersMarkAsReceived')}}</el-button>
        <a v-if="orderInfo.orderDetailCO.buyerOrderStatus===2" :href="`https://t.17track.net/en#nums=${orderInfo.orderDetailCO.logisticsCode}`" target="_blank">
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
        <div ref="contactInfoRef" class="order-text Contact" id="contact-info-click" @click="contactInfoClick(contactInfoRef)">
          <b>{{$t('orders.ordersContactSeller')}}</b>
          <div class="order-text-icon">
            <div v-for="item in contactData" :key="item.value" v-show="orderInfo.orderDetailCO[item.value]" class="contact-info-item-icon">
              <img v-if="orderInfo.orderDetailCO[item.value]" :src="item.icon" lazy />
            </div>
          </div>
        </div>
      </div>
      <div class="left">
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
              {{orderInfo.currency}} {{currencyFormat(orderInfo.orderDetailCO.goodsAmount)}}
            </div>
          </div>
          <div class="goods-details-text">
            <div class="goods-details-text1">
              {{$t('orders.ordersShipping')}}
            </div>
            <div class="goods-details-text2">
              <h2 class="deliver-h2">
                <span class="decoration" v-if="orderInfo.orderDetailCO.discountedShippingAmount>0">{{orderInfo.orderDetailCO.currency}} {{currencyFormat(orderInfo.orderDetailCO.discountedShippingAmount)}}</span>
                <span v-else-if="orderInfo.orderDetailCO.shippingFeeAmount===0 || orderInfo.orderDetailCO.shippingFeeAmount">{{orderInfo.orderDetailCO.currency}} {{currencyFormat(orderInfo.orderDetailCO.shippingFeeAmount)}}</span>
                <span class="active" v-else>{{$t('orders.ordersFreeShipping')}}</span>
              </h2>
            </div>
          </div>
          <!-- 存在邮费并且达到包邮 -->
          <div v-if="orderInfo.orderDetailCO.freeShippingThreshold && orderInfo.orderDetailCO.discountedShippingAmount>0" class="goods-details-text">
            <div class="goods-details-text2 deliver-p active">
              {{$t('orders.ordersFreeShippingLimit', {curreny: orderInfo.currency, amt: currencyFormat(orderInfo.orderDetailCO.freeShippingThreshold)})}}
            </div>
          </div>
          <div class="goods-details-text">
            <div class="goods-details-text1">
              {{$t('orders.ordersTotal')}}
            </div>
            <div class="goods-details-text2">
              {{orderInfo.currency}}  {{currencyFormat(orderInfo.orderDetailCO.goodsAmount)}}
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

    <!-- 联系方式 -->
    <ContactInfo v-if="showContactInfo" :contactInfo="orderInfo.orderDetailCO" :positionTop="contactInfoScrollHeight" :positionLeft="positionLeft" @hide="showContactInfo=false" />
    
    <!-- 已完成收货-->
    <ShipmentReceived v-if="showReceived" v-model="showReceived" :data="orderInfo.orderDetailCO" @save="receivedSave" />
  </div>
</template>
<style lang="scss" scoped>
.orders-detail-box {
  margin: 20px 0 32px;
}
.order-detail-title {
  .order-detail-title-header {
    .el-tag {
      border-radius: 6px;
      border: 1px solid #B2DDFF;
      background:#EFF8FF;
      color: #175CD3;
      font-weight: 600;
    }
    .el-tag.success {
      border: 1px solid #ABEFC6;
      background: #ECFDF3;
      color:#067647;
    }
    .el-tag.warning {
      border: 1px solid #CFCCFF;
      background: #F0EFFF;
      color:#443ACC;
    }
    .el-tag.info {
      border: 1px solid #E4E7EC;
      background: #F9FAFB;
      color:#344054;
    }
  }
  .title {
    color: 101828;
    font-family: Inter;
    font-size: 30px;
    font-weight: 600;
    line-height: 38px;
    margin: 8px 0 20px;
  }
  .order-detail-title-fotter-button {
    display: inline-block;
    margin-right: 12px;
  }
}
.order-detail-content {
  border-radius: 8px;
  margin-top: 28px;
  width: 100%;
  display: inline-block;
  .right {
    width: 320px;
    margin-left: 24px;
    float: right;
    background-color: #fff;
    .order-text {
      padding: 16px 20px 0;
      b {
        color: #475467;
        font-family: Inter;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
      }
      p, .order-text-icon {
        color: #475467;
        font-family: Inter;
        font-size: 16px;
        line-height: 24px;
        margin-top: 4px;
        overflow: hidden;
      }
      .contact-info-item-icon {
        float: left;
        margin-right: 6px;
      }
      .shipment-tag-a {
        display: inline-block;
        max-width: calc(100% - 16px);
        cursor: pointer;
        border-radius: 6px;
        border: 1px solid #CFCCFF;
        background: #F0EFFF;
        margin-top: 6px;
        overflow: hidden;
        text-decoration: none;
        padding: 2px 8px 2px 6px;
        margin-right: 8px;
        span {
          display: block;
          float: left;
          max-width: calc(100% - 16px);
          color: #443ACC;
          text-align: center;
          font-family: Inter;
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
        }
        i {
          display: block;
          float: left;
          margin-left: 4px;
          font-size: 12px;
          line-height: 20px;
        }
      }
    }
    .Contact {
      margin: 16px 24px;
      padding: 0;
      cursor: pointer;
      position: relative;
      display: inline-block;
    }
    .divider {
      margin: 16px 0 0 0;
    }
  }
  .left {
    float: left;
    background-color: #fff;
    overflow: hidden;
    width: calc(100% - 320px - 24px);
    margin-bottom: 24px;
    .header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      cursor: pointer;
      border-bottom: 1px solid var(--Colors-Border-border-secondary, #E4E7EC);
      .goods-text {
        color: #101828;
        font-family: Inter;
        font-size: 18px;
        font-weight: 600;
        line-height: 28px;
        max-width: calc(100% - 50px);
        margin: 0 6px;
      }
      svg, i {
        color: #475467;
        line-height: 28px;
      }
    }
    .goods-content {
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      .goods-name {
        flex: 1;
        margin-right: 20px;
        .goods-imgs{
          width: 60px;
          height: 60px;
          border-radius: 2.4px;
          overflow: hidden;
          margin-right: 20px;
          float: left;
          border-radius: 2.4px;
          background: #f7f7f7;
          .store-goods-module-item-image {
            width: 60px;
            height: 60px;
            display: block;
          }
        }
        .goods-attr {
          width: calc(100% - 80px);
          float: left;
         .goods-sku {
            color: #667085;
            font-family: Inter;
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 8px;
          }
         .goods-spu {
            color: #101828;
            font-family: Inter;
            font-size: 16px;
            line-height: 24px;
         }
        }
      }
      .goods-quantity {
        flex-shrink: 0;
        text-align: right;
        font-family: Inter;
        line-height: 30px;
        span {
          color: #101828;
          font-size: 20px;
          font-weight: 600;
        }
        .quantity {
          color: #475467;
          font-size: 16px;
          font-weight: 400;
          margin-left: 4px;
        }
      }
    }
    .goods-details-bottom {
      padding: 16px 20px;
      overflow: hidden;
      padding-left: 50%;
      border-top: 1px solid #E4E7EC;
      .goods-details-text {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        color: #101828;
        width: 100%;
        color: #101828;
        font-family: Inter;
        font-size: 16px;
        line-height: 24px;
        .goods-details-text1 {
          margin-right: 16px;
        }
        .goods-details-text2 {
          text-align: right;
          font-weight: 600;
        }
        .deliver-p {
          text-align: right;
          flex: 1;
          font-weight: 400;
          font-size: 12px;
          margin-top: -8px;
        }
        .decoration{
          color: #a9aaad;
          text-decoration: line-through;
        }
        .active {
          color: #21a470;
        }
      }
    }
  }
}
.shipping-box {
  width: calc(100% - 320px - 24px);
  background-color: #fff;
  overflow: hidden;
  .shipping-title {
    padding: 16px 20px;
    border-bottom: 1px solid #E4E7EC;
  }
  .shipping-content {
    padding: 16px 20px;
    dl {
      display: flex;
      margin-bottom: 8px;
      dt {
        color: #475467;
        font-family: Inter;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        margin-bottom: 4px;
        min-width: 160px;
      }
      dd {
        flex: 1;
        p {
          color: #475467;
          font-family: Inter;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
}

.m.orders-detail-box {
  .order-detail-title, .header-back {
    padding: 0 16px;
  }
  .order-detail-content {
    .right {
      margin-bottom: 16px;
      margin-left: 0;
      width: 100%;
    }
    .left {
      width: 100%;
      .quantity, .goods-sku-code {
        display: block;
      }
      .goods-details-bottom {
        padding-left: 20px;
      }
    }
  }
  .shipping-box {
    width: 100%;
    .shipping-content {
      dl {
        display: block;
        margin-bottom: 12px;
        dt {
          width: 100%;
        }
      }
    }
  }
}
// 媒体自适应
@media screen and (max-width: 768px) {
  .order-detail-content {
    .right {
      margin-bottom: 16px;
      margin-left: 0;
      width: 100%;
    }
    .left {
      width: 100%;
      .quantity, .goods-sku-code {
        display: block;
      }
      .goods-details-bottom {
        padding-left: 20px;
      }
    }
  }
  .shipping-box {
    width: 100%;
    .shipping-content {
      dl {
        display: block;
        margin-bottom: 12px;
        dt {
          width: 100%;
        }
      }
    }
  }
}
@media screen and (max-width: 1000px){
  .order-detail-content .left .goods-details-bottom {
    padding-left: 20px;
  }
}
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