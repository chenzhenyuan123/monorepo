<script setup>
import { Close } from '@element-plus/icons-vue';
const isMobile = useIsMobile()

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  positionTop: {
    type: Number,
    default: 0
  },
  positionLeft: { // PC端对应的左边定位，不传默认在右侧
    type: String,
    default: 'auto'
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
    <div v-if="isShow" :class="{ 'layer': true, 'is-pc': !isMobile }" @click.stop="hide">
        <div
          :class="{ 'layer-body': true, 'init-animation': isShow }"
          @click.stop
          :style="{ top: (positionTop > 0&&!isMobile) ? `${positionTop}px` : 'auto',
                    left: !isMobile ? positionLeft : 0 }"
        >
            <div class="layer-body-title-container">
                <h1 class="layer-body-title">{{ title }}</h1>
                <div class="layer-body-title-close" @click="hide">
                    <el-icon><Close /></el-icon>
                </div>
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
            padding: 0 24px;
            .layer-body-title-close {
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
            padding: 8px 20px 24px;
            text-align: center;
            color: #4D74ED;
            font-size: 16px;
            font-weight: 500;
            line-height: 24px; /* 150% */
        }
    }
}


// 媒体自适应
@media screen and (min-width: 768px) {
    .layer {
      /*width: 0;*/
      background-color: transparent;
      :deep(.layer-body) {
        position: absolute;
        width: 366px;
        top: 50px;
        right: 36px;
        left: auto;
        bottom: auto;
        border-radius: 12px;
        background: #FFF;
        box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1), 0px 4px 20px 0px rgba(0, 0, 0, 0.15);
        &.init-animation {
          animation: none;
        }
        .rtl & {
          left: 16px;
          right: auto;
        }
        .layer-body-title-container {
          .layer-body-title-close {
            display: none;
          }
        }
        .layer-body-bottom-button {
          display: none;
        }
      }
    }
  }
  /* 1440+(16)*2 */
  @media screen and (min-width: 1472px) {
    .layer {
      :deep(.layer-body) {
        .rtl & {
          left: calc(50% - 720px);
        }
      }
    }
  }
</style>
