<script setup>
import { checkResponseData, arrToDict, successMessage } from "@/util/index.js"
import { flagUrl } from "@/util/dataUtil.js"
import {
    validatePhoneByLibphonenumberNum,
    validatePhoneByLibphonenumberStr
} from "@flylinking/core/utils/validate";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
const { merchantApplyApi, countryApi } = useApi()
const isMobile = useIsMobile()

const isEdit = ref(false) // 是否是编辑状态-如果没有填过数据，则默认编辑状态
const loading = ref(false)
const pageLoading = ref(false)
const countryDataByLang = ref([]) // 国家下拉数据
const countryDict = computed(() => arrToDict(countryList.value, { value: 'countryId', label: 'name' }))
const countryCallingCodeDict = computed(() => arrToDict(countryList.value, { value: 'countryId', label: 'callingCode' }))
const detailData = ref({}) // 详情数据
const formValidateRef = ref(null)
const form = ref({})

// 推广平台选项
const platformOptions = computed(() => [
    { value: 'TikTok', label: t('moreMerchantApply.platformOptions1') },
    { value: 'Instagram', label: t('moreMerchantApply.platformOptions2') },
    { value: 'Facebook', label: t('moreMerchantApply.platformOptions3') },
    { value: 'telegram', label: t('moreMerchantApply.platformOptions4') },
    { value: 'Reddit', label: t('moreMerchantApply.platformOptions5') },
    { value: 'WhatsApp', label: t('moreMerchantApply.platformOptions6') },
    { value: 'Google', label: t('moreMerchantApply.platformOptions7') },
    { value: 'Other', label: t('moreMerchantApply.platformOptions8') }
])
const platformDict = computed(() => arrToDict(platformOptions.value, { label: null }))
const isPlatformOtherSelected = computed(() => Array.isArray(form.value.platform) && form.value.platform.includes('Other'))

// 粉丝数量选项
const followersOptions = computed(() => [
    { value: '0', label: t('moreMerchantApply.followersOptions1') }, // 0-1K
    { value: '1', label: t('moreMerchantApply.followersOptions2') }, // 1K-5K
    { value: '2', label: t('moreMerchantApply.followersOptions3') }, // 5K-10K
    { value: '3', label: t('moreMerchantApply.followersOptions4') }, // 10K-50K
    { value: '4', label: t('moreMerchantApply.followersOptions5') }, // 50K-100K
    { value: '5', label: t('moreMerchantApply.followersOptions6') } // More than 100K
])
const followersDict = computed(() => arrToDict(followersOptions.value))

// 月销售额选项
const revenueOptions = computed(() => [
    { value: '0', label: t('moreMerchantApply.revenueOptions1') }, // Under $1000
    { value: '1', label: t('moreMerchantApply.revenueOptions2') }, // $1000-$10000
    { value: '2', label: t('moreMerchantApply.revenueOptions3') }, // $10000-$100000
    { value: '3', label: t('moreMerchantApply.revenueOptions4') }, // $100000-$500000
    { value: '4', label: t('moreMerchantApply.revenueOptions5') } // $500000+
])
const revenueDict = computed(() => arrToDict(revenueOptions.value))

// 粉丝分布选项
const distributionOptions = computed(() => [
    { value: '0', label: t('moreMerchantApply.distributionOptions1') }, // Only in my country
    { value: '1', label: t('moreMerchantApply.distributionOptions2') }, // My country and nearby regions
    { value: '2', label: t('moreMerchantApply.distributionOptions3') } // Worldwide
])
const distributionDict = computed(() => arrToDict(distributionOptions.value))

// 偏好销售类目选项
const categoryOptions = computed(() => [
    { value: '0', label: t('moreMerchantApply.categoryOptions1') }, // Women's clothing
    { value: '1', label: t('moreMerchantApply.categoryOptions2') }, // Bags
    { value: '2', label: t('moreMerchantApply.categoryOptions3') }, // Shoes
    { value: '3', label: t('moreMerchantApply.categoryOptions4') }, // Jewelry
    { value: '4', label: t('moreMerchantApply.categoryOptions5') }, // Watches
    { value: '5', label: t('moreMerchantApply.categoryOptions6') }, // Electronics
    { value: '6', label: t('moreMerchantApply.categoryOptions7') }, // Sports
    { value: '7', label: t('moreMerchantApply.categoryOptions8') }, // Home & Living
    { value: '8', label: t('moreMerchantApply.categoryOptions9') } // Other
])
const categoryDict = computed(() => arrToDict(categoryOptions.value, { label: null }))
const isCategoryOtherSelected = computed(() => Array.isArray(form.value.salesCategory) && form.value.salesCategory.includes('8'))

// 粉丝偏好选项
const followerPreferenceOptions = computed(() => [
    { value: '0', label: t('moreMerchantApply.valueForMoney'), desc: t('moreMerchantApply.valueForMoneyDesc') }, // Value for money
    { value: '1', label: t('moreMerchantApply.qualityFocused'), desc: t('moreMerchantApply.qualityFocusedDesc') } // Quality-focused
])
const followerPreferenceDict = computed(() => arrToDict(followerPreferenceOptions.value, { label: null }))

const countryToCallingCodeRepeat = computed(() => {
    const dict = {}
    const repeatDict = {}
    countryList.value.forEach(item => {
        if (dict[item.callingCode]) {
            // 记录重复
            repeatDict[item.callingCode] = true
        } else {
            // 记录第一次
            dict[item.callingCode] = true
        }
    })

    return repeatDict
})
// 校验规则
const rules = () => {
    return {
        "location": [{
            required: true,
            message: t('moreMerchantApply.required'),
            trigger: 'change'
        }],
        "platform": [{
            required: true,
            message: t('moreMerchantApply.required'),
            trigger: 'change'
        }],
        "followerCount": [{
            required: true,
            message: t('moreMerchantApply.required'),
            trigger: 'change'
        }],
        "monthlySalesRevenue": [{
            required: true,
            message: t('moreMerchantApply.required'),
            trigger: 'change'
        }],
        "followerDistribution": [{
            required: true,
            message: t('moreMerchantApply.required'),
            trigger: 'change'
        }],
        "salesCategory": [{
            required: true,
            message: t('moreMerchantApply.required'),
            trigger: 'change'
        }],
        "followerPreference": [{
            required: true,
            message: t('moreMerchantApply.required'),
            trigger: 'change'
        }],
        "whatsApp": [{
            asyncValidator(rule, value, cb) {
                // 如果输入了 WhatsApp 号码，则需要验证是否授权
                if (form.value?.whatsApp && !form.value.authShareWhats) {
                    return cb(new Error(t("moreMerchantApply.whatsAppAuthorizeError")));
                } else if (form.value?.whatsApp) {
                    // 如果输入了 WhatsApp 号码，则需要根据国家码验证号码是否合法
                    if (countryToCallingCodeRepeat.value[form.value.whatsAppCallingCode]) {
                        if (!validatePhoneByLibphonenumberStr(form.value.whatsApp, form.value.callingCodeLocation, true)){
                            return cb(new Error(t("profile.validPhone")))
                        }
                    } else {
                        // 如果不是重复的国家码，则需要验证是否是正确的国际电话号码
                        if (!validatePhoneByLibphonenumberNum('+' + form.value.whatsAppCallingCode + form.value.whatsApp)){
                            return cb(new Error(t("profile.validPhone")))
                        }
                    }
                }
                cb();
            },
            trigger: "change",
        }]
    }
}

// 获取国家列表
const fetchCountryList = async () => {
    const res = await countryApi.getAllCountry()
    const data = checkResponseData(res)
    if (data && Array.isArray(data)) {
        countryDataByLang.value = data
    }
}
const countryList = computed(() => {
    const key = locale.value === 'zh-CN' ? 'zhCn' : 'enUs'
    return countryDataByLang.value.map(item => {
        return { ...item, name: item[key] }
    })
})

// 根据国家id 更新 WhatsApp 前缀
const updateWhatsappCountry = (countryId) => {
    if (!countryId) return
    const code = countryCallingCodeDict.value[countryId]
    if (code) {
        form.value.callingCodeLocation = countryId // 国家id
        form.value.whatsAppCallingCode = code // 电话前缀：86、1等
    }
}
// 更新 WhatsApp 前缀
const callingCodeCountryChange = () => {
    form.value.whatsAppCallingCode = countryCallingCodeDict.value[form.value.callingCodeLocation]
}

// 查询详情数据
const fetchDetail = async () => {
    pageLoading.value = true
    const res = await merchantApplyApi.getDistributorApply()
    const data = checkResponseData(res)
    if (data) {
        detailData.value = data
        updateWhatsappCountry(detailData.value.location)
    } else { // 没有数据则默认编辑状态
        isEdit.value = true
    }
    pageLoading.value = false
}


// 进入编辑
const edit = () => {
    form.value = {}
    Object.assign(form.value, detailData.value)
    if (detailData.value.authShareWhats === 1) {
        form.value.authShareWhats = true
    }
    isEdit.value = true
}

// 取消编辑
const cancel = () => {
    isEdit.value = false
    formValidateRef.value?.formRef?.clearValidate()
}

// 提交
const submit = () => {
    formValidateRef.value?.formRef.validate(async valid => {
        if (!valid) return
        loading.value = true
        const param = {
            location: form.value.location,
            platform: form.value.platform,
            followerCount: form.value.followerCount,
            monthlySalesRevenue: form.value.monthlySalesRevenue,
            followerDistribution: form.value.followerDistribution,
            salesCategory: form.value.salesCategory,
            followerPreference: form.value.followerPreference,
            whatsAppCallingCode: form.value.whatsAppCallingCode,
            callingCodeLocation: form.value.callingCodeLocation,
            whatsApp: form.value.whatsApp,
            authShareWhats: form.value.authShareWhats ? 1 : 0
        }
        if (isPlatformOtherSelected.value) param.platformOtherDetail = form.value.platformOtherDetail
        if (isCategoryOtherSelected.value) param.categoryOtherDetail = form.value.categoryOtherDetail
        let result = null
        if(detailData.value?.id) { // 编辑
            param.id = detailData.value.id
            result = await merchantApplyApi.saveOrUpdateDistributorApply(param)
        } else { // 新增
            result = await merchantApplyApi.createDistributorApply(param)
        }
        const res = checkResponseData(result)
        if (res) {
            successMessage(t('moreMerchantApply.saveSuccess'))
            isEdit.value = false
            fetchDetail()
        }
        loading.value = false
    })
}

onMounted(async () => {
    await fetchCountryList()
    await fetchDetail()
})

// 查看态展示文本
const displayPlatform = computed(() => {
    const platforms = Array.isArray(detailData.value?.platform) ? detailData.value.platform : []
    const labels = platforms
        .map(v => (platformDict.value[v]?.label || v))
        .filter(Boolean)

    if (platforms.includes('Other') && detailData.value?.platformOtherDetail) {
        labels.push(detailData.value.platformOtherDetail)
    }

    return labels.length ? labels.join('、') : '-'
})

const displayCategories = computed(() => {
    const salesCategory = Array.isArray(detailData.value?.salesCategory) ? detailData.value.salesCategory : []
    const labels = salesCategory
        .map(v => (categoryDict.value[v]?.label || v))
        .filter(Boolean)

    if (salesCategory.includes('8') && detailData.value?.categoryOtherDetail) {
        labels.push(detailData.value.categoryOtherDetail)
    }
    
    return labels.length ? labels.join('、') : '-'
})

const displayFollowerPreference = computed(() => {
    const item = followerPreferenceDict.value[detailData.value?.followerPreference]
    if (!item) return '-'
    return item.desc ? `${item.label} (${item.desc})` : item.label
})

const displayWhatsApp = computed(() => {
    if (!detailData.value.whatsApp) return '-'
    return `${detailData.value.whatsAppCallingCode ? `+${detailData.value.whatsAppCallingCode}` : ''} ${detailData.value.whatsApp}`
})
</script>

<template>
    <div class="more-merchant-apply" :class="{ m: isMobile }" v-loading="pageLoading">
        <div class="profile-head">
            <div class="profile-head-content">
                <div class="profile-title">{{ $t('moreMerchantApply.title') }}</div>
                <div class="flex">
                    <div>
                        <div class="profile-discribe">{{ $t('moreMerchantApply.titleMessage1') }}</div>
                        <div class="profile-discribe">{{ $t('moreMerchantApply.titleMessage2') }}</div>
                    </div>
                    <div class="flex-center-16"></div>
                    <div class="profile-head-right" v-if="!isEdit">
                        <el-button class="button-default" @click="edit">{{ $t('moreMerchantApply.edit') }}</el-button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 编辑态 -->
        <FormValidate
            v-if="isEdit"
            ref="formValidateRef"
            :model="form"
            :rules="rules()"
            label-width="auto"
            class="nature-form"
            novalidate
        >
            <el-form-item :label="$t('moreMerchantApply.location')" prop="location" class="nature-form-item gap32">
                <el-select
                    v-model="form.location"
                    filterable
                    :placeholder="$t('moreMerchantApply.locationPlaceholder')"
                    class="nature-form-input select-default"
                    @change="updateWhatsappCountry"
                >
                    <template #label="{ label, value }">
                        <div class="flex items-center gap8">
                            <div class="circle-country-icon-container size-20">
                                <img v-if="value" :src="flagUrl(value)">
                            </div>
                            <span>{{ label }}</span>
                        </div>
                    </template>
                    <el-option
                        v-for="item in countryList"
                        :key="item.countryId"
                        :value="item.countryId"
                        :label="item.name"
                    >
                        <div class="flex items-center gap8">
                            <div class="circle-country-icon-container size-20">
                                <img :src="flagUrl(item.countryId)">
                            </div>
                            <span>{{ item.name }}</span>
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('moreMerchantApply.platform')" prop="platform" class="nature-form-item gap32">
                <el-select
                    v-model="form.platform"
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    :placeholder="$t('moreMerchantApply.platformPlaceholder')"
                    class="nature-form-input select-default multiple"
                    popper-class="select-multiple"
                >
                    <el-option
                        v-for="item in platformOptions"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    >
                        <el-checkbox
                            :model-value="Array.isArray(form.platform) && form.platform.includes(item.value)"
                        >{{ item.label }}</el-checkbox>
                    </el-option>
                    <div v-if="isPlatformOtherSelected" class="flex mb20">
                        <div class="flex-center-40"></div>
                        <el-input
                            v-model="form.platformOtherDetail"
                            maxlength="200"
                            class="nature-form-input input-default"
                            @change="e => { form.platformOtherDetail = e.trim() }"
                        />
                        <div class="flex-center-16"></div>
                    </div>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('moreMerchantApply.followerCount')" prop="followerCount" class="nature-form-item gap32">
                <el-select
                    v-model="form.followerCount"
                    :placeholder="$t('moreMerchantApply.locationPlaceholder')"
                    class="nature-form-input select-default"
                >
                    <el-option
                        v-for="item in followersOptions"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    />
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('moreMerchantApply.monthlySalesRevenue')" prop="monthlySalesRevenue" class="nature-form-item gap32">
                <el-select
                    v-model="form.monthlySalesRevenue"
                    :placeholder="$t('moreMerchantApply.locationPlaceholder')"
                    class="nature-form-input select-default"
                >
                    <el-option
                        v-for="item in revenueOptions"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    />
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('moreMerchantApply.followerDistribution')" prop="followerDistribution" class="nature-form-item gap32">
                <el-select
                    v-model="form.followerDistribution"
                    :placeholder="$t('moreMerchantApply.locationPlaceholder')"
                    class="nature-form-input select-default"
                >
                    <el-option
                        v-for="item in distributionOptions"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    />
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('moreMerchantApply.salesCategory')" prop="salesCategory" class="nature-form-item gap32">
                <el-select
                    v-model="form.salesCategory"
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    :placeholder="$t('moreMerchantApply.salesCategoryPlaceholder')"
                    class="nature-form-input select-default multiple"
                    popper-class="select-multiple"
                >
                    <el-option
                        v-for="item in categoryOptions"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                    >
                        <el-checkbox
                            :model-value="Array.isArray(form.salesCategory) && form.salesCategory.includes(item.value)"
                        >{{ item.label }}</el-checkbox>
                    </el-option>
                    <div v-if="isCategoryOtherSelected" class="flex mb20">
                        <div class="flex-center-40"></div>
                        <el-input
                            v-model="form.categoryOtherDetail"
                            maxlength="200"
                            class="nature-form-input input-default"
                            @change="e => { form.categoryOtherDetail = e.trim() }"
                        />
                        <div class="flex-center-16"></div>
                    </div>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('moreMerchantApply.followerPreference')" prop="followerPreference" class="nature-form-item gap32">
                <el-radio-group v-model="form.followerPreference" class="nature-form-input radio-default radio-vertical">
                    <el-radio v-for="item in followerPreferenceOptions" :key="item.value" :value="item.value">
                        <div class="radio-label-wrap">
                            <div class="radio-label">{{ item.label }}</div>
                            <div class="radio-desc">{{ item.desc }}</div>
                        </div>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('moreMerchantApply.whatsApp')" prop="whatsApp" class="nature-form-item gap32">
                <el-input
                    v-model="form.whatsApp"
                    :placeholder="$t('moreMerchantApply.whatsAppPlaceholder')"
                    class="nature-form-input input-default"
                    @change="e => { form.whatsApp = e.trim() }"
                >
                    <template #prepend>
                        <el-select
                            v-model="form.callingCodeLocation"
                            placeholder=""
                            style="width: 115px"
                            @change="callingCodeCountryChange"
                        >
                            <el-option
                                v-for="item in countryList"
                                :key="item.countryId"
                                :value="item.countryId"
                                :label="item.countryId + ' +' + item.callingCode"
                            />
                        </el-select>
                    </template>
                </el-input>                
                <el-checkbox v-model="form.authShareWhats" class="whatsapp-auth">
                    {{ $t('moreMerchantApply.whatsAppAuthorize') }}
                </el-checkbox>
            </el-form-item>

            <el-form-item class="nature-form-buttons">
                <el-button class="button-default" @click="cancel">{{ $t('moreMerchantApply.cancel') }}</el-button>
                <div class="flex-center-12"></div>
                <el-button type="primary" class="button-default" :loading="loading" @click="submit">{{ $t('moreMerchantApply.save') }}</el-button>
            </el-form-item>
        </FormValidate>

        <!-- 查看态 -->
        <div v-else class="nature-list">
            <div class="nature-item gap32">
                <div class="nature-item-label">{{ $t('moreMerchantApply.location') }}</div>
                <div class="nature-item-value">{{ countryDict[detailData.location] || '-' }}</div>
            </div>
            <div class="nature-item gap32">
                <div class="nature-item-label">{{ $t('moreMerchantApply.platform') }}</div>
                <div class="nature-item-value">{{ displayPlatform }}</div>
            </div>
            <div class="nature-item gap32">
                <div class="nature-item-label">{{ $t('moreMerchantApply.followerCount') }}</div>
                <div class="nature-item-value">{{ followersDict[detailData.followerCount] || '-' }}</div>
            </div>
            <div class="nature-item gap32">
                <div class="nature-item-label">{{ $t('moreMerchantApply.monthlySalesRevenue') }}</div>
                <div class="nature-item-value">{{ revenueDict[detailData.monthlySalesRevenue] || '-' }}</div>
            </div>
            <div class="nature-item gap32">
                <div class="nature-item-label">{{ $t('moreMerchantApply.followerDistribution') }}</div>
                <div class="nature-item-value">{{ distributionDict[detailData.followerDistribution] || '-' }}</div>
            </div>
            <div class="nature-item gap32">
                <div class="nature-item-label">{{ $t('moreMerchantApply.salesCategory') }}</div>
                <div class="nature-item-value">{{ displayCategories }}</div>
            </div>
            <div class="nature-item gap32">
                <div class="nature-item-label">{{ $t('moreMerchantApply.followerPreference') }}</div>
                <div class="nature-item-value">{{  displayFollowerPreference }}</div>
            </div>
            <div class="nature-item gap32">
                <div class="nature-item-label">{{ $t('moreMerchantApply.whatsApp') }}</div>
                <div class="nature-item-value">{{ displayWhatsApp }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "@/assets/css/element-reset/button.scss" as *;
@use "@/assets/css/element-reset/input.scss" as *;
@use "@/assets/css/element-reset/select.scss" as *;
@use "@/assets/css/element-reset/radio.scss" as *;
@use "@/components/account/profile/form.scss" as *;

.more-merchant-apply {
    max-width: calc(100% - 32px);
    width: 1200px;
    margin-bottom: 24px;
    .profile-head-content {
        .profile-title {
            margin: 20px 0 32px;
            color: #101828;
            font-family: var(--Font-family-font-family-display, Inter);
            font-size: var(--Font-size-display-sm, 30px);
            font-style: normal;
            font-weight: 600;
            line-height: var(--Line-height-display-sm, 38px);
        }
        .profile-discribe {
            color: var(--colors-text-text-tertiary-600, #475467);
            font-family: var(--Font-family-font-family-body, Inter);
            font-size: var(--Font-size-text-sm, 14px);
            font-style: normal;
            font-weight: 400;
            line-height: var(--Line-height-text-sm, 20px);
            margin-top: 12px;
        }
        .profile-head-right {
            padding: 0;
            margin-top: 12px;
        }
    }

    .other-input-item {
        :deep(.el-form-item__label) {
            visibility: hidden;
        }
    }

    .radio-vertical {
        display: flex;
        align-items: flex-start;
        gap: 24px;

        .el-radio {
            gap: 0;
            height: auto;

            .radio-label-wrap {
                display: flex;
                flex-direction: column;
                gap: 4px;

                .radio-label {
                    font-weight: 500;
                    color: var(--fly-color-text-primary);
                }

                .radio-desc {
                    color: var(--colors-text-text-tertiary-600, #475467);
                    font-family: var(--Font-family-font-family-body, Inter);
                    font-size: var(--Font-size-text-sm, 14px);
                    font-weight: 400;
                    line-height: var(--Line-height-text-sm, 20px);
                    white-space: normal;
                }
            }
        }
    }

    .whatsapp-auth {
        width: 512px;
        max-width: 100%;
        line-height: 1.4;
        align-items: start;
        white-space: pre-wrap;
        margin-top: 6px;
        margin-bottom: 6px;
        height: auto;
        :deep(.el-checkbox__label) {
            line-height: 20px;
            font-weight: 400;
        }
        :deep(.el-checkbox__input) {
            margin-top: 2px;
        }
        &.is-checked {
            :deep(.el-checkbox__label) {
                color: #475467;
            }
        }
    }
    .nature-list .nature-item .nature-item-label, :deep(.nature-form .nature-form-item .el-form-item__label-wrap) {
        min-width: 30%;
        max-width: 280px;
    }

    &.m {
        padding: 0 16px;
    }
}

</style>

<!-- 下拉面板挂载在 body 下，scoped 穿透不到，需要非 scoped 块 -->
<style lang="scss">
.select-multiple {
    .el-select-dropdown__item {
        padding: 0 16px;
        height: 45px;
        &.is-selected::after {
            display: none;
        }
        .el-checkbox {
            height: 45px;
            .el-checkbox__input {
                .el-checkbox__inner {
                    width: 16px;
                    height: 16px;
                    border-radius: var(--spacing-xs, 4px);
                    border: 1px solid var(--Colors-Border-border-primary, #D0D5DD);
                }
                &.is-checked .el-checkbox__inner{
                    background-color: #5548FF;
                    border-color: #5548FF;
                    &::after {
                        left: 5px;
                        top: 2px;
                    }
                }
            }
            .el-checkbox__label {
                color: var(--colors-text-text-secondary-700, #344054);
                font-family: var(--Font-family-font-family-body, Inter);
                font-size: var(--Font-size-text-sm, 14px);
                font-style: normal;
                font-weight: 500;
                line-height: var(--Line-height-text-sm, 20px);
            }
        }
    }
}
</style>
