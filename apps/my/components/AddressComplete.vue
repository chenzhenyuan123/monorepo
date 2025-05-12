<script setup name="AddressComplete">
    import { debounce } from 'throttle-debounce'
    import { v4 as uuidv4 } from 'uuid';
    // import axios from 'axios'

    const props = defineProps({
        merchantId: { type: String, default: '' },
        busType: { type: String, default: 'FlyPay' },
        value: { type: String, default: '' },
        country: { type: String, default: '' },
        lang: { type: String, default: 'en' },
    })

    let uuid = sessionStorage.getItem('googleMapUuid');
    const setUuid = () => {
        uuid = uuidv4();
        sessionStorage.setItem('googleMapUuid', uuid)
    }

    const { googleMapApi } = useApi();
    const emit = defineEmits(['selected', 'change'])
    const options = ref([])
    const placeId = ref()
    const _value = ref('')
    const dropdownCommand = (index) => {
        const target = options.value[index]
        placeId.value = target.placeId
        googleMapApi.place_detail({
            merchantId: props.merchantId,
            busType: props.busType,
            placeId: placeId.value,
            // languageCode: props.lang,
            languageCode: 'en',
            sessionToken: uuid
        }).then(result => {
            const res = result.data.value?.data || {}
            if (res) {
                if (res.address_line) _value.value = res.address_line
                console.log('addressComponentsJson', JSON.parse(res.addressComponentsJson))
                emit('selected', res)
            }
        }).finally(() => {
            setUuid()
        })
    }

    watchEffect(() => {
        const val = props.value
        _value.value = val
        if (!val) {
            options.value = []
        }
    })

    const dropdownRef = ref()
    const W = ref(0)
    const getW = () => {
        const el = dropdownRef.value.$el
        W.value = el.getBoundingClientRect?.()?.width || 426
    }

    onMounted(() => {
        getW()
    })

    // let cancelToken = null
    const search = (keywords) => {
        // if (cancelToken) {
        //     cancelToken.cancel()
        // }
        if (!uuid) {
            setUuid()
        }
        // cancelToken = axios.CancelToken.source()
        googleMapApi.place_list({
            merchantId: props.merchantId,
            busType: props.busType,
            input: keywords,
            // languageCode: props.lang,
            languageCode: 'en',
            includedRegionCode: props.country,
            sessionToken: uuid
        }).then(result => {
            console.log('result: ', result)
            const res = result.data.value?.data || {}
            if (res) {
                options.value = res.map(item => {
                    const regex = new RegExp(keywords, 'i')
                    const matched = item.mainText.match(regex)
                    item.html = matched ? item.text.replace(regex, `<b>${matched[0]}</b>`) : item.text
                    return item
                })
                dropdownRef.value.handleOpen()
            } else {
                options.value = []
            }
        })
    }

    const inputHandle = debounce(300, (_val) => {
        const val = _val ? _val.trim() : ''
        _value.value = _val
        emit('change', _val)
        if (val && val.length > 1) {
            getW()
            search(val)
        } else {
            options.value = []
        }
    })

    const trim = () => {
        const val = _value.value ? _value.value : ''
        _value.value = val
        emit('change', val)
    }
</script>

<template>
    <el-dropdown trigger="click" @command="dropdownCommand" style="width: 100%;" max-height="300px" ref="dropdownRef" popper-class="popper-2025225114306"
                 :popper-options="{modifiers: [{ name: 'offset', options: { offset: [0, 1] }}]}" :triggerKeys="[]">
        <el-input size="large" cashier_inputInfo v-model="_value" @update:model-value="inputHandle" :placeholder="$attrs.placeholder" clearable @blur="trim" />
        <template v-if="options.length > 0" #dropdown>
            <el-dropdown-menu placement="bottom" :style="{width: W+'px', maxHeight: '250px', overflowY: 'auto'}">
                <el-dropdown-item v-for="(item, index) in options" :key="index" :command="index" :class="{active: placeId === item.placeId}">
                    <span class="icon">
                        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.00002 11.0665C9.10459 11.0665 10 10.1711 10 9.06655C10 7.96198 9.10459 7.06655 8.00002 7.06655C6.89545 7.06655 6.00002 7.96198 6.00002 9.06655C6.00002 10.1711 6.89545 11.0665 8.00002 11.0665Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8.00002 17.0665C10.6667 14.3999 13.3334 12.0121 13.3334 9.06655C13.3334 6.12103 10.9455 3.73322 8.00002 3.73322C5.0545 3.73322 2.66669 6.12103 2.66669 9.06655C2.66669 12.0121 5.33335 14.3999 8.00002 17.0665Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                    <div class="text" v-html="item.html"></div>
                </el-dropdown-item>
            </el-dropdown-menu>
            <div class="powered-by">
                <span>powered by</span>
                <svg width="54" height="16" viewBox="0 0 54 16" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><rect x="0.962952" width="53.037" height="16" fill="url(#uicons-8k1hugwn26)"></rect><defs><pattern id="uicons-8k1hugwn26" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlink:href="#image0_3685_11110" transform="scale(0.00558659 0.0185185)"></use></pattern><image id="image0_3685_11110" width="179" height="54" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"></image></defs></svg>
            </div>
        </template>
    </el-dropdown>
</template>

<style lang="scss">
    .popper-2025225114306{
        .el-dropdown-menu{
            padding: 4px 0;
        }
        .el-dropdown-menu__item {
            padding: 0;
            margin: 1px 6px;
            min-height: 40px;
            border-radius: 6px;
            padding: 10px 10px 10px 8px;
            line-height: 20px;
            color: #686A6C;
            white-space: normal;
            box-sizing: border-box;
            align-items: flex-start;
            &.active{
                background-color: #EFF1F4 !important;
            }
            .icon {
                flex-shrink: 0;
                margin-right: 8px;
                svg{
                    display: block;
                }
            }
            .text{
                line-height: 20px;
                b{
                    color: #222;
                    font-weight: 600;
                }
            }
        }
        .el-dropdown-menu__item:not(.is-disabled):focus {
            background-color: transparent;
            color: #686A6C;
        }
        .el-dropdown-menu__item:not(.is-disabled):hover {
            background-color: #F5F7FA;
            color: #686A6C;
        }
        .el-popper__arrow{
            display: none;
        }
    }
</style>
<style scoped lang="scss">
    .powered-by{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 42px;
        padding: 0 8px;
        font-size: 12px;
        color: #686A6C;
        span{
            margin-right: 4px;
            line-height: 16px;
            flex-grow: 1;
            text-align: right;
        }
    }
</style>
