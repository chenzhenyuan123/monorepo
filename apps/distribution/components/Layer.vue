<script setup>
import { Close } from '@element-plus/icons-vue';
const isMobile = useIsMobile()

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  closeOnClickModal: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(["hide"])

const isShow = ref(false)

const show = () => {
    isShow.value = true
}

const hide = () => {
    isShow.value = false
    emit('hide')
}

const toggle = () => {
    isShow.value = !isShow.value
}

const getIsShow = () => {
    return isShow.value
}

defineExpose({ show, hide, toggle, getIsShow })

</script>

<template>
    <div v-if="isShow" :class="{ 'layer': true, 'is-pc': !isMobile }" @click="closeOnClickModal && hide()">
        <div :class="{ 'layer-body': true, 'init-animation': isShow }" @click.stop>
            <div class="layer-body-title-container">
                <!-- <h1 class="layer-body-title">{{ title }}</h1> -->
                <!-- <div class="layer-body-title-close" @click="hide">
                    <el-icon><Close /></el-icon>
                </div> -->
            </div>
            <div class="layer-body-content">
                <slot></slot>
            </div>
            <div class="layer-body-bottom-button" @click="hide">Close</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
@keyframes animate {
  0% {
    // bottom: -100px;
    transform: translate(0, 100px);
  }

  100% {
    // bottom: 0;
    transform: translate(0, 0);
  }
}

@mixin animation-config() {
    // animation-delay: 50ms;
    animation-timing-function: ease-in-out;
    animation-duration: 100ms;
    animation-direction: alternate;
    animation-iteration-count: 1;
}
.layer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 900;
    background-color: rgba(0, 0, 0, 0.40);
    min-height: 500px;
    &.is-pc {
        position: absolute;
        top: 0;
        right: 0;
        background-color: transparent;
    }
    .layer-body {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        max-height: 100%;
        background-color: #ffffff;
        border-radius: 12px 12px 0 0;
        &.init-animation {
            // animation
            animation-name: animate;
            @include animation-config();
        }
        .layer-body-title-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .layer-body-title-close {
                display: none;
                padding: 4px;
                color: #424552;
                font-size: 16px;
                cursor: pointer;
            }
        }
        .layer-body-title {
            padding: 16px 0;
            color: #222;
            font-size: 16px;
            font-weight: 500;
            line-height: 24px; /* 150% */
            /*text-align: left;*/
        }
        .layer-body-content {
            width: 100%;
            max-height: calc(80vh - 120px);
            overflow: auto;
        }
        .layer-body-bottom-button {
            padding: 8px 20px;
            text-align: center;
            color: #4D74ED;
            font-size: 16px;
            font-weight: 500;
            line-height: 24px; /* 150% */
        }
    }
}
</style>
