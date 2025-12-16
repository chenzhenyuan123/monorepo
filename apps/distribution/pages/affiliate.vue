<!--
 * @Author: czy
 * @Description: 分销员招募平台
-->
<script setup name="Affiliate">
import {checkResponseData} from "@/util";
import { currencyFormat } from "@/util/index.js";
import {sendLog} from "@/util/logUtil";
import { reactive } from "vue";

definePageMeta({
  layout: 'noside'
})
const router = useRouter();
const route = useRoute();
const { affiliateApi, joinApi } = useApi()
const isMobile = useIsMobile()

const page = reactive({
  pageSize: 8,
  total: 0,
  pageNo: 1
})
const total = ref(0)

const storeList = ref([])

onMounted(()=>{
  getStoreData()
  sendLog({
    eventType: 1,
    eventCode: 'da-affiliate-load',
    eventDesc: '分销端-ai推广页-加载'
  })
})
// 获取店铺数据
const getStoreData = async() => {
  const result = await affiliateApi.listStoreCanJoin({
    pageNo: page.pageNo,
    pageSize: page.pageSize
  })

  const res = checkResponseData(result)
  storeList.value = res?.list || []
  total.value = res.total
}

const isShowStoreDialog = ref(false)
const storeDialogData = ref({})
const showStoreDialog = (obj) => {
  storeDialogData.value = obj
  isShowStoreDialog.value = true
}

const handleSizeChange = val => {
  page.pageSize = val
  page.pageNo = 1
  getStoreData()
}
const handleCurrentChange = val => {
  if (page.pageNo === val) return
  page.pageNo = val
  getStoreData()
}

</script>
<template>
  <div class="main-box bg-gradient-to-br min-h-screen" :class="{ m: isMobile }">
    <div class="affiliate-header bg-white shadow-sm">
      <div class="affiliate-header-center max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900">FlyLink Distributor Recruitment Platform</h1>
        <p class="text-gray-600 mt-2">Join us and embark on your journey of making money through distribution</p>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <section>
        <h2 class="text-2xl font-bold text-center mb-8">Four easy steps to earn commissions</h2>
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
              <h3 class="font-semibold tracking-tight text-lg">Register to join</h3></div>
            <div class="p-6 pt-0"><p class="text-gray-600">Fill in basic information to become a distributor</p></div>
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
              <h3 class="font-semibold tracking-tight text-lg">Share link</h3></div>
            <div class="p-6 pt-0"><p class="text-gray-600">Obtain exclusive promotional links and share them with buyers</p></div>
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
              <h3 class="font-semibold tracking-tight text-lg">Buyer payment</h3></div>
            <div class="p-6 pt-0"><p class="text-gray-600">The buyer completes the purchase through your link</p></div>
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
              <h3 class="font-semibold tracking-tight text-lg">Get commission</h3></div>
            <div class="p-6 pt-0"><p class="text-gray-600">The system automatically settles and earns generous commissions</p></div>
          </div>
        </div>
      </section>
      <section>
        <h2 class="text-2xl font-bold text-center mb-8">Stores that can join distribution</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="item in storeList"
            :key="item.storeId"
            class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow cursor-pointer grid-box"
            @click="showStoreDialog(item)"
          >
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
                  {{ item.storeName }}
                </h3>
                <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 whitespace-normal">
                  {{ item.storeFlag }}
                </div>
              </div>
              <p v-if="item.storeDesc" class="text-sm text-muted-foreground">{{ item.storeDesc }}</p>
            </div>
            <div class="p-6 pt-0">
              <div class="flex items-center justify-between"><span class="text-sm text-gray-600">Commission Rate:</span><span
                      class="text-2xl font-bold text-green-600">{{currencyFormat(item.commissionRate * 100)}}%</span></div>
            </div>
            <div class="flex items-center p-6 pt-0">
              <el-link
                :href="item.joinUrl"
                target="_blank"
                underline="never"
                class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                @click.stop
              >
                Join Now
              </el-link>
            </div>
          </div>
        </div>
      </section>
      
      <Pagination
        v-if="total>0"
        :current-page="page.pageNo"
        :page-sizes="[8, 16, 50, 100, 200]"
        :page-size="page.pageSize"
        :total="total"
        @update:page-size="handleSizeChange"
        @update:current-page="handleCurrentChange"
      />
    </div>

    <div class="footer-main affiliate-footer max-w-7xl mx-auto">
      <Footer />
    </div>

    <AffiliateStoreDialog
            v-if="isShowStoreDialog"
            v-model="isShowStoreDialog"
            :storeData="storeDialogData"
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
  padding: 50px 16px;
}
</style>