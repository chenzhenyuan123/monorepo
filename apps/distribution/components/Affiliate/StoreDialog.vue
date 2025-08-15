<script setup>
import {checkResponseData} from "@/util";
import { previewImg, currencyFormat } from "@/util/index.js";
import NoData from '@/components/svg/NoData.svg'

const { affiliateApi } = useApi()
const isMobile = useIsMobile()
const attrs = useAttrs()
const props = defineProps({
    storeData: {
        type: Object,
        default: () => ({})
    }
})
const emit = defineEmits(['submit', 'cancel'])

const submit = () => {
    emit('submit')
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
}

const cancel = () => {
    emit('cancel')
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
}


const goodsList = ref([])
// 获取商品数据
const getGoodsData = async() => {
    const result = await affiliateApi.listGoodsByStoreId(props.storeData.storeId)

    const res = checkResponseData(result)
    goodsList.value = res?.list || []
}
getGoodsData().then(() => {})
const jumpToGoods = (url) => {
    window.open(url, '_blank')
}

</script>

<template>
  <div class="dialog-container">
    <el-dialog
    v-bind="$attrs"
    width="896px"
    :show-close="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :class="{ 'm': isMobile }"
    >
        <template #header="{ close }">
            <div class="close-container transition-opacity opacity-70 hover:opacity-100" @click="close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="lucide lucide-x h-4 w-4">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                </svg>
            </div>
        </template>
        <div class="grid gap-4">
            <div class="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2 id="radix-:r1:" class="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         class="lucide lucide-store w-5 h-5">
                        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                        <path d="M2 7h20"></path>
                        <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"></path>
                    </svg>
                    {{ storeData.storeName }}
                </h2>
                <p id="radix-:r2:" class="text-sm text-muted-foreground">
                    <template v-if="storeData.storeDesc">{{ storeData.storeDesc }} · </template>Commission Rate: {{currencyFormat(storeData.commissionRate * 100)}}%
                </p>
            </div>
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="lucide lucide-package w-5 h-5">
                            <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
                            <path d="M12 22V12"></path>
                            <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"></path>
                            <path d="m7.5 4.27 9 5.15"></path>
                        </svg>
                        Store products(Join Distribution View More)
                    </h3>
                    <!-- 暂无数据时展示 -->
                    <div v-if="goodsList.length<=0" class="no-data-box">
                        <div class="grid-box" />
                        <div class="no-data-icon">
                        <el-icon class="no-data-icon-Search"><img :src="NoData" /></el-icon>
                        </div>
                        <p class="no-data-text">No Data</p>
                    </div>
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div
                                v-for="item in goodsList"
                                :key="item.goodsLinkUrl"
                                class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                @click="jumpToGoods(item.goodsLinkUrl)"
                        >
                            <div class="p-4">
                                <img
                                    :src="previewImg(item.imageUrl)"
                                    class="w-full h-32 object-cover rounded-md mb-3"
                                >
                                <h4 class="font-semibold text-sm mb-2">{{ item.goodsTitle }}</h4>
                                <div class="space-y-1">
                                    <div class="flex justify-between text-sm mb-1">
<!--                                        <span class="text-gray-600"></span>-->
                                        <span class="font-semibold">
                                            {{item.saleCurrency}} {{currencyFormat(item.minSalePrice)}}{{(item.maxSalePrice&&parseFloat(item.maxSalePrice)>parseFloat(item.minSalePrice)) ? `~${currencyFormat(item.maxSalePrice)}` : ''}}
                                        </span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600">Commission Rate:</span>
                                    </div>
                                    <div class="text-sm">
                                        <span class="font-semibold text-green-600">{{currencyFormat(item.commissionRate * 100)}}% </span>
                                        <span>(≈{{item.saleCurrency}} {{ currencyFormat(parseFloat(item.minSalePrice)*parseFloat(item.commissionRate)) }}</span>
                                        <span>{{ (item.maxSalePrice&&parseFloat(item.maxSalePrice)>parseFloat(item.minSalePrice)) ? `~${currencyFormat(parseFloat(item.maxSalePrice)*parseFloat(item.commissionRate))})` : ')' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-center pt-4">
                    <el-link
                        :href="storeData.joinUrl"
                        target="_blank"
                        :underline="false"
                        class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8"
                    >
                        Join Store Distribution
                    </el-link>
                </div>
            </div>
        </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@use "@flylinking/ui/styles/css/radix.scss" as *;

.dialog-container :deep(.el-dialog) {
    max-width: 100%;
    min-height: 50%;
    padding: 24px;
    border-radius: 0.5rem;
    background-color: #FFF;
    &.m {
        .el-dialog__footer {
            padding: 0;
        }
    }
    .el-dialog__header {
        padding: 0;
        .close-container {
            position: absolute;
            top: 16px;
            right: 16px;
            cursor: pointer;
            font-size: 0;
        }
    }
    .el-dialog__body {
        padding: 0;
        color: #020817;
    }
    .el-dialog__footer {
        padding: 0;
    }
}
.rtl .dialog-container :deep(.el-dialog) {
    .el-dialog__header {
        .close-container {
            left: 16px;
            right: auto;
        }
    }
}
</style>
