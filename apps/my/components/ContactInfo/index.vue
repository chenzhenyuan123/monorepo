<script setup>
import { copyToClipboard, successMessage } from "@/util/index.js";
import { contactData } from './const.js'
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  contactInfo: {
    type: Object,
    default: () => ({})
  },
  positionTop: { // PC端对应的定位
    type: Number,
    default: 0
  },
  positionLeft: { // PC端对应的左边定位，不传默认在右侧
    type: String,
    default: 'auto'
  }
})

const copyText = (text) => {
  copyToClipboard(text)
  successMessage(t('invitation.inviteDialogButtonCopied'))
}

const layerRef = ref(null)
const emit = defineEmits(["change","hide"])
onMounted(() => {
  layerRef.value.show()
});
const getSrc = (imgName) => {
  return new URL(`../../assets/imgs/contact-icon/${imgName}.svg`, import.meta.url).href
}
</script>
<template>
  <Layer ref="layerRef" :title="$t('orders.orderContactAs')" class="layer" :positionTop="positionTop" :positionLeft="positionLeft" v-once @hide="$emit('hide')">
    <div class="contact-info">
      <div v-for="item in contactData" :key="item.value" v-show="contactInfo[item.value]" class="contact-info-item">
        <div class="contact-info-item-icon">
          <img v-if="contactInfo[item.value]" class="scope-other-info-icon2" :src="getSrc(item.icon.replace('.svg', ''))" loading="lazy">
        </div>
        <span class="contact-info-item-name direction-text-align-left">{{contactInfo[item.value]}}</span>
        <div
          class="contact-info-item-icon2-container copy-btn"
          :data-copy="contactInfo[item.value]"
          @click="copyText(contactInfo[item.value])"
        >
          <img
            class="contact-info-item-icon2"
            src="https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1709558500006_copy.svg"
          />
        </div>
        <a
          v-if="contactInfo[item.value]"
          class="contact-info-item-icon2-container"
          :href="item.geturl(contactInfo)"
          target="_blank"
        >
          <img
            class="contact-info-item-icon2 size-24"
            :src="item.goIcon || 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1712656592133_arrow-right-up-line.svg'"
          />
        </a>
      </div>
    </div>
  </Layer>
</template>
<style lang="scss" scoped>
.contact-info {
  padding: 0 24px;
  .contact-info-item {
    display: flex;
    align-items: center;
    padding: 15px 0px;
    height: 24px;
    &:last-child {
      border-bottom: none;
    }
  }
  .contact-info-item-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 100%;
    }
  }
  .contact-info-item-name {
    flex: 1;
    padding: 0 16px;
    color: #222;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px; /* 142.857% */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .contact-info-item-icon2-container {
    width: 32px;
    height: 32px;
    position: relative;
    cursor: pointer;
    &:hover {
      border-radius:4px;
      background-color: rgba(183, 185, 199, 0.20);
    }
    + .contact-info-item-icon2-container {
      margin-left: 16px;
    }
    .contact-info-item-icon2 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 21px;
      &.size-19 {
        width: 19px;
      }
      &.size-21 {
        width: 21px;
      }
      &.size-24 {
        width: 24px;
      }
    }
  }
}
</style>