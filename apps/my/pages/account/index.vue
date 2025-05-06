<script setup name="Profile">
import { scrollToAnchor } from '@/util/router.js'
import { useUserStore } from '@/store/userState.js'
import { checkResponseData, arrToDict } from "@/util/index.js"
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { userApi } = useApi()
const userStore = useUserStore()
const isMobile = useIsMobile()
// 当前页签
const anchorActive = ref()
// 地址数据
const shippingData = ref([])
const locationData = reactive({
    countryData: [
        // {
        //     "countryId": "CN",
        //         "name": "China",
        //         "description": "中国大陆",
        //         "valid": "1",
        //         "area": "N",
        //         "chinaArea": "亚洲",
        //         "sort": 0E-30,
        //         "countryCode": "457",
        //         "threeCountryCode": null,
        //         "currency": "RMB",
        //         "callingCode": "86",
        //         "ecCountryId": "CN"
        // }
    ]
})
const anchorData = computed(() => {
    return [
        { value: 'email-and-password', label: 'Email & Password' },
        { value: 'shipping-address', label: 'Shipping addresses' },
    ]
})
const anchorDict = computed(() => {
    return arrToDict(anchorData.value)
})

// 获取用户账号关联信息
const getUserAccountInfo = async() => {
    const result = await userApi.getUserAccountInfo()
    const res = checkResponseData(result)
    if (res) {
        shippingData.value = [ res.shipping ]
    }
}
// 获取所有国家列表
const getAllCountry = async() => {
    const result = await userApi.getAllCountry()
    const res = checkResponseData(result)
    if (res) {
        res.forEach(item => item.name = item.name || item.enUs)
        locationData.countryData = res
    }
}
const changeMenu = id => {
    anchorActive.value = id
    scrollToAnchor(id)
}
// 自适应
let mainWrapDom
const headerScroll = () => {

    const scrollTop = mainWrapDom.scrollTop
    const isSet = anchorData.value.some(item => {
        const dom = document.getElementById(item.value)
        // 减去顶部 navbar
        const top = isMobile ? dom.offsetTop : (dom.offsetTop - 80)
        if (scrollTop <= top) {
            anchorActive.value = item.value
            return true
        }
    })

    if (!isSet) anchorActive.value = anchorData.value[anchorData.value.length - 1].value
}

console.log('profile')

onMounted(() => {
    userStore.getUserInfo()
    getUserAccountInfo()
    getAllCountry()

    const firstAnchor = anchorData.value[0].value
    const hash = window.location.hash ? window.location.hash.substring(1) : ''
    if (!anchorDict.value[hash] || hash === firstAnchor) {
        //
        anchorActive.value = firstAnchor
    } else {
        changeMenu(hash)
    }

    mainWrapDom = document.getElementsByClassName(isMobile ? 'm-wrap' : 'main-wrap')[0]
    mainWrapDom.addEventListener('scroll', headerScroll)
})

onBeforeUnmount(() => {
    mainWrapDom.removeEventListener('scroll', headerScroll)
});
</script>

<template>
    <div :class="{ 'page': true, 'm': isMobile }">
        <div :class="{ 'title-container': true, 'm': isMobile }">
            <h1 class="title">Account</h1>
            <p class="discribe">Manage your account here.</p>
        </div>
        <div :class="{ 'profile-box': true, 'm': isMobile }">
            <div class="profile-menu">
                <a
                    v-for="item in anchorData"
                    :key="item.value"
                    :id="'profile-anchor-' + item.value"
                    href="#"
                    :class="{ 'profile-menu-item': true, 'active': item.value === anchorActive }"
                    @click="changeMenu(item.value)"
                >
                    {{ item.label }}
                </a>
            </div>
            <el-select
                v-model="anchorActive"
                placeholder=""
                class="profile-select-menu select-default"
                @change="changeMenu"
            >
              <el-option
                v-for="item in anchorData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div class="profile-group">
                <div id="email-and-password" class="profile">
                    <AccountBuyerGeneral></AccountBuyerGeneral>
                </div>
                <div id="shipping-address" class="profile">
                    <AccountBuyerShippingAddressGroup
                        :nature-data="shippingData"
                        :country-data="locationData.countryData"
                        @update-data="getUserAccountInfo"
                    ></AccountBuyerShippingAddressGroup>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import url("@/assets/css/element-reset/select.scss");
* {
    box-sizing: border-box;
}
// .page {
//     position: relative;
//     height: calc(100vh - 183px);
//     padding: 130px 0 0 208px;
//     margin: 0 -32px 0 0;
//     &.m {
//         height: calc(100vh - 80px);
//         height: calc(100vh - 322px);
//         padding: 148px 0 0;
//         margin: 0;
//     }
// }
.title-container {
    margin: 32px 0;
    // position: absolute;
    // left: 0;
    // top: 32px;
    &.m {
        // top: 0;
        margin: 0;
        padding: 0 16px 24px;
        .title {
            font-size: 24px;
            line-height: 32px;
        }
    }
    .title {
        color: #101828;
        font-size: 30px;
        font-weight: 600;
        line-height: 38px; /* 126.667% */
        margin-bottom: 4px;
    }
    .discribe {
        color:  #475467;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px; /* 150% */
    }
}
.profile-box {
    // height: 100%;
    width: 1216px;
    // width: 1008px;
    max-width: 100%;
    // padding-bottom: 32px;
    // display: flex;
    word-break: break-word;

    &.m {
        display: block;
        margin: 0;
        padding: 0 16px;
        // padding: 0 0 0 16px;
        .profile-menu {
            display: none;
        }
        .profile-select-menu {
            display: block;
        }
        .profile-group {
            width: 100%;
            max-width: none;
            // padding-right: 16px;
        }
    }
    .profile-menu {
        // position: absolute;
        // left: 0;
        // top: 130px;
        width: 208px;
        min-width: 208px;
        float: left;
        position: sticky;
        top: 0;
        .profile-menu-item {
            display: inline-block;
            width: 100%;
            padding: 8px 12px 8px 10px;
            border-left: 2px solid transparent;
            color: #667085;
            font-size: 14px;
            font-weight: 600;
            line-height: 20px; /* 142.857% */
            text-decoration: auto;
            &.active {
                color: #5548FF;
                border-left-color: #5548FF;
                cursor: default;
            }
            + .profile-menu-item {
                margin-top: 4px;
            }
        }
    }
    .profile-select-menu {
        display: none;
        margin-bottom: 20px;
        width: 100%;
        position: sticky;
        top: 0;
        z-index: 10;
        // position: absolute;
        // left: 16px;
        // top: 84px;
        // width: calc(100% - 32px);
    }
    .profile-group {
        // height: 100%;
        // padding-right: 32px;
        // overflow: auto;
        // flex: 1;
        display: inline-block;
        max-width: calc(100% - 208px);
    }
}
.profile {
    margin-bottom: 32px;
    // &:last-child {
    //     margin-bottom: 0;
    // }
}
</style>
