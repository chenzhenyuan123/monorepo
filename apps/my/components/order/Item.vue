<!--
 * @Author: czy
 * @Description: 买家中心/订单列表/订单项
-->
<script name="Orders" setup>
    import { useI18n } from "vue-i18n";
    import { currencyFormat, formatInTable, previewImg } from "@/util/index.js"
    import { ordersStatus, refundStatus } from "@/util/const.js";
    import {formatDate} from "@flylinking/core/utils/dateUtil";
    import {previewFlylinkStoreUrl} from "@flylinking/core/utils/urlUtil";
    import { ArrowRight } from '@element-plus/icons-vue';
    import {sendLog} from "@flylinking/core/utils/logUtil";
    import {accurate_toFixed} from "@flylinking/core/utils/dataUtil";

    const props = defineProps({
        orderData: {
            type: Object,
            default: () => ({})
        }
    })
    const { t } = useI18n();
    const router = useRouter();
    const isMobile = useIsMobile()

    const hasButton = computed(() => {
        return props.orderData.buyerOrderStatus===0 && props.orderData.payNowUrl ||
            props.orderData.buyerOrderStatus===1 ||
            props.orderData.buyerOrderStatus===2 && props.orderData.logisticsCode ||
            ([3,4].includes(props.orderData.buyerOrderStatus)) && props.orderData.orderLinkurl
    })

    const skuLimit = ref(3)
    const isShowSkuMore = ref(false)
    const showSkuMore = () => {
        isShowSkuMore.value = true
    }

    const jumpToDetail = () => {
        navigateTo({
            path: `/orders/${props.orderData.id}`
        })
    }

    const jumpToShop = () => {
        const url = 's/' + props.orderData.sellerStoreId
        window.open(previewFlylinkStoreUrl(url), '_blank')
    }

    const jumpToPay = (url, type) => {
        if (type === 'Buy-Again-btn') { // 给再次购买加日志统计
            sendLog({
                eventType: 2,
                eventCode: 'my-order-click-Buy-Again',
                eventDesc: '买家中心-订单列表和详情-再次购买Buy-Again'
            })
        }
        window.open(url, '_blank')
    }

    const jumpTo17track = () => {
        const url = `https://t.17track.net/en#nums=${props.orderData.tradeOrderLogisticsList[0]?.logisticsCode}${props.orderData.tradeOrderLogisticsList[0]?.logisticsProviderCode ? '&fc='+props.orderData.tradeOrderLogisticsList[0].logisticsProviderCode : ''}`
        window.open(url, '_blank')
    }


    // 联系人弹窗
    const showContactInfo = ref(false)
</script>

<template>
    <div class="order-list-box" @click="jumpToDetail">
        <div class="header justify-between">
            <div class="flex">
                <template v-if="!isMobile">
                    <span class="span big">{{ formatDate(orderData.createTime, 4) }}</span>
                    <div class="flex-center-8"></div>
                    <span class="span">{{$t('orders.orderItemLabelOrderID')}}: {{ orderData.flylinkOrderId }}</span>
                    <div class="line"></div>
                </template>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" class="icon-Shop icon mt7" @click.stop="jumpToShop">
                    <path d="M10 14V10.4C10 10.0266 10 9.83995 9.92734 9.69734C9.86342 9.5719 9.76144 9.46991 9.63599 9.406C9.49339 9.33333 9.3067 9.33333 8.93333 9.33333H7.06667C6.6933 9.33333 6.50661 9.33333 6.36401 9.406C6.23857 9.46991 6.13658 9.5719 6.07266 9.69734C6 9.83995 6 10.0266 6 10.4V14M2 4.66667C2 5.77124 2.89543 6.66667 4 6.66667C5.10457 6.66667 6 5.77124 6 4.66667C6 5.77124 6.89543 6.66667 8 6.66667C9.10457 6.66667 10 5.77124 10 4.66667C10 5.77124 10.8954 6.66667 12 6.66667C13.1046 6.66667 14 5.77124 14 4.66667M4.13333 14H11.8667C12.6134 14 12.9868 14 13.272 13.8547C13.5229 13.7268 13.7268 13.5229 13.8547 13.272C14 12.9868 14 12.6134 14 11.8667V4.13333C14 3.3866 14 3.01323 13.8547 2.72801C13.7268 2.47713 13.5229 2.27316 13.272 2.14532C12.9868 2 12.6134 2 11.8667 2H4.13333C3.3866 2 3.01323 2 2.72801 2.14532C2.47713 2.27316 2.27316 2.47713 2.14532 2.72801C2 3.01323 2 3.3866 2 4.13333V11.8667C2 12.6134 2 12.9868 2.14532 13.272C2.27316 13.5229 2.47713 13.7268 2.72801 13.8547C3.01323 14 3.3866 14 4.13333 14Z" stroke="#475467" stroke-width="1.14286" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div class="flex-center-4" @click.stop="jumpToShop"></div>
                <span class="span link ellipsis" @click.stop="jumpToShop">{{ orderData.sellerBusinessName }}</span>
                <div class="flex-center-4" @click.stop="jumpToShop"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" class="icon-chevron-right icon mt6 mirror-x-icon" @click.stop="jumpToShop">
                    <path d="M6.75 13.5L11.25 9L6.75 4.5" stroke="#475467" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="flex-center-8"></div>
            <div class="flex justify-end flex-wrap gap8">
                <!-- 有退款refundStatus1 -->
                <el-tag v-if="orderData.refundStatus===1" class="orders-status-tag" :class="formatInTable(refundStatus, orderData.refundStatus, 'value', 'tag')">{{$t(formatInTable(refundStatus, orderData.refundStatus))}}</el-tag>
                <!-- 支付状态 -->
                <el-tag class="orders-status-tag" :class="formatInTable(ordersStatus, orderData.buyerOrderStatus, 'value', 'tag')">{{$t(formatInTable(ordersStatus, orderData.buyerOrderStatus))}}</el-tag>
            </div>            
        </div>
        <div v-for="(item, i) in orderData.orderGoodsSpuCOList" :key="i">
            <dl v-if="isShowSkuMore || i < skuLimit" class="goods-content">
                <div class="goods-imgs">
                    <img :src="previewImg(item.mainPicture)" lazy />
                </div>
                <div class="goods-attr">
                    <div class="goods-spu ellipsis2">{{ item.goodsTitle }}</div>
                    <p class="goods-sku ellipsis">{{$t('orders.ordersGoodsNo')}}: {{item.flylinkGoodsNo}}</p>
                </div>
                <dd class="goods-quantity-container direction-text-align-right">
                    <p class="goods-quantity-amount">{{ item.paymentCurrency }} {{currencyFormat(item.paymentAmount)}}</p>
                    <p class="goods-quantity-num">{{$t('orders.orderItemLabelQuantity')}}: {{ item.quantity }}</p>
                </dd>
            </dl>
        </div>
        <div v-if="orderData.orderGoodsSpuCOList.length > skuLimit && !isShowSkuMore" class="goods-sku-more">
            <el-button
                    id="sku-more-btn"
                    @click.stop="jumpToDetail"
            >{{$t('orders.orderItemButtonMore')}}<el-icon class="tag-icon mirror-x-icon"><ArrowRight /></el-icon></el-button>
        </div>
        <div class="goods-details-bottom direction-text-align-right">
            <div v-if="orderData.shippingFeeAmount >= 0" class="goods-details-text">
                <div v-if="orderData.shippingFeeAmount > 0">{{$t('orders.ordersShippingAmount', { currency: orderData.paymentCurrency, amt: currencyFormat(orderData.shippingFeeAmount) })}}</div>
                <template v-else-if="orderData.discountedShippingAmount">
                    <div class="delete">{{$t('orders.ordersShippingAmount', { currency: orderData.paymentCurrency, amt: currencyFormat(orderData.discountedShippingAmount) })}}</div>
                    <div class="active">{{$t('orders.ordersFreeShippingLimit', { currency: orderData.paymentCurrency, amt: currencyFormat(orderData.freeShippingThreshold) })}}</div>
                </template>
                <div v-else class="active">{{$t('orders.ordersFreeShipping')}}</div>
            </div>
            <!-- 商品订单才有优惠字段 -->
            <template v-if="orderData.transSource === 'GOODS_ORDER' && orderData.discountAmount">
                <div class="goods-details-text-container direction-flex-right">
                    <div class="goods-details-text">{{$t('orders.discount')}}</div>
                    <div class="flex-center-6"></div>
                    <div class="goods-details-text colorRed direction-ltr">
                        - {{orderData.paymentCurrency}} {{currencyFormat(orderData.discountAmount)}}
                    </div>
                </div>
                <div class="goods-details-text">
                    <div class="goods-details-text colorTip">
                        <!-- 优惠券类型为折扣码 -->
                        <span v-if="orderData.couponType===2">{{$t('orders.promoCode')}} </span>
                        <!-- 折扣类型为固定金额 -->
                        <span v-if="orderData.reductionAmount">{{$t('orders.fixedDiscount', {
                            currency: orderData.paymentCurrency,
                            thresholdAmount: currencyFormat(orderData.thresholdAmount),
                            reductionAmount: currencyFormat(orderData.reductionAmount)
                        })}} </span>
                        <!-- 折扣类型为百分比+有上限 -->
                        <span v-else-if="orderData.maxDeductionAmount">{{$t('orders.percentageMaxDiscount', {
                            currency: orderData.paymentCurrency,
                            thresholdAmount: currencyFormat(orderData.thresholdAmount),
                            reductionDiscount: accurate_toFixed(orderData.reductionDiscount * 100, 2),
                            maxDeductionAmount: currencyFormat(orderData.maxDeductionAmount)
                        })}} </span>
                        <!-- 折扣类型为百分比 -->
                        <span v-else-if="orderData.reductionDiscount">{{$t('orders.percentageDiscount', {
                            currency: orderData.paymentCurrency,
                            thresholdAmount: currencyFormat(orderData.thresholdAmount),
                            reductionDiscount: accurate_toFixed(orderData.reductionDiscount * 100, 2)
                        })}} </span>
                    </div>
                </div>
            </template>
            <div class="goods-details-text-container direction-flex-right">
                <div class="goods-details-text">{{$t('orders.orderItemLabelAmount')}}</div>
                <div class="flex-center-6"></div>
                <div class="goods-details-text bold">
                    {{ orderData.paymentCurrency }} {{currencyFormat(orderData.paymentAmount)}}
                </div>
            </div>
        </div>
        <div v-if="hasButton" class="goods-details-bottom-button direction-text-align-right flex gap12 justify-end">
            <!-- 待付款0&有支付链接可去付款 -->
            <el-button v-if="orderData.buyerOrderStatus===0 && orderData.payNowUrl" type="primary" class="button-default" id="Pay-Now-btn" @click.stop="jumpToPay(orderData.payNowUrl)">{{$t('orders.ordersPayNow')}}</el-button>
            <!-- 待发货1可联系卖家 -->
            <div v-if="orderData.buyerOrderStatus===1" class="order-detail-title-fotter-button">
                <el-button type="primary" class="button-default" id="Contact-seller-btn" @click.stop="showContactInfo = true">{{$t('orders.ordersContactSeller')}}</el-button>
                <!-- 联系方式 -->
                <ContactInfo v-if="showContactInfo" :contactInfo="orderData" @hide="showContactInfo=false" />
            </div>
            <!-- 已发货2可去17track查看 -->
            <el-button v-if="orderData.buyerOrderStatus===2 && orderData.logisticsCode" type="primary" class="button-default" id="Track-Shipment-btn" @click.stop="jumpTo17track">{{$t('orders.ordersTrackShipment')}}</el-button>
            <!-- 再次购买：已完成3、已取消4、有退款refundStatus1，并且有链接的情况下显示 -->
            <el-button v-if="([3,4].includes(orderData.buyerOrderStatus) || orderData.refundStatus===1) && orderData.orderLinkurl" type="primary" class="button-default" id="Buy-Again-btn-list" @click.stop="jumpToPay(orderData.orderLinkurl, 'Buy-Again-btn')">{{$t('orders.ordersBuyAgain')}}</el-button>
        </div>

    </div>
</template>

<style lang="scss" scoped>
    @use "@/assets/css/element-reset/tag.scss" as *;
    @use "@/assets/css/element-reset/button.scss" as *;
    .order-list-box {
        border-radius: 8px;
        border: 1px solid #E4E7EC;
        background: #FFF;
        cursor: pointer;
        &:hover {
            background: #F2F4F7;
            box-shadow: 0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06);
        }
        .m & {
            padding: 0 0 12px;
            .header {
                padding: 12px;
                .span {
                    font-size: 12px;
                    font-weight: 600;
                }
            }
            .goods-content {
                padding: 0 12px;
                + .goods-content {
                    margin-top: 8px;
                }
                .goods-attr {
                    padding: 0 12px;
                    max-width: calc(100% - 160px);
                    .goods-spu {
                        font-size: 12px;
                        line-height: 18px;
                    }
                    .goods-sku {
                        font-size: 12px;
                        line-height: 18px;
                    }
                }
                .goods-quantity-container {
                    min-width: 100px;
                    .goods-quantity-amount {
                        font-size: 14px;
                        line-height: 20px;
                    }
                    .goods-quantity-num {
                        font-size: 12px;
                        line-height: 18px;
                    }
                }
            }
            .goods-details-bottom {
                padding: 0 12px 8px;
                .goods-details-text {
                    font-size: 12px;
                    line-height: 18px;
                    &.bold {
                        font-size: 16px;
                        line-height: 24px;
                    }
                }
            }
            .goods-details-bottom-button {
                border-top: 0;
                padding: 0 12px 0;
                .button-default {
                    height: 36px;
                }
            }
        }
        .header {
            padding: 20px 24px 0;
            display: flex;
            .link{
                border: 1px solid transparent;
                &:hover {
                    border-bottom-color: #475467;
                }
            }
            .line {
                height: 16px;
                margin: 4px 8px;
                border-left: 1px solid #F2F4F7;
            }
            .span {
                white-space: nowrap;
                color: #475467;
                font-family: Inter;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 28px;
                &.big {
                    font-size: 16px;
                }
            }
            svg, i {
                color: #475467;
            }
        }
        .goods-content {
            padding: 26px 24px;
            display: flex;
            .goods-imgs{
                align-self: center;
                width: 60px;
                min-width: 60px;
                height: 60px;
                border-radius: 2.4px;
                overflow: hidden;
                img {
                    height: 100%;
                    width: 100%;
                    object-fit: cover;
                }
            }
            .goods-attr {
                flex: 1;
                padding: 0 20px;
                max-width: calc(100% - 260px);
                box-sizing: border-box;
                .goods-spu {
                    color: #101828;
                    font-family: Inter;
                    font-size: 16px;
                    line-height: 24px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                .goods-sku {
                    color: #667085;
                    font-family: Inter;
                    font-size: 14px;
                    line-height: 20px;
                }
            }
            .goods-quantity-container {
                min-width: 200px;
                white-space: nowrap;
                flex-shrink: 0;
                font-family: Inter;
                .goods-quantity-amount {
                    color: #101828;
                    font-size: 18px;
                    font-weight: 600;
                    line-height: 28px;
                    margin-bottom: 2px;
                    font-family: "IBM Plex Sans Condensed";
                }
                .goods-quantity-num {
                    color: #667085;
                    font-size: 16px;
                    font-weight: 400;
                    line-height: 20px;
                }
            }
        }
        .goods-sku-more {
            padding: 20px;
            text-align: center;
            .el-button {
                height: 28px;
                padding: 0 12px;
                border-radius: 4px;
            }
        }
        .goods-details-bottom {
            padding: 0 24px 16px;
            .goods-details-text-container {
                display: flex;
                align-items: baseline;
            }
            .goods-details-text {
                color: #475467;
                font-family: Inter;
                font-size: 14px;
                font-weight: 400;
                line-height: 20px;
                &.bold {
                    color: #101828;
                    font-size: 20px;
                    font-weight: 600;
                    line-height: 30px;
                    font-family: "IBM Plex Sans Condensed";
                }
                &.colorRed {
                    color: #FF2477;
                    font-weight: 500;
                    font-family: "IBM Plex Sans Condensed";
                }
                &.colorTip {
                    color: #817F86;
                    font-family:  "PingFang SC";
                    font-size: 12px;
                }
                .active {
                    color: #21a470;
                }
                .delete {
                    color: #A9AAAD;
                    text-decoration: line-through;
                }
            }
        }
        .goods-details-bottom-button {
            border-top: 1px solid #E4E7EC;
            padding: 12px 24px 16px;
            .button-default{
                margin: 0;
            }                    
        }
    }
    .order-detail-title-fotter-button {
        position: relative;
    }
</style>
