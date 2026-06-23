<script setup>
import NoData from '@/components/svg/NoData.svg'
import { Search } from '@element-plus/icons-vue';
const props = defineProps({
    noDataTitle: { // 暂无数据的文案
        type: String,
        default: 'home.homeNoData'
    },
    noDataText: { // 暂无数据的文案
        type: String,
        default: ''
    },
    iconType: { // 图标-默认为NoData，可传Search
        type: String,
        default: 'NoData'
    }
})

</script>

<template>

<div class="no-data-box">
    <div class="grid-box" />
    <div class="no-data-box-content">
        <div class="no-data-icon">
            <el-icon class="no-data-icon-Search">
                <Search v-if="iconType==='Search'" />
                <img v-else :src="NoData" />
            </el-icon>
        </div>
        <p class="no-data-text">{{$t(noDataTitle)}}</p>
        <p v-if="noDataText" class="no-data-search-text">{{$t(noDataText)}}</p>
    </div>
</div>
</template>

<style lang="scss" scoped>
.no-data-box {
    height: 320px;
    width: 480px;
    max-width: 100%;
    margin: 0 auto;
    position: relative;
    overflow: hidden;

    // 底部网格
    .grid-box {
        height: 480px;
        width: 480px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        z-index: 0;
        background: url('@/assets/imgs/decorative-img.svg') 50% / cover no-repeat;
    }
    .no-data-box-content {
        // position: absolute;
        // left: 0;
        // top: 50%;
        // transform: translate(0,-50%);
        position: relative;
        z-index: 1;
        padding: 112px 0 0;
        text-align: center;
    }
    .no-data-icon {
        width: 24px;
        height: 24px;
        padding: 12px;
        border-radius: 10px;
        border: 1px solid #E4E7EC;
        background: #fff;
        box-shadow: 0px 0px 0px 1px rgba(16, 24, 40, 0.18) inset, 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
        margin: 0 auto 16px;
        position: relative;
        z-index: 11;

        .no-data-icon-Search {
            font-size: 24px;
            color: #344054;
        }
        .no-data-icon-Warning {
            color: #F04438;
        }
    }

    .no-data-text {
        color: #101828;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        margin: 0 52px;
    }

    .no-data-search-text {
        color: #475467;
        font-size: 14px;
        line-height: 20px;
        margin-top: 4px;
        margin: 5px 52px 20px;
        .el-link {
        text-decoration: underline;
        text-underline-position: under;
        }
    }
}
</style>