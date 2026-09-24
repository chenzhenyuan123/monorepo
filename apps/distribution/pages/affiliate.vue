<!--  
 * @Author: czy
 * @Description: 分销员招募平台（新版设计稿）
-->
<script setup name="Affiliate">
import { checkResponseData, copyToClipboard, successMessage } from "@/util";
import { currencyFormat } from "@/util/index.js";
import { sendLog } from "@flylinking/core/utils/logUtil";

// 图片 / 视频资源（设计稿 assets/imgs/affiliate）
import bannerBg from '@/assets/imgs/affiliate/banner_bg.png'
import storesBg from '@/assets/imgs/affiliate/stores_bg.png'
import joinNowImg from '@/assets/imgs/affiliate/JoinNow.png'
import contactImg from '@/assets/imgs/affiliate/contact.png'
import getLinkImg from '@/assets/imgs/affiliate/getLink.png'
import walletImg from '@/assets/imgs/affiliate/wallet.png'
const allVideo = 'https://raw.githubusercontent.com/chenzhenyuan123/flylink/main/Distribution-Platform_files/all1.mp4'
const joinStoreVideo = 'https://raw.githubusercontent.com/chenzhenyuan123/flylink/main/Distribution-Platform_files/joinStore.mp4'
const contactSellersVideo = 'https://raw.githubusercontent.com/chenzhenyuan123/flylink/main/Distribution-Platform_files/ContactSellers_GetLinks.mp4'
const contactSellersFeatureVideo = 'https://raw.githubusercontent.com/chenzhenyuan123/flylink/main/Distribution-Platform_files/ContactSellers&GetProductLinks.mp4'


definePageMeta({
  layout: 'noside'
})

const { affiliateApi } = useApi()
const isMobile = useIsMobile()

// ===================== 接口：可加入的店铺列表 =====================
const page = reactive({
  pageSize: 8,
  total: 0,
  pageNo: 1
})
const total = ref(0)
const storeList = ref([])

const getStoreData = async() => {
  const result = await affiliateApi.listStoreCanJoin({
    pageNo: page.pageNo,
    pageSize: page.pageSize
  })
  const res = checkResponseData(result)
  storeList.value = res?.list || []
  total.value = res?.total || 0
}

onMounted(() => {
  getStoreData()
  sendLog({
    eventType: 1,
    eventCode: 'da-affiliate-load',
    eventDesc: '分销端-ai推广页-加载'
  })
})

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

// 点击店铺卡片 → 弹商品列表弹窗（复用原有 AffiliateStoreDialog）
const isShowStoreDialog = ref(false)
const storeDialogData = ref({})
const showStoreDialog = (obj) => {
  storeDialogData.value = obj
  isShowStoreDialog.value = true
}

// ===================== 图标库（Lucide line icons）=====================
const ICONS = {
  store: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
  trendingUp: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  externalLink: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  whatsapp: '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>',
  alertCircle: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  playCircle: '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  badgeCheck: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
  headset: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a9 9 0 0 1 18 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
}

const icon = (name, size = 20, extraClass = '') => {
  const content = ICONS[name] || ''
  return '<svg class="icon ' + extraClass + '" width="' + size + '" height="' + size +
    '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + content + '</svg>'
}

// ===================== 页面静态数据 =====================
const nav = [
  { href: '#steps', label: { en: 'Distribution Step', he: 'שלבי ההפצה' } },
  { href: '#stores', label: { en: 'Featured Stores', he: 'חנויות מומלצות' } },
  { href: '#scripts', label: { en: 'Promo Scripts', he: 'תסריטי קידום' } },
  // { href: '#videos', label: { en: 'Video Tutorials', he: 'מדריכי וידאו' } },
  { href: '#faq', label: { en: 'FAQ', he: 'שאלות נפוצות' } }
]

const stats = [
  { icon: 'store', value: '9', label: { en: 'Stores to Join', he: 'חנויות להצטרפות' } },
  { icon: 'trendingUp', value: '20%+', label: { en: 'Max Commission', he: 'עמלה מקסימלית' } },
  { icon: 'clock', value: 'T+1', label: { en: 'Settlement Cycle', he: 'מחזור סילוק' } },
  { icon: 'gift', value: '0', label: { en: 'Joining Fee', he: 'דמי הצטרפות' } }
]

const steps = [
  {
    num: 1, tone: 'violet', icon: 'userPlus',
    title: { en: 'Join a Store as an Affiliate', he: 'הצטרף לחנות כשותף' },
    detail: { en: "Browse the store list below, choose stores with high commissions and products that fit your audience, then tap to join. Once joined, you'll get the promotion rights for that store.", he: 'עיין ברשימת החנויות למטה, בחר חנויות עם עמלות גבוהות ומוצרים שמתאימים לקהל שלך, ואז לחץ להצטרפות. לאחר ההצטרפות, תקבל את זכויות הקידום של אותה חנות.' },
    subSteps: [
      { en: 'Browse stores by category – Find shops that match your interests.', he: 'דפדף בחנויות לפי קטגוריה – מצא חנויות שמתאימות לתחומי העניין שלך.' },
      { en: 'Pick a popular local store by category.', he: 'בחר חנות מקומית פופולרית לפי קטגוריה.' },
      { en: 'Tap “Join Now” – Get instant promotion rights.', he: 'לחץ על "הצטרף עכשיו" – קבל זכויות קידום מיידיות.' },
      { en: 'Join multiple stores – Promote different categories at once.', he: 'הצטרף למספר חנויות – קדם קטגוריות שונות בו זמנית.' }
    ],
    tips: [
      { en: 'Stick to familiar categories – You’ll promote more naturally and build trust.', he: 'היצמד לקטגוריות מוכרות – תקדם באופן טבעי יותר ותבנה אמון.' },
      { en: 'Start small, scale fast.', he: 'התחל בקטן, גדל מהר.' },
      { en: 'Test one store first, then Join more to maximize reach.', he: 'בדוק חנות אחת קודם, ואז הצטרף ליותר כדי למקסם את הטווח.' }
    ],
    image: joinNowImg
  },
  {
    num: 2, tone: 'purple', icon: 'message',
    title: { en: 'Contact the Seller about Products', he: 'צור קשר עם המוכר לגבי מוצרים' },
    detail: { en: 'After joining, open the Products menu and tap the "Contact" button to chat directly with the seller via WhatsApp. Communicate naturally as a buyer or partner, and confirm the best-sellers, stock and available promo materials.', he: 'לאחר ההצטרפות, פתח את תפריט המוצרים ולחץ על כפתור "יצירת קשר" כדי לשוחח ישירות עם המוכר ב-WhatsApp. תקשר באופן טבעי כקונה או שותף, ואשר את המוצרים הנמכרים ביותר, המלאי וחומרי הקידום הזמינים.' },
    subSteps: [
      { en: 'Open the product menu and find "Store Contact Information"', he: 'פתח את תפריט המוצרים ומצא "פרטי יצירת קשר עם החנות"' },
      { en: 'Tapping it opens the WhatsApp chat window automatically', he: 'לחיצה עליו פותחת את חלון הצ\'אט של WhatsApp אוטומטית' },
      { en: 'Send a message to introduce your promotion intent', he: 'שלח הודעה כדי להציג את כוונת הקידום שלך' },
      { en: 'Ask the seller for best-seller links, images and materials', he: 'בקש מהמוכר קישורים למוצרים הנמכרים ביותר, תמונות וחומרים' }
    ],
    tips: [
      { en: 'Click on "Contact Information" on the product menu to start WhatsApp chat', he: 'לחץ על "פרטי יצירת קשר" בתפריט המוצרים כדי להתחיל צ\'אט ב-WhatsApp' },
      { en: "Don't leave the Flylink platform when chatting, just communicate naturally", he: 'אל תעזוב את פלטפורמת Flylink בעת השיחה, פשוט תקשר באופן טבעי' },
      { en: 'Proactively ask about best-sellers, stock and commission policy', he: 'שאל באופן יזום על המוצרים הנמכרים ביותר, המלאי ומדיניות העמלות' },
      { en: 'Ask the seller for product images and promo materials', he: 'בקש מהמוכר תמונות מוצר וחומרי קידום' }
    ],
    image: contactImg
  },
  {
    num: 3, tone: 'indigo', icon: 'share',
    title: { en: 'Get Your Link & Share with Buyers', he: 'קבל את הקישור שלך ושתף עם קונים' },
    detail: { en: 'After confirming products with the seller, go to the store home or product menu and copy your unique promo link with your affiliate ID. Share it to your Moments, WeChat groups, or privately with friends who might need it.', he: 'לאחר אישור מוצרים עם המוכר, עבור לעמוד הבית של החנות או לתפריט המוצרים והעתק את קישור הקידום הייחודי שלך עם מזהה השותף שלך. שתף אותו ברגעים שלך, בקבוצות WeChat, או באופן פרטי עם חברים שעשויים להזדקק לו.' },
    subSteps: [
      { en: 'Tap "Get Affiliate Link" on the store home or product menu', he: 'לחץ על "קבל קישור שותף" בעמוד הבית של החנות או בתפריט המוצרים' },
      { en: 'Copy your unique link with your affiliate ID', he: 'העתק את הקישור הייחודי שלך עם מזהה השותף שלך' },
      { en: 'Pair it with a genuine review and share to Moments or groups', he: 'שלב אותו עם ביקורת אמיתית ושתף ברגעים או בקבוצות' },
      { en: 'Or recommend it privately to friends in need', he: 'או המלץ עליו באופן פרטי לחברים הזקוקים לכך' }
    ],
    tips: [
      { en: 'Tap "Get Affiliate Link" on the store home or product menu', he: 'לחץ על "קבל קישור שותף" בעמוד הבית של החנות או בתפריט המוצרים' },
      { en: 'Copy your unique link with your affiliate ID', he: 'העתק את הקישור הייחודי שלך עם מזהה השותף שלך' },
      { en: 'Share to Moments, groups or recommend privately', he: 'שתף ברגעים, בקבוצות או המלץ באופן פרטי' },
      { en: 'Pairing with genuine experience copy works better', he: 'שילוב עם תיאור חוויה אמיתי עובד טוב יותר' }
    ],
    image: getLinkImg
  },
  {
    num: 4, tone: 'fuchsia', icon: 'wallet',
    title: { en: 'Wait for Payment, Earn Commission', he: 'המתן לתשלום, הרווח עמלה' },
    detail: { en: 'When buyers place orders and successfully make payments through your promotional link, they can immediately see the commission income, and the system will automatically settle the commission to your wallet without manual request, which is safe and reliable.', he: 'כאשר קונים מבצעים הזמנות ומשלמים בהצלחה דרך קישור הקידום שלך, הם יכולים לראות מיד את הכנסות העמלה, והמערכת תסדיר את העמלה לארנק שלך אוטומטית ללא בקשה ידנית, מה שבטוח ואמין.' },
    subSteps: [
      { en: 'Buyers can enter the product through your distribution link and place an order', he: 'קונים יכולים להיכנס למוצר דרך קישור ההפצה שלך ולבצע הזמנה' },
      { en: 'After successful payment, you can immediately see the expected commission income', he: 'לאחר תשלום מוצלח, תוכל לראות מיד את הכנסות העמלה הצפויות' },
      { en: 'The system will automatically settle the commission to your wallet', he: 'המערכת תסדיר את העמלה לארנק שלך אוטומטית' },
      { en: 'View commission details and expenses in the wallet', he: 'צפה בפרטי העמלה וההוצאות בארנק' }
    ],
    tips: [
      { en: 'After the buyer makes the payment, the commission will be automatically recorded', he: 'לאחר שהקונה מבצע את התשלום, העמלה תירשם אוטומטית' },
      { en: 'Automatically settle commission to your wallet', he: 'סילוק אוטומטי של העמלה לארנק שלך' },
      { en: 'View commission details in the wallet', he: 'צפה בפרטי העמלה בארנק' },
      { en: 'Platform guarantee transactions ensure the safety of funds', he: 'עסקאות בערבות הפלטפורמה מבטיחות את בטיחות הכספים' }
    ],
    image: walletImg
  }
]

const contactSteps = [
  { key: 'A', title: { en: 'Open the Products menu', he: 'פתח את תפריט המוצרים' }, desc: { en: 'After joining, open the product menu, select the store, and view the store contact information', he: 'לאחר ההצטרפות, פתח את תפריט המוצרים, בחר את החנות וצפה בפרטי יצירת הקשר עם החנות' } },
  { key: 'B', title: { en: 'Click on the store contact information', he: 'לחץ על פרטי יצירת הקשר עם החנות' }, desc: { en: 'Find the corresponding store contact information on the product menu and click on Start WhatsApp Chat', he: 'מצא את פרטי יצירת הקשר המתאימים לחנות בתפריט המוצרים ולחץ על התחל צ\'אט WhatsApp' } },
  { key: 'C', title: { en: 'Send a Message', he: 'שלח הודעה' }, desc: { en: 'Copy the template below, paste it into the WhatsApp chat and send it to the seller to naturally introduce your promotion intent', he: 'העתק את התבנית למטה, הדבק אותה בצ\'אט WhatsApp ושלח אותה למוכר כדי להציג באופן טבעי את כוונת הקידום שלך' } },
  { key: 'D', title: { en: 'Get Product Details', he: 'קבל פרטי מוצר' }, desc: { en: 'After confirming best-sellers with the seller, ask for promo links and product images, and make sure the link includes your affiliate ID', he: 'לאחר אישור המוצרים הנמכרים ביותר עם המוכר, בקש קישורי קידום ותמונות מוצר, וודא שהקישור כולל את מזהה השותף שלך' } }
]

const templates = [
  { label: { en: 'Formal', he: 'רשמי' }, content: { en: 'Hello， I am a distributor on the Flylink platform and I am very interested in the products in your store. Could you please introduce your product category and commission policy? Looking forward to cooperation! Thank you.', he: 'שלום, אני מפיץ בפלטפורמת Flylink ואני מאוד מתעניין במוצרים בחנות שלך. תוכל בבקשה להציג את קטגוריית המוצרים ומדיניות העמלות שלך? מצפה לשיתוף פעולה! תודה.' } },
  { label: { en: 'Casual Buyer', he: 'קונה רגיל' }, content: { en: "Hi! I've been recommending good products to friends lately and came across your store—really nice items. Which best-sellers would you recommend? Could you send some product links and images for reference?", he: 'היי! לאחרונה אני ממליץ לחברים על מוצרים טובים ונתקלתי בחנות שלך – פריטים ממש נחמדים. על אילו מוצרים נמכרים ביותר היית ממליץ? תוכל לשלוח כמה קישורים ותמונות של מוצרים לעיון?' } },
  { label: { en: 'Community Promo', he: 'קידום בקהילה' }, content: { en: 'Hello, I run a shopping-sharing community and would like to recommend your products to the group. Could you provide best-seller links, image materials and the affiliate commission policy? Thank you!', he: 'שלום, אני מנהל קהילת שיתוף קניות וברצוני להמליץ על המוצרים שלך לקבוצה. תוכל לספק קישורים למוצרים הנמכרים ביותר, חומרי תמונה ומדיניות עמלות שותפים? תודה!' } }
]

const scripts = [
  {
    id: 'friend-recommend', tone: 'blue',
    title: { en: 'Private Recommendation', he: 'המלצה פרטית' },
    category: { en: '1-on-1 Recommendation', he: 'המלצה 1 על 1' },
    content: { en: 'Hi~Last time I heard that you were looking for XX products, I happened to find a very reliable store with good quality and prices. This is my exclusive recommendation link. Please take a look and let me know if it meets your expectations. Feel free to contact me if you have any questions~', he: 'היי~ בפעם הקודמת שמעתי שאתה מחפש מוצרי XX, במקרה מצאתי חנות אמינה מאוד עם איכות ומחירים טובים. זהו קישור ההמלצה הבלעדי שלי. בבקשה תסתכל ותגיד לי אם זה עונה על הציפיות שלך. מוזמן ליצור איתי קשר אם יש לך שאלות~' },
    usage: { en: 'Great for recommending products to friends in private chat, natural and not pushy', he: 'מצוין להמלצת מוצרים לחברים בצ\'אט פרטי, טבעי ולא לוחץ' },
    tip: { en: 'Understand their needs before recommending to avoid a mass-message feel, and follow up on their experience after.', he: 'הבן את הצרכים שלהם לפני ההמלצה כדי להימנע מתחושת הודעה המונית, ועקוב אחר החוויה שלהם לאחר מכן.' }
  },
  {
    id: 'group-share', tone: 'orange',
    title: { en: 'Group Share', he: 'שיתוף בקבוצה' },
    category: { en: 'Community Promo', he: 'קידום בקהילה' },
    content: { en: 'My family, I recently found a good item with good quality and reasonable price. I have been using it for a while and think it\'s good. I want to share it with you! The link is here. If you are interested, take a look and feel free to ask me any questions~', he: 'משפחה שלי, לאחרונה מצאתי פריט טוב עם איכות טובה ומחיר סביר. אני משתמש בו כבר זמן מה וחושב שהוא טוב. אני רוצה לשתף אתכם! הנה הקישור. אם אתם מעוניינים, תסתכלו ומוזמנים לשאול אותי כל שאלה~' },
    usage: { en: 'Great for sharing in WeChat groups and communities, friendly and natural', he: 'מצוין לשיתוף בקבוצות וקהילות WeChat, ידידותי וטבעי' },
    tip: { en: 'Better to interact in the group first; dropping a link out of nowhere can be off-putting.', he: 'עדיף ליצור אינטראקציה בקבוצה קודם; שליחת קישור ישירות ללא הקשר יכולה להיות מרתיעה.' }
  }
]

const videos = [
  { id: 'full-flow', title: { en: 'Full process demonstration', he: 'הדגמת תהליך מלא' }, desc: { en: 'Full flow demo from joining a store to receiving commission', he: 'הדגמת זרימה מלאה מהצטרפות לחנות ועד קבלת עמלה' }, duration: '02:15', image: walletImg, video: allVideo },
  { id: 'pick-store', title: { en: 'How to join the store', he: 'איך להצטרף לחנות' }, desc: { en: 'Product selection strategy and commission comparison tips', he: 'אסטרטגיית בחירת מוצרים וטיפים להשוואת עמלות' }, duration: '00:42', image: joinNowImg, video: joinStoreVideo },
  { id: 'whatsapp-guide', title: { en: 'Contact Sellers & Get Links via WhatsApp', he: 'צור קשר עם מוכרים וקבל קישורים דרך WhatsApp' }, desc: { en: 'Hands-on WhatsApp walkthrough, learn in 3 minutes', he: 'הדרכה מעשית ב-WhatsApp, למד ב-3 דקות' }, duration: '00:46', image: contactImg, video: contactSellersVideo }
]

const videoFeature = {
  title: { en: 'How to Contact Sellers & Get Product Details?', he: 'איך ליצור קשר עם מוכרים ולקבל פרטי מוצר?' },
  desc: { en: 'This is the most critical step in promotion. After joining a store, you need to chat with the seller via WhatsApp to confirm best-sellers and promo materials. This video shows the full process.', he: 'זהו השלב הקריטי ביותר בקידום. לאחר הצטרפות לחנות, עליך לשוחח עם המוכר ב-WhatsApp כדי לאשר מוצרים נמכרים וחומרי קידום. הסרטון הזה מציג את התהליך המלא.' },
  steps: [
    { en: '1. Open the Products menu', he: '1. פתח את תפריט המוצרים' },
    { en: '2. Click on the contact information', he: '2. לחץ על פרטי יצירת הקשר' },
    { en: '3. Chat on WhatsApp', he: '3. שוחח ב-WhatsApp' },
    { en: '4. Get Affiliate Link', he: '4. קבל קישור שותף' }
  ],
  image: contactImg,
  duration: '00:55',
  video: contactSellersFeatureVideo
}

const guarantees = [
  { icon: 'shield', title: { en: 'Fund Safety', he: 'בטיחות כספים' }, desc: { en: 'Platform-guaranteed transactions with automatic commission settlement', he: 'עסקאות בערבות הפלטפורמה עם סילוק עמלות אוטומטי' } },
  { icon: 'lock', title: { en: 'Info Security', he: 'אבטחת מידע' }, desc: { en: 'Encrypted promo links protect affiliate privacy', he: 'קישורי קידום מוצפנים מגנים על פרטיות השותף' } },
  { icon: 'badgeCheck', title: { en: 'Commission Guarantee', he: 'ערבות עמלה' }, desc: { en: 'Automatic transfer, no withdrawal threshold', he: 'העברה אוטומטית, ללא סף משיכה' } },
  { icon: 'headset', title: { en: 'Dedicated Support', he: 'תמיכה ייעודית' }, desc: { en: 'Online 7×12 hours with timely responses', he: 'זמין 7×12 שעות עם מענה בזמן' } }
]

const faqs = [
  { q: { en: 'Does joining cost anything?', he: 'האם ההצטרפות עולה כסף?' }, a: { en: 'Completely free. Joining a stores affiliate program costs nothing—just register to become an affiliate. Simply pick a store you like and tap "Join Now" to get promotion rights.', he: 'חינם לחלוטין. ההצטרפות לתוכנית השותפים של חנות אינה עולה דבר – פשוט הירשם כדי להפוך לשותף. בחר חנות שאתה אוהב ולחץ על "הצטרף עכשיו" כדי לקבל זכויות קידום.' } },
  { q: { en: 'When does commission arrive?', he: 'מתי העמלה מגיעה?' }, a: { en: 'When a buyer places an order through your promotional link and successfully pays, they can immediately see the commission income for the period, and the system will automatically settle the commission to your wallet without the need for manual requests.', he: 'כאשר קונה מבצע הזמנה דרך קישור הקידום שלך ומשלם בהצלחה, הוא יכול לראות מיד את הכנסות העמלה לתקופה, והמערכת תסדיר את העמלה לארנק שלך אוטומטית ללא צורך בבקשות ידניות.' } },
  { q: { en: 'How do I contact the seller?', he: 'איך אני יוצר קשר עם המוכר?' }, a: { en: 'After joining, open the Product menu and find the "Contact" button—tap it to chat with the seller directly via WhatsApp. We recommend contacting the seller right away to confirm best-sellers, stock and promo materials.', he: 'לאחר ההצטרפות, פתח את תפריט המוצרים ומצא את כפתור "יצירת קשר" – לחץ עליו כדי לשוחח עם המוכר ישירות ב-WhatsApp. אנו ממליצים ליצור קשר עם המוכר מיד כדי לאשר מוצרים נמכרים, מלאי וחומרי קידום.' } },
  { q: { en: 'What should I keep in mind when talking to sellers?', he: 'מה עלי לזכור כשאני מדבר עם מוכרים?' }, a: { en: "Communicate naturally as a buyer or partner and don't mention our platform name. Proactively ask about best-sellers, stock and commission policy, and request product images and promo materials from the seller.", he: 'תקשר באופן טבעי כקונה או שותף ואל תזכיר את שם הפלטפורמה שלנו. שאל באופן יזום על מוצרים נמכרים, מלאי ומדיניות עמלות, ובקש תמונות מוצר וחומרי קידום מהמוכר.' } },
  { q: { en: 'How do I get the promo link?', he: 'איך אני מקבל את קישור הקידום?' }, a: { en: 'After confirming products with the seller, tap "Get Affiliate Link" on the store home or product menu and copy your unique link with your affiliate ID. Share it with friends or groups to track commission.', he: 'לאחר אישור מוצרים עם המוכר, לחץ על "קבל קישור שותף" בעמוד הבית של החנות או בתפריט המוצרים והעתק את הקישור הייחודי שלך עם מזהה השותף שלך. שתף אותו עם חברים או קבוצות כדי לעקוב אחר העמלה.' } },
  { q: { en: 'Can I join multiple stores?', he: 'האם אני יכול להצטרף למספר חנויות?' }, a: { en: 'Yes. You can join multiple stores affiliate programs and promote different categories. We recommend prioritizing stores you know well with high commissions.', he: 'כן. אתה יכול להצטרף לתוכניות שותפים של מספר חנויות ולקדם קטגוריות שונות. אנו ממליצים לתת עדיפות לחנויות שאתה מכיר היטב עם עמלות גבוהות.' } },
  { q: { en: 'What if a buyer returns the item?', he: 'מה קורה אם קונה מחזיר את הפריט?' }, a: { en: "If a buyer requests a return/refund, that orders commission is deducted automatically. Only orders that are paid and not refunded are finally settled.", he: 'אם קונה מבקש החזרה/החזר כספי, עמלת ההזמנה הזו מופחתת אוטומטית. רק הזמנות ששולמו ולא הוחזרו מסודרות בסופו של דבר.' } },
  { q: { en: 'How can I check my commission status?', he: 'איך אני יכול לבדוק את מצב העמלה שלי?' }, a: { en: 'On the wallet menu, you can view your balance, commission pending confirmation, and distribution transaction records..', he: 'בתפריט הארנק, תוכל לצפות ביתרה שלך, בעמלה הממתינה לאישור וברישומי עסקאות ההפצה.' } }
]

const benefits = [
  { en: 'Free to join, no threshold', he: 'הצטרפות חינם, ללא סף' },
  { en: 'No stocking, Seller after-sales', he: 'ללא מלאי, שירות לאחר מכירה על ידי המוכר' },
  { en: 'Commission automatically credited to the account', he: 'עמלה נזקפת אוטומטית לחשבון' },
  { en: 'Platform-guaranteed safe trading', he: 'מסחר בטוח בערבות הפלטפורמה' }
]

// ===================== 双语支持（EN / Hebrew） =====================
const lang = ref('en') // 'en' | 'he'
const isRTL = computed(() => lang.value === 'he')
const toggleLang = () => {
  lang.value = lang.value === 'en' ? 'he' : 'en'
}
// 从 { en, he } 双语字段取当前语言文案
const L = (v) => (v && typeof v === 'object' && 'en' in v) ? v[lang.value] : v

// 页面级独立 UI 文案
const ui = {
  brandName: { en: 'Distributor Recruitment Platform', he: 'פלטפורמת גיוס מפיצים' },
  joinNow: { en: 'Join Now', he: 'הצטרף עכשיו' },
  seeHow: { en: 'See How It Works', he: 'ראה איך זה עובד' },
  heroPill: { en: 'No stocking · High commission · Abundant promotion resources · Zero cost', he: 'אין גרביים · עמלה גבוהה · משאבי קידום שפעים · אפס עלות' },
  heroTitle: { en: 'Join the distribution platform, Easily earn commissions', he: 'הצטרף לפלטפורמת ההפצה והרווח עמלות בקלות' },
  stepsEyebrow: { en: 'How-To Guide', he: 'מדריך איך-לעשות' },
  stepsTitle: { en: 'Earn Commission in 4 Easy Steps', he: 'הרווח עמלה ב-4 צעדים פשוטים' },
  stepsDesc: { en: 'From joining to payout, the flow is simple and transparent — tap each step for detailed guidance', he: 'מההצטרפות ועד התשלום, התהליך פשוט ושקוף — לחץ על כל שלב להדרכה מפורטת' },
  stepTag: { en: 'Step', he: 'שלב' },
  stepsLabel: { en: 'Steps', he: 'שלבים' },
  keyPoints: { en: 'Key Points', he: 'נקודות מפתח' },
  previous: { en: 'Previous', he: 'הקודם' },
  next: { en: 'Next', he: 'הבא' },
  storesEyebrow: { en: 'Featured Stores', he: 'חנויות מומלצות' },
  storesTitle: { en: 'These stores are waiting for you to promote', he: 'החנויות האלה מחכות לך לקידום' },
  storesDesc: { en: 'Curated quality stores with high commissions and easy sales — pick the category that fits you', he: 'חנויות איכותיות שנבחרו בקפידה עם עמלות גבוהות ומכירות קלות — בחר את הקטגוריה שמתאימה לך' },
  high: { en: 'High', he: 'גבוה' },
  commissionRate: { en: 'Commission Rate:', he: 'שיעור עמלה:' },
  contactEyebrow: { en: 'Seller Contact Guide', he: 'מדריך ליצירת קשר עם המוכר' },
  contactTitle: { en: 'After joining a store, how do you contact the seller?', he: 'לאחר ההצטרפות לחנות, איך יוצרים קשר עם המוכר?' },
  contactDesc1: { en: 'This is the most critical step in promotion — after joining, contact the seller right away to confirm product info and promo materials.', he: 'זהו השלב הקריטי ביותר בקידום — לאחר ההצטרפות, צור קשר עם המוכר מיד כדי לאשר פרטי מוצר וחומרי קידום.' },
  contactDesc2: { en: "We've written the scripts for you; just copy and use", he: 'כתבנו עבורך את התסריטים; פשוט העתק והשתמש' },
  readyTitle: { en: 'Ready to start?', he: 'מוכן להתחיל?' },
  readyDesc: { en: 'Tap the button below to open the Product menu, then find the "Contact" button to chat with the seller via WhatsApp.', he: 'לחץ על הכפתור למטה כדי לפתוח את תפריט המוצרים, ואז מצא את כפתור "יצירת קשר" כדי לשוחח עם המוכר ב-WhatsApp.' },
  goContact: { en: 'Go to Store & Contact Seller', he: 'עבור לחנות וצור קשר עם המוכר' },
  waTemplates: { en: 'WhatsApp Message Templates', he: 'תבניות הודעות WhatsApp' },
  copyMessage: { en: 'Copy Message', he: 'העתק הודעה' },
  note: { en: 'Important reminder: Do not disconnect from the Flylink platform when chatting with sellers - communicate naturally as buyers or partners.', he: 'תזכורת חשובה: אל תתנתק מפלטפורמת Flylink בעת שיחה עם מוכרים - תקשר באופן טבעי כקונה או שותף.' },
  scriptsEyebrow: { en: 'Handy Tools', he: 'כלים שימושיים' },
  scriptsTitle: { en: 'Promo Scripts', he: 'תסריטי קידום' },
  scriptsDesc: { en: 'Copy-and-use scripts for many promo scenarios — make your promotion more natural and effective', he: 'תסריטים מוכנים להעתקה לתרחישי קידום רבים — הפוך את הקידום שלך לטבעי ויעיל יותר' },
  copy: { en: 'Copy', he: 'העתק' },
  videosEyebrow: { en: 'Video Lessons', he: 'שיעורי וידאו' },
  videosTitle: { en: 'Video Tutorials', he: 'מדריכי וידאו' },
  videosDesc: { en: 'Watch video tutorials to get started fast — learn by doing, easily', he: 'צפה במדריכי וידאו כדי להתחיל מהר — למד על ידי עשייה, בקלות' },
  featuredTutorial: { en: 'Featured Tutorial', he: 'מדריך מומלץ' },
  minToLearn: { en: 'min to learn', he: 'דקות ללמידה' },
  guaranteeTitle: { en: 'Four Platform Guarantees for Worry-free Promotion', he: 'ארבע ערבויות פלטפורמה לקידום ללא דאגות' },
  faqEyebrow: { en: 'FAQ', he: 'שאלות נפוצות' },
  faqTitle: { en: 'All Your Questions, Answered', he: 'כל השאלות שלך, עם תשובות' },
  faqDesc: { en: 'Answers to the most common beginner questions — contact support if you need more help', he: 'תשובות לשאלות הנפוצות ביותר למתחילים — צור קשר עם התמיכה אם אתה צריך עזרה נוספת' },
  faqFoot: { en: 'More questions? Contact platform support, online 7×12 hours', he: 'עוד שאלות? צור קשר עם תמיכת הפלטפורמה, זמין 7×12 שעות' },
  ctaTitle: { en: 'Start Earning Your First Commission Now', he: 'התחל להרוויח את העמלה הראשונה שלך עכשיו' },
  ctaDesc: { en: 'No guessing what to do next. Pick a store, contact the seller, share your link — your first commission is that simple', he: 'אין צורך לנחש מה לעשות הלאה. בחר חנות, צור קשר עם המוכר, שתף את הקישור שלך — העמלה הראשונה שלך פשוטה כל כך' },
  seeProcess: { en: 'See the Process', he: 'ראה את התהליך' },
  footerCopy1: { en: 'Affiliate Platform · Auto commission settlement, safe & reliable', he: 'פלטפורמת שותפים · סילוק עמלות אוטומטי, בטוח ואמין' },
  footerCopy2: { en: 'After joining, contact the seller right away to get your product promo link', he: 'לאחר ההצטרפות, צור קשר עם המוכר מיד כדי לקבל את קישור קידום המוצר שלך' },
  footerBottom: { en: '© 2026 FlyLink. All rights reserved.', he: '© 2026 FlyLink. כל הזכויות שמורות.' },
  copied: { en: 'Copied', he: 'הועתק' }
}
const t = (key) => (ui[key] ? ui[key][lang.value] : key)

// ===================== 交互状态 =====================
const activeStep = ref(0)
const currentStep = computed(() => steps[activeStep.value])

const mobileMenuOpen = ref(false)

const openFaq = ref(-1)
const toggleFaq = (i) => {
  openFaq.value = openFaq.value === i ? -1 : i
}

const activeScript = ref(0)
const activeTemplate = ref(0)

// 复制文案（复用项目 copyToClipboard）
const copyText = (text) => {
  if (copyToClipboard(text)) {
    successMessage(t('copied'))
  }
}
</script>

<template>
  <div class="affiliate-page" :class="{ m: isMobile }" :dir="isRTL ? 'rtl' : 'ltr'">
    <!-- ====================== Header Nav ====================== -->
    <header class="site-header">
      <nav class="site-header__bar container">
        <a class="brand" href="#top">
          <img class="brand__logo" src="https://da-test.flylinking.com/_nuxt/Flylinking-logo.fjmDM9jT.svg" alt="FlyLink">
          <span class="brand__name">{{ t('brandName') }}</span>
        </a>

        <div class="nav-links">
          <a v-for="l in nav" :key="l.href" class="nav-link" :href="l.href">{{ L(l.label) }}</a>
          <a class="nav-link nav-link--cta" href="#stores">{{ t('joinNow') }}</a>
          <button class="lang-toggle" type="button" @click="toggleLang">{{ lang === 'en' ? 'עברית' : 'EN' }}</button>
        </div>

        <button class="nav-toggle" type="button" :aria-label="lang === 'en' ? 'Menu' : 'תפריט'" @click="mobileMenuOpen = !mobileMenuOpen">
          <span v-html="icon(mobileMenuOpen ? 'x' : 'menu', 24)"></span>
        </button>
      </nav>

      <div v-if="mobileMenuOpen" class="mobile-menu">
        <a v-for="l in nav" :key="l.href" class="mobile-menu__link" :href="l.href" @click="mobileMenuOpen = false">{{ L(l.label) }}</a>
        <a class="mobile-menu__cta" href="#stores" @click="mobileMenuOpen = false">{{ t('joinNow') }}</a>
      </div>
    </header>

    <main>
      <!-- ====================== Hero ====================== -->
      <section class="hero" :style="{ backgroundImage: `url(${bannerBg})` }">
        <div class="hero__decor" aria-hidden="true">
          <span class="hero__blob hero__blob--a"></span>
          <span class="hero__blob hero__blob--b"></span>
          <span class="hero__blob hero__blob--c"></span>
        </div>

        <div class="hero__inner container">
          <p class="pill animate-fade-in">
            <span class="pill__dot" aria-hidden="true"></span>
            {{ t('heroPill') }}
          </p>

          <h1 class="hero__title animate-fade-in-up">{{ t('heroTitle') }}</h1>

          <div class="hero__actions animate-fade-in-up">
            <a class="btn btn--light animate-cta-glow" href="#stores">
              {{ t('joinNow') }}
              <span class="js-arrow" aria-hidden="true" v-html="icon('arrowRight', 20)"></span>
            </a>
            <a class="btn btn--outline-light" href="#steps">{{ t('seeHow') }}</a>
          </div>

          <div class="stats animate-fade-in-up">
            <div v-for="s in stats" :key="s.icon" class="stat">
              <span class="stat__icon" v-html="icon(s.icon, 24)"></span>
              <div class="stat__value">{{ s.value }}</div>
              <div class="stat__label">{{ L(s.label) }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ====================== Distribution Flow ====================== -->
      <section class="section section--alt" id="steps">
        <div class="container">
          <div class="section-head">
            <span class="section-head__eyebrow">{{ t('stepsEyebrow') }}</span>
            <h2 class="section-head__title">{{ t('stepsTitle') }}</h2>
            <p class="section-head__desc">{{ t('stepsDesc') }}</p>
          </div>

          <div class="flow">
            <div class="flow__track" role="tablist">
              <div
                v-for="(s, i) in steps"
                :key="s.num"
                class="flow__item"
                :class="{ 'is-active': activeStep === i, 'is-done': activeStep > i }"
                @click="activeStep = i"
              >
                <span class="flow__line"><span class="flow__line-fill"></span></span>
                <div class="flow__node">
                  <span class="flow__circle">
                    <span class="flow__ring"></span>
                    <span class="flow__inner" v-html="icon(s.icon, 24)"></span>
                    <span class="flow__num">{{ s.num }}</span>
                  </span>
                  <span class="flow__label">{{ L(s.title) }}</span>
                </div>
              </div>
            </div>

            <div class="flow__pills" role="tablist">
              <button
                v-for="(s, i) in steps"
                :key="s.num"
                class="flow__pill"
                :class="{ 'is-active': activeStep === i }"
                @click="activeStep = i"
              >
                <span class="flow__pill-num">{{ s.num }}</span>
                {{ L(s.title) }}
              </button>
            </div>

            <div class="flow__panel" :data-tone="currentStep.tone">
              <div class="flow__grid">
                <div class="flow__left">
                  <div class="flow__head">
                    <span class="flow__icon-box" v-html="icon(currentStep.icon, 24)"></span>
                    <div>
                      <div class="flow__step-tag">{{ t('stepTag') }} {{ currentStep.num }}</div>
                      <div class="flow__step-title">{{ L(currentStep.title) }}</div>
                    </div>
                  </div>
                  <p class="flow__detail">{{ L(currentStep.detail) }}</p>
                  <figure class="flow__figure">
                    <img :src="currentStep.image" :alt="L(currentStep.title)" loading="lazy">
                  </figure>
                </div>
                <div class="flow__right">
                  <div class="flow__right-title">{{ t('stepsLabel') }}</div>
                  <div class="flow__sub">
                    <div v-for="(sub, si) in currentStep.subSteps" :key="si" class="flow__sub-item">
                      <span class="num-dot">{{ si + 1 }}</span>
                      <span>{{ L(sub) }}</span>
                    </div>
                  </div>
                  <div class="flow__right-title mt1">{{ t('keyPoints') }}</div>
                  <div class="flow__tips">
                    <div v-for="(tip, ti) in currentStep.tips" :key="ti" class="flow__tip">
                      <span class="num-dot">{{ ti + 1 }}</span>
                      <span>{{ L(tip) }}</span>
                    </div>
                  </div>
                  <div class="flow__nav">
                    <button class="flow__nav-btn" type="button" :disabled="activeStep === 0" @click="activeStep--">
                      <span v-html="icon('chevronRight', 16, 'icon--flip')"></span>
                      {{ t('previous') }}
                    </button>
                    <span class="flow__progress">{{ activeStep + 1 }} / {{ steps.length }}</span>
                    <button class="flow__nav-btn flow__nav-btn--next" type="button" :disabled="activeStep === steps.length - 1" @click="activeStep++">
                      {{ t('next') }}
                      <span v-html="icon('chevronRight', 16)"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ====================== Featured Stores ====================== -->
      <section class="section" id="stores" :style="{ backgroundImage: `url(${storesBg})` }">
        <div class="container">
          <div class="section-head">
            <span class="section-head__eyebrow">{{ t('storesEyebrow') }}</span>
            <h2 class="section-head__title">{{ t('storesTitle') }}</h2>
            <p class="section-head__desc">{{ t('storesDesc') }}</p>
          </div>

          <div class="store-grid">
            <article
              v-for="item in storeList"
              :key="item.storeId"
              class="store-card"
              @click="showStoreDialog(item)"
            >
              <div class="store-card__media">
                <span class="store-card__merchant-icon" aria-hidden="true" v-html="icon('store', 24)"></span>
                <span class="store-card__tags">
                  <span v-if="Number(item.commissionRate) >= 0.2" class="store-card__tag store-card__tag--commission">{{ t('high') }}</span>
                  <span class="store-card__tag">{{ item.storeFlag }}</span>
                </span>
              </div>
              <div class="store-card__body">
                <h3 class="store-card__name">{{ item.storeName }}</h3>
                <p v-if="item.storeDesc" class="store-card__desc">{{ item.storeDesc }}</p>
                <dl class="store-card__commission">
                  <dt>{{ t('commissionRate') }}</dt>
                  <dd>{{ currencyFormat(item.commissionRate * 100) }}%</dd>
                </dl>
                <a
                  class="store-card__btn store-card__btn--join"
                  :href="item.joinUrl"
                  target="_blank"
                  @click.stop
                >{{ t('joinNow') }}</a>
              </div>
            </article>
          </div>

          <Pagination
            v-if="total > 0"
            class="store-pagination"
            :current-page="page.pageNo"
            :page-sizes="[8, 16, 50, 100, 200]"
            :page-size="page.pageSize"
            :total="total"
            @update:page-size="handleSizeChange"
            @update:current-page="handleCurrentChange"
          />
        </div>
      </section>

      <!-- ====================== Seller Contact Guide ====================== -->
      <section class="section" id="contact">
        <div class="container">
          <div class="section-head">
            <span class="section-head__eyebrow section-head__eyebrow--pill">
              <span aria-hidden="true" v-html="icon('whatsapp', 16)"></span>
              {{ t('contactEyebrow') }}
            </span>
            <h2 class="section-head__title">{{ t('contactTitle') }}</h2>
            <p class="section-head__desc section-head__desc--wide">
              {{ t('contactDesc1') }}
              {{ t('contactDesc2') }}
            </p>
          </div>

          <div class="contact-steps">
            <div v-for="s in contactSteps" :key="s.key" class="contact-step">
              <div class="contact-step__card">
                <span class="contact-step__key">{{ s.key }}</span>
                <h3 class="contact-step__title">{{ L(s.title) }}</h3>
                <p class="contact-step__desc">{{ L(s.desc) }}</p>
              </div>
            </div>
          </div>

          <div class="contact-cta">
            <div class="contact-cta__grid">
              <div>
                <h3 class="contact-cta__title">{{ t('readyTitle') }}</h3>
                <p class="contact-cta__desc">{{ t('readyDesc') }}</p>
                <div class="contact-cta__actions">
                  <a class="btn btn--whatsapp" href="/products" target="_blank">
                    <span aria-hidden="true" v-html="icon('whatsapp', 18)"></span>
                    {{ t('goContact') }}
                    <span aria-hidden="true" v-html="icon('externalLink', 16)"></span>
                  </a>
                </div>
              </div>

              <div class="script-box">
                <div class="script-box__head">
                  <span aria-hidden="true" v-html="icon('whatsapp', 18)"></span>
                  <span>{{ t('waTemplates') }}</span>
                </div>
                <div class="script-box__tabs">
                  <button
                    v-for="(tmpl, i) in templates"
                    :key="i"
                    class="script-box__tab"
                    :class="{ 'is-active': activeTemplate === i }"
                    @click="activeTemplate = i"
                  >{{ L(tmpl.label) }}</button>
                </div>
                <div class="script-box__body"><p>{{ L(templates[activeTemplate].content) }}</p></div>
                <button class="script-box__copy" type="button" @click="copyText(L(templates[activeTemplate].content))">
                  <span aria-hidden="true" v-html="icon('copy', 16)"></span>
                  <span>{{ t('copyMessage') }}</span>
                </button>
                <div class="note">
                  <span aria-hidden="true" v-html="icon('alertCircle', 16)"></span>
                  <p>{{ t('note') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ====================== Promo Scripts ====================== -->
      <section class="section section--alt" id="scripts">
        <div class="container">
          <div class="section-head">
            <span class="section-head__eyebrow">{{ t('scriptsEyebrow') }}</span>
            <h2 class="section-head__title">{{ t('scriptsTitle') }}</h2>
            <p class="section-head__desc">{{ t('scriptsDesc') }}</p>
          </div>

          <div class="scripts">
            <div class="script-tabs">
              <button
                v-for="(s, i) in scripts"
                :key="s.id"
                class="script-tab"
                :class="{ 'is-active': activeScript === i }"
                @click="activeScript = i"
              >{{ L(s.title) }}</button>
            </div>

            <div class="script-detail">
              <div class="script-detail__head">
                <h3 class="script-detail__title">{{ L(scripts[activeScript].title) }}</h3>
                <span class="tag" :class="'tag--' + scripts[activeScript].tone">{{ L(scripts[activeScript].category) }}</span>
              </div>
              <div class="script-detail__content">
                <div class="script-detail__quote"><p>{{ L(scripts[activeScript].content) }}</p></div>
                <button class="btn btn--brand" @click="copyText(L(scripts[activeScript].content))">
                  <span aria-hidden="true" v-html="icon('copy', 16)"></span>
                  {{ t('copy') }}
                </button>
              </div>
              <p class="mt1" style="color: var(--gray-500); font-size: .875rem;">{{ L(scripts[activeScript].usage) }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ====================== Video Tutorials ====================== -->
      <section class="section" id="videos" style="display:none;">
        <div class="container">
          <div class="section-head">
            <span class="section-head__eyebrow">{{ t('videosEyebrow') }}</span>
            <h2 class="section-head__title">{{ t('videosTitle') }}</h2>
            <p class="section-head__desc">{{ t('videosDesc') }}</p>
          </div>

          <div class="video-grid">
            <article v-for="v in videos" :key="v.id" class="video-card">
              <div class="video-card__media">
                <video class="video-card__video" :src="v.video" :poster="v.image" controls preload="metadata" playsinline></video>
                <span class="video-card__duration"><span v-html="icon('clock', 12)"></span>{{ v.duration }}</span>
              </div>
              <div class="video-card__body">
                <h3 class="video-card__title">{{ L(v.title) }}</h3>
                <p class="video-card__desc">{{ L(v.desc) }}</p>
              </div>
            </article>
          </div>

          <div class="video-feature">
            <div class="video-feature__grid">
              <div>
                <span class="video-feature__tag"><span v-html="icon('playCircle', 16)"></span>{{ t('featuredTutorial') }}</span>
                <h3 class="video-feature__title">{{ L(videoFeature.title) }}</h3>
                <p class="video-feature__desc">{{ L(videoFeature.desc) }}</p>
                <ul class="video-feature__steps">
                  <li v-for="(s, i) in videoFeature.steps" :key="i">{{ L(s) }}</li>
                </ul>
              </div>
              <div class="video-feature__media">
                <div class="video-feature__frame">
                  <video class="video-feature__video" :src="videoFeature.video" :poster="videoFeature.image" controls preload="metadata" playsinline></video>
                </div>
                <div class="video-feature__time"><b>{{ videoFeature.duration }}</b><span>{{ t('minToLearn') }}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ====================== Guarantees ====================== -->
      <section class="section section--alt">
        <div class="container">
          <div class="guarantee">
            <h3 class="guarantee__title">{{ t('guaranteeTitle') }}</h3>
            <div class="guarantee__grid">
              <div v-for="g in guarantees" :key="g.icon" class="guarantee__item">
                <span class="guarantee__icon" v-html="icon(g.icon, 28)"></span>
                <div class="guarantee__name">{{ L(g.title) }}</div>
                <p class="guarantee__desc">{{ L(g.desc) }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ====================== FAQ ====================== -->
      <section class="section section--alt" id="faq">
        <div class="container">
          <div class="section-head">
            <span class="section-head__eyebrow">{{ t('faqEyebrow') }}</span>
            <h2 class="section-head__title">{{ t('faqTitle') }}</h2>
            <p class="section-head__desc">{{ t('faqDesc') }}</p>
          </div>

          <div class="faq">
            <div v-for="(f, i) in faqs" :key="i" class="faq-item" :class="{ 'is-open': openFaq === i }">
              <button class="faq-item__q" @click="toggleFaq(i)">
                <span>{{ L(f.q) }}</span>
                <span v-html="icon('chevronDown', 20)"></span>
              </button>
              <div class="faq-item__a"><div><p>{{ L(f.a) }}</p></div></div>
            </div>
          </div>
          <p class="faq__foot">{{ t('faqFoot') }}</p>
        </div>
      </section>

      <!-- ====================== Footer CTA ====================== -->
      <section class="cta">
        <div class="cta__decor" aria-hidden="true">
          <span class="cta__blob cta__blob--a"></span>
          <span class="cta__blob cta__blob--b"></span>
        </div>

        <div class="cta__inner container">
          <h2 class="cta__title animate-fade-in-up">{{ t('ctaTitle') }}</h2>
          <p class="cta__desc animate-fade-in-up">
            {{ t('ctaDesc') }}
          </p>

          <div class="cta__actions animate-fade-in-up">
            <a class="btn btn--light" href="#stores">
              {{ t('joinNow') }}
              <span class="js-arrow" aria-hidden="true" v-html="icon('arrowRight', 20)"></span>
            </a>
            <a class="btn btn--outline-light" href="#steps">{{ t('seeProcess') }}</a>
          </div>

          <ul class="cta__benefits animate-fade-in-up">
            <li v-for="(b, i) in benefits" :key="i" class="cta__benefit">
              <span aria-hidden="true" v-html="icon('check', 16)"></span>
              <span>{{ L(b) }}</span>
            </li>
          </ul>
        </div>
      </section>
    </main>

    <!-- ====================== Footer ====================== -->
    <footer class="footer">
      <div class="container">
        <div class="footer__top">
          <div class="brand footer__brand">
            <img class="brand__logo" src="https://da-test.flylinking.com/_nuxt/Flylinking-logo.fjmDM9jT.svg" alt="FlyLink">
          </div>
          <p class="footer__copy">
            {{ t('footerCopy1') }}<br>
            {{ t('footerCopy2') }}
          </p>
        </div>
        <p class="footer__bottom">{{ t('footerBottom') }}</p>
      </div>
    </footer>

    <!-- 点击店铺卡片 → 商品列表弹窗（原有组件） -->
    <AffiliateStoreDialog
      v-if="isShowStoreDialog"
      v-model="isShowStoreDialog"
      :storeData="storeDialogData"
      :language="lang"
    ></AffiliateStoreDialog>
  </div>
</template>

<style>
/* ====================== Design Tokens & Global Reset（全局，非 scoped） ====================== */
:root {
  --brand: #753bff;
  --brand-dark: #5a2fd9;
  --brand-light: #8b5cff;
  --brand-soft: #695dff;
  --brand-soft-hover: #5a4ae6;

  --whatsapp: #57b97c;
  --whatsapp-dark: #1ebe5d;
  --whatsapp-tint: rgba(37, 211, 102, .1);
  --whatsapp-soft: rgba(37, 211, 102, .05);

  --ink-900: #111827;
  --ink-800: #1f2937;
  --ink-700: #374151;
  --gray-600: #4b5563;
  --gray-500: #6b7280;
  --gray-400: #9ca3af;
  --gray-300: #d1d5db;
  --gray-200: #e5e7eb;
  --gray-100: #f3f4f6;
  --gray-50: #f9fafb;
  --white: #ffffff;

  --flow-fill: rgb(49 113 236);
  --flow-border: rgb(238 246 255);
  --flow-border-active: rgb(80 159 248);

  --r-sm: .5rem;
  --r-md: .75rem;
  --r-lg: 1rem;
  --r-xl: 1.5rem;
  --r-2xl: 2rem;

  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / .05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / .1), 0 8px 10px -6px rgb(0 0 0 / .1);

  --container: 1360px;
  --section-y: 3rem;
  --ease: cubic-bezier(.4, 0, .2, 1);
}

[data-tone="violet"] { --tone-50: #f5f3ff; --tone-100: #ede9fe; --tone-200: #ddd6fe; --tone-500: #8b5cf6; --tone-600: #7c3aed; }
[data-tone="purple"] { --tone-50: #faf5ff; --tone-100: #f3e8ff; --tone-200: #e9d5ff; --tone-500: #a855f7; --tone-600: #9333ea; }
[data-tone="indigo"] { --tone-50: #eef2ff; --tone-100: #e0e7ff; --tone-200: #c7d2fe; --tone-500: #6366f1; --tone-600: #4f46e5; }
[data-tone="fuchsia"] { --tone-50: #fdf4ff; --tone-100: #fae8ff; --tone-200: #f5d0fe; --tone-500: #d946ef; --tone-600: #c026d3; }

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
</style>

<style lang="scss" scoped>
.affiliate-page {
  font-family: "PingFang SC", "Noto Sans SC", "Hiragino Sans GB", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: var(--ink-900);
  background: var(--white);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;

  img { display: block; max-width: 100%; }
  a { color: inherit; text-decoration: none; }
  button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
  ul { margin: 0; padding: 0; list-style: none; }
  h1, h2, h3, h4, p { margin: 0; }

  .container { width: 100%; max-width: var(--container); margin-inline: auto; padding-inline: 1rem; }
  .section { padding-block: var(--section-y); }
  .section--alt { background: var(--gray-50); }

  .section-head__eyebrow {
    display: inline-block; font-size: .875rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--brand);
  }
  .section-head__eyebrow--pill {
    display: inline-flex; align-items: center; gap: .5rem; border-radius: 9999px; background: var(--whatsapp-tint);
    padding: .375rem 1rem; text-transform: none; letter-spacing: 0; color: var(--whatsapp-dark);
  }
  .section-head__title { margin-top: .5rem; font-size: 1.875rem; font-weight: 700; line-height: 1.25; color: var(--ink-900); }
  .section-head__desc { margin: .75rem 0 0; max-width: 36rem; color: var(--gray-500); }
  .section-head__desc--wide { max-width: 42rem; }

  .icon { flex: none; display: block; }
  .btn:hover .js-arrow { transform: translateX(.25rem); }
  .num-dot {
    display: flex; height: 1.25rem; width: 1.25rem; flex: none; align-items: center; justify-content: center;
    border-radius: 9999px; background: var(--tone-500, var(--brand)); font-size: .75rem; font-weight: 700; color: var(--white);
  }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: .5rem; border-radius: var(--r-md);
    padding: .875rem 1.75rem; font-size: 1rem; font-weight: 600; line-height: 1.25; white-space: nowrap;
    transition: transform .2s var(--ease), box-shadow .2s var(--ease), background-color .2s var(--ease), color .2s var(--ease), border-color .2s var(--ease);
  }
  .btn--light { background: linear-gradient(270deg, #3b79ff, #5548ff); color: var(--white); box-shadow: var(--shadow-lg); }
  .btn--light:hover { transform: scale(1.05); box-shadow: var(--shadow-xl); }
  .btn--outline-light { border: 2px solid var(--gray-200); color: var(--ink-700); background: #fff; }
  .btn--brand { background: var(--whatsapp); color: var(--white); }
  .btn--brand:hover { background: var(--whatsapp-dark); }
  .btn--whatsapp { background: var(--whatsapp); color: var(--white); box-shadow: var(--shadow-md); }
  .btn--whatsapp:hover { background: var(--whatsapp-dark); box-shadow: var(--shadow-lg); transform: scale(1.05); }
  .btn:active { transform: scale(.95); }

  .note { display: flex; align-items: flex-start; gap: .5rem; border-radius: var(--r-sm); background: #fffbeb; padding: .75rem; }
  .note > .icon { margin-top: .125rem; color: #f59e0b; }
  .note p { font-size: .75rem; line-height: 1.7; color: #b45309; }

  .tag { display: inline-block; border-radius: 9999px; padding: 0 .5rem; font-size: .75rem; font-weight: 500; }
  .tag--blue { background: #dbeafe; color: #1d4ed8; }
  .tag--orange { background: #ffedd5; color: #c2410c; }

  /* Header */
  .site-header { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: rgba(255,255,255,.95); backdrop-filter: blur(12px); box-shadow: var(--shadow-md); }
  .site-header__bar { display: flex; align-items: center; justify-content: space-between; padding-block: .875rem; }
  .brand { display: flex; align-items: center; gap: .5rem; }
  .brand__logo { width: 3rem; object-fit: contain; }
  .footer__brand .brand__logo { width: 5rem; }
  .brand__name { font-size: 1.125rem; font-weight: 700; color: var(--ink-900); }
  .nav-links { display: none; align-items: center; gap: .25rem; }
  .nav-link { border-radius: var(--r-sm); padding: .5rem; font-size: .8rem; font-weight: 500; color: var(--gray-600); transition: background-color .2s var(--ease), color .2s var(--ease); }
  .nav-link:hover { background: var(--gray-100); color: var(--ink-900); }
  .nav-link--cta { margin-inline-start: .5rem; background: var(--brand-soft); color: var(--white); font-weight: 600; }
  .lang-toggle { margin-inline-start: .5rem; border: 1px solid var(--gray-200); border-radius: var(--r-sm); padding: .375rem .625rem; font-size: .875rem; font-weight: 600; color: var(--brand); background: var(--white); cursor: pointer; transition: all .2s var(--ease); }
  .lang-toggle:hover { background: var(--gray-50); }
  .nav-link--cta:hover { background: var(--brand-soft-hover); color: var(--white); }
  .nav-toggle { display: inline-flex; color: var(--ink-900); }
  .mobile-menu { margin: 0 1rem .5rem; border-radius: var(--r-lg); background: var(--white); padding: 1rem; box-shadow: var(--shadow-lg); }
  .mobile-menu__link { display: block; border-radius: var(--r-sm); padding: .75rem 1rem; font-size: .875rem; font-weight: 500; color: var(--ink-700); }
  .mobile-menu__link:hover { background: var(--gray-50); }
  .mobile-menu__cta { display: block; margin-top: .5rem; border-radius: var(--r-sm); background: var(--brand-soft); padding: .75rem 1rem; text-align: center; font-size: .875rem; font-weight: 600; color: var(--white); }

  /* Hero */
  .hero { position: relative; overflow: hidden; background-color: #e5dcff; background-size: 100% 100%; background-repeat: no-repeat; }
  .hero__decor { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .hero__blob { position: absolute; border-radius: 9999px; }
  .hero__blob--a { right: -5rem; top: -5rem; width: 20rem; height: 20rem; background: rgba(255,255,255,.05); filter: blur(64px); }
  .hero__blob--b { bottom: -8rem; left: 25%; width: 24rem; height: 24rem; background: rgba(139,92,255,.3); filter: blur(64px); }
  .hero__blob--c { right: 25%; top: 50%; width: 16rem; height: 16rem; background: rgba(255,255,255,.05); filter: blur(40px); }
  .hero__inner { position: relative; padding-top: 6rem; padding-bottom: 4rem; text-align: center; }
  .pill { display: inline-flex; align-items: center; gap: .5rem; border-radius: 9999px; background: rgb(172 154 182 / 63%); padding: .375rem 1rem; font-size: 1rem; font-weight: 500; color: #010d3b; backdrop-filter: blur(4px); }
  .pill__dot { width: .5rem; height: .5rem; border-radius: 9999px; background: #8a4cff; animation: pulse 2s infinite; }
  .hero__title { margin-top: 1.5rem; font-size: 2.25rem; font-weight: 700; color: transparent; background-image: linear-gradient(45deg, #5b48ff, #b14eff); background-clip: text; }
  .hero__actions { margin-top: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .75rem; }
  .stats { display: none; }

  /* Flow */
  .flow { margin-top: 3.5rem; }
  .flow__track { display: none; }
  .flow__item { position: relative; flex: 1; display: flex; flex-direction: column; align-items: center; cursor: pointer; }
  .flow__line { position: absolute; left: 50%; top: 1.75rem; height: 2px; width: 100%; border-radius: 9999px; background: var(--gray-200); pointer-events: none; }
  .flow__line-fill { height: 100%; width: 0; border-radius: 9999px; transition: width .5s var(--ease); }
  .flow__item.is-done .flow__line-fill { width: 100%; background: linear-gradient(to right, #a78bfa, #8b5cf6); }
  .flow__node { position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; }
  .flow__circle { position: relative; display: flex; align-items: center; justify-content: center; width: 4rem; height: 4rem; padding: .6rem; border: 4px solid rgb(185 218 255); border-radius: 9999px; background: var(--white); color: var(--white); transition: transform .3s var(--ease), border-color .3s var(--ease), box-shadow .3s var(--ease); }
  .flow__item.is-active .flow__circle { border-color: rgb(139 92 246); transform: scale(1.1); box-shadow: var(--shadow-lg); }
  .flow__inner { display: flex; height: 100%; width: 100%; align-items: center; justify-content: center; border-radius: 9999px; background: var(--flow-fill); }
  .flow__num { position: absolute; right: -.5rem; top: -.6rem; display: flex; height: 1.75rem; width: 1.75rem; align-items: center; justify-content: center; border-radius: 9999px; background: rgb(131 171 247); font-size: .75rem; font-weight: 700; color: var(--white); box-shadow: var(--shadow-sm); }
  .flow__item.is-active .flow__num { background: rgb(139 92 246); }
  .flow__label { margin-top: .75rem; max-width: 140px; text-align: center; font-size: .875rem; font-weight: 500; line-height: 1.25; color: var(--gray-500); }
  .flow__item.is-active .flow__label { color: var(--ink-900); }
  .flow__pills { display: flex; gap: .5rem; overflow-x: auto; padding-bottom: .5rem; }
  .flow__pill { display: flex; flex: none; align-items: center; gap: .5rem; border: 1px solid var(--gray-200); border-radius: 9999px; background: var(--white); padding: .5rem 1rem; font-size: .875rem; font-weight: 500; color: var(--gray-500); transition: all .2s var(--ease); }
  .flow__pill:hover{ border-color: rgb(139, 92, 246) }
  .flow__pill.is-active { background: var(--tone-50); border-color: rgb(139, 92, 246); color: rgb(117 59 254); }
  .flow__pill-num { display: flex; height: 1.25rem; width: 1.25rem; align-items: center; justify-content: center; border-radius: 9999px; background: var(--flow-fill); font-size: .75rem; font-weight: 700; color: var(--white); }
  .flow__panel { margin-top: 2.5rem; overflow: hidden; border: 1px solid var(--gray-100); border-radius: var(--r-2xl); background: var(--white); box-shadow: var(--shadow-sm); }
  .flow__grid { display: grid; }
  .flow__left { padding: 2rem; background: var(--tone-50); }
  .flow__right { padding: 2rem; }
  .flow__head { display: flex; align-items: center; gap: .75rem; }
  .flow__icon-box { display: flex; height: 3rem; width: 3rem; align-items: center; justify-content: center; border-radius: var(--r-md); background: var(--white); box-shadow: var(--shadow-sm); color: var(--tone-600); }
  .flow__step-tag { font-size: .875rem; font-weight: 500; color: var(--tone-600); }
  .flow__step-title { font-size: 1.25rem; font-weight: 700; color: var(--ink-900); }
  .flow__detail { margin-top: 1.25rem; color: var(--ink-700); line-height: 1.75; }
  .flow__right-title { font-size: .875rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--gray-400); }
  .flow__tips { display: grid; font-size: .875rem; }
  .flow__tip { display: flex; align-items: flex-start; gap: .75rem; color: var(--ink-700); padding: .5rem .75rem; }
  .flow__tip .num-dot { margin-top: .125rem; }
  .flow__figure { margin-top: 1.25rem; overflow: hidden; border: 1px solid rgba(255,255,255,.6); border-radius: var(--r-md); box-shadow: var(--shadow-sm); }
  .flow__figure img { aspect-ratio: 15 / 10; width: 100%; object-fit: cover; }
  .flow__sub { display: grid; }
  .flow__sub-item { display: flex; gap: .625rem; border-radius: var(--r-sm); background: rgba(255,255,255,.5); padding: .5rem .75rem; }
  .flow__sub-item span:last-child { font-size: .875rem; color: var(--ink-700); }
  .flow__nav { margin-top: 2rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--gray-100); padding-top: 1.5rem; }
  .flow__nav-btn { display: flex; align-items: center; gap: .25rem; font-size: .875rem; font-weight: 500; color: var(--gray-400); transition: color .2s var(--ease); }
  .flow__nav-btn:not(:disabled) { color: var(--gray-600); }
  .flow__nav-btn:not(:disabled):hover { color: var(--ink-900); }
  .flow__nav-btn--next:not(:disabled) { color: var(--brand); }
  .flow__nav-btn--next:not(:disabled):hover { color: var(--brand-dark); }
  .flow__nav-btn:disabled { cursor: default; opacity: .4; }
  .flow__progress { font-size: .875rem; color: var(--gray-400); }
  .icon--flip { transform: rotate(180deg); }

  /* Store grid & card */
  .store-grid { margin-top: 3rem; display: grid; gap: 1.5rem; }
  .store-card { display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--gray-100); border-radius: var(--r-xl); background: var(--white); box-shadow: var(--shadow-sm); transition: box-shadow .3s var(--ease); cursor: pointer; }
  .store-card:hover { box-shadow: var(--shadow-xl); }
  .store-card__media { display: flex; align-items: center; justify-content: space-between; padding: 8px 1.25rem 0; }
  .store-card__merchant-icon { display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: var(--r-md); background: rgb(232 235 235); box-shadow: var(--shadow-sm); }
  .store-card__tags { display: inline-flex; align-items: center; gap: .375rem; max-width: 80%; }
  .store-card__tag { border-radius: 9999px; background: #dee7e0; padding: .125rem .625rem; font-size: .75rem; font-weight: 500; color: #0e5529; }
  .store-card__tag--commission { background: #ff9c17; color: #fff; }
  .store-card__body { display: flex; flex-direction: column; flex: 1 1 auto; padding: 1.25rem; }
  .store-card__name { font-size: 1.125rem; font-weight: 700; }
  .store-card__desc { margin-top: .5rem; font-size: .875rem; line-height: 1.7; color: var(--gray-500); }
  .store-card__commission { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 1rem; }
  .store-card__commission dt { font-size: .875rem; font-weight: 500; color: var(--gray-600); }
  .store-card__commission dd { margin: 0; font-size: 1.875rem; font-weight: 700; line-height: 1; color: var(--whatsapp); }
  .store-card__btn { width: 100%; margin-top: .75rem; display: inline-flex; align-items: center; justify-content: center; gap: .375rem; border-radius: var(--r-md); padding: .625rem 0; font-weight: 600; color: var(--white); transition: background-color .2s var(--ease), box-shadow .2s var(--ease), transform .2s var(--ease); }
  .store-card__btn--join { background: var(--brand-soft); }
  .store-card__btn--join:hover { background: var(--brand-soft-hover); box-shadow: var(--shadow-md); }
  .store-pagination { margin-top: 2rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; }

  /* Contact guide */
  .contact-steps { margin-top: 3.5rem; display: grid; gap: 1.5rem; }
  .contact-step__card { height: 100%; border: 2px solid var(--gray-100); border-radius: var(--r-xl); background: var(--white); padding: 1.5rem; transition: border-color .3s var(--ease), box-shadow .3s var(--ease); }
  .contact-step__card:hover { border-color: #ddd6fe; box-shadow: var(--shadow-lg); }
  .contact-step__key { display: flex; height: 2.75rem; width: 2.75rem; align-items: center; justify-content: center; border-radius: var(--r-md); background: var(--brand); font-size: 1.125rem; font-weight: 700; color: var(--white); box-shadow: var(--shadow-sm); }
  .contact-step__title { margin-top: 1rem; font-weight: 700; }
  .contact-step__desc { margin-top: .5rem; font-size: .875rem; line-height: 1.7; color: var(--gray-500); }
  .contact-cta { margin-top: 2.5rem; overflow: hidden; border: 1px solid #ede9fe; border-radius: var(--r-2xl); background: linear-gradient(to bottom right, #f5f3ff, #faf5ff); padding: 2rem; }
  .contact-cta__grid { display: grid; gap: 2rem; align-items: center; }
  .contact-cta__title { font-size: 1.25rem; font-weight: 700; }
  .contact-cta__desc { margin-top: .5rem; color: var(--gray-600); }
  .contact-cta__actions { margin-top: 1.25rem; display: flex; flex-direction: column; gap: .75rem; }

  .script-box { border-radius: var(--r-xl); background: var(--white); padding: 1.25rem; box-shadow: var(--shadow-sm); }
  .script-box__head { display: flex; align-items: center; gap: .5rem; border-bottom: 1px solid var(--gray-100); padding-bottom: .75rem; }
  .script-box__head > .icon { color: var(--whatsapp); }
  .script-box__head span { font-size: .875rem; font-weight: 600; color: var(--ink-700); }
  .script-box__tabs { margin-top: .75rem; display: flex; flex-wrap: wrap; gap: .5rem; }
  .script-box__tab { border-radius: var(--r-sm); padding: .375rem .75rem; font-size: .75rem; font-weight: 500; background: var(--gray-100); color: var(--gray-500); transition: all .2s var(--ease); }
  .script-box__tab.is-active { background: var(--whatsapp); color: var(--white); }
  .script-box__body { margin-top: .75rem; border-radius: var(--r-md); background: var(--whatsapp-soft); padding: 1rem; }
  .script-box__body p { font-size: .875rem; line-height: 1.75; color: var(--ink-700); }
  .script-box__copy { margin-top: .75rem; width: 100%; display: flex; align-items: center; justify-content: center; gap: .5rem; border-radius: var(--r-sm); background: var(--whatsapp); padding: .625rem; font-size: .875rem; font-weight: 600; color: var(--white); transition: background-color .2s var(--ease), transform .2s var(--ease); }
  .script-box__copy:hover { background: var(--whatsapp-dark); }

  /* Promo scripts */
  .scripts { margin-top: 3rem; }
  .script-tabs { display: flex; gap: 2rem; border-bottom: 1px solid var(--gray-200); margin-bottom: 1.25rem; }
  .script-tab { flex: none; padding: .75rem 0; font-size: .9375rem; font-weight: 500; color: var(--gray-500); border-bottom: 2px solid transparent; margin-bottom: -1px; cursor: pointer; white-space: nowrap; transition: color .2s var(--ease), border-color .2s var(--ease); }
  .script-tab:hover { color: var(--brand); }
  .script-tab.is-active { color: var(--brand); border-bottom-color: var(--brand); font-weight: 600; }
  .script-detail { border: 1px solid var(--gray-100); border-radius: var(--r-xl); background: var(--white); padding: 1.5rem; box-shadow: var(--shadow-sm); }
  .script-detail__head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .script-detail__title { font-size: 1.25rem; font-weight: 700; }
  .script-detail__content { display: flex; align-items: end; }
  .script-detail__quote { margin: 20px 20px 0 0; border-radius: var(--r-md); background: var(--whatsapp-soft); padding: 1.25rem; flex: 1; }
  .script-detail__quote p { font-size: 1.125rem; line-height: 1.75; color: var(--ink-800); }
  .script-detail .btn { margin-top: 1rem; height: 40px; max-width: 300px; }

  /* Videos */
  .video-grid { margin-top: 3rem; display: grid; gap: 1.5rem; }
  .video-card { overflow: hidden; border: 1px solid var(--gray-100); border-radius: var(--r-xl); background: var(--white); box-shadow: var(--shadow-sm); cursor: pointer; transition: box-shadow .3s var(--ease), transform .3s var(--ease); }
  .video-card:hover { box-shadow: var(--shadow-xl); transform: translateY(-.25rem); }
  .video-card__media { position: relative; height: 12rem; overflow: hidden; background: linear-gradient(135deg, #ddd6fe, #c7d2fe); }
  .video-card__play { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.3); }
  .video-card__play > .icon { color: rgba(255,255,255,.9); }
  .video-card__duration { position: absolute; right: .75rem; bottom: .75rem; display: flex; align-items: center; gap: .25rem; border-radius: 9999px; background: rgba(0,0,0,.6); padding: .25rem .625rem; font-size: .75rem; font-weight: 500; color: var(--white); }
  .video-card__body { padding: 1.25rem; }
  .video-card__title { font-size: 1.125rem; font-weight: 700; }
  .video-card__desc { margin-top: .5rem; font-size: .875rem; color: var(--gray-500); }
  .video-card__video { height: 100%; width: 100%; object-fit: cover; display: block; }

  .video-feature { margin-top: 2rem; overflow: hidden; border-radius: var(--r-2xl); background: #abb8cd; padding: 2rem; }
  .video-feature__grid { display: grid; gap: 2rem; align-items: center; }
  .video-feature__tag { display: inline-flex; align-items: center; gap: .5rem; border-radius: 9999px; background: rgba(255,255,255,.15); padding: .25rem .75rem; font-size: .875rem; font-weight: 500; color: var(--white); }
  .video-feature__title { margin-top: 1rem; font-size: 1.5rem; font-weight: 700; color: var(--white); }
  .video-feature__desc { margin-top: .75rem; line-height: 1.75; color: rgba(255,255,255,.8); }
  .video-feature__steps { margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: .75rem; }
  .video-feature__steps li { border-radius: var(--r-sm); background: rgba(255,255,255,.1); padding: .5rem 1rem; font-size: .875rem; color: rgba(255,255,255,.9); }
  .video-feature__media { position: relative; }
  .video-feature__frame { position: relative; overflow: hidden; border-radius: var(--r-xl); box-shadow: var(--shadow-xl); }
  .video-feature__frame video { width: 100%; object-fit: cover; display: block; }
  .video-feature__time { position: absolute; right: -1rem; top: -1rem; border-radius: var(--r-md); background: var(--white); padding: 1rem; box-shadow: var(--shadow-xl); }
  .video-feature__time b { display: block; font-size: 1.5rem; font-weight: 700; color: var(--brand); }
  .video-feature__time span { font-size: .75rem; color: var(--gray-400); }

  /* Guarantee */
  .guarantee { border: 1px solid #ddd6fe; border-radius: var(--r-2xl); background: #e8e3ff; padding: 2rem; }
  .guarantee__title { text-align: center; font-size: 1.5rem; font-weight: 700; }
  .guarantee__grid { margin-top: 2rem; display: grid; gap: 1.5rem; }
  .guarantee__item { text-align: center; }
  .guarantee__icon { margin-inline: auto; display: flex; height: 3.5rem; width: 3.5rem; align-items: center; justify-content: center; border-radius: var(--r-lg); background: #5b4bff; color: var(--white); }
  .guarantee__name { margin-top: 1rem; font-weight: 600; }
  .guarantee__desc { margin-top: .25rem; font-size: .875rem; color: var(--gray-600); }

  /* FAQ */
  .faq { margin-top: 3rem; display: grid; gap: .75rem; }
  .faq-item { overflow: hidden; border: 1px solid var(--gray-100); border-radius: var(--r-xl); background: var(--white); box-shadow: var(--shadow-sm); }
  .faq-item__q { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.5rem; text-align: left; font-weight: 600; }
  .faq-item__q > .icon { color: var(--gray-400); transition: transform .3s var(--ease); }
  .faq-item.is-open .faq-item__q > .icon { transform: rotate(180deg); }
  .faq-item__a { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows .3s var(--ease), opacity .3s var(--ease); }
  .faq-item.is-open .faq-item__a { grid-template-rows: 1fr; opacity: 1; }
  .faq-item__a > div { overflow: hidden; }
  .faq-item__a p { padding: 0 1.5rem 1.25rem; color: var(--gray-600); line-height: 1.75; }
  .faq__foot { margin-top: 2.5rem; text-align: center; font-size: .875rem; color: var(--gray-400); }

  /* CTA & Footer */
  .cta { position: relative; overflow: hidden; background: #7a5ff7; padding-block: var(--section-y); }
  .cta__decor { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .cta__blob { position: absolute; border-radius: 9999px; }
  .cta__blob--a { right: -5rem; top: -5rem; width: 20rem; height: 20rem; background: rgba(255,255,255,.05); filter: blur(64px); }
  .cta__blob--b { bottom: -8rem; left: 25%; width: 24rem; height: 24rem; background: rgba(139,92,255,.3); filter: blur(64px); }
  .cta__inner { position: relative; text-align: center; }
  .cta__title { font-size: 1.875rem; font-weight: 700; line-height: 1.25; color: var(--white); }
  .cta__desc { margin: 1.25rem auto 0; max-width: 42rem; font-size: 1.125rem; color: rgba(255,255,255,.8); }
  .cta__actions { margin-top: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .75rem; }
  .cta__benefits { margin-top: 2.5rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: .5rem 1.5rem; }
  .cta__benefit { display: flex; align-items: center; gap: .5rem; }
  .cta__benefit > .icon { color: rgba(255,255,255,.7); }
  .cta__benefit span { font-size: .875rem; color: rgba(255,255,255,.8); }

  .footer { background: #0a0945; padding-block: 3rem; }
  .footer__top { display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 1.5rem; text-align: center; }
  .footer__brand .brand__name { color: var(--white); }
  .footer__copy { font-size: .875rem; line-height: 1.75; color: var(--gray-400); }
  .footer__bottom { margin-top: 2rem; border-top: 1px solid var(--ink-800); padding-top: 1.5rem; text-align: center; font-size: .75rem; color: var(--gray-500); }

  /* Animations */
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pulse { 50% { opacity: .5; } }
  @keyframes ctaGlow { 0%, 100% { box-shadow: 0 8px 20px rgb(96 53 151 / 62%); } 50% { box-shadow: 0 10px 30px rgb(98 61 120 / 32%), 0 0 0 5px rgba(255, 255, 255, .12); } }
  .animate-fade-in-up { animation: fadeInUp .7s ease-out both; }
  .animate-fade-in { animation: fadeIn .7s ease-out both; }
  .animate-cta-glow { animation: ctaGlow 2.6s ease-in-out infinite; }
  .mt1 { margin-top: 1rem; }

  /* ====================== Responsive ====================== */
  @media (min-width: 768px) {
    .nav-links { display: flex; }
    .nav-toggle, .mobile-menu { display: none; }
    .hero__inner { padding-top: 7rem; padding-bottom: 6rem; }
    .hero__title { font-size: 3.75rem; }
    .flow__track { display: flex; align-items: flex-start; justify-content: space-between; }
    .flow__pills { display: none; }
    .flow__grid { grid-template-columns: 1fr 1fr; }
    .flow__left, .flow__right { padding: 2.5rem; }
    .store-grid { grid-template-columns: repeat(2, 1fr); }
    .contact-steps { grid-template-columns: repeat(2, 1fr); }
    .contact-cta { padding: 2.5rem; }
    .contact-cta__grid { grid-template-columns: 1fr 2fr; }
    .contact-cta__title { font-size: 1.5rem; }
    .contact-cta__actions { flex-direction: row; }
    .video-grid { grid-template-columns: repeat(3, 1fr); }
    .video-feature { padding: 3rem; }
    .video-feature__grid { grid-template-columns: 1fr 1fr; }
    .video-feature__title { font-size: 1.875rem; }
    .guarantee { padding: 3rem; }
    .guarantee__title { font-size: 1.875rem; }
    .guarantee__grid { grid-template-columns: repeat(2, 1fr); }
    .cta__title { font-size: 3rem; }
    .cta__actions { flex-direction: row; }
    .footer__top { flex-direction: row; text-align: left; }
    .footer__copy { text-align: right; }
    [dir="rtl"] .footer__top { text-align: right; }
    [dir="rtl"] .footer__copy { text-align: left; }
  }
  @media (min-width: 640px) {
    .hero__actions { flex-direction: row; }
  }
  @media (min-width: 1024px) {
    .store-grid { grid-template-columns: repeat(3, 1fr); }
    .contact-steps { grid-template-columns: repeat(4, 1fr); }
    .guarantee__grid { grid-template-columns: repeat(4, 1fr); }
  }
  @media (min-width: 1280px) {
    .store-grid { grid-template-columns: repeat(4, 1fr); }
  }
  @media (max-width: 768px) {
    .script-detail__content { display: block; }
    .script-detail__quote { margin: 20px 0 0; }
  }

  /* RTL（希伯来语）适配：镜像物理方向 */
  [dir="rtl"] .btn:hover .js-arrow { transform: translateX(-.25rem); }
  [dir="rtl"] .flow__num { right: auto; left: -.5rem; }
  [dir="rtl"] .video-card__duration { right: auto; left: .75rem; }
  [dir="rtl"] .video-feature__time { right: auto; left: -1rem; }
  [dir="rtl"] .faq-item__q { text-align: right; }
  [dir="rtl"] .hero__blob--a { right: auto; left: -5rem; }
  [dir="rtl"] .hero__blob--b { left: auto; right: 25%; }
  [dir="rtl"] .hero__blob--c { right: auto; left: 25%; }
  [dir="rtl"] .cta__blob--a { right: auto; left: -5rem; }
  [dir="rtl"] .cta__blob--b { left: auto; right: 25%; }
}
</style>
