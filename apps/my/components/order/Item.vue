<!--
 * @Author: czy
 * @Description: 买家中心/订单列表/订单项
-->
<script name="Orders" setup>
    import { useI18n } from "vue-i18n";
    import { currencyFormat, formatInTable } from "@/util/index.js"
    import { ordersStatus } from "@/util/const.js";
    import {formatDate} from "@flylinking/core/utils/dateUtil";
    import {previewFlylinkStoreUrl} from "@flylinking/core/utils/urlUtil";

    const props = defineProps({
        orderData: {
            type: Object,
            default: () => ({})
        }
    })
    const { t } = useI18n();
    const router = useRouter();
    const isMobile = useIsMobile()

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
        window.open(`https://t.17track.net/en#nums=${props.orderData.logisticsCode}`, '_blank')
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
</script>

<template>
    <div class="order-list-box" @click="jumpToDetail">
        <div class="header">
            <template v-if="!isMobile">
                <span class="span big">{{ formatDate(orderData.createTime, 4) }}</span>
                <div class="flex-center-8"></div>
                <span class="span">{{$t('wallet.subReferralTableLabelOrderID')}}: {{ orderData.id }}</span>
                <div class="line"></div>
            </template>
            <div class="link" @click.stop="jumpToShop">
                <i class="Flylink icon-Shop icon"></i>
                <div class="flex-center-4"></div>
                <span class="span ellipsis">{{ orderData.sellerBusinessName }}</span>
                <div class="flex-center-4"></div>
                <i class="Flylink icon-chevron-right icon"></i>
            </div>
            <div class="flex-center"></div>
            <el-tag class="orders-status-tag" :class="formatInTable(ordersStatus, orderData.buyerOrderStatus, 'value', 'tag')">{{$t(formatInTable(ordersStatus, orderData.buyerOrderStatus))}}</el-tag>
        </div>
        <dl v-for="item in orderData.orderGoodsSkuCOList" :key="item.id" class="goods-content">
            <div class="goods-imgs">
                <img :src="item.mainPicture" lazy />
            </div>
            <div class="goods-attr">
                <div class="goods-spu ellipsis2">{{ item.goodsTitle }}</div>
                <p class="goods-sku ellipsis">{{ item.skuDesc }}</p>
            </div>
            <dd class="goods-quantity">
                <p>{{ item.currency }} {{currencyFormat(item.unitPrice)}}</p>
                <p class="quantity">× {{ item.quantity }}</p>
            </dd>
        </dl>
        <div class="goods-details-bottom">
            <div v-if="orderData.shippingFeeAmount >= 0" class="goods-details-text">
                <div v-if="orderData.shippingFeeAmount > 0">{{$t('orders.ordersShippingAmount', { currency: orderData.currency, amt: currencyFormat(orderData.shippingFeeAmount) })}}</div>
                <template v-else-if="orderData.discountedShippingAmount">
                    <div class="delete">{{$t('orders.ordersShippingAmount', { currency: orderData.currency, amt: currencyFormat(orderData.discountedShippingAmount) })}}</div>
                    <div class="active">{{$t('orders.ordersFreeShippingLimit', { currency: orderData.currency, amt: currencyFormat(orderData.freeShippingThreshold) })}}</div>
                </template>
                <div v-else class="active">{{$t('orders.ordersFreeShipping')}}</div>
            </div>
            <div class="goods-details-text">
                <div class="goods-details-text1">
                    Amount:
                    <b class="deliver-h2 decoration">{{ orderData.currency }} {{currencyFormat(orderData.goodsAmount)}}</b>
                </div>
            </div>
        </div>
        <div class="goods-details-bottom-button">
            <el-button v-if="orderData.buyerOrderStatus===0 && orderData.payNowUrl" type="primary" id="Pay-Now-btn" @click.stop="jumpToPay">{{$t('orders.ordersPayNow')}}</el-button>
            <div v-if="orderData.buyerOrderStatus===1" :ref="'contactSellerRef'+orderData.id" class="order-detail-title-fotter-button">
                <el-button type="primary" id="Contact-seller-btn" @click.stop="contactInfoClick(contactSellerRef)">{{$t('orders.ordersContactSeller')}}</el-button>
            </div>
            <el-button v-if="orderData.buyerOrderStatus===2 && orderData.logisticsCode" type="primary" id="Track-Shipment-btn" @click.stop="jumpTo17track">{{$t('orders.ordersTrackShipment')}}</el-button>
        </div>

        <!-- 联系方式 -->
        <ContactInfo v-if="showContactInfo" :contactInfo="orderData" :positionTop="contactInfoScrollHeight" :positionLeft="positionLeft" @hide="showContactInfo=false" />
    </div>
</template>

<style lang="scss" scoped>
    @use "@/assets/css/element-reset/tag.scss" as *;
    .order-list-box {
        overflow: hidden;
        border-radius: 8px;
        border: 1px solid #E4E7EC;
        background: #FFF;
        cursor: pointer;
        &:hover {
            background: #F2F4F7;
            box-shadow: 0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06);
        }
        .header {
            padding: 20px 24px 0;
            display: flex;
            align-items: center;
            .link{
                display: flex;
                align-items: center;
                border: 1px solid transparent;
                &:hover {
                    border-bottom-color: #475467;
                }
                .icon {
                    width: 18px;
                    text-align: center;
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
                    font-weight: 600;
                }
            }
            .goods-quantity {
                min-width: 200px;
                white-space: nowrap;
                flex-shrink: 0;
                text-align: right;
                font-family: Inter;
                line-height: 30px;
                color: #101828;
                font-size: 20px;
                font-weight: 600;
                .quantity {
                    color: #475467;
                    font-size: 16px;
                    font-weight: 400;
                }
            }
        }
        .goods-details-bottom {
            padding: 0px 24px 16px;
            overflow: hidden;
            text-align: right;
            .goods-details-text {
                margin-top: 8px;
                color: #101828;
                width: 100%;
                color: #101828;
                font-family: Inter;
                font-size: 16px;
                line-height: 24px;
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
            text-align: right;
        }
    }
</style>
