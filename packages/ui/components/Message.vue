<script setup>
import { COMMON } from "@flylinking/core"

const props = defineProps({
    type: {
        type: String,
        default: 'info'
    },
    isClose: {
        type: Boolean,
        default: false
    }
})

const messageData = reactive({
    arr: [
        { value: 'info', label: '信息', class: 'message-type-info' },
        { value: 'success', label: '成功', class: 'message-type-success' },
        { value: 'warn', label: '警告', class: 'message-type-warn' },
        { value: 'error', label: '错误', class: 'message-type-error' },
    ]
})

const messageDict = computed(() => {
    return COMMON.arrToDict(messageData.arr, { label: null })
});

const messageTypeClass = computed(() => {
    return messageDict.value[props.type].class
});

const hideBtn = () => {
    emit('hideBtn', true);
}
</script>

<template>
    <div class="message" :class="[messageTypeClass]">
        <div class="icon">
            <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"
                fill="none">
                <g opacity="0.3">
                    <path
                        d="M5.50033 18.0001C5.50033 11.0965 11.0968 5.50008 18.0003 5.50008C24.9039 5.50008 30.5003 11.0965 30.5003 18.0001C30.5003 24.9036 24.9039 30.5001 18.0003 30.5001C11.0968 30.5001 5.50033 24.9036 5.50033 18.0001Z"
                        stroke="#079455" stroke-width="1.66667" />
                </g>
                <g opacity="0.1">
                    <path
                        d="M1.33333 18C1.33333 8.79525 8.79525 1.33333 18 1.33333C27.2047 1.33333 34.6667 8.79525 34.6667 18C34.6667 27.2047 27.2047 34.6667 18 34.6667C8.79525 34.6667 1.33333 27.2047 1.33333 18Z"
                        stroke="#079455" stroke-width="1.66667" />
                </g>
                <g clip-path="url(#clip0_2654_2994)">
                    <path
                        d="M14.2503 18.0001L16.7503 20.5001L21.7503 15.5001M26.3337 18.0001C26.3337 22.6025 22.6027 26.3334 18.0003 26.3334C13.398 26.3334 9.66699 22.6025 9.66699 18.0001C9.66699 13.3977 13.398 9.66675 18.0003 9.66675C22.6027 9.66675 26.3337 13.3977 26.3337 18.0001Z"
                        stroke="#079455" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip0_2654_2994">
                        <rect width="20" height="20" fill="white" transform="translate(8 8)" />
                    </clipPath>
                </defs>
            </svg>
            <svg v-else-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38"
                fill="none">
                <g opacity="0.3">
                    <path
                        d="M6 19C6 11.8203 11.8203 6 19 6C26.1797 6 32 11.8203 32 19C32 26.1797 26.1797 32 19 32C11.8203 32 6 26.1797 6 19Z"
                        stroke="#D92D20" stroke-width="2" />
                </g>
                <g opacity="0.1">
                    <path
                        d="M1 19C1 9.05888 9.05888 1 19 1C28.9411 1 37 9.05888 37 19C37 28.9411 28.9411 37 19 37C9.05888 37 1 28.9411 1 19Z"
                        stroke="#D92D20" stroke-width="2" />
                </g>
                <g clip-path="url(#clip0_2654_4600)">
                    <path
                        d="M19.0003 15.6667V19.0001M19.0003 22.3334H19.0087M27.3337 19.0001C27.3337 23.6025 23.6027 27.3334 19.0003 27.3334C14.398 27.3334 10.667 23.6025 10.667 19.0001C10.667 14.3977 14.398 10.6667 19.0003 10.6667C23.6027 10.6667 27.3337 14.3977 27.3337 19.0001Z"
                        stroke="#D92D20" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip0_2654_4600">
                        <rect width="20" height="20" fill="white" transform="translate(9 9)" />
                    </clipPath>
                </defs>
            </svg>
            <svg v-else-if="type === 'warn'" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"
                fill="none">
                <g opacity="0.3">
                    <path
                        d="M5.50033 18.0001C5.50033 11.0965 11.0968 5.50008 18.0003 5.50008C24.9039 5.50008 30.5003 11.0965 30.5003 18.0001C30.5003 24.9036 24.9039 30.5001 18.0003 30.5001C11.0968 30.5001 5.50033 24.9036 5.50033 18.0001Z"
                        stroke="#DC6803" stroke-width="1.66667" />
                </g>
                <g opacity="0.1">
                    <path
                        d="M1.33333 18C1.33333 8.79525 8.79525 1.33333 18 1.33333C27.2047 1.33333 34.6667 8.79525 34.6667 18C34.6667 27.2047 27.2047 34.6667 18 34.6667C8.79525 34.6667 1.33333 27.2047 1.33333 18Z"
                        stroke="#DC6803" stroke-width="1.66667" />
                </g>
                <g clip-path="url(#clip0_2654_2594)">
                    <path
                        d="M18.0003 14.6667V18.0001M18.0003 21.3334H18.0087M26.3337 18.0001C26.3337 22.6025 22.6027 26.3334 18.0003 26.3334C13.398 26.3334 9.66699 22.6025 9.66699 18.0001C9.66699 13.3977 13.398 9.66675 18.0003 9.66675C22.6027 9.66675 26.3337 13.3977 26.3337 18.0001Z"
                        stroke="#DC6803" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                    <clipPath id="clip0_2654_2594">
                        <rect width="20" height="20" fill="white" transform="translate(8 8)" />
                    </clipPath>
                </defs>
            </svg>
        </div>
        <div class="flex-center-6"></div>

        <slot />
        <div class="flex-center"></div>

        <div v-if="isClose" class="close" @click="hideBtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15.5 5.9043L5.5 15.9043M5.5 5.9043L15.5 15.9043" stroke="#98A2B3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.message {
    position: relative;
    padding: 12px 10px;
    border-radius: 12px;
    border: 1px solid #D0D5DD;
    background: #FFF;
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
    display: flex;

    /* 142.857% */
    &.message-type-success {
        color: #067647;
    }

    &.message-type-warn {
        color: #B54708;
    }

    &.message-type-error {
        color: #B42318;
    }

    .icon {
        line-height: 0;
    }
    .close {
        padding: 8px;
        cursor: pointer;
        line-height: 0;
    }
}
</style>
