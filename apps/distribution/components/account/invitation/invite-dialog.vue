<script setup>
import { CloseBold, Check } from '@element-plus/icons-vue';
import { checkResponseData, copyToClipboard, arrToDict, errorMessage } from "@/util/index.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const isMobile = useIsMobile()
const { clientApi } = useApi()
const props = defineProps({
})
const attrs = useAttrs()
const form = ref({
    storeId: undefined
})
const isCopySuccess = ref(false)


const inviteData = reactive({
    // 分销员佣金比例
    distributorCommissionRateStr: '',
    bindingStoreList: []
})
const bindingStoreToObj = computed(() => {
    return arrToDict(inviteData.bindingStoreList, { value: 'storeId', label: null })
})
const inviteItemData = computed(() => {
     return bindingStoreToObj.value[form.value.storeId] || {}
})
// 邀请店铺下拉列表
function getInviteData() {
    clientApi.bind_listStoresToInvite().then(result => {
        const res = checkResponseData(result)
        if (res) {
            const bindingStoreList = res.bindingStoreList || []
            bindingStoreList.forEach(item => {
                item.label = item.storeName ? `${item.storeName}（${item.storeId}）` : item.storeId
            });
            inviteData.bindingStoreList = bindingStoreList
        }
    })
}
getInviteData()


const cancel = () => {
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
}
// 提交
const submit = () => {
    if (!inviteItemData.value.signupUrl) {
        errorMessage(t('invitation.inviteDialogMessageSelectStore'))
        return
    }

    const isCopy = copyToClipboard(inviteItemData.value.signupUrl)
    if (isCopy) {
        isCopySuccess.value = true
        setTimeout(() => {
            cancel()
        }, 500)
    }
}

</script>

<template>
  <div class="dialog-container">
    <el-dialog
    v-bind="$attrs"
    width="688px"
    :show-close="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :class="{ 'm': isMobile }"
    >
        <template #header="{ close }">
            <el-icon class="close-container" @click="close"><CloseBold /></el-icon>
            <span class="icon-container">
                <img src="@/assets/imgs/users-plus.svg" alt="">
            </span>
            <h1>{{$t('invitation.inviteDialogtitle')}}</h1>
        </template>

        <el-form
            :model="form"
            label-position="top"
            class="dialog-form"
            novalidate
        >
            <el-form-item :label="$t('invitation.inviteDialogLabelStore')" class="dialog-form-item">
                <el-select
                    v-model="form.storeId"
                    multiple
                    collapse-tags
                    :multiple-limit="10"
                    placeholder=""
                    class="select-default multiple h44"
                    popper-class="select-checkbox-popper-1779263932970"
                >
                    <div class="tertiary-span pl10 pr10 mb8">Note: you can select up to 10 affiliate programs at a time</div>
                    <el-option
                        v-for="item in inviteData.bindingStoreList"
                        :key="item.storeId"
                        :value="item.storeId"
                        :label="item.label"
                    >
                        <div class="flex items-center gap8">
                            <div class="base-icon lh0">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 0.5H12C13.933 0.5 15.5 2.067 15.5 4V12C15.5 13.933 13.933 15.5 12 15.5H4C2.067 15.5 0.5 13.933 0.5 12V4C0.5 2.067 2.067 0.5 4 0.5Z" stroke="#D0D5DD"/>
                                </svg>
                            </div>
                            <div class="select-icon lh0">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 4C0 1.79086 1.79086 0 4 0H12C14.2091 0 16 1.79086 16 4V12C16 14.2091 14.2091 16 12 16H4C1.79086 16 0 14.2091 0 12V4Z" fill="#5548FF"/>
                                    <path d="M12 5L6.5 10.5L4 8" stroke="white" stroke-width="1.6666" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <div><span class="black-span2">{{ item.storeName }}</span><span class="tertiary-span">（{{ item.storeId }}）</span></div>
                        </div>
                    </el-option>
                </el-select>
                <div class="tertiary-span f12 mt8">{{$t('invitation.inviteDialogDescribeStoreBefore')}} <span class="primary-span f12 fw600 direction-ltr direction-inline-block">10</span> {{$t('invitation.inviteDialogDescribeStoreafter')}}</div>
            </el-form-item>
            <el-form-item label="Choose your reward type" class="dialog-form-item">

            </el-form-item>
            <el-form-item :label="$t('invitation.inviteDialogLabelLink')" class="dialog-form-item">
                <el-input
                    v-model="inviteItemData.signupUrl"
                    class="dialog-form-input input-default"
                    readonly
                />
                <div class="tertiary-span f12 mt8">{{$t('invitation.inviteDialogDescribeLink')}}</div>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button v-if="!isMobile" id="invitation-btn-pc-dialog-cancel" class="dialog-footer-button button-default dialog-adaptive" @click="cancel">{{$t('invitation.inviteDialogButtonCancel')}}</el-button>
                <el-button type="primary" id="invitation-btn-dialog-copy" class="dialog-footer-button button-default dialog-adaptive" :disabled="!inviteData.bindingStoreList.length" @click="submit">
                    <template v-if="isCopySuccess" #icon>
                        <Check />
                    </template>
                    <template v-if="isCopySuccess">
                        {{$t('invitation.inviteDialogButtonCopied')}}
                    </template>
                    <template v-else>
                        {{$t('invitation.inviteDialogButtonCopyAndShare')}}
                    </template>
                </el-button>
                <el-button v-if="isMobile" id="invitation-btn-m-dialog-cancel" class="dialog-footer-button button-default dialog-adaptive" @click="cancel">{{$t('invitation.inviteDialogButtonCancel')}}</el-button>
            </div>
        </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
@import url("@/assets/css/element-reset/popper.scss");
</style>
<style lang="scss" scoped>
@import url("@/assets/css/element-reset/button.scss");
@import url("@/assets/css/element-reset/input.scss");
@import url("@/assets/css/element-reset/select.scss");
.black-span {
    color: #344054;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    &.f12 {
        font-size: 12px;
        line-height: 18px;
    }
    &.fw500 {
        font-weight: 500;
    }
}
.black-span2 {
    color: #182230;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
}
.tertiary-span {
    color: #667085;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    &.f12 {
        font-size: 12px;
        line-height: 18px;
    }
}
.primary-span {
    color: #5548FF;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    &.f12 {
        font-size: 12px;
        line-height: 18px;
    }
    &.fw600 {
        font-weight: 600;
    }
}
.dialog-container :deep(.el-dialog) {
    max-width: calc(100% - 16px);
    padding: 0;
    border-radius: 12px;
    box-shadow: 0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03);
    background-color: #FFF;
    background-image: url('@/assets/imgs/bg-cricles.svg');
    background-position: 0 0;
    background-repeat: no-repeat;
    &.m {
    .el-dialog__footer {
        padding: 24px 16px 16px;
    }
    .dialog-footer {
        display: block;
        .dialog-footer-button {
            width: 100%;
            + .dialog-footer-button {
                margin: 12px 0 0;
            }
        }
    }
    }
    .el-dialog__header {
        padding: 24px 24px 20px 24px;
        .close-container {
            position: absolute;
            top: 16px;
            right: 16px;
            padding: 10px;
            cursor: pointer;
            font-size: 24px;
            color: #98A2B3;
            &:hover {
                color: #5548FF;
            }
        }
        .icon-container {
            display: inline-block;
            padding: 11px;
            border-radius: 10px;
            border: 1px solid #E4E7EC;
            background: #FFF;
            box-shadow: 0px 0px 0px 1px rgba(16, 24, 40, 0.18) inset, 0px -2px 0px 0px rgba(16, 24, 40, 0.05) inset, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
            margin-bottom: 16px;
        }
        h1 {
            color: #101828;
            font-size: 18px;
            font-weight: 600;
            line-height: 28px; /* 155.556% */
        }
    }
    .el-dialog__body {
        padding: 0 24px;
    }
    .el-dialog__footer {
        padding: 32px 24px 24px;
    }
    .dialog-form {
        .dialog-form-item {
            margin-bottom: 0;
            + .dialog-form-item {
                margin-top: 20px;
            }
        }
        .el-form-item__label {
            color: #344054;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px; /* 142.857% */
            margin-bottom: 6px;
        }
        .dialog-form-input {
            .el-input__wrapper {
                background-color: #F9FAFB;
                .el-input__inner {
                    color: #5548FF;
                }
            }
        }
    }
    .dialog-footer {
        display: flex;
        justify-content: space-between;
        .dialog-footer-button {
            flex: 1;
            + .dialog-footer-button {
                margin: 0 0 0 12px;
            }
        }
    }
}
.rtl .dialog-container :deep(.el-dialog) {
    .el-dialog__header {
        .close-container {
            left: 16px;
            right: auto;
        }
    }

    .dialog-footer {
        .dialog-footer-button {
            + .dialog-footer-button {
                margin: 0 12px 0 0;
            }
        }
    }
}
</style>
