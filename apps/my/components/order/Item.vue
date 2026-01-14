<!--
 * @Author: czy
 * @Description: 买家中心/订单列表/订单项
-->
<script name="Orders" setup>
    import { useI18n } from "vue-i18n";
    import { currencyFormat, formatInTable, previewImg } from "@/util/index.js"
    import { ordersStatus } from "@/util/const.js";
    import {formatDate} from "@flylinking/core/utils/dateUtil";
    import {previewFlylinkStoreUrl} from "@flylinking/core/utils/urlUtil";
    import { ArrowRight } from '@element-plus/icons-vue';
    import {sendLog} from "@flylinking/core/utils/logUtil";

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
        <div class="header">
            <template v-if="!isMobile">
                <span class="span big">{{ formatDate(orderData.createTime, 4) }}</span>
                <div class="flex-center-8"></div>
                <span class="span">{{$t('orders.orderItemLabelOrderID')}}: {{ orderData.flylinkOrderId }}</span>
                <div class="line"></div>
            </template>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" class="icon-Shop icon" @click.stop="jumpToShop">
                <path d="M12.5 17.5V13C12.5 12.5333 12.5 12.2999 12.4092 12.1217C12.3293 11.9649 12.2018 11.8374 12.045 11.7575C11.8667 11.6667 11.6334 11.6667 11.1667 11.6667H8.83333C8.36662 11.6667 8.13327 11.6667 7.95501 11.7575C7.79821 11.8374 7.67072 11.9649 7.59083 12.1217C7.5 12.2999 7.5 12.5333 7.5 13V17.5M2.5 5.83333C2.5 7.21404 3.61929 8.33333 5 8.33333C6.38071 8.33333 7.5 7.21404 7.5 5.83333C7.5 7.21404 8.61929 8.33333 10 8.33333C11.3807 8.33333 12.5 7.21404 12.5 5.83333C12.5 7.21404 13.6193 8.33333 15 8.33333C16.3807 8.33333 17.5 7.21404 17.5 5.83333M5.16667 17.5H14.8333C15.7668 17.5 16.2335 17.5 16.59 17.3183C16.9036 17.1586 17.1586 16.9036 17.3183 16.59C17.5 16.2335 17.5 15.7668 17.5 14.8333V5.16667C17.5 4.23325 17.5 3.76654 17.3183 3.41002C17.1586 3.09641 16.9036 2.84144 16.59 2.68166C16.2335 2.5 15.7668 2.5 14.8333 2.5H5.16667C4.23325 2.5 3.76654 2.5 3.41002 2.68166C3.09641 2.84144 2.84144 3.09641 2.68166 3.41002C2.5 3.76654 2.5 4.23325 2.5 5.16667V14.8333C2.5 15.7668 2.5 16.2335 2.68166 16.59C2.84144 16.9036 3.09641 17.1586 3.41002 17.3183C3.76654 17.5 4.23325 17.5 5.16667 17.5Z" stroke="#475467" stroke-width="1.44444" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            <div class="flex-center-4" @click.stop="jumpToShop"></div>
            <span class="span link ellipsis" @click.stop="jumpToShop">{{ orderData.sellerBusinessName }}</span>
            <div class="flex-center-4" @click.stop="jumpToShop"></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" class="icon-chevron-right icon" @click.stop="jumpToShop">
                <path d="M6.75 13.5L11.25 9L6.75 4.5" stroke="#475467" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="flex-center"></div>
            <el-tag class="orders-status-tag" :class="formatInTable(ordersStatus, orderData.buyerOrderStatus, 'value', 'tag')">{{$t(formatInTable(ordersStatus, orderData.buyerOrderStatus))}}</el-tag>
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
                    <p class="goods-quantity-amount">{{ item.paymentCurrency }} {{currencyFormat(item.totalPrice)}}</p>
                    <p class="goods-quantity-num">{{$t('orders.orderItemLabelQuantity')}}: {{ item.quantity }}</p>
                </dd>
            </dl>
        </div>
        <div v-if="orderData.orderGoodsSpuCOList.length > skuLimit && !isShowSkuMore" class="goods-sku-more">
            <el-button
                    id="sku-more-btn"
                    @click.stop="jumpToDetail"
            >{{$t('orders.orderItemButtonMore')}}<el-icon class="tag-icon"><ArrowRight /></el-icon></el-button>
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
            <div class="goods-details-text-container direction-flex-right">
                <div class="goods-details-text">{{$t('orders.orderItemLabelAmount')}}</div>
                <div class="flex-center-6"></div>
                <div class="goods-details-text bold">
                    {{ orderData.paymentCurrency }} {{currencyFormat(orderData.paymentAmount)}}
                </div>
            </div>
        </div>
        <div v-if="hasButton" class="goods-details-bottom-button direction-text-align-right">
            <el-button v-if="orderData.buyerOrderStatus===0 && orderData.payNowUrl" type="primary" class="button-default" id="Pay-Now-btn" @click.stop="jumpToPay(orderData.payNowUrl)">{{$t('orders.ordersPayNow')}}</el-button>
            <div v-if="orderData.buyerOrderStatus===1" class="order-detail-title-fotter-button">
                <el-button type="primary" class="button-default" id="Contact-seller-btn" @click.stop="showContactInfo = true">{{$t('orders.ordersContactSeller')}}</el-button>
                <!-- 联系方式 -->
                <ContactInfo v-if="showContactInfo" :contactInfo="orderData" @hide="showContactInfo=false" />
            </div>
            <el-button v-if="orderData.buyerOrderStatus===2 && orderData.logisticsCode" type="primary" class="button-default" id="Track-Shipment-btn" @click.stop="jumpTo17track">{{$t('orders.ordersTrackShipment')}}</el-button>
            <el-button v-if="([3,4].includes(orderData.buyerOrderStatus)) && orderData.orderLinkurl" type="primary" class="button-default" id="Buy-Again-btn-list" @click.stop="jumpToPay(orderData.orderLinkurl, 'Buy-Again-btn')">{{$t('orders.ordersBuyAgain')}}</el-button>
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
                    line-height: 18px;
                    /*&.big {*/
                    /*    font-size: 16px;*/
                    /*    line-height: 24px;*/
                    /*}*/
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
            align-items: center;
            .link{
                border: 1px solid transparent;
                &:hover {
                    border-bottom-color: #475467;
                }
            }
            .line {
                height: 16px;
                margin: 0 8px;
                border-left: 1px solid #F2F4F7;
            }
            .span {
                white-space: nowrap;
                color: #475467;
                font-family: Inter;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 20px;
                &.big {
                    font-size: 16px;
                    line-height: 24px;
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
        }
    }
    .order-detail-title-fotter-button {
        position: relative;
    }
</style>
