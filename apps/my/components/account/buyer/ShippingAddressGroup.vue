<script setup>
import { Plus } from '@element-plus/icons-vue';

const props = defineProps({
    natureData: {
        type: Array,
        default: () => []
    },
    countryData: {
        type: Array,
        default: () => []
    },
    maxLength: {
        type: Number,
        default: 20
    }
})
const emit = defineEmits(["updateData"])

const isAdd = ref(false)

const showAddModule = () => {
    isAdd.value = true
}

const hideAddModule = () => {
    isAdd.value = false
}

const addData = () => {
    hideAddModule()
    emit('updateData')
}

const updateData = () => {
    emit('updateData')
}

</script>

<template>
    <div class="profile-head">
        <div class="profile-head-content">
            <div class="profile-title">Shipping addresses</div>
            <div class="profile-discribe">Add your shipping address and log in when visiting store.flylinking.com to quickly fill in your address at checkout and get the products you love faster.</div>
        </div>
        <div v-if="natureData.length < maxLength && natureData.length > 0" class="profile-head-right">
            <el-button id="profile-btn-shipping-address-add" :icon="Plus" class="button-default" @click="showAddModule">Add address</el-button>
        </div>
    </div>

    <AccountBuyerShippingAddress
            v-if="isAdd"
            key="add"
            :isAdd="true"
            :country-data="countryData"
            @update-data="addData"
            @cancel="hideAddModule"
    ></AccountBuyerShippingAddress>

    <template v-if="natureData.length">
        <AccountBuyerShippingAddress
                v-for="item in natureData"
                :key="item.id"
                :nature-data="item"
                :country-data="countryData"
                @update-data="updateData"
        ></AccountBuyerShippingAddress>
    </template>

    <div v-else-if="!isAdd" class="nature-list">
        <div class="nature-item">
            <el-button id="profile-btn-shipping-address-add" :icon="Plus" class="button-default" @click="showAddModule">Add address</el-button>
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
