<script setup>
import { CloseBold, Check } from '@element-plus/icons-vue';
import { checkResponseData, arrToDict, errorMessage, currencyFormat, successMessage } from "@/util/index.js";
import { useI18n } from "vue-i18n";
import {formatCreditCardNumber, normalCreditCardNumber} from "@/util/dataUtil";
import { CircleCheck } from '@element-plus/icons-vue';

const { t } = useI18n();
const router = useRouter()
const isMobile = useIsMobile()
const attrs = useAttrs()
const { withdrawApi } = useApi()
const emit = defineEmits(["submit"])

const formRef = ref()
const form = reactive({
    verificationCode: '',
})
const createCodeData = reactive({
    loading: false,
    createCodeError: false,
})
const checkResultData = reactive({
    loading: false,
    code: '',
    numberTimes: 1,
    max: 5,
    errorForExceedingLimit: false,
    isVerify: undefined,
    checkCode: undefined,
})

// 校验验证码
const validateCode = (rule, value, callback) => {
    if (checkResultData.errorForExceedingLimit || createCodeData.createCodeError) {
        callback(new Error(t('withdraw.verifyCodeDialogValidateCodeExceedingLimit')))
    } else if (value && checkResultData.isVerify === false) {
        callback(new Error(t('withdraw.verifyCodeDialogValidateCodeError', { times: checkResultData.max - checkResultData.numberTimes })))
    } else {
        callback()
    }
}
const rules = () => {
    return {
        verificationCode: [
            {
                validator: validateCode,
                trigger: 'change'
            },
            {
                required: true,
                message: t('withdraw.verifyCodeDialogValidateCodeRequired'),
                trigger: 'change',
            },
        ],
    }
}

const countdownData = reactive({
    // 显示延时时间
    timerShow: false,
    // 轮循时间
    times: 120,
    // 120 秒内获取验证码
    timerCount: 120,
    timer: null,
})


/**
 * 倒计时
 */
const setTimeoutForCountdown = (times) => {
    // 取消倒计时
    clearTimeoutForCountdown()

    // 重置时间
    countdownData.timerCount = times || countdownData.times
    countdownData.timerShow = true
    countdownData.timer = setInterval(() => {
        if (countdownData.timerCount > 1) {
            countdownData.timerCount--
        } else {
            // 取消倒计时
            clearTimeoutForCountdown()
        }
    }, 1000)
}
/**
 * 取消倒计时
 */
const clearTimeoutForCountdown = () => {
    clearInterval(countdownData.timer)
    countdownData.timerShow = false
}

// 验证码创建
const createCode = async() => {
    if (form.verificationCode) form.verificationCode = ''
    createCodeData.loading = true
    const result = await withdrawApi.verification_code_create()
    const res = checkResponseData(result)

    if (res) {
        if (res.isSuccess) {
            successMessage(t('withdraw.verifyCodeDialogSendSuccessMessage'))
            // 倒计时
            setTimeoutForCountdown()
        } else {
            // 倒计时
            setTimeoutForCountdown(res.nextSendCountDown)
        }
        createCodeData.createCodeError = false
    } else if (result.code === 'FA0011') {
        createCodeData.createCodeError = true
        formRef.value.validateField('verificationCode')
    }
    createCodeData.loading = false
}
// 校验验证码是否正确
const verifyCode = async() => {
    checkResultData.code = normalCreditCardNumber(form.verificationCode)
    const result = await withdrawApi.verification_code_verify(checkResultData.code)
    const res = checkResponseData(result)
    if (res) {
        checkResultData.isVerify = !!res.isVerify
        checkResultData.numberTimes = res.numberTimes
        checkResultData.checkCode = res.checkCode
        return res.isVerify
    } else {
        checkResultData.errorForExceedingLimit = true
        return false
    }
}

// 重置code正确校验
const removeCodeVerify = () => {
    checkResultData.isVerify = undefined
}

const submit = () => {
    if (checkResultData.isVerify) {
        console.log('isVerify')
        return
    }
    // if (checkResultData.errorForExceedingLimit) {
    //     console.log('errorForExceedingLimit')
    //     return
    // }
    formRef.value.validate(async (valid) => {
        if (!valid) {
            console.log('error submit!!');
            return false;
        }
        checkResultData.loading = true
        verifyCode().then(isVerify => {
            if (isVerify) {
                const t = setTimeout(() => {
                    clearTimeout(t)
                    const fn = attrs['onUpdate:modelValue']
                    fn && fn(false)
                    emit('submit', checkResultData.checkCode)
                }, 500)
            } else {
                formRef.value.validateField('verificationCode')
            }
        }).finally(() => {
            checkResultData.loading = false
        })
    })
}

const cancel = () => {
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
    // jumpToWallet()
}

onMounted(()=>{
    createCode()
})

onUnmounted(()=>{
    // 取消倒计时
    clearTimeoutForCountdown()
})

</script>

<template>
  <div>
    <el-dialog
    v-bind="$attrs"
    width="408px"
    :show-close="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :class="{ 'm': isMobile }"
    >
        <!-- <template #header="{ close }"> -->
            <!-- <el-icon class="close-container" @click="close"><CloseBold /></el-icon> -->
            <template #header="">
            <span class="icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z" stroke="#5548FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <h1>
                {{ $t('withdraw.verifyCodeDialogTitle') }}
            </h1>
        </template>

        <p class="dialog-p center mb20">
            {{ $t('withdraw.verifyCodeDialogP1') }}
        </p>
        <el-form
                ref="formRef"
                :model="form"
                :rules="rules()"
                :validate-on-rule-change="false"
                label-position="top"
                class="form submit-form"
                novalidate
        >
            <el-form-item prop="verificationCode" class="form-item">
                <el-input
                        v-model="form.verificationCode"
                        :maxlength="9"
                        class="form-input input-default direction-ltr-input"
                        placeholder="0000 0000"
                        @input="e => { form.verificationCode = formatCreditCardNumber(e);removeCodeVerify(); }"
                />
            </el-form-item>
        </el-form>
        <p v-if="checkResultData.errorForExceedingLimit || createCodeData.createCodeError" class="dialog-p mb6">
            {{ $t('withdraw.verifyCodeDialogP2') }}
        </p>
        <template v-else>
            <p v-if="checkResultData.isVerify === false" class="dialog-p mb6">
                {{ $t('withdraw.verifyCodeDialogP3', { max: checkResultData.max }) }}
            </p>
            <p class="dialog-p mb6">
                {{ $t('withdraw.verifyCodeDialogP4_1') }}
                <el-link underline="never" :disabled="createCodeData.loading || countdownData.timerShow" @click="createCode">
                    {{ countdownData.timerShow ? $t('withdraw.verifyCodeDialogP4_countdown', { sec: countdownData.timerCount }) : $t('withdraw.verifyCodeDialogP4_2') }}
                </el-link>
            </p>
        </template>

        <template #footer>
            <div class="dialog-footer">
                <el-button
                        type="primary"
                        class="button-default dialog-adaptive"
                        :loading="checkResultData.loading"
                        :icon="checkResultData.isVerify && CircleCheck"
                        @click="submit"
                >
                    {{ $t('withdraw.verifyCodeDialogButtonSubmit') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import url("@/assets/css/element-reset/button.scss");
@import url("@/assets/css/element-reset/input.scss");
@import url("@/assets/css/element-reset/select.scss");
:deep(.el-dialog) {
    max-width: calc(100% - 16px);
    padding: 0;
    border-radius: 12px;
    box-shadow: 0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03);
    background-color: #FFF;
    background-image: url('@/assets/imgs/bg-circle-center.svg');
    background-position: center 0;
    background-repeat: no-repeat;
    &.m {
        .el-dialog__footer {
            padding: 24px 16px 16px;
        }
    }
    .el-dialog__header {
        // padding: 32px 32px 16px 32px;
        padding: 32px 24px 4px 24px;
        text-align: center;
        .icon-container {
            display: inline-block;
            padding: 12px;
            border-radius: 50%;
            background: #E7E6FF;
            margin-bottom: 24px;
        }
        .el-dialog__headerbtn {
            z-index: 11
        }

        .el-dialog__headerbtn .el-dialog__close {
            color: #98a2b3;
            font-size: 24px;
            margin: 12px 12px 0 0
        }
        h1 {
            color: #101828;
            font-size: 18px;
            font-weight: 600;
            line-height: 28px; /* 155.556% */
        }
    }
    .el-dialog__body {
        padding: 0 44px;
    }
    .el-dialog__footer {
        /*padding: 32px 24px;*/
        padding: 26px 24px 32px;
    }
    .mb20 {
        margin-bottom: 20px;
    }
    .mb6 {
        margin-bottom: 6px;
    }
    .dialog-p {
        color: #475467;
        /*text-align: left;*/
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 150% */
        &.center {
            text-align: center;
        }
        .el-link {
            text-decoration-line: underline;
            text-decoration-style: solid;
            text-decoration-skip-ink: none;
            text-decoration-thickness: auto;
            text-underline-offset: auto;
            text-underline-position: from-font;
        }
    }
    .el-form-item {
        margin-bottom: 6px;
        .el-form-item__error {
            position: static;
            color: #D92D20;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
            padding-top: 6px;
        }
    }
    .dialog-footer {
    }
}
</style>
