<script setup>
import { useUserStore } from '@/store/userState.js'
import { isName } from '@/util/validate.js'
import { checkResponseData, isEMpty, arrToDict } from "@/util/index.js"
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { userApi } = useApi()
const userStore = useUserStore()
const props = defineProps({
    natureData: {
        type: Object,
        default: () => ({})
    },
    userData: {
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
const isEdit = ref(false)
const formRef = ref()
const loading = ref(false)
const form = reactive({
    account: undefined,
    firstName: undefined,
    lastName: undefined,
    // 0 女性 FEMALE , 1 男性 MALE
    gender: undefined,
    location: undefined,
    biography: undefined
})
const nameMaxLength = ref(35)
const maxLength = ref(100)
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
        // ],
        gender: [
            {
            required: true,
            message: t('profile.generalEditRequiredGender'),
            trigger: 'change',
            }
        ],
        location: [
            {
            required: true,
            message: t('profile.generalEditRequiredLocation'),
            trigger: 'change',
            }
        ]
    }
}
const genderData = computed(() => {
    return [
        { value: '0', label: t('profile.generalEditDataGenderFemale') },
        { value: '1', label: t('profile.generalEditDataGenderMale') },
        { value: '2', label: t('profile.generalEditDataGenderNotTell') },
    ]
})
const genderDict = computed(() => {
    return arrToDict(genderData.value)
})
const emit = defineEmits(["updateData"])

// watch(props.natureData, (newCurrent, oldCurrent) => {
//     initForm()
// })

const edit = () => {
    Object.assign(form, props.natureData)
    isEdit.value = true
}
// 编辑用户基础信息
const submit = () => {
    formRef.value.validate(async valid => {
        if (!valid) return
        loading.value = true
        const param = Object.assign({}, form)
        const result = await userApi.editUserBasicInfo(param)
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
            <div class="profile-title">{{$t('profile.general')}}</div>
            <div class="profile-discribe">{{$t('profile.generalTitleMessage')}}</div>
        </div>
        <div class="profile-head-right">
            <el-button v-if="!isEdit" id="profile-btn-general-edit" class="button-default" @click="edit">{{$t('profile.edit')}}</el-button>
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
        <el-form-item :label="$t('profile.generalEditLableAccount')" prop="" class="nature-form-item">
            <el-input v-model="userData.loginAccount" class="nature-form-input input-default" disabled />
        </el-form-item>
        <el-form-item :label="$t('profile.generalEditLableDistributorID')" prop="" class="nature-form-item">
            <el-input v-model="userData.userNumber" class="nature-form-input input-default" disabled />
        </el-form-item>
        <el-form-item :label="$t('profile.generalEditLableName')" class="nature-form-item">
            <div class="nature-form-group">
                <el-form-item prop="firstName" class="nature-form-item">
                    <el-input v-model="form.firstName" :maxlength="nameMaxLength" class="nature-form-input input-default" @change="e => { form.firstName = e.trim() }" />
                </el-form-item>
                <div class="nature-form-group-center"></div>
                <el-form-item prop="lastName" class="nature-form-item">
                    <el-input v-model="form.lastName" :maxlength="nameMaxLength" class="nature-form-input input-default" @change="e => { form.lastName = e.trim() }" />
                </el-form-item>
            </div>
        </el-form-item>
        <el-form-item :label="$t('profile.generalEditLableGender')" prop="gender" class="nature-form-item">
            <el-radio-group v-model="form.gender" class="nature-form-input radio-default direction-ltr">
                <el-radio v-for="item in genderData" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('profile.generalEditLableLocation')" prop="location" class="nature-form-item">
            <el-select
                v-model="form.location"
                filterable
                placeholder=""
                class="nature-form-input select-default"
            >
                <el-option
                    v-for="item in countryData"
                    :key="item.countryId"
                    :value="item.countryId"
                    :label="item.name"
                />
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('profile.generalEditLableBiography')" prop="biography" class="nature-form-item">
            <el-input
                v-model="form.biography"
                type="textarea"
                :autosize="{ minRows: 2 }"
                :maxlength="maxLength"
                :placeholder="$t('profile.generalEditPlaceholderBiography')"
                class="nature-form-input input-default"
            />
            <div class="input-default-p" style="width: 100%;">{{$t('profile.generalEditDescribeBiographyBefore')}} 100 {{$t('profile.generalEditDescribeBiographyafter')}}</div>
        </el-form-item>
        <el-form-item class="nature-form-buttons">
            <el-button id="profile-btn-general-cancel" class="button-default" @click="cancel">{{$t('profile.cancel')}}</el-button>
            <el-button id="profile-btn-general-save" type="primary" class="button-default" :loading="loading" @click="submit">{{$t('profile.saveChanges')}}</el-button>
        </el-form-item>
    </el-form>

    <div v-else class="nature-list">
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.generalLableAccount')}}</div>
            <div class="nature-item-value">{{ userData.loginAccount || '-' }}</div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.generalLableDistributorID')}}</div>
            <div class="nature-item-value">{{ userData.userNumber || '-' }}</div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.generalLableFirstName')}}</div>
            <div class="nature-item-value">{{ natureData.firstName || '-' }}</div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.generalLableLastName')}}</div>
            <div class="nature-item-value">{{ natureData.lastName || '-' }}</div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.generalLableGender')}}</div>
            <div class="nature-item-value">{{ genderDict[natureData.gender] || '-' }}</div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.generalLableLocation')}}</div>
            <div class="nature-item-value">{{ countryDict[natureData.location] || '-' }}</div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.generalLableBiography')}}</div>
            <div class="nature-item-value">{{ natureData.biography || '-' }}</div>
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
