<!--
 * @Author: czy
 * @Description: 分销员招募平台
-->
<script setup name="Affiliate">
definePageMeta({
  layout: 'noside'
})
const isMobile = useIsMobile()


const join = () => {
}


const isShowStoreDialog = ref(false)
const storeDialogId = ref()
const showStoreDialog = (id) => {
  storeDialogId.value = id
  isShowStoreDialog.value = true
}

</script>
<template>
  <div class="main-box bg-gradient-to-br min-h-screen" :class="{ m: isMobile }">
    <div class="affiliate-header bg-white shadow-sm">
      <div class="affiliate-header-center max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900">分销员招募平台</h1>
        <p class="text-gray-600 mt-2">加入我们，开启您的分销赚钱之旅</p>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <section>
        <h2 class="text-2xl font-bold text-center mb-8">四步轻松赚佣金</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm text-center hover:shadow-lg transition-shadow">
            <div class="flex flex-col space-y-1.5 p-6">
              <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="lucide lucide-users w-8 h-8 text-blue-600">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 class="font-semibold tracking-tight text-lg">注册加入</h3></div>
            <div class="p-6 pt-0"><p class="text-gray-600">填写基本信息，成为分销员</p></div>
            <div class="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   class="lucide lucide-arrow-right w-6 h-6 text-gray-400">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
          </div>
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm text-center hover:shadow-lg transition-shadow">
            <div class="flex flex-col space-y-1.5 p-6">
              <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="lucide lucide-share2 w-8 h-8 text-blue-600">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                  <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                </svg>
              </div>
              <h3 class="font-semibold tracking-tight text-lg">分享链接</h3></div>
            <div class="p-6 pt-0"><p class="text-gray-600">获取专属推广链接，分享给买家</p></div>
            <div class="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   class="lucide lucide-arrow-right w-6 h-6 text-gray-400">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
          </div>
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm text-center hover:shadow-lg transition-shadow">
            <div class="flex flex-col space-y-1.5 p-6">
              <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="lucide lucide-credit-card w-8 h-8 text-blue-600">
                  <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                  <line x1="2" x2="22" y1="10" y2="10"></line>
                </svg>
              </div>
              <h3 class="font-semibold tracking-tight text-lg">买家支付</h3></div>
            <div class="p-6 pt-0"><p class="text-gray-600">买家通过您的链接完成购买</p></div>
            <div class="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   class="lucide lucide-arrow-right w-6 h-6 text-gray-400">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
          </div>
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm text-center hover:shadow-lg transition-shadow">
            <div class="flex flex-col space-y-1.5 p-6">
              <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="lucide lucide-dollar-sign w-8 h-8 text-blue-600">
                  <line x1="12" x2="12" y1="2" y2="22"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 class="font-semibold tracking-tight text-lg">获得佣金</h3></div>
            <div class="p-6 pt-0"><p class="text-gray-600">系统自动结算，获得丰厚佣金</p></div>
          </div>
        </div>
      </section>
      <section>
        <h2 class="text-2xl font-bold text-center mb-8">可加入的店铺组织</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow cursor-pointer" @click="showStoreDialog(123)">
            <div class="flex flex-col space-y-1.5 p-6">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold tracking-tight text-lg flex items-center gap-2">
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
                </h3>
                <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  服饰
                </div>
              </div>
              <p class="text-sm text-muted-foreground">专注女性时尚服饰，包含连衣裙、外套、配饰等</p></div>
            <div class="p-6 pt-0">
              <div class="flex items-center justify-between"><span class="text-sm text-gray-600">佣金比例：</span><span
                      class="text-2xl font-bold text-green-600">15%</span></div>
            </div>
            <div class="flex items-center p-6 pt-0">
              <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                加入分销组织
              </button>
            </div>
          </div>
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
            <div class="flex flex-col space-y-1.5 p-6">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold tracking-tight text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                       class="lucide lucide-store w-5 h-5">
                    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                    <path d="M2 7h20"></path>
                    <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"></path>
                  </svg>
                  数码3C精品店
                </h3>
                <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  数码
                </div>
              </div>
              <p class="text-sm text-muted-foreground">销售手机、耳机、充电器等数码产品</p></div>
            <div class="p-6 pt-0">
              <div class="flex items-center justify-between"><span class="text-sm text-gray-600">佣金比例：</span><span
                      class="text-2xl font-bold text-green-600">12%</span></div>
            </div>
            <div class="flex items-center p-6 pt-0">
              <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                加入分销组织
              </button>
            </div>
          </div>
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
            <div class="flex flex-col space-y-1.5 p-6">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold tracking-tight text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                       class="lucide lucide-store w-5 h-5">
                    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                    <path d="M2 7h20"></path>
                    <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"></path>
                  </svg>
                  美妆护肤旗舰店
                </h3>
                <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  美妆
                </div>
              </div>
              <p class="text-sm text-muted-foreground">知名品牌化妆品、护肤品、香水等美妆产品</p></div>
            <div class="p-6 pt-0">
              <div class="flex items-center justify-between"><span class="text-sm text-gray-600">佣金比例：</span><span
                      class="text-2xl font-bold text-green-600">20%</span></div>
            </div>
            <div class="flex items-center p-6 pt-0">
              <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                加入分销组织
              </button>
            </div>
          </div>
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
            <div class="flex flex-col space-y-1.5 p-6">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold tracking-tight text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                       class="lucide lucide-store w-5 h-5">
                    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                    <path d="M2 7h20"></path>
                    <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"></path>
                  </svg>
                  家居生活馆
                </h3>
                <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  家居
                </div>
              </div>
              <p class="text-sm text-muted-foreground">家居用品、厨房用具、收纳整理等生活必需品</p></div>
            <div class="p-6 pt-0">
              <div class="flex items-center justify-between"><span class="text-sm text-gray-600">佣金比例：</span><span
                      class="text-2xl font-bold text-green-600">18%</span></div>
            </div>
            <div class="flex items-center p-6 pt-0">
              <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                加入分销组织
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>


    <div class="footer-main affiliate-footer">
      <Footer />
    </div>

    <AffiliateStoreDialog
            v-if="isShowStoreDialog"
            v-model="isShowStoreDialog"
            :id="storeDialogId"
            @submit="join"
    ></AffiliateStoreDialog>
  </div>
</template>

<style lang="scss" scoped>
@use "@flylinking/ui/styles/css/radix.scss" as *;

.main-box {
  line-height: 1.5;
  color: #020817;
}
.affiliate-header {
  .affiliate-header-center {
    padding: 24px 16px;
  }
}
.affiliate-footer {
  padding: 0 20px;
}
</style>