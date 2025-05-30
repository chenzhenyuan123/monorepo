<script setup>
import { useI18n } from "vue-i18n";
import { useUserStore } from '@/store/userState.js'
import { checkResponseData, isEMpty, arrToDict } from "@/util/index.js"
import {
    hasChinese,
    hasArabic,
    isValidZipcode,
} from "@/util/validate";
import {isUseless} from "@flylinking/core/utils/dataUtil";

const { t, locale } = useI18n();
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


const isShowDeleteDialog = ref(false)
const showDeleteDialog = () => {
    isShowDeleteDialog.value = true
}

const countryToCallingCode = computed(() => {
    return arrToDict(props.countryData, { value: 'countryId', label: 'callingCode' })
})
const isEdit = ref(false)
const formValidateRef = ref(null)
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
    phone: undefined,
    defaultAddress: undefined,
})
const rules = () => {
    return {
        "firstName": [
            {
                asyncValidator(rule, value, cb) {
                    if (!value)
                        return cb(new Error(t("profile.firstNameRequired")));
                    else {
                        if (hasChinese(value)){
                            return cb(new Error(t("profile.hasChineseLimit")))
                        } else if (hasArabic(value)){
                            return cb(new Error(t("profile.hasArabicLimit")))
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
                        return cb(new Error(t("profile.lastNameRequired")));
                    else {
                        if (hasChinese(value)){
                            return cb(new Error(t("profile.hasChineseLimit")))
                        } else if (hasArabic(value)){
                            return cb(new Error(t("profile.hasArabicLimit")))
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
                    if (!value) return cb(new Error(t("profile.CountryRequired")));
                    cb();
                },
                trigger: "change",
            },
        ],
        "addressLineOne": [
            {
                asyncValidator(rule, value, cb) {
                    if (!value)
                        return cb(new Error(t("profile.AddressRequired")));
                    else {
                        if (hasChinese(value)){
                            return cb(new Error(t("profile.hasChineseLimit")))
                        } else if (hasArabic(value)){
                            return cb(new Error(t("profile.hasArabicLimit")))
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
                            return cb(new Error(t("profile.hasChineseLimit")))
                        } else if (hasArabic(value)){
                            return cb(new Error(t("profile.hasArabicLimit")))
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
                        return cb(new Error(t("profile.CityRequired")));
                    else {
                        if (hasChinese(value)){
                            return cb(new Error(t("profile.hasChineseLimit")))
                        } else if (hasArabic(value)){
                            return cb(new Error(t("profile.hasArabicLimit")))
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
                        return cb(new Error(t("profile.ZIPRequired")));
                    else {
                        if (!isValidZipcode(value)){
                            return cb(new Error(t("profile.zipcodeLimit")))
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
        "phone": [
            {
                asyncValidator(rule, value, cb) {
                    if (!value)
                        return cb(new Error(t("profile.MobileNumberRequired")));
                    cb();
                },
                trigger: "change",
            },
        ],
    }
}

const edit = () => {
    Object.assign(form.value, props.natureData)
    if (form.value.defaultAddress === 1) {
        form.value.defaultAddressBlo = true
    } else {
        form.value.defaultAddressBlo = false
    }
    if (form.value.country) getBaseProvinceByCountry(form.value.country)
    isEdit.value = true
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
  const result = await userApi.getBaseProvinceByCountry(countryId)
  const res = checkResponseData(result)
  if (res) {
      // res.forEach(item => item.name = item.name || item.enUs)
    provinceData.value = res
  }
}
const changeCountry = () => {
    getBaseProvinceByCountry(form.value.country)
    form.value.province = undefined
    form.value.callingCode = countryToCallingCode.value[form.value.country]
}


const setGoogleMapData = (data) => {
    if (!isUseless(data.address_line)) form.value.addressLineOne = data.address_line;
    if (!isUseless(data.address_line_2)) form.value.addressLineTwo = data.address_line_2;
    if (!isUseless(data.city)) form.value.city = data.city;
    if (!isUseless(data.zipcode)) form.value.postal = data.zipcode;
    provinceData.value.some(item => {
        if (item.name === data.state) {
            form.value.province = item.provinceId;
            return true
        }
    })
}

const addressChange = (val) => {
    form.value.addressLineOne = val;
}
// 编辑用户基础信息
const submit = () => {
    formValidateRef.value?.formRef.validate(async valid => {
        if (!valid) return
        loading.value = true
        const param = Object.assign({}, form.value)
        if (form.value.defaultAddressBlo) {
            param.defaultAddress = 1
        } else {
            param.defaultAddress = 0
        }
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
    const result = await userApi.deleteUserShippingInfoById(props.natureData.id)
    const res = checkResponseData(result, 'NO_RETURN_DATA')
    if (res) {
        emit('updateData')
    }
}

onMounted(() => {
    if (props.isAdd) {
        form.value = {}
    }
    if (props.natureData.country) getBaseProvinceByCountry(props.natureData.country)
})

userStore.getUserInfo()

</script>

<template>

    <FormValidate
        v-if="isEdit || isAdd"
        ref="formValidateRef"
        :model="form"
        :rules="rules()"
        label-width="auto"
        class="nature-form"
        novalidate
    >
        <FormGroup :label="$t('profile.shippingAddressEditLabelName')" class="nature-form-item">
            <div class="nature-form-group">
                <FormGroupItem prop="firstName" class="nature-form-item">
                    <el-input
                            v-model="form.firstName"
                            :placeholder="$t('profile.shippingAddressLabelFirstName')"
                            class="nature-form-input input-default"
                            @change="e => { form.firstName = e.trim() }"
                    />
                </FormGroupItem>
                <div class="flex-center-8"></div>
                <FormGroupItem prop="lastName" class="nature-form-item">
                    <el-input
                            v-model="form.lastName"
                            :placeholder="$t('profile.shippingAddressLabelLastName')"
                            class="nature-form-input
                            input-default"
                            @change="e => { form.lastName = e.trim() }"
                    />
                </FormGroupItem>
            </div>
        </FormGroup>
        <FormGroup :label="$t('profile.shippingAddressEditLabelAddress')" prop="" class="nature-form-item">
            <div class="nature-form-group wrap">
                <FormGroupItem prop="country" class="nature-form-item-col12">
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
                </FormGroupItem>
                <FormGroupItem prop="addressLineOne" class="nature-form-item-col12">
<!--                    <el-input v-model="form.addressLineOne" :placeholder="$t('profile.shippingAddressEditPlaceholderAddress1')" class="nature-form-input input-default" @change="e => { form.addressLineOne = e.trim() }" />-->
                    <AddressComplete
                            :placeholder="$t('profile.shippingAddressEditPlaceholderAddress1')"
                            :country="form.country"
                            :lang="locale"
                            :value="form.addressLineOne"
                            @selected="setGoogleMapData"
                            @change="addressChange"
                    />
                </FormGroupItem>
                <FormGroupItem prop="addressLineTwo" class="nature-form-item-col12">
                    <el-input
                            v-model="form.addressLineTwo"
                            :placeholder="$t('profile.shippingAddressEditPlaceholderAddress2')"
                            class="nature-form-input input-default"
                            @change="e => { form.addressLineTwo = e.trim() }"
                    />
                </FormGroupItem>
                <div class="nature-form-group">
                    <FormGroupItem prop="city" class="nature-form-item">
                        <el-input v-model="form.city" :placeholder="$t('profile.shippingAddressEditPlaceholderCity')" class="nature-form-input input-default" @change="e => { form.city = e.trim() }" />
                    </FormGroupItem>
                    <div class="flex-center-8"></div>
                    <FormGroupItem prop="postal" class="nature-form-item">
                        <el-input v-model="form.postal" :placeholder="$t('profile.shippingAddressEditPlaceholderPostal')" class="nature-form-input input-default" @change="e => { form.postal = e.trim() }" />
                    </FormGroupItem>
                </div>
                <FormGroupItem prop="province" class="nature-form-item-col12">
                    <el-select
                        v-model="form.province"
                        filterable
                        :placeholder="$t('profile.shippingAddressEditPlaceholderProvince')"
                        class="nature-form-input select-default"
                    >
                        <el-option
                            v-for="item in provinceData"
                            :key="item.provinceId"
                            :value="item.provinceId"
                            :label="item.name"
                        />
                    </el-select>
                </FormGroupItem>
            </div>
        </FormGroup>
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

        <el-form-item width="100%" class="nature-form-item">
            <el-checkbox v-model="form.defaultAddressBlo" label="As the default shipping address" size="large" />
        </el-form-item>

        <el-form-item class="nature-form-buttons">
            <el-button id="profile-btn-shipping-address-cancel" class="button-default" @click="cancel">{{$t('profile.cancel')}}</el-button>
            <div class="flex-center-12"></div>
            <el-button id="profile-btn-shipping-address-save" type="primary" class="button-default" :loading="loading" @click="submit">{{$t('profile.save')}}</el-button>
        </el-form-item>
    </FormValidate>

    <div v-else class="nature-list">
        <div v-if="natureData.defaultAddress === 1" class="nature-position-right-icon">
            Default address
        </div>
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
            <el-button type="text" class="button-default" @click="showDeleteDialog">{{$t('profile.delete')}}</el-button>
            <div class="flex-center-12"></div>
            <el-button class="button-default" :loading="loading" @click="edit">{{$t('profile.edit')}}</el-button>
        </div>
    </div>

    <AccountBuyerDeleteDialog
            v-if="isShowDeleteDialog"
            v-model="isShowDeleteDialog"
            @delete="deleteAddress"
    ></AccountBuyerDeleteDialog>
</template>

<style lang="scss" scoped>
    @use "@/assets/css/element-reset/button.scss" as *;
    @use "@/assets/css/element-reset/input.scss" as *;
    @use "@/assets/css/element-reset/select.scss" as *;
    @use "@/assets/css/element-reset/radio.scss" as *;
    @use "./form.scss" as *;
</style>
