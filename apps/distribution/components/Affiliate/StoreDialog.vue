<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const isMobile = useIsMobile()
const attrs = useAttrs()
const props = defineProps({
    id: {
        type: String,
        default: ''
    }
})
const emit = defineEmits(['submit', 'cancel'])

const submit = () => {
    emit('submit')
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
}

const cancel = () => {
    emit('cancel')
    const fn = attrs['onUpdate:modelValue']
    fn && fn(false)
}

</script>

<template>
  <div class="dialog-container">
    <el-dialog
    v-bind="$attrs"
    width="896px"
    :show-close="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :class="{ 'm': isMobile }"
    >
        <template #header="{ close }">
            <div class="close-container transition-opacity opacity-70 hover:opacity-100" @click="close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="lucide lucide-x h-4 w-4">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                </svg>
            </div>
        </template>
        <div class="grid gap-4">
            <div class="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2 id="radix-:r1:" class="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         class="lucide lucide-store w-5 h-5">
                        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                        <path d="M2 7h20"></path>
                        <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"></path>
                    </svg>
                    时尚服饰专营店
                </h2>
                <p id="radix-:r2:" class="text-sm text-muted-foreground">专注女性时尚服饰，包含连衣裙、外套、配饰等 · 佣金比例：15%</p></div>
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="lucide lucide-package w-5 h-5">
                            <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
                            <path d="M12 22V12"></path>
                            <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"></path>
                            <path d="m7.5 4.27 9 5.15"></path>
                        </svg>
                        店铺商品 (最多展示10个)
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                            <div class="p-4"><img
                                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&amp;h=300&amp;fit=crop"
                                    alt="春季连衣裙" class="w-full h-32 object-cover rounded-md mb-3"><h4
                                    class="font-semibold text-sm mb-2">春季连衣裙</h4>
                                <div class="space-y-1">
                                    <div class="flex justify-between text-sm"><span class="text-gray-600">商品价格：</span><span
                                            class="font-semibold">¥299</span></div>
                                    <div class="flex justify-between text-sm"><span class="text-gray-600">获得佣金：</span><span
                                            class="font-semibold text-green-600">¥44.85</span></div>
                                </div>
                            </div>
                        </div>
                        <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                            <div class="p-4"><img
                                    src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&amp;h=300&amp;fit=crop"
                                    alt="时尚外套" class="w-full h-32 object-cover rounded-md mb-3"><h4
                                    class="font-semibold text-sm mb-2">时尚外套</h4>
                                <div class="space-y-1">
                                    <div class="flex justify-between text-sm"><span class="text-gray-600">商品价格：</span><span
                                            class="font-semibold">¥599</span></div>
                                    <div class="flex justify-between text-sm"><span class="text-gray-600">获得佣金：</span><span
                                            class="font-semibold text-green-600">¥89.85</span></div>
                                </div>
                            </div>
                        </div>
                        <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                            <div class="p-4"><img
                                    src="https://images.unsplash.com/photo-1583496661160-fb5886a13d35?w=300&amp;h=300&amp;fit=crop"
                                    alt="优雅半身裙" class="w-full h-32 object-cover rounded-md mb-3"><h4
                                    class="font-semibold text-sm mb-2">优雅半身裙</h4>
                                <div class="space-y-1">
                                    <div class="flex justify-between text-sm"><span class="text-gray-600">商品价格：</span><span
                                            class="font-semibold">¥199</span></div>
                                    <div class="flex justify-between text-sm"><span class="text-gray-600">获得佣金：</span><span
                                            class="font-semibold text-green-600">¥29.85</span></div>
                                </div>
                            </div>
                        </div>
                        <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                            <div class="p-4"><img
                                    src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&amp;h=300&amp;fit=crop"
                                    alt="职业套装" class="w-full h-32 object-cover rounded-md mb-3"><h4
                                    class="font-semibold text-sm mb-2">职业套装</h4>
                                <div class="space-y-1">
                                    <div class="flex justify-between text-sm"><span class="text-gray-600">商品价格：</span><span
                                            class="font-semibold">¥899</span></div>
                                    <div class="flex justify-between text-sm"><span class="text-gray-600">获得佣金：</span><span
                                            class="font-semibold text-green-600">¥134.85</span></div>
                                </div>
                            </div>
                        </div>
                        <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                            <div class="p-4"><img
                                    src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&amp;h=300&amp;fit=crop"
                                    alt="休闲T恤" class="w-full h-32 object-cover rounded-md mb-3"><h4
                                    class="font-semibold text-sm mb-2">休闲T恤</h4>
                                <div class="space-y-1">
                                    <div class="flex justify-between text-sm"><span class="text-gray-600">商品价格：</span><span
                                            class="font-semibold">¥99</span></div>
                                    <div class="flex justify-between text-sm"><span class="text-gray-600">获得佣金：</span><span
                                            class="font-semibold text-green-600">¥14.85</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-center pt-4">
                    <button
                            class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8"
                            @click="submit"
                    >
                        加入 时尚服饰专营店 分销组织
                    </button>
                </div>
            </div>
        </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@use "@flylinking/ui/styles/css/radix.scss" as *;

.dialog-container :deep(.el-dialog) {
    max-width: 100%;
    min-height: 50%;
    padding: 24px;
    border-radius: 0.5rem;
    background-color: #FFF;
    &.m {
        .el-dialog__footer {
            padding: 0;
        }
    }
    .el-dialog__header {
        padding: 0;
        .close-container {
            position: absolute;
            top: 16px;
            right: 16px;
            cursor: pointer;
            font-size: 0;
        }
    }
    .el-dialog__body {
        padding: 0;
        color: #020817;
    }
    .el-dialog__footer {
        padding: 0;
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
