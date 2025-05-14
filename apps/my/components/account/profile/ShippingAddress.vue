<script setup>
import { useUserStore } from '@/store/userState.js'
import { checkResponseData, isEMpty, arrToDict } from "@/util/index.js"

const { userApi } = useApi()
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
const formRef = ref()
const loading = ref(false)
const form = reactive({
    firstName: undefined,
    lastName: undefined,
    country: undefined,
    province: undefined,
    city: undefined,
    addressLineOne: undefined,
    addressLineTwo: undefined,
    postal: undefined,
    callingCode: undefined,
    phone: undefined
})
const rules = reactive({
})
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
const emit = defineEmits(["updateData"])

watch(props.natureData, (newCurrent, oldCurrent) => {
    if (props.natureData.country) getBaseProvinceByCountry(props.natureData.country)
})

const edit = () => {
    Object.assign(form, props.natureData)
    isEdit.value = true
    // if (form.country) getBaseProvinceByCountry(form.country)
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
    getBaseProvinceByCountry(form.country)
    form.province = undefined
    form.callingCode = countryToCallingCode.value[form.country]
}
// 编辑用户基础信息
const submit = () => {
    formRef.value.validate(async valid => {
        if (!valid) return
        loading.value = true
        const param = Object.assign({}, form)
        const result = await userApi.editUserShippingInfo(param)
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
            <div class="profile-title">{{$t('profile.shippingAddress')}}</div>
            <div class="profile-discribe">{{$t('profile.shippingAddressTitleMessage')}}</div>
        </div>
        <div class="profile-head-right">
            <el-button v-if="!isEdit" id="profile-btn-shipping-address-edit" class="button-default" @click="edit">{{$t('profile.edit')}}</el-button>
        </div>
    </div>

    <el-form
        v-if="isEdit"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="auto"
        class="nature-form"
        novalidate
    >
        <el-form-item :label="$t('profile.shippingAddressEditLabelName')" class="nature-form-item">
            <div class="nature-form-group">
                <el-form-item prop="" class="nature-form-item">
                    <el-input v-model="form.firstName" class="nature-form-input input-default" @change="e => { form.firstName = e.trim() }" />
                </el-form-item>
                <div class="flex-center-8"></div>
                <el-form-item prop="" class="nature-form-item">
                    <el-input v-model="form.lastName" class="nature-form-input input-default" @change="e => { form.lastName = e.trim() }" />
                </el-form-item>
            </div>
        </el-form-item>
        <el-form-item :label="$t('profile.shippingAddressEditLabelAddress')" prop="" class="nature-form-item">
            <div class="nature-form-group wrap">
                <el-form-item prop="" class="nature-form-item-col12">
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
                <el-form-item prop="" class="nature-form-item-col12">
                    <el-input v-model="form.addressLineOne" :placeholder="$t('profile.shippingAddressEditPlaceholderAddress1')" class="nature-form-input input-default" @change="e => { form.addressLineOne = e.trim() }" />
                </el-form-item>
                <el-form-item prop="" class="nature-form-item-col12">
                    <el-input v-model="form.addressLineTwo" :placeholder="$t('profile.shippingAddressEditPlaceholderAddress2')" class="nature-form-input input-default" @change="e => { form.addressLineTwo = e.trim() }" />
                </el-form-item>
                <div class="nature-form-group">
                    <el-form-item prop="" class="nature-form-item">
                        <el-input v-model="form.city" :placeholder="$t('profile.shippingAddressEditPlaceholderCity')" class="nature-form-input input-default" @change="e => { form.city = e.trim() }" />
                    </el-form-item>
                    <div class="flex-center-8"></div>
                    <el-form-item prop="" class="nature-form-item">
                        <el-input v-model="form.postal" :placeholder="$t('profile.shippingAddressEditPlaceholderPostal')" class="nature-form-input input-default" @change="e => { form.postal = e.trim() }" />
                    </el-form-item>
                </div>
                <el-form-item prop="" class="nature-form-item-col12">
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
        <el-form-item :label="$t('profile.shippingAddressEditLabelPhone')" prop="" class="nature-form-item">
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
            <div class="flex-center-12"></div>
            <el-button id="profile-btn-shipping-address-save" type="primary" class="button-default" :loading="loading" @click="submit">{{$t('profile.saveChanges')}}</el-button>
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
