<script setup>
import { useUserStore } from '@/store/userState.js'
import { isEmail } from '@/util/validate.js'
import { checkResponseData } from "@/util/index.js"
import { useI18n } from "vue-i18n";
import {checkEmail, checkEmailLength} from "@flylinking/core/utils/validate";

const { t } = useI18n();
const { userApi } = useApi()
const userStore = useUserStore()
const props = defineProps({
    natureData: {
        type: Object,
        default: () => ({})
    }
})
const isEdit = ref(false)
const formRef = ref()
const loading = ref(false)
const form = reactive({
    email: undefined,
    whatsApp: undefined,
    instagram: undefined,
    line: undefined,
    skype: undefined
})

// 校验邮件
const validateEmail = (rule, value, callback) => {
    if (!(checkEmailLength(value) && checkEmail(value))){
        callback(new Error(t('profile.contactEditValidateEmail')))
    } else {
        callback()
    }
}

const rules = computed(() => {
    return {
        email: [
            { type: 'email', trigger: 'change', message: t('profile.contactEditValidateEmail') },
            { validator: validateEmail, trigger: 'change' },
        ]
    }
})
const emit = defineEmits(["updateData"])

// watch(props.natureData, (newCurrent, oldCurrent) => {
//     initForm()
// })

const edit = () => {
    Object.assign(form, props.natureData)
    isEdit.value = true
}
// 编辑用户联系方式信息
const submit = () => {
    formRef.value.validate(async valid => {
        if (!valid) return
        loading.value = true
        const param = Object.assign({}, form)
        const result = await userApi.editUserContactInfo(param)
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
            <div class="profile-title">{{$t('profile.contact')}}</div>
            <div class="profile-discribe">{{$t('profile.contactTitleMessage')}}</div>
        </div>
        <div class="profile-head-right">
            <el-button v-if="!isEdit" id="profile-btn-contact-edit" class="button-default" @click="edit">{{$t('profile.edit')}}</el-button>
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
        <el-form-item :label="$t('profile.contactEditLabelEmail')" prop="email" class="nature-form-item">
            <el-input v-model="form.email" maxlength="254" class="nature-form-input input-default" @change="e => { form.email = e.trim() }" />
        </el-form-item>
        <el-form-item :label="$t('profile.contactEditLabelWhatsApp')" prop="whatsApp" class="nature-form-item">
            <el-input v-model="form.whatsApp" class="nature-form-input input-default" @change="e => { form.whatsApp = e.trim() }" />
        </el-form-item>
        <el-form-item :label="$t('profile.contactEditLabelInstagram')" prop="instagram" class="nature-form-item">
            <el-input v-model="form.instagram" class="nature-form-input input-default" @change="e => { form.instagram = e.trim() }" />
        </el-form-item>
        <el-form-item :label="$t('profile.contactEditLabelLine')" prop="line" class="nature-form-item">
            <el-input v-model="form.line" class="nature-form-input input-default" @change="e => { form.line = e.trim() }" />
        </el-form-item>
        <el-form-item :label="$t('profile.contactEditLabelSkype')" prop="skype" class="nature-form-item">
            <el-input v-model="form.skype" class="nature-form-input input-default" @change="e => { form.skype = e.trim() }" />
        </el-form-item>
        <el-form-item class="nature-form-buttons">
            <el-button id="profile-btn-contact-cancel" class="button-default" @click="cancel">{{$t('profile.cancel')}}</el-button>
            <div class="flex-center-12"></div>
            <el-button id="profile-btn-contact-save" type="primary" class="button-default" :loading="loading" @click="submit">{{$t('profile.saveChanges')}}</el-button>
        </el-form-item>
    </el-form>

    <div v-else class="nature-list">
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.contactLabelEmail')}}</div>
            <div class="nature-item-value">{{ natureData.email || '-' }}</div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.contactLabelWhatsApp')}}</div>
            <div class="nature-item-value">{{ natureData.whatsApp || '-' }}</div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.contactLabelInstagram')}}</div>
            <div class="nature-item-value">{{ natureData.instagram || '-' }}</div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.contactLabelLine')}}</div>
            <div class="nature-item-value">{{ natureData.line || '-' }}</div>
        </div>
        <div class="nature-item">
            <div class="nature-item-label">{{$t('profile.contactLabelSkype')}}</div>
            <div class="nature-item-value">{{ natureData.skype || '-' }}</div>
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