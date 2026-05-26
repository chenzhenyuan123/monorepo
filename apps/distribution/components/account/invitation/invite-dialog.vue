<script setup>
import { CloseBold, Check } from '@element-plus/icons-vue';
import { checkResponseData, copyToClipboard, arrToDict, errorMessage } from "@/util/index.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const isMobile = useIsMobile()
const { clientApi, joinApi } = useApi()
const props = defineProps({
})
const attrs = useAttrs()
const formData = ref({
    storeIdList: []
})
const storeMax = ref(10)


const bindingStoreList = ref([])
// 邀请店铺下拉列表
function getInviteData() {
    clientApi.bind_listStoresToInvite().then(result => {
        const res = checkResponseData(result)
        if (res) {
            bindingStoreList.value = res.bindingStoreList || []
        }
    })
}
getInviteData()


const invitationLink = ref('')
const loadingForCreat = ref(false)
// 创建邀请链接
function creatInvitationLink() {
    loadingForCreat.value =true
    const params = {
        storeIdList: formData.value.storeIdList,
        pattern: formData.value.pattern
    }
    return joinApi.creatInvitationLink(params).then(result => {
        invitationLink.value = checkResponseData(result) || ''
    }).finally(() => {
        loadingForCreat.value = false
    })
}
function clearInvitationLink() {
    invitationLink.value = ''
    isCopySuccess.value = false
}


const isCopySuccess = ref(false)
// 提交
async function submit() {
    if (!invitationLink.value) {
        await creatInvitationLink()
    }
    if (invitationLink.value && !isCopySuccess.value) {
        const isCopy = copyToClipboard(invitationLink.value)
        if (isCopy) {
            isCopySuccess.value = true
        }
    }
}
function cancel() {
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
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
            :model="formData"
            rules
            label-position="top"
            class="dialog-form"
            novalidate
        >
            <el-form-item :label="$t('invitation.inviteDialogLabelStore')" class="dialog-form-item" required>
                <el-select
                    v-model="formData.storeIdList"
                    multiple
                    collapse-tags
                    :multiple-limit="storeMax"
                    placeholder=""
                    class="select-default multiple h44"
                    popper-class="select-checkbox-popper-1779263932970"
                    @change="clearInvitationLink"
                >
                    <div class="tertiary-span pl10 pr10 mb8">{{$t('invitation.inviteDialogStoreMax', { num: storeMax })}}</div>
                    <el-option v-for="item in bindingStoreList" :key="item.storeId" :value="item.storeId">
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
                            <div class="whitespace-normal"><span class="black-span2">{{ item.storeName }}</span><span class="tertiary-span">（{{ item.storeId }}）</span></div>
                        </div>
                    </el-option>
                </el-select>
                <div class="tertiary-span f12 mt8">{{$t('invitation.inviteDialogDescribeStoreBefore')}} <span class="primary-span f12 fw600 direction-ltr direction-inline-block">10</span> {{$t('invitation.inviteDialogDescribeStoreafter')}}</div>
            </el-form-item>
            <el-form-item :label="$t('invitation.inviteDialogLabelType')" class="dialog-form-item" required>
                <el-radio-group v-model="formData.pattern" class="radio-20-1779342400880" @change="clearInvitationLink">
                    <el-radio label="parent" class="w-full h-auto mb12" style="margin-right: 0">
                        <div class="whitespace-normal">
                            <div class="black-span fw500">{{$t('invitation.RewardTypeDataHierarchical')}}</div>
                            <div class="tertiary-span f12">{{$t('invitation.inviteDialogTypeDescHierarchical')}}</div>
                        </div>
                    </el-radio>
                    <el-radio label="peer" class="h-auto">
                        <div class="whitespace-normal">
                            <div class="black-span fw500">{{$t('invitation.RewardTypeDataPeer')}}</div>
                            <div class="tertiary-span f12">{{$t('invitation.inviteDialogTypeDescPeer')}}</div>
                        </div>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('invitation.inviteDialogLabelLink')" class="dialog-form-item">
                <el-input
                    v-model="invitationLink"
                    class="dialog-form-input input-default"
                    readonly
                >
                    <template #suffix>
                        <div v-if="invitationLink" class="lh0 cursor-pointer" @click="copyToClipboard(invitationLink)">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 2H9.73333C11.2268 2 11.9735 2 12.544 2.29065C13.0457 2.54631 13.4537 2.95426 13.7094 3.45603C14 4.02646 14 4.77319 14 6.26667V11M4.13333 14H9.53333C10.2801 14 10.6534 14 10.9387 13.8547C11.1895 13.7268 11.3935 13.5229 11.5213 13.272C11.6667 12.9868 11.6667 12.6134 11.6667 11.8667V6.46667C11.6667 5.71993 11.6667 5.34656 11.5213 5.06135C11.3935 4.81046 11.1895 4.60649 10.9387 4.47866C10.6534 4.33333 10.2801 4.33333 9.53333 4.33333H4.13333C3.3866 4.33333 3.01323 4.33333 2.72801 4.47866C2.47713 4.60649 2.27316 4.81046 2.14532 5.06135C2 5.34656 2 5.71993 2 6.46667V11.8667C2 12.6134 2 12.9868 2.14532 13.272C2.27316 13.5229 2.47713 13.7268 2.72801 13.8547C3.01323 14 3.3866 14 4.13333 14Z" stroke="#667085" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </template>
                </el-input>
                <div class="tertiary-span f12 mt8">{{$t('invitation.inviteDialogDescribeLink')}}</div>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button
                  type="primary"
                  id="invitation-btn-dialog-copy"
                  class="dialog-footer-button button-default dialog-adaptive"
                  :loading="loadingForCreat"
                  :disabled="!(formData.storeIdList && formData.storeIdList.length && formData.pattern)"
                  @click="submit"
                >
                    <template v-if="isCopySuccess" #icon>
                        <Check />
                    </template>
                    <template v-if="isCopySuccess">
                        {{$t('invitation.inviteDialogButtonCopied')}}
                    </template>
                    <template v-else>
                        {{$t('invitation.inviteDialogButtonCreatAndCopy')}}
                    </template>
                </el-button>
                <el-button id="invitation-btn-dialog-cancel" class="dialog-footer-button button-default dialog-adaptive" @click="cancel">{{$t('invitation.inviteDialogButtonCancel')}}</el-button>
            </div>
        </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
@use "@/assets/css/element-reset/popper.scss" as *;
</style>
<style lang="scss" scoped>
@use "@/assets/css/element-reset/button.scss" as *;
@use "@/assets/css/element-reset/input.scss" as *;
@use "@/assets/css/element-reset/select.scss" as *;
@use "@/assets/css/element-reset/radio.scss" as *;
@use "@flylinking/ui/styles/css/radix.scss" as *;
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
            &.is-required {
                .el-form-item__label {
                    &:before {
                        content: none;
                    }
                    &:after {
                        content: "*";
                        color: #5548FF;
                        padding: 0 2px;
                    }
                }
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
        flex-direction: row-reverse;
        gap: 12px;
        .dialog-footer-button {
            flex: 1;
            margin: 0;
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
}
</style>
