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
    import { ArrowDown } from '@element-plus/icons-vue';

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
            props.orderData.buyerOrderStatus===2 && props.orderData.logisticsCode
    })

    const skuLimit = ref(2)
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

    const jumpToPay = () => {
        window.open(props.orderData.payNowUrl, '_blank')
    }

    const jumpTo17track = () => {
        const LogisticsListStr = props.orderData.tradeOrderLogisticsList.map(ele => {
            return ele.logisticsCode;
        }).join(',');
        window.open(`https://t.17track.net/en#nums=${LogisticsListStr}`, '_blank')
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
<!--            <div class="link" @click.stop="jumpToShop">-->
                <i class="Flylink icon-Shop icon" @click.stop="jumpToShop"></i>
                <div class="flex-center-4" @click.stop="jumpToShop"></div>
                <span class="span link ellipsis" @click.stop="jumpToShop">{{ orderData.sellerBusinessName }}</span>
                <div class="flex-center-4" @click.stop="jumpToShop"></div>
                <i class="Flylink icon-chevron-right icon" @click.stop="jumpToShop"></i>
<!--            </div>-->
            <div class="flex-center"></div>
            <el-tag class="orders-status-tag" :class="formatInTable(ordersStatus, orderData.buyerOrderStatus, 'value', 'tag')">{{$t(formatInTable(ordersStatus, orderData.buyerOrderStatus))}}</el-tag>
        </div>
        <template v-for="(item, i) in orderData.orderGoodsSkuCOList" :key="item.id">
            <dl v-if="isShowSkuMore || i < skuLimit" class="goods-content">
                <div class="goods-imgs">
                    <img :src="previewImg(item.mainPicture)" lazy />
                </div>
                <div class="goods-attr">
                    <div class="goods-spu ellipsis2">{{ item.goodsTitle }}</div>
                    <p class="goods-sku ellipsis">{{ item.skuDesc }}</p>
                </div>
                <dd class="goods-quantity-container direction-text-align-right">
                    <p class="goods-quantity-amount">{{ item.paymentCurrency }} {{currencyFormat(item.paymentAmount)}}</p>
                    <p class="goods-quantity-num">{{$t('orders.orderItemLabelQuantity')}}: {{ item.quantity }}</p>
                </dd>
            </dl>
        </template>
        <div v-if="orderData.orderGoodsSkuCOList.length > skuLimit && !isShowSkuMore" class="goods-sku-more">
            <el-button
                    id="sku-more-btn"
                    :icon="ArrowDown"
                    @click.stop="showSkuMore"
            >{{$t('orders.orderItemButtonMore')}}</el-button>
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
            <el-button v-if="orderData.buyerOrderStatus===0 && orderData.payNowUrl" type="primary" class="button-default" id="Pay-Now-btn" @click.stop="jumpToPay">{{$t('orders.ordersPayNow')}}</el-button>
            <div v-if="orderData.buyerOrderStatus===1" class="order-detail-title-fotter-button">
                <el-button type="primary" class="button-default" id="Contact-seller-btn" @click.stop="showContactInfo = true">{{$t('orders.ordersContactSeller')}}</el-button>
                <!-- 联系方式 -->
                <ContactInfo v-if="showContactInfo" :contactInfo="orderData" @hide="showContactInfo=false" />
            </div>
            <el-button v-if="orderData.buyerOrderStatus===2 && orderData.logisticsCode" type="primary" class="button-default" id="Track-Shipment-btn" @click.stop="jumpTo17track">{{$t('orders.ordersTrackShipment')}}</el-button>
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
