<script setup>
import { useI18n } from "vue-i18n";
import { useUserStore } from '@/store/userState.js'
import { checkResponseData, isEMpty, arrToDict } from "@/util/index.js"
import {
    hasChinese,
    hasArabic,
    isValidZipcode,
} from "@/util/validate";

const { t } = useI18n();
const { userApi } = useApi()
const userStore = useUserStore()
const props = defineProps({
    isAdd: {
        type: Boolean,
        default: false
    },
    natureData: {
        type: Object,
        default: () => ({})
    },
    countryData: {
        type: Array,
        default: () => ([])
    }
})
const emit = defineEmits(['updateData', 'cancel', 'delete'])

const countryDict = computed(() => {
    return arrToDict(props.countryData, { value: 'countryId', label: 'name' })
})
const provinceDict = computed(() => {
    return arrToDict(locationData.provinceData, { value: 'provinceId', label: 'name' })
})
const countryToCallingCode = computed(() => {
    return arrToDict(props.countryData, { value: 'countryId', label: 'callingCode' })
})
const isEdit = ref(false)
const formRef = ref(null)
const loading = ref(false)
const form = ref({
    firstName: undefined,
    lastName: undefined,
    country: undefined,
    addressLineOne: undefined,
    addressLineTwo: undefined,
    city: undefined,
    postal: undefined,
    province: undefined,
    callingCode: undefined,
    phone: undefined
})
const rules = () => {
    return {
        "firstName": [
            {
                asyncValidator(rule, value, cb) {
                    if (!value)
                        return cb(new Error(t("cashier.firstNameRequired")));
                    else {
                        if (hasChinese(value)){
                            return cb(new Error(t("cashier.hasChineseLimit")))
                        } else if (hasArabic(value)){
                            return cb(new Error(t("cashier.hasArabicLimit")))
                        }
                    }
                    cb();
                },
                trigger: "change",
            },
        ],
        "lastName": [
            {
                asyncValidator(rule, value, cb) {
                    if (!value)
                        return cb(new Error(t("cashier.lastNameRequired")));
                    else {
                        if (hasChinese(value)){
                            return cb(new Error(t("cashier.hasChineseLimit")))
                        } else if (hasArabic(value)){
                            return cb(new Error(t("cashier.hasArabicLimit")))
                        }
                    }
                    cb();
                },
                trigger: "change",
            },
        ],
        "country": [
            {
                asyncValidator(rule, value, cb) {
                    if (!value) return cb(new Error(""));
                    cb();
                },
                trigger: "change",
            },
        ],
        "addressLineOne": [
            {
                asyncValidator(rule, value, cb) {
                    if (!value)
                        return cb(new Error(t("cashier.AddressRequired")));
                    else {
                        if (hasChinese(value)){
                            return cb(new Error(t("cashier.hasChineseLimit")))
                        } else if (hasArabic(value)){
                            return cb(new Error(t("cashier.hasArabicLimit")))
                        }
                    }
                    cb();
                },
                trigger: "blur",
            },
        ],
        "addressLineTwo": [
            {
                asyncValidator(rule, value, cb) {
                    if (value) {
                        if (hasChinese(value)){
                            return cb(new Error(t("cashier.hasChineseLimit")))
                        } else if (hasArabic(value)){
                            return cb(new Error(t("cashier.hasArabicLimit")))
                        }
                    }
                    cb();
                },
                trigger: "change",
            },
        ],
        "city": [
            {
                asyncValidator(rule, value, cb) {
                    if (!value)
                        return cb(new Error(t("cashier.CityRequired")));
                    else {
                        if (hasChinese(value)){
                            return cb(new Error(t("cashier.hasChineseLimit")))
                        } else if (hasArabic(value)){
                            return cb(new Error(t("cashier.hasArabicLimit")))
                        }
                    }
                    cb();
                },
                trigger: "change",
            },
        ],
        "postal": [
            {
                asyncValidator(rule, value, cb) {
                    if (!value)
                        return cb(new Error(t("cashier.ZIPRequired")));
                    else {
                        if (!isValidZipcode(value)){
                            return cb(new Error(t("cashier.zipcodeLimit")))
                        }
                    }
                    cb();
                },
                trigger: "change",
            },
        ],
        // 部分国家或地区没有对应城市，故不做必填校验
        // "province": [
        //   {
        //     asyncValidator(rule, value, cb) {
        //       if (!value) return cb(new Error(""));
        //       cb();
        //     },
        //     trigger: "change",
        //   },
        // ],
        "shipping.phone": [
            {
                asyncValidator(rule, value, cb) {
                    if (!value)
                        return cb(new Error(t("cashier.MobileNumberRequired")));
                    cb();
                },
                trigger: "change",
            },
        ],
    }
}
const locationData = reactive({
    provinceData: [
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

watch(props.natureData, (newCurrent, oldCurrent) => {
    if (props.natureData.country) getBaseProvinceByCountry(props.natureData.country)
})

const edit = () => {
    Object.assign(form.value, props.natureData)
    isEdit.value = true
}
const getBaseProvinceByCountry = async(countryId) => {
  const result = await userApi.getBaseProvinceByCountry(countryId)
  const res = checkResponseData(result)
  if (res) {
      res.forEach(item => item.name = item.name || item.enUs)
    locationData.provinceData = res
  }
}
const changeCountry = () => {
    getBaseProvinceByCountry(form.value.country)
    form.value.province = undefined
    form.value.callingCode = countryToCallingCode.value[form.value.country]
}
// 编辑用户基础信息
const submit = () => {
    formRef.value.validate(async valid => {
        if (!valid) return
        loading.value = true
        const param = Object.assign({}, form.value)
        let result
        // if (props.isAdd) {
        //     //
        // } else {
        result = await userApi.editUserShippingInfo(param)
        // }
        const res = checkResponseData(result, 'NO_RETURN_DATA')
        if (res) {
            form.value = {}
            emit('updateData')
            isEdit.value = false
            isAdd.value = false
        }
        loading.value = false

    })
}
const cancel = () => {
    form.value = {}
    isEdit.value = false
    emit('cancel')
}
const deleteAddress = async () => {
    const result = await userApi.deleteShippingInfo({ id: props.natureData.id })
    const res = checkResponseData(result, 'NO_RETURN_DATA')
    if (res) {
        emit('updateData')
    }
}

userStore.getUserInfo()

</script>

<template>

    <el-form
        v-if="isEdit || isAdd"
        ref="formRef"
        :model="form"
        label-width="auto"
        class="nature-form"
        novalidate
    >
<!--        :rules="rules()"-->
        <el-form-item :label="$t('profile.shippingAddressEditLabelName')" class="nature-form-item">
            <div class="nature-form-group">
                <el-form-item prop="firstName" class="nature-form-item">
                    <el-input v-model="form.firstName" class="nature-form-input input-default" @change="e => { form.firstName = e.trim() }" />
                </el-form-item>
                <div class="nature-form-group-center"></div>
                <el-form-item prop="lastName" class="nature-form-item">
                    <el-input v-model="form.lastName" class="nature-form-input input-default" @change="e => { form.lastName = e.trim() }" />
                </el-form-item>
            </div>
        </el-form-item>
        <el-form-item :label="$t('profile.shippingAddressEditLabelAddress')" prop="" class="nature-form-item">
            <div class="nature-form-group wrap">
                <el-form-item prop="country" class="nature-form-item-col12">
                    <el-select
                        v-model="form.country"
                        filterable
                        :placeholder="$t('profile.shippingAddressEditPlaceholderCountry')"
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
                <el-form-item prop="addressLineOne" class="nature-form-item-col12">
                    <el-input v-model="form.addressLineOne" :placeholder="$t('profile.shippingAddressEditPlaceholderAddress1')" class="nature-form-input input-default" @change="e => { form.addressLineOne = e.trim() }" />
                </el-form-item>
                <el-form-item prop="addressLineTwo" class="nature-form-item-col12">
                    <el-input v-model="form.addressLineTwo" :placeholder="$t('profile.shippingAddressEditPlaceholderAddress2')" class="nature-form-input input-default" @change="e => { form.addressLineTwo = e.trim() }" />
                </el-form-item>
                <div class="nature-form-group">
                    <el-form-item prop="city" class="nature-form-item">
                        <el-input v-model="form.city" :placeholder="$t('profile.shippingAddressEditPlaceholderCity')" class="nature-form-input input-default" @change="e => { form.city = e.trim() }" />
                    </el-form-item>
                    <div class="nature-form-group-center"></div>
                    <el-form-item prop="postal" class="nature-form-item">
                        <el-input v-model="form.postal" :placeholder="$t('profile.shippingAddressEditPlaceholderPostal')" class="nature-form-input input-default" @change="e => { form.postal = e.trim() }" />
                    </el-form-item>
                </div>
                <el-form-item prop="province" class="nature-form-item-col12">
                    <el-select
                        v-model="form.province"
                        filterable
                        :placeholder="$t('profile.shippingAddressEditPlaceholderProvince')"
                        class="nature-form-input select-default"
                    >
                        <el-option
                            v-for="item in locationData.provinceData"
                            :key="item.provinceId"
                            :value="item.provinceId"
                            :label="item.name"
                        />
                    </el-select>
                </el-form-item>
            </div>
        </el-form-item>
        <el-form-item :label="$t('profile.shippingAddressEditLabelPhone')" prop="phone" class="nature-form-item">
            <el-input v-model="form.phone" :placeholder="$t('profile.shippingAddressEditPlaceholderPhone')" class="nature-form-input input-default" @change="e => { form.phone = e.trim() }">
                <template #prepend>
                    <el-select
                      v-model="form.callingCode"
                      placeholder=""
                      style="width: 115px"
                    >
                        <el-option
                            v-for="item in countryData"
                            :key="item.countryId"
                            :value="item.callingCode"
                            :label="item.countryId + ' +' + item.callingCode"
                        />
                    </el-select>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item class="nature-form-buttons">
            <el-button id="profile-btn-shipping-address-cancel" class="button-default" @click="cancel">{{$t('profile.cancel')}}</el-button>
            <el-button id="profile-btn-shipping-address-save" type="primary" class="button-default" :loading="loading" @click="submit">{{$t('profile.save')}}</el-button>
        </el-form-item>
    </el-form>

    <div v-else class="nature-list">
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.shippingAddressLabelFirstName')}}</div>
            <div class="nature-item-value">{{ natureData.firstName || '-' }}</div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.shippingAddressLabelLastName')}}</div>
            <div class="nature-item-value">{{ natureData.lastName || '-' }}</div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.shippingAddressLabelAddress')}}</div>
            <div class="nature-item-value nature-item-value-group">
                <template v-if="natureData.country || natureData.province || natureData.city || natureData.addressLineOne || natureData.addressLineTwo || natureData.postal">
                    <span class="nature-item-value-item">{{ natureData.addressLineOne }}</span>
                    <br>
                    <span class="nature-item-value-item">{{ natureData.addressLineTwo }}</span>
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
            <div class="nature-item-label">{{$t('profile.shippingAddressLabelPhone')}}</div>
            <div class="nature-item-value direction-ltr">
                <!-- {{ natureData.phone || '-' }} -->
                <template v-if="natureData.callingCode || natureData.phone">
                    {{ natureData.callingCode ? ('+' + natureData.callingCode + ' ' + (natureData.phone || '')) : natureData.phone }}
                </template>
                <template v-else>
                    -
                </template>
            </div>
        </div>
        <div v-if="!isEdit" class="nature-item nature-buttons">
            <el-button type="text" class="button-default" @click="deleteAddress">Delete</el-button>
            <el-button class="button-default" :loading="loading" @click="edit">{{$t('profile.edit')}}</el-button>
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
