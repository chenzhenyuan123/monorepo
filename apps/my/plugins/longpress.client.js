export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('longpress', {
        mounted(el, binding) {
            let pressTimer = null;
            const delay = binding.arg ? parseInt(binding.arg) : 1000; // 通过参数设置时间，如 v-longpress:800

            // 触发长按
            const start = (e) => {
                e.preventDefault();
                if (pressTimer === null) {
                    pressTimer = setTimeout(() => {
                        binding.value(e); // 执行回调
                        pressTimer = null;
                    }, delay);
                }
            };

            // 取消长按
            const cancel = () => {
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
            };

            // 绑定事件（同时支持触摸和鼠标）
            el.addEventListener('touchstart', start);
            el.addEventListener('touchend', cancel);
            el.addEventListener('touchcancel', cancel);
            el.addEventListener('mousedown', start); // PC端兼容
            el.addEventListener('mouseup', cancel);
            el.addEventListener('mouseleave', cancel);
        },
        // 卸载时清理事件
        beforeUnmount(el) {
            el.removeEventListener('touchstart', start);
            el.removeEventListener('touchend', cancel);
            // ...其他事件同理
        }
    });
});