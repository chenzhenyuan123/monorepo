<script setup>
import { checkResponseData, arrToDict, successMessage } from "@/util/index.js"
import {
    validatePhoneByLibphonenumberNum,
    validatePhoneByLibphonenumberStr
} from "@flylinking/core/utils/validate";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { merchantApplyApi, countryApi } = useApi()
const isMobile = useIsMobile()

const isEdit = ref(false) // 是否是编辑状态-如果没有填过数据，则默认编辑状态
const loading = ref(false)
const pageLoading = ref(false)
const countryList = ref([]) // 国家下拉数据
const countryDict = computed(() => arrToDict(countryList.value, { value: 'countryId', label: 'name' }))
const countryCallingCodeDict = computed(() => arrToDict(countryList.value, { value: 'countryId', label: 'callingCode' }))
const detailData = ref({}) // 详情数据
const formValidateRef = ref(null)
const form = ref({
    promotionPlatform: [],
    salesCategories: []
})

// 推广平台选项
const platformOptions = computed(() => [
    { value: 'tiktok', label: t('moreMerchantApply.platformOptions1') },
    { value: 'instagram', label: t('moreMerchantApply.platformOptions2') },
    { value: 'facebook', label: t('moreMerchantApply.platformOptions3') },
    { value: 'telegram', label: t('moreMerchantApply.platformOptions4') },
    { value: 'reddit', label: t('moreMerchantApply.platformOptions5') },
    { value: 'whatsapp', label: t('moreMerchantApply.platformOptions6') },
    { value: 'google', label: t('moreMerchantApply.platformOptions7') },
    { value: 'other', label: t('moreMerchantApply.platformOptions8') }
])
const platformDict = computed(() => arrToDict(platformOptions.value))
const isPlatformOtherSelected = computed(() => form.value.promotionPlatform.includes('other'))

// 粉丝数量选项
const followersOptions = computed(() => [
    { value: '0-1K', label: t('moreMerchantApply.followersOptions1') },
    { value: '1K-5K', label: t('moreMerchantApply.followersOptions2') },
    { value: '5K-10K', label: t('moreMerchantApply.followersOptions3') },
    { value: '10K-50K', label: t('moreMerchantApply.followersOptions4') },
    { value: '50K-100K', label: t('moreMerchantApply.followersOptions5') },
    { value: 'More than 100K', label: t('moreMerchantApply.followersOptions6') }
])
const followersDict = computed(() => arrToDict(followersOptions.value))

// 月销售额选项
const revenueOptions = computed(() => [
    { value: '0-1000', label: t('moreMerchantApply.revenueOptions1') },
    { value: '1000-10000', label: t('moreMerchantApply.revenueOptions2') },
    { value: '10000-100000', label: t('moreMerchantApply.revenueOptions3') },
    { value: '100000-500000', label: t('moreMerchantApply.revenueOptions4') },
    { value: '500000+', label: t('moreMerchantApply.revenueOptions5') }
])
const revenueDict = computed(() => arrToDict(revenueOptions.value))

// 粉丝分布选项
const distributionOptions = computed(() => [
    { value: 'country', label: t('moreMerchantApply.distributionOptions1') },
    { value: 'countryandregions', label: t('moreMerchantApply.distributionOptions2') },
    { value: 'Worldwide', label: t('moreMerchantApply.distributionOptions3') }
])
const distributionDict = computed(() => arrToDict(distributionOptions.value))

// 偏好销售类目选项
const categoryOptions = computed(() => [
    { value: 'womenClothing', label: t('moreMerchantApply.categoryOptions1') },
    { value: 'bags', label: t('moreMerchantApply.categoryOptions2') },
    { value: 'shoes', label: t('moreMerchantApply.categoryOptions3') },
    { value: 'jewelry', label: t('moreMerchantApply.categoryOptions4') },
    { value: 'watches', label: t('moreMerchantApply.categoryOptions5') },
    { value: 'electronic', label: t('moreMerchantApply.categoryOptions6') },
    { value: 'sports', label: t('moreMerchantApply.categoryOptions7') },
    { value: 'homeLiving', label: t('moreMerchantApply.categoryOptions8') },
    { value: 'other', label: t('moreMerchantApply.categoryOptions9') }
])
const categoryDict = computed(() => arrToDict(categoryOptions.value))
const isCategoryOtherSelected = computed(() => form.value.salesCategories.includes('other'))

// 粉丝偏好选项
const preferenceOptions = computed(() => [
    { value: 'valueForMoney', label: t('moreMerchantApply.valueForMoney'), desc: t('moreMerchantApply.valueForMoneyDesc') },
    { value: 'qualityFocused', label: t('moreMerchantApply.qualityFocused'), desc: t('moreMerchantApply.qualityFocusedDesc') }
])
const preferenceDict = computed(() => arrToDict(preferenceOptions.value))

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
        "countryId": [{
            asyncValidator(rule, value, cb) {
                if (!value) return cb(new Error(t('moreMerchantApply.required')));
                cb();
            },
            trigger: "change",
        }],
        "promotionPlatform": [{
            asyncValidator(rule, value, cb) {
                if (!value || !value.length) return cb(new Error(t('moreMerchantApply.required')));
                cb();
            },
            trigger: "change",
        }],
        "followers": [{
            asyncValidator(rule, value, cb) {
                if (!value) return cb(new Error(t('moreMerchantApply.required')));
                cb();
            },
            trigger: "change",
        }],
        "monthlyRevenue": [{
            asyncValidator(rule, value, cb) {
                if (!value) return cb(new Error(t('moreMerchantApply.required')));
                cb();
            },
            trigger: "change",
        }],
        "followerDistribution": [{
            asyncValidator(rule, value, cb) {
                if (!value) return cb(new Error(t('moreMerchantApply.required')));
                cb();
            },
            trigger: "change",
        }],
        "salesCategories": [{
            asyncValidator(rule, value, cb) {
                if (!value || !value.length) return cb(new Error(t('moreMerchantApply.required')));
                cb();
            },
            trigger: "change",
        }],
        "followerPreference": [{
            asyncValidator(rule, value, cb) {
                if (!value) return cb(new Error(t('moreMerchantApply.required')));
                cb();
            },
            trigger: "change",
        }],
        "whatsappAuthorized": [{
            asyncValidator(rule, value, cb) {
                // 如果输入了 WhatsApp 号码，则需要验证是否授权
                if (form.value?.whatsappNumber && !form.value.whatsappAuthorized) {
                    return cb(new Error(t("moreMerchantApply.whatsappAuthorizeError")));
                } else if (form.value?.whatsappNumber) {
                    // 如果输入了 WhatsApp 号码，则需要根据国家码验证号码是否合法
                    if (countryToCallingCodeRepeat.value[form.value.callingCode]) {
                        if (!validatePhoneByLibphonenumberStr(form.value.whatsappNumber, form.value.whatsappCountry, true)){
                            return cb(new Error(t("profile.validPhone")))
                        }
                    } else {
                        // 如果不是重复的国家码，则需要验证是否是正确的国际电话号码
                        if (!validatePhoneByLibphonenumberNum('+' + form.value.callingCode + form.value.whatsappNumber)){
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
        countryList.value = data
    }
}

// 根据国家id 更新 WhatsApp 前缀
const updateWhatsappCountry = (countryId) => {
    if (!countryId) return
    const code = countryCallingCodeDict.value[countryId]
    if (code) {
        form.value.whatsappCountry = countryId // 国家id
        form.value.callingCode = code // 电话前缀：86、1等
    }
}

// 查询详情数据
const fetchDetail = async () => {
    pageLoading.value = true
    try {
        const res = await merchantApplyApi.getDistributorApply()
        const data = checkResponseData(res)
        if (data) {
            detailData.value = data
        } else { // 没有数据则默认编辑状态
            isEdit.value = true
        }
    } finally {
        pageLoading.value = false
    }
}


// 进入编辑
const edit = () => {
    Object.assign(form.value, detailData.value)
    isEdit.value = true
}

// 取消编辑
const cancel = () => {
    isEdit.value = false
    // formValidateRef.value?.clearValidate()
}

// 提交
const submit = () => {
    formValidateRef.value?.formRef.validate(async valid => {
        if (!valid) return
        loading.value = true
        const param = {
            countryId: form.value.countryId,
            promotionPlatform: form.value.promotionPlatform.join(','),
            followers: form.value.followers,
            monthlyRevenue: form.value.monthlyRevenue,
            followerDistribution: form.value.followerDistribution,
            salesCategories: form.value.salesCategories.join(','),
            followerPreference: form.value.followerPreference,
            callingCode: form.value.callingCode,
            whatsappNumber: form.value.whatsappNumber,
            whatsappAuthorized: form.value.whatsappAuthorized ? 1 : 0
        }
        if (isPlatformOtherSelected.value) param.promotionPlatformOther = form.value.promotionPlatformOther
        if (isCategoryOtherSelected.value) param.salesCategoryOther = form.value.salesCategoryOther
        const res = await merchantApplyApi.saveOrUpdateDistributorApply(param)
        const data = checkResponseData(res)
        if (data) {
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
    const arr = detailData.value.promotionPlatform ? detailData.value.promotionPlatform.split(',').filter(Boolean) : []
    const labels = arr.map(v => platformDict.value[v]).filter(Boolean)
    if (arr.includes('other') && detailData.value.promotionPlatformOther) {
        labels.push(detailData.value.promotionPlatformOther)
    }
    return labels.length ? labels.join('、') : '-'
})

const displayCategories = computed(() => {
    const arr = detailData.value.salesCategories ? detailData.value.salesCategories.split(',').filter(Boolean) : []
    const labels = arr.map(v => categoryDict.value[v]).filter(Boolean)
    if (arr.includes('other') && detailData.value.salesCategoryOther) {
        labels.push(detailData.value.salesCategoryOther)
    }
    return labels.length ? labels.join('、') : '-'
})

const displayWhatsapp = computed(() => {
    if (!detailData.value.whatsappNumber) return '-'
    return `${detailData.value.whatsappCountry || ''} ${detailData.value.whatsappNumber}`
})
</script>

<template>
    <div class="more-merchant-apply" :class="{ m: isMobile }" v-loading="pageLoading">
        <div class="profile-head">
            <div class="profile-head-content">
                <div class="profile-title">{{ $t('moreMerchantApply.title') }}</div>
                <div class="profile-discribe">{{ $t('moreMerchantApply.titleMessage1') }}</div>
                <div class="profile-discribe">{{ $t('moreMerchantApply.titleMessage2') }}</div>
            </div>
            <div class="profile-head-right" v-if="!isEdit">
                <el-button class="button-default" @click="edit">{{ $t('moreMerchantApply.edit') }}</el-button>
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
            <el-form-item :label="$t('moreMerchantApply.location')" prop="countryId" class="nature-form-item">
                <el-select
                    v-model="form.countryId"
                    filterable
                    :placeholder="$t('moreMerchantApply.locationPlaceholder')"
                    class="nature-form-input select-default"
                    @change="updateWhatsappCountry"
                >
                    <el-option
                        v-for="item in countryList"
                        :key="item.countryId"
                        :value="item.countryId"
                        :label="item.name"
                    />
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('moreMerchantApply.promotionPlatform')" prop="promotionPlatform" class="nature-form-item">
                <el-select
                    v-model="form.promotionPlatform"
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    :placeholder="$t('moreMerchantApply.promotionPlatformPlaceholder')"
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
                            :model-value="form.promotionPlatform.includes(item.value)"
                        >{{ item.label }}</el-checkbox>
                    </el-option>
                    <div v-if="isPlatformOtherSelected" class="flex mb20">
                        <div class="flex-center-40"></div>
                        <el-input
                            v-model="form.promotionPlatformOther"
                            maxlength="200"
                            class="nature-form-input input-default"
                            @change="e => { form.promotionPlatformOther = e.trim() }"
                        />
                        <div class="flex-center-16"></div>
                    </div>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('moreMerchantApply.followers')" prop="followers" class="nature-form-item">
                <el-select
                    v-model="form.followers"
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

            <el-form-item :label="$t('moreMerchantApply.monthlyRevenue')" prop="monthlyRevenue" class="nature-form-item">
                <el-select
                    v-model="form.monthlyRevenue"
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

            <el-form-item :label="$t('moreMerchantApply.followerDistribution')" prop="followerDistribution" class="nature-form-item">
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

            <el-form-item :label="$t('moreMerchantApply.salesCategories')" prop="salesCategories" class="nature-form-item">
                <el-select
                    v-model="form.salesCategories"
                    multiple
                    collapse-tags
                    collapse-tags-tooltip
                    :placeholder="$t('moreMerchantApply.salesCategoriesPlaceholder')"
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
                            :model-value="form.salesCategories.includes(item.value)"
                        >{{ item.label }}</el-checkbox>
                    </el-option>
                    <div v-if="isCategoryOtherSelected" class="flex mb20">
                        <div class="flex-center-40"></div>
                        <el-input
                            v-model="form.salesCategoryOther"
                            maxlength="200"
                            class="nature-form-input input-default"
                            @change="e => { form.salesCategoryOther = e.trim() }"
                        />
                        <div class="flex-center-16"></div>
                    </div>
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('moreMerchantApply.followerPreferences')" prop="followerPreference" class="nature-form-item">
                <el-radio-group v-model="form.followerPreference" class="nature-form-input radio-default radio-vertical">
                    <el-radio v-for="item in preferenceOptions" :key="item.value" :value="item.value">
                        <div class="radio-label-wrap">
                            <div class="radio-label">{{ item.label }}</div>
                            <div class="radio-desc">{{ item.desc }}</div>
                        </div>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('moreMerchantApply.whatsapp')" prop="whatsappAuthorized" class="nature-form-item">
                <el-input
                    v-model="form.whatsappNumber"
                    :placeholder="$t('moreMerchantApply.whatsappPlaceholder')"
                    class="nature-form-input input-default"
                    @change="e => { form.whatsappNumber = e.trim() }"
                >
                    <template #prepend>
                        <el-select
                            v-model="form.whatsappCountry"
                            placeholder=""
                            style="width: 115px"
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
                <el-checkbox v-model="form.whatsappAuthorized" class="whatsapp-auth">
                    {{ $t('moreMerchantApply.whatsappAuthorize') }}
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
            <div class="nature-item">
                <div class="nature-item-label">{{ $t('moreMerchantApply.location') }}</div>
                <div class="nature-item-value">{{ countryDict[detailData.countryId] || '-' }}</div>
            </div>
            <div class="nature-item">
                <div class="nature-item-label">{{ $t('moreMerchantApply.promotionPlatform') }}</div>
                <div class="nature-item-value">{{ displayPlatform }}</div>
            </div>
            <div class="nature-item">
                <div class="nature-item-label">{{ $t('moreMerchantApply.followers') }}</div>
                <div class="nature-item-value">{{ followersDict[detailData.followers] || '-' }}</div>
            </div>
            <div class="nature-item">
                <div class="nature-item-label">{{ $t('moreMerchantApply.monthlyRevenue') }}</div>
                <div class="nature-item-value">{{ revenueDict[detailData.monthlyRevenue] || '-' }}</div>
            </div>
            <div class="nature-item">
                <div class="nature-item-label">{{ $t('moreMerchantApply.followerDistribution') }}</div>
                <div class="nature-item-value">{{ distributionDict[detailData.followerDistribution] || '-' }}</div>
            </div>
            <div class="nature-item">
                <div class="nature-item-label">{{ $t('moreMerchantApply.salesCategories') }}</div>
                <div class="nature-item-value">{{ displayCategories }}</div>
            </div>
            <div class="nature-item">
                <div class="nature-item-label">{{ $t('moreMerchantApply.followerPreferences') }}</div>
                <div class="nature-item-value">{{ (preferenceDict[detailData.followerPreference] && preferenceDict[detailData.followerPreference].label) || '-' }}</div>
            </div>
            <div class="nature-item">
                <div class="nature-item-label">{{ $t('moreMerchantApply.whatsapp') }}</div>
                <div class="nature-item-value">{{ displayWhatsapp }}</div>
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
                    line-height: var(--Line-height-text-sm, 20px); /* 142.857% */
                }
            }
        }
    }

    .whatsapp-auth {
        line-height: 1.4;
        align-items: start;
        white-space: pre-wrap;
        margin-top: 6px;
        margin-bottom: 6px;
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
