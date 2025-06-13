<script setup>
import { useUserStore } from '@/store/userState.js'
import { isName } from '@/util/validate.js'
import { checkResponseData, isEMpty, arrToDict } from "@/util/index.js"
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const { userApi, countryApi } = useApi()
const userStore = useUserStore()
const props = defineProps({
    natureData: {
        type: Object,
        default: () => ({})
    },
    countryData: {
        type: Array,
        default: () => ([])
    }
})
const isEdit = ref(false)
const formRef = ref()
const loading = ref(false)
const form = reactive({
    type: undefined,
    companyName: undefined,
    firstName: undefined,
    lastName: undefined,
    country: undefined,
    province: undefined,
    city: undefined,
    address: undefined,
    postal: undefined,
    taxId: undefined,
    vat: undefined,
})
// 校验名称格式
// const validateName = (rule, value, callback) => {
// if (value && !isName(value)) {
//     callback(new Error(t('profile.generalEditValidateName')))
//   } else {
//     callback()
//   }
// }
const rules = () => {
    return {
        // companyName: [
        //     {
        //         validator: validateName,
        //         trigger: 'blur'
        //     }
        // ],
        // firstName: [
        //     {
        //         validator: validateName,
        //         trigger: 'blur'
        //     }
        // ],
        // lastName: [
        //     {
        //         validator: validateName,
        //         trigger: 'blur'
        //     }
        // ]
    }
}
const companyTypeData = computed(() => {
    return [
        { value: 'Company', label: t('profile.companyEditDataTypeCompany') },
        { value: 'Personal', label: t('profile.companyEditDataTypePersonal') },
    ]
})
const companyTypeDict = computed(() => {
    return arrToDict(companyTypeData.value)
})
const emit = defineEmits(["updateData"])

watch(props.natureData, (newCurrent, oldCurrent) => {
    if (props.natureData.country) getBaseProvinceByCountry(props.natureData.country)
})

const isCompany = (type) => {
    return type === 'Company'
}
const isPersonal = (type) => {
    return type === 'Personal'
}
const edit = () => {
    Object.assign(form, props.natureData)
    isEdit.value = true
    // if (props.natureData.country) getBaseProvinceByCountry(props.natureData.country)
}
const changeCompanyType = () => {
    if (isCompany(form.type)) {
        form.firstName = undefined
        form.lastName = undefined
        console.log('form: ', form)
    } else {
        form.companyName = undefined
        console.log('form: ', form)
    }
}


const countryDict = computed(() => {
    return arrToDict(props.countryData, { value: 'countryId', label: 'name' })
})
const provinceData = ref([
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
])
const provinceDataByLang = computed(() => {
    const key = locale.value === 'zh-CN' ? 'zhCn' : 'enUs'
    return provinceData.value.map(item => {
        return { ...item, name: item[key] }
    })
})
const provinceDict = computed(() => {
    return arrToDict(provinceDataByLang.value, { value: 'provinceId', label: 'name' })
})
const getBaseProvinceByCountry = async(countryId) => {
  const result = await countryApi.getProvinceByCountry(countryId)
  const res = checkResponseData(result)
  if (res) {
      // res.forEach(item => item.name = item.name || item.enUs)
    provinceData.value = res
  }
}
const changeCountry = () => {
    getBaseProvinceByCountry(form.country)
    form.province = undefined
}


// 编辑用户基础信息
const submit = () => {
    formRef.value.validate(async valid => {
        if (!valid) return
        loading.value = true
        const param = Object.assign({}, form)
        const result = await userApi.editUserCompanyInfo(param)
        const res = checkResponseData(result, 'NO_RETURN_DATA')
        if (res) {
            emit('updateData')
            isEdit.value = false
        }
        loading.value = false

    })
}
const cancel = () => {
    isEdit.value = false
}

userStore.getUserInfo()

</script>

<template>
    <div class="profile-head">
        <div class="profile-head-content">
            <div class="profile-title">{{$t('profile.company')}} ({{$t('profile.companyTitleExplain')}})</div>
            <div class="profile-discribe">{{$t('profile.companyTitleMessage')}}</div>
        </div>
        <div class="profile-head-right">
            <el-button v-if="!isEdit" id="profile-btn-company-edit" class="button-default" @click="edit">{{$t('profile.edit')}}</el-button>
        </div>
    </div>

    <el-form
        v-if="isEdit"
        ref="formRef"
        :model="form"
        :rules="rules()"
        label-width="auto"
        class="nature-form"
        novalidate
    >
        <el-form-item :label="$t('profile.companyEditLabelType')" prop="type" class="nature-form-item">
            <el-select
                v-model="form.type"
                placeholder=""
                class="nature-form-input select-default"
                @change="changeCompanyType"
            >
                <el-option
                    v-for="item in companyTypeData"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                />
            </el-select>
        </el-form-item>
        <el-form-item v-if="isCompany(form.type)" :label="$t('profile.companyEditLabelName')" prop="companyName" class="nature-form-item">
            <el-input v-model="form.companyName" class="nature-form-input input-default" @change="e => { form.companyName = e.trim() }" />
        </el-form-item>
        <el-form-item v-else-if="isPersonal(form.type)" :label="$t('profile.companyEditLabelName')" class="nature-form-item">
            <div class="nature-form-group">
                <el-form-item prop="firstName" class="nature-form-item">
                    <el-input
                            v-model="form.firstName"
                            :placeholder="$t('profile.shippingAddressLabelFirstName')"
                            class="nature-form-input input-default"
                            @change="e => { form.firstName = e.trim() }"
                    />
                </el-form-item>
                <div class="flex-center-8"></div>
                <el-form-item prop="lastName" class="nature-form-item">
                    <el-input
                            v-model="form.lastName"
                            :placeholder="$t('profile.shippingAddressLabelLastName')"
                            class="nature-form-input
                            input-default"
                            @change="e => { form.lastName = e.trim() }"
                    />
                </el-form-item>
            </div>
        </el-form-item>
        <el-form-item :label="$t('profile.companyEditLabelAddress')" prop="" class="nature-form-item">
            <div class="nature-form-group wrap">
                <el-form-item prop="" class="nature-form-item-col12">
                    <el-select
                        v-model="form.country"
                        filterable
                        :placeholder="$t('profile.companyEditPlaceholderCountry')"
                        class="nature-form-input select-default"
                        @change="changeCountry"
                    >
                        <el-option
                            v-for="item in countryData"
                            :key="item.countryId"
                            :value="item.countryId"
                            :label="item.name"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item prop="" class="nature-form-item-col12">
                    <el-input v-model="form.address" :placeholder="$t('profile.companyEditPlaceholderAddress')" class="nature-form-input input-default" @change="e => { form.address = e.trim() }" />
                </el-form-item>
                <div class="nature-form-group">
                    <el-form-item prop="" class="nature-form-item">
                        <el-input v-model="form.city" :placeholder="$t('profile.companyEditPlaceholderCity')" class="nature-form-input input-default" @change="e => { form.city = e.trim() }" />
                    </el-form-item>
                    <div class="flex-center-8"></div>
                    <el-form-item prop="" class="nature-form-item">
                        <el-input v-model="form.postal" :placeholder="$t('profile.companyEditPlaceholderPostal')" class="nature-form-input input-default" @change="e => { form.postal = e.trim() }" />
                    </el-form-item>
                </div>
                <el-form-item prop="" class="nature-form-item-col12">
                    <el-select
                        v-model="form.province"
                        filterable
                        :placeholder="$t('profile.companyEditPlaceholderProvince')"
                        class="nature-form-input select-default"
                    >
                        <el-option
                            v-for="item in provinceDataByLang"
                            :key="item.provinceId"
                            :value="item.provinceId"
                            :label="item.name"
                        />
                    </el-select>
                </el-form-item>
            </div>
        </el-form-item>
        <el-form-item :label="$t('profile.companyEditLabelTaxID')" prop="" class="nature-form-item">
            <el-input v-model="form.taxId" :placeholder="$t('profile.companyEditPlaceholderTaxID')" class="nature-form-input input-default" @change="e => { form.taxId = e.trim() }" />
        </el-form-item>
        <el-form-item :label="$t('profile.companyEditLabelVAT')" prop="" class="nature-form-item">
            <el-input v-model="form.vat" :placeholder="$t('profile.companyEditPlaceholderVAT')" class="nature-form-input input-default" @change="e => { form.vat = e.trim() }" />
        </el-form-item>
        <el-form-item class="nature-form-buttons">
            <el-button id="profile-btn-company-cancel" class="button-default" @click="cancel">{{$t('profile.cancel')}}</el-button>
            <div class="flex-center-12"></div>
            <el-button id="profile-btn-company-save" type="primary" class="button-default" :loading="loading" @click="submit">{{$t('profile.saveChanges')}}</el-button>
        </el-form-item>
    </el-form>

    <div v-else class="nature-list">
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.companyLabelType')}}</div>
            <div class="nature-item-value">{{ companyTypeDict[natureData.type] || '-' }}</div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.companyLabelName')}}</div>
            <div class="nature-item-value">
                <template v-if="isCompany(natureData.type)">
                    {{ natureData.companyName || '-' }}
                </template>
                <template v-else-if="natureData.firstName || natureData.lastName">
                    {{ natureData.firstName ? (natureData.firstName + ' ' + natureData.lastName) : natureData.lastName }}
                </template>
                <template v-else>
                    -
                </template>
            </div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.companyLabelAddress')}}</div>
            <div class="nature-item-value nature-item-value-group">
                <template v-if="natureData.country || natureData.province || natureData.city || natureData.address || natureData.postal">
                    <span class="nature-item-value-item">{{ natureData.address }}</span>
                    <br>
                    <span class="nature-item-value-item">{{ provinceDict[natureData.province] }}</span>
                    <span v-if="natureData.province && natureData.city"> , </span>
                    <span class="nature-item-value-item">{{ natureData.city }}&nbsp;</span>
                    <span class="nature-item-value-item">{{ natureData.postal }}</span>
                    <br>
                    <span class="nature-item-value-item">{{ countryDict[natureData.country] }}</span>
                </template>
                <template v-else>-</template>
            </div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.companyLabelPostal')}}</div>
            <div class="nature-item-value">{{ natureData.postal || '-' }}</div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.companyLabelTaxID')}}</div>
            <div class="nature-item-value">{{ natureData.taxId || '-' }}</div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.companyLabelVAT')}}</div>
            <div class="nature-item-value">{{ natureData.vat || '-' }}</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import url("@/assets/css/element-reset/button.scss");
@import url("@/assets/css/element-reset/input.scss");
@import url("@/assets/css/element-reset/select.scss");
@import url("@/assets/css/element-reset/radio.scss");
// @import url("@/components/account/profile/form.scss");
@import url("./form.scss");
</style>
