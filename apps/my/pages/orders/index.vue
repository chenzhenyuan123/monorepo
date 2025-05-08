<!--
 * @Author: czy
 * @Description: 买家中心/订单列表
-->
<template>
  <div class="orders">
    <CarouselImage system="106" />
    
    <div class="order-list-box">
      <div class="header">
        <div class="order-header-shop-name">
          <i class="Flylink icon-Shop"></i>
          <span class="goods-text">店铺名称.店铺名称店铺名称店铺名称店铺名称</span>
          <i class="Flylink icon-chevron-right"></i>
        </div>
        <div class="order-header-status">
          <el-tag>Pending payment</el-tag>
        </div>
      </div>
      <dl class="goods-content">
        <dt class="goods-name">
          <div class="goods-imgs">
            <img src="https://flylink-cdn-oss-test.inflyway.com/flylink/1739782961352_b132cd9f67e9e3c95fb3d371934ba589.jpg" lazy />
          </div>
          <div class="goods-attr">
            <div class="goods-spu ellipsis2">Baby Name Sweater, Baby Knit Sweater, Embroidered Baby Sweatshirt, Personalized Baby Clothes, Baby Girl Coming Home Outfit, Gift for Newborn</div>
            <p class="goods-sku ellipsis"> xianglian, S925, white</p>
          </div>
        </dt>
        <dd class="goods-quantity">
          <p>$ {{currencyFormat(2888.99)}}</p>
          <p class="quantity">× 2</p>
        </dd>
      </dl>
      <div class="goods-details-bottom">
        <div class="goods-details-text">
          <div class="goods-details-text1">
            Shipping: $ 20.00
          </div>
        </div>
        <div class="goods-details-text">
          <div class="goods-details-text1">
            Amount:
            <b class="deliver-h2 decoration">$ 20.00</b>
          </div>
        </div>
        <div class="goods-details-text">
          <div class="goods-details-text2 deliver-p active">
            Free shipping  (Order ≥ $ 200.00)
          </div>
        </div>
      </div>
      <div class="goods-details-bottom-button">
        <el-button type="primary">Pay Now</el-button>
      </div>
    </div>
    
    <NuxtLink :to="`/orders/${order.id}`">
      {{ order.title }}
    </NuxtLink>
  </div>
</template>
<script name="Orders" setup>
import { checkResponseData, currencyFormat } from "@/util/index.js"
const { walletApi } = useApi();

onMounted(async () => {
  getHomeWalletInfo()
})
// 获取用户账号关联信息
const getHomeWalletInfo = async() => {
  const result = await walletApi.getHomeWalletInfo()
  const res = checkResponseData(result)
  if (res) {
    console.log(res)
  }
}

const order = reactive({
  id: '1',
  title: '跳转订单详情页'
})
</script>

<style lang="scss" scoped>
.order-list-box {
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #E4E7EC;
  background: #FFF;
  margin-top: 12px;
  .header {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .order-header-shop-name{
      cursor: pointer;
    }
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
    padding: 10px 24px;
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
        img {
          height: 100%;
          width: 100%;
          object-fit: cover;
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
          font-weight: 600;
       }
      }
    }
    .goods-quantity {
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
        margin-left: 4px;
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
    }
  }
  .goods-details-bottom-button {
    border-top: 1px solid #E4E7EC;
    padding: 12px 24px 16px;
    text-align: right;
  }
}
</style>
