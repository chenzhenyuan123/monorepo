<!--  
 * @Author: czy
 * @Description: 分销员招募平台（新版设计稿）
-->
<script setup name="Affiliate">
import { checkResponseData, copyToClipboard, successMessage } from "@/util";
import { currencyFormat } from "@/util/index.js";
import { sendLog } from "@flylinking/core/utils/logUtil";
import { dayjs } from "@flylinking/core/utils/dateUtil";

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
const nav = [ // 文案已修改
  { href: '#steps', label: { en: 'Distribution Steps', he: 'שלבי ההפצה' } },
  { href: '#stores', label: { en: 'Top-Rated Stores', he: 'חנויות עם הדירוג הגבוה ביותר' } },
  { href: '#scripts', label: { en: 'Recommended Scripts', he: 'תסריטים מומלצים' } },
  // { href: '#videos', label: { en: 'Video Tutorials', he: 'מדריכי וידאו' } },
  { href: '#faq', label: { en: 'FAQ', he: 'שאלות נפוצות' } }
]

const steps = [ // 文案已修改
  {
    num: 1, tone: 'violet', icon: 'userPlus',
    title: { en: 'Join the Store as a Distributor', he: 'הצטרפו לחנות כמפיצים' },
    detail: { en: "Browse the list of stores below, select high-quality stores whose products meet the needs of your local audience, and then click “Join Now” Once you’ve joined, you’ll gain permission to promote that store.", he: 'עיין ברשימת החנויות שלמטה, בחר חנויות איכותיות שמוצריהן עונים על צרכי הקהל המקומי שלך, ולאחר מכן לחץ על "הצטרף עכשיו". לאחר ההצטרפות, תקבל הרשאה לקדם את החנות הזו.' },
    subSteps: [
      { en: 'Browse Stores—Browse stores that interest you.', he: 'עיון בחנויות — עיון בחנויות שמעניינות אותך.' },
      { en: 'Select a store that offers products popular in your local market by category.', he: 'בחר חנות המציעה מוצרים פופולריים בשוק המקומי שלך לפי קטגוריה.' },
      { en: 'Click “Join Now”—Get promotional access immediately.', he: 'לחץ על "הצטרף עכשיו" — קבל גישה לקידום מכירות באופן מיידי.' },
      { en: 'You can join multiple stores—promote products from different categories at the same time.', he: 'אתה יכול להצטרף למספר חנויות — ולשווק מוצרים מקטגוריות שונות בו-זמנית.' }
    ],
    tips: [
      { en: 'Focus on categories you’re familiar with—this makes your promotions feel more natural and helps build trust.', he: 'התמקד בקטגוריות שאתה מכיר — כך המבצעים שלך ייראו טבעיים יותר ויסייעו בבניית אמון.' },
      { en: 'Start by running one store on a trial basis, then join more stores to expand your reach.', he: 'התחל בהפעלת חנות אחת לתקופת ניסיון, ולאחר מכן צרף חנויות נוספות כדי להרחיב את טווח ההגעה שלך.' },
      { en: 'Start small by choosing categories that align with local bestsellers, then expand quickly.', he: 'התחילו בקטן על ידי בחירת קטגוריות התואמות את רבי-המכר המקומיים, ואז התרחבו במהירות.' }
    ],
    image: joinNowImg
  },
  {
    num: 2, tone: 'purple', icon: 'message',
    title: { en: 'Contact the Seller on the Product Menu', he: 'צרו קשר עם המוכר בתפריט המוצר' },
    detail: { en: 'After joining, open the Product menu, click on the store’s contact information, and you can chat directly with the seller via WhatsApp. You can communicate naturally as a buyer or distributor and inquire about best-selling products, inventory status, and available promotional materials.', he: 'לאחר ההרשמה, פתחו את תפריט "מוצרים", לחצו על פרטי יצירת הקשר של החנות, ותוכלו לשוחח ישירות עם המוכר באמצעות WhatsApp. תוכלו לתקשר באופן טבעי כקונים או כמפיצים ולברר אודות המוצרים הנמכרים ביותר, מצב המלאי וחומרי קידום מכירות זמינים.' },
    subSteps: [
      { en: 'Open the Product menu and locate the store\'s contact information."', he: 'פתח את תפריט "מוצר" ואיתור פרטי יצירת הקשר של החנות.' },
      { en: 'Clicking it will automatically open a WhatsApp chat window.', he: 'לחיצה עליו תפתח באופן אוטומטי חלון צ\'אט ב-WhatsApp.' },
      { en: 'Send a message explaining your interest in promoting the product.', he: 'שלח הודעה שבה תסביר את העניין שלך בקידום המוצר.' },
      { en: 'Ask the seller for links, images, and promotional materials for their best-selling products.', he: 'בקש מהמוכר קישורים, תמונות וחומרי קידום מכירות עבור המוצרים הנמכרים ביותר שלו.' }
    ],
    tips: [
      { en: 'Click Contact in the Product menu to start a WhatsApp chat.', he: 'לחץ על "צור קשר" בתפריט "מוצר" כדי לפתוח צ\'אט ב-WhatsApp.' },
      { en: "Ask about best-selling products, inventory status, and commission policies.", he: 'שאלו על המוצרים הנמכרים ביותר, מצב המלאי ומדיניות העמלות.' },
      { en: 'Request product images and promotional materials from the seller.', he: 'בקש מהמוכר תמונות של המוצר וחומרי קידום מכירות.' }
    ],
    image: contactImg
  },
  {
    num: 3, tone: 'indigo', icon: 'share',
    title: { en: 'Get Your Link & Share with Buyers', he: 'קבלו את הקישור שלכם ושתפו אותו עם הקונים' },
    detail: { en: 'After confirming the product with the seller, go to the store’s homepage or the product page and copy the unique promotional link that includes your affiliate ID.', he: 'לאחר שתאשר את המוצר מול המוכר, עבור לדף הבית של החנות או לדף המוצר והעתק את הקישור הייחודי לקידום המכירות, הכולל את מזהה השותף שלך.' },
    subSteps: [
      { en: 'We\'ve found products that are perfect for your friends.', he: 'מצאנו מוצרים שמתאימים בדיוק לחברים שלך.' },
      { en: 'Click "Get Affiliate Link" on the store Home or Product menu.', he: 'לחץ על "קבל קישור שותפים" בדף הבית של החנות או בתפריט המוצרים.' },
      { en: 'Copy your unique link with your affiliate ID.', he: 'העתק את הקישור הייחודי שלך הכולל את מזהה השותף שלך.' },
      { en: 'Share it with your community, groups, or privately with friends who might need this product.', he: 'שתפו את המידע עם הקהילה שלכם, בקבוצות או באופן פרטי עם חברים שעשויים להזדקק למוצר זה.' }
    ],
    tips: [
      { en: 'Search for suitable products in the product menu.', he: 'חפש מוצרים מתאימים בתפריט המוצרים.' },
      { en: 'Click “Get Affiliate Link” to copy the unique link containing your affiliate ID.', he: 'לחץ על "קבל קישור שותפים" כדי להעתיק את הקישור הייחודי המכיל את מזהה השותף שלך.' },
      { en: 'Share the product with friends who might be interested.', he: 'שתף את המוצר עם חברים שעשויים להתעניין בו.' }
    ],
    image: getLinkImg
  },
  {
    num: 4, tone: 'fuchsia', icon: 'wallet',
    title: { en: 'Buyers Pay, You Earn Commissions', he: 'המתן לתשלום, הרווח עמלה' },
    detail: { en: 'Once a buyer places an order through your referral link and successfully completes payment, you’ll immediately see your commission earnings. The system will automatically credit the commission to your wallet—no manual request is required—making the process safe and reliable.', he: 'כאשר קונים מבצעים הזמנות ומשלמים בהצלחה דרך קישור הקידום שלך, הם יכולים לראות מיד את הכנסות העמלה, והמערכת תסדיר את העמלה לארנק שלך אוטומטית ללא בקשה ידנית, מה שבטוח ואמין.' },
    subSteps: [
      { en: 'Buyers can access the product page and place an order through your referral link.', he: 'הקונים יכולים לגשת לדף המוצר ולבצע הזמנה באמצעות קישור ההפניה שלך.' },
      { en: 'Once payment is successful, you can immediately view your estimated commission earnings.', he: 'ברגע שהתשלום יבוצע בהצלחה, תוכל לראות מיד את הרווחים המשוערים מהעמלות שלך.' },
      { en: 'The system will automatically credit the commission to your wallet.', he: 'המערכת תזכה את הארנק שלך בעמלה באופן אוטומטי.' },
      { en: 'View commission details and expenses in your wallet.', he: 'צפה בפרטי העמלות וההוצאות בארנק שלך.' }
    ],
    tips: [
      { en: 'Once the buyer makes a payment, the commission is automatically credited to your wallet.', he: 'ברגע שהקונה מבצע את התשלום, העמלה נזקפת אוטומטית לארנק שלך.' },
      { en: 'View commission details in your wallet.', he: 'צפה בפרטי העמלה בארנק שלך.' },
      { en: 'The platform’s transaction guarantee ensures the security of your funds.', he: 'ערבות העסקאות של הפלטפורמה מבטיחה את אבטחת כספיכם.' }
    ],
    image: walletImg
  }
]

const contactSteps = [ // 文案已修改
  { key: 'A', title: { en: 'Open the Products menu', he: 'פתח את תפריט \'מוצרים\'' }, desc: { en: 'After joining, open the product menu, select the store, and view the store contact information', he: 'לאחר ההרשמה, פתחו את תפריט המוצרים, בחרו את החנות והציגו את פרטי יצירת הקשר של החנות' } },
  { key: 'B', title: { en: 'Click on the store contact information', he: 'לחץ על פרטי יצירת הקשר של החנות' }, desc: { en: 'Find the store\'s contact information in the product menu, then tap the “WhatsApp” contact option to start a chat.', he: 'מצא את פרטי יצירת הקשר של החנות בתפריט המוצרים, ולאחר מכן הקש על אפשרות יצירת הקשר "WhatsApp" כדי לפתוח צ\'אט.' } },
  { key: 'C', title: { en: 'Send a Message', he: 'שלח הודעה' }, desc: { en: 'Copy the template below, paste it into the WhatsApp chat and send it to the seller to naturally introduce your promotion intent', he: 'העתיקו את התבנית שלמטה, הדביקו אותה בצ\'אט של ווטסאפ ושלחו אותה למוכר כדי להציג באופן טבעי את כוונתכם לקידום מכירות' } },
  { key: 'D', title: { en: 'Get Product Details', he: 'קבל פרטים על המוצר' }, desc: { en: 'After confirming the best-selling products with the seller, please request the promotional links and product images for those items, and make sure your affiliate ID is included in the links.', he: 'לאחר שתאמת עם המוכר אילו מוצרים הם הנמכרים ביותר, אנא בקש את הקישורים לקידום מכירות ותמונות המוצרים עבור פריטים אלה, וודא שמספר הזיהוי שלך כשותף כלול בקישורים.' } }
]

const templates = [ // 文案已修改
  { label: { en: 'Formal', he: 'פורמלי' }, content: { en: 'Hello, I am a distributor on the Flylink platform and am very interested in your store’s products. Could you please tell me about your best-selling products and commission policy? I look forward to working with your store! Thank you.', he: 'שלום, אני מפיץ בפלטפורמת Flylink ואני מתעניין מאוד במוצרים של החנות שלכם. האם תוכלו לספר לי על המוצרים הנמכרים ביותר שלכם ועל מדיניות העמלות שלכם? אני מצפה לעבוד עם החנות שלכם! תודה.' } },
  { label: { en: 'Relaxed', he: 'נינוח' }, content: { en: "Hello, I’ve been recommending great products to my friends lately, and I stumbled upon your store—your products are really excellent. Could you recommend some of your best-selling items? Would you be able to send me some promotional links and images for reference?", he: 'שלום, לאחרונה אני ממליץ לחברים שלי על מוצרים מעולים, ונתקלתי במקרה בחנות שלכם — המוצרים שלכם באמת מצוינים. האם תוכלו להמליץ לי על כמה מהמוצרים הנמכרים ביותר שלכם? האם תוכלו לשלוח לי כמה קישורים ותמונות לקידום מכירות לשם התייחסות?' } },
  { label: { en: 'Community Promo', he: 'מבצע קהילתי' }, content: { en: 'Hello, I run a shopping community and would like to recommend your company’s best-selling products to my group members. Could you please provide links to your best-selling products, product images, and information on your affiliate commission policy? Thank you!', he: 'שלום, אני מנהל קהילת קניות והייתי רוצה להמליץ לחברי הקבוצה שלי על המוצרים הנמכרים ביותר של החברה שלכם. האם תוכלו לספק לי קישורים למוצרים הנמכרים ביותר שלכם, תמונות של המוצרים ומידע על מדיניות העמלות שלכם לתוכנית השותפים? תודה!' } }
]

const scripts = [ // 文案已修改
  {
    id: 'friend-recommend', tone: 'blue',
    title: { en: 'Private Recommendation', he: 'המלצה פרטית' },
    category: { en: '1-on-1 Recommendation', he: 'המלצה אישית' },
    content: { en: 'Hi! I heard you were looking for XX product the other day, and I just happened to come across a store that offers great quality, affordable prices, and is very reliable. Here’s my exclusive referral link. Please take a look, and let me know if it meets your expectations. If you have any questions, feel free to contact me anytime!', he: 'היי! שמעתי שלאחרונה חיפשת את המוצר XX, ובמקרה נתקלתי בחנות שמציעה איכות מעולה, מחירים נוחים והיא אמינה מאוד. הנה קישור ההפניה הבלעדי שלי. אנא תסתכל, ותודיע לי אם זה עונה על הציפיות שלך. אם יש לך שאלות, אל תהסס לפנות אליי בכל עת!' },
    usage: { en: 'Great for recommending products to friends in private chat, natural and not pushy', he: 'נהדר להמלצה על מוצרים לחברים בצ\'אט פרטי, בצורה טבעית ולא אגרסיבית' },
    tip: { en: 'Understand their needs before recommending to avoid a mass-message feel, and follow up on their experience after.', he: 'הבינו את צרכיהם לפני שתמליצו, כדי להימנע מתחושת "הודעה המונית", ועקבו אחר חווייתם לאחר מכן.' }
  },
  {
    id: 'group-share', tone: 'orange',
    title: { en: 'Community Promo', he: 'מבצע קהילתי' },
    category: { en: 'Group Share', he: 'שיתוף קבוצתי' },
    content: { en: 'Dear family, I recently discovered a high-quality, affordable product. I’ve been using it myself for a while now and think it’s pretty great, so I wanted to share it with you all! Here’s the link. If you’re interested, feel free to check it out, and let me know if you have any questions~', he: 'משפחה יקרה, לאחרונה גיליתי מוצר איכותי ובמחיר סביר. אני משתמשת בו בעצמי כבר זמן מה ומאוד מרוצה ממנו, ולכן רציתי לשתף אתכם בו! הנה הקישור. אם אתם מעוניינים, אתם מוזמנים לבדוק אותו, ותודיעו לי אם יש לכם שאלות~' },
    usage: { en: 'Perfect for sharing in groups and communities, the tone is friendly and natural.', he: 'מושלם לשיתוף בקבוצות ובקהילות, והטון ידידותי וטבעי.' },
    tip: { en: 'It\'s best to interact with the community a bit first, posting a link out of the blue might make people feel uncomfortable.', he: 'עדיף קודם כל ליצור קצת אינטראקציה עם הקהילה; פרסום קישור פתאום עלול לגרום לאנשים להרגיש לא בנוח.' }
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

const guarantees = [ // 文案已修改
  { icon: 'shield', title: { en: 'Fund Safety', he: 'בטיחות הקרן' }, desc: { en: 'Platform-guaranteed transactions with automatic commission settlement', he: 'עסקאות המובטחות על ידי הפלטפורמה עם סילוק עמלות אוטומטי' } },
  { icon: 'lock', title: { en: 'Info Security', he: 'אבטחת מידע' }, desc: { en: 'Encrypted promo links protect affiliate privacy', he: 'קישורי קידום מכירות מוצפנים מגנים על פרטיות השותפים' } },
  { icon: 'badgeCheck', title: { en: 'Commission Guarantee', he: 'ערבות הנציבות' }, desc: { en: 'Commissions are automatically credited to your account, with no upfront investment required', he: 'העמלות נזקפות לחשבונך באופן אוטומטי, ללא צורך בהשקעה מראש' } },
  { icon: 'headset', title: { en: 'Dedicated Support', he: 'תמיכה ייעודית' }, desc: { en: 'Online 7×24 hours with timely responses', he: 'זמינים באינטרנט 24 שעות ביממה, 7 ימים בשבוע, עם מענה מהיר' } }
]

const faqs = [ // 文案已修改
  { q: { en: 'Does joining cost anything?', he: 'האם ההצטרפות כרוכה בתשלום כלשהו?' }, a: { en: 'It\'s completely free. There\'s no cost to join a merchant\'s affiliate program—simply sign up to become an affiliate. Then choose the merchants you like, click “Join Now,” and you\'ll gain promotional access.', he: 'זה לגמרי בחינם. ההצטרפות לתוכנית השותפים של סוחר כלשהו אינה כרוכה בעלות כלשהי — כל שעליך לעשות הוא להירשם כדי להפוך לשותף. לאחר מכן, בחר את הסוחרים המועדפים עליך, לחץ על "הצטרף עכשיו", ותקבל גישה למבצעים.' } },
  { q: { en: 'When does commission arrive?', he: 'מתי מתקבלת העמלה?' }, a: { en: 'Once a buyer places an order through your referral link and successfully completes payment, you can immediately view your commission earnings for that period. The system will automatically credit the commission to your wallet; there is no need to submit a manual request.', he: 'ברגע שקונה מבצע הזמנה דרך קישור ההפניה שלך ומשלים את התשלום בהצלחה, תוכל לראות מיד את רווחי העמלה שלך לאותה תקופה. המערכת תזכה את העמלה באופן אוטומטי לארנק שלך; אין צורך להגיש בקשה ידנית.' } },
  { q: { en: 'How do I contact the seller?', he: 'איך ניתן ליצור קשר עם המוכר?' }, a: { en: 'After joining the affiliate program, open the Products menu, locate store contact Information, and click on it to chat directly with the seller via WhatsApp. We recommend that you contact the seller immediately after successfully joining to confirm best-selling items, inventory status, and promotional materials.', he: 'לאחר ההצטרפות לתוכנית השותפים, פתחו את תפריט המוצרים, אתרו את פרטי יצירת הקשר של החנות ולחצו עליהם כדי לשוחח ישירות עם המוכר באמצעות WhatsApp. אנו ממליצים ליצור קשר עם המוכר מיד לאחר ההצטרפות, כדי לאמת אילו מוצרים הם הנמכרים ביותר, מה מצב המלאי ומהם חומרי הקידום.' } },
  { q: { en: 'What should I keep in mind when talking to sellers?', he: 'על מה עליי לשים לב כשאני משוחח עם המוכרים?' }, a: { en: "Please communicate naturally as a buyer or reseller, and never stray from the Flylink platform. Proactively ask sellers about local best-selling products, inventory status, and commission policies, and request product images and reseller links from them, ensuring that the reseller links include your affiliate ID.", he: 'אנא תקשרו באופן טבעי כקונה או כמפיץ, ואל תסטו לעולם מפלטפורמת Flylink. שאלו את המוכרים ביוזמתכם אודות המוצרים הנמכרים ביותר באזור, מצב המלאי ומדיניות העמלות, ובקשו מהם תמונות של המוצרים וקישורי מפיצים, תוך הקפדה על כך שקישורי המפיצים יכללו את מזהה השותף שלכם.' } },
  { q: { en: 'How do I get the promo link?', he: 'איך אני מקבל את קישור המבצע?' }, a: { en: 'After confirming the product with the seller, click “Get Affiliate Link” on the Home page or in the product menu, and copy the unique link that includes your affiliate ID. Share it with friends or in groups so you can track your commissions.', he: 'לאחר שאישרת את המוצר מול המוכר, לחץ על "קבל קישור שותפים" בדף הבית או בתפריט המוצרים, והעתק את הקישור הייחודי הכולל את מזהה השותף שלך. שתף אותו עם חברים או בקבוצות כדי שתוכל לעקוב אחר העמלות שלך.' } },
  { q: { en: 'Can I join multiple stores?', he: 'האם אני יכול להצטרף למספר חנויות?' }, a: { en: 'Yes. You can join affiliate programs from multiple merchants and promote products in different categories. We recommend prioritizing merchants you’re familiar with and whose products are popular locally.', he: 'כן. אתה יכול להצטרף לתוכניות שותפים של מספר סוחרים ולקדם מוצרים בקטגוריות שונות. אנו ממליצים לתת עדיפות לסוחרים שאתה מכיר ושמוצריהם פופולריים באזור שלך.' } },
  { q: { en: 'What if a buyer returns the item?', he: 'מה יקרה אם הקונה יחזיר את הפריט?' }, a: { en: "If a buyer requests a return or refund, the commission for that order will be automatically deducted. Only orders that have been paid for, shipped, and not refunded will be finalized.", he: 'אם קונה מבקש להחזיר את המוצר או לקבל החזר כספי, העמלה עבור אותה הזמנה תנוכה באופן אוטומטי. רק הזמנות ששולמו, נשלחו ולא הוחזרו ייסגרו סופית.' } },
  { q: { en: 'How can I check my commission status?', he: 'איך אוכל לבדוק את מצב העמלה שלי?' }, a: { en: 'In the Wallet menu, you can view your balance, pending commissions, and all transaction records for the products you distribute.', he: 'בתפריט "ארנק" תוכל להציג את היתרה שלך, את העמלות הממתינות ואת כל רישומי העסקאות עבור המוצרים שאתה מפיץ.' } }
]

const benefits = [ // 文案已修改
  { en: 'Free to join, no threshold', he: 'ההצטרפות חינם, ללא תנאי סף' },
  { en: 'No stocking, Seller after-sales', he: 'ללא מלאי, שירות לאחר מכירה מטעם המוכר' },
  { en: 'Commission automatically credited to the account', he: 'העמלה נזקפה באופן אוטומטי לחשבון' },
  { en: 'Platform-guaranteed safe trading', he: 'מסחר בטוח המובטח על ידי הפלטפורמה' }
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
const ui = { // 文案已修改
  brandName: { en: 'Distributor Recruitment Platform', he: 'פלטפורמה לגיוס מפיצים' },
  joinNow: { en: 'Join Now', he: 'הצטרפו עכשיו' },
  seeHow: { en: 'See How It Works', he: 'ראו כיצד זה עובד' },
  heroPill: { en: 'No stocking · High commission · Abundant promotion resources · Zero cost', he: 'ללא מלאי · עמלה גבוהה · משאבי קידום רבים · ללא עלות' },
  heroTitle: { en: 'Join the distribution platform, Easily earn commissions', he: 'הצטרפו לפלטפורמת ההפצה, והרוויחו עמלות בקלות' },
  stepsEyebrow: { en: 'How-To Guide', he: 'מדריך מעשי' },
  stepsTitle: { en: 'Earn Commission in 4 Easy Steps', he: 'הרוויחו עמלה ב-4 שלבים פשוטים' },
  stepsDesc: { en: 'From joining to payout, the flow is simple and transparent — Click each step for detailed guidance', he: 'מההרשמה ועד לתשלום, התהליך פשוט ושקוף — לחצו על כל שלב לקבלת הנחיות מפורטות' },
  stepTag: { en: 'Step', he: 'שלב' },
  stepsLabel: { en: 'Steps', he: 'שלבים' },
  keyPoints: { en: 'Key Points', he: 'נקודות מרכזיות' },
  previous: { en: 'Previous', he: 'קודם' },
  next: { en: 'Next', he: 'הבא' },
  storesEyebrow: { en: 'Top-Rated Stores', he: 'חנויות עם הדירוג הגבוה ביותר' },
  storesTitle: { en: 'The best-selling products from these top-quality stores are just waiting for you to promote them', he: 'המוצרים הנמכרים ביותר מחנויות איכותיות אלה רק מחכים שתקדם אותם' },
  storesDesc: { en: 'Carefully selected high-quality stores, generous commissions, and easy sales—Choose categories that are popular in your local market', he: 'חנויות איכותיות שנבחרו בקפידה, עמלות נדיבות ומכירות קלות — בחרו בקטגוריות הפופולריות בשוק המקומי שלכם' },
  high: { en: 'Best', he: 'הטוב ביותר' },
  commissionRate: { en: 'Commission Rate:', he: 'שיעור העמלה:' },
  contactEyebrow: { en: 'Seller Contact Guide', he: 'מדריך ליצירת קשר עם המוכר' },
  contactTitle: { en: 'After joining a store, how do you contact the seller?', he: 'לאחר ההצטרפות לחנות, כיצד ניתן ליצור קשר עם המוכר?' },
  contactDesc1: { en: 'This is the most critical step in promotion — after joining, contact the seller right away to confirm product info and promo materials.', he: 'זהו השלב החשוב ביותר בקידום — לאחר ההצטרפות, צרו קשר עם המוכר מיד כדי לאשר את פרטי המוצר וחומרי הקידום.' },
  contactDesc2: { en: "We've already filled in your contact information for you; just copy it and you're all set.", he: 'כבר מילאנו עבורך את פרטי הקשר; כל מה שאתה צריך לעשות זה להעתיק אותם וזהו.' },
  readyTitle: { en: 'Ready to start?', he: 'מוכנים להתחיל?' },
  readyDesc: { en: 'Click the button below to open the product menu, then find the store\'s contact information and chat with the seller via WhatsApp.', he: 'לחץ על הכפתור שלמטה כדי לפתוח את תפריט המוצרים, ולאחר מכן מצא את פרטי יצירת הקשר של החנות וצ\'ט עם המוכר דרך WhatsApp.' },
  goContact: { en: 'Go to Product & Contact Seller', he: 'עבור אל המוצר וצור קשר עם המוכר' },
  waTemplates: { en: 'WhatsApp Message Templates', he: 'תבניות הודעות WhatsApp' },
  copyMessage: { en: 'Copy Message', he: 'העתק הודעה' },
  note: { en: 'Friendly Reminder: When chatting with sellers, please stay on the Flylink platform—engage in natural conversation as a buyer or distributor.', he: 'תזכורת ידידותית: בעת שיחה עם המוכרים, אנא הישארו בפלטפורמת Flylink — ניהלו שיחה טבעית בתור קונה או מפיץ.' },
  scriptsEyebrow: { en: 'Handy Tools', he: 'כלים שימושיים' },
  scriptsTitle: { en: 'Recommended Scripts', he: 'תסריטים מומלצים' },
  scriptsDesc: { en: 'Ready-to-use scripts for a variety of promotional scenarios—making your promotions more natural, faster, and more effective', he: 'תסריטים מוכנים לשימוש למגוון תרחישי קידום מכירות — שהופכים את פעולות הקידום שלכם לטבעיות יותר, מהירות יותר ויעילות יותר' },
  copy: { en: 'Copy', he: 'העתק' },
  videosEyebrow: { en: 'Video Lessons', he: 'שיעורי וידאו' },
  videosTitle: { en: 'Video Tutorials', he: 'מדריכי וידאו' },
  videosDesc: { en: 'Watch video tutorials to get started fast — learn by doing, easily', he: 'צפו במדריכי וידאו כדי להתחיל במהירות — למדו תוך כדי עשייה, בקלות' },
  featuredTutorial: { en: 'Featured Tutorial', he: 'מדריך מומלץ' },
  minToLearn: { en: 'min to learn', he: 'דקות ללמוד' },
  guaranteeTitle: { en: 'Four Platform Guarantees for Worry-free Promotion', he: 'ארבע התחייבויות של הפלטפורמה לקידום ללא דאגות' },
  faqEyebrow: { en: 'FAQ', he: 'שאלות נפוצות' },
  faqTitle: { en: 'All Your Questions, Answered', he: 'תשובות לכל השאלות שלכם' },
  faqDesc: { en: 'Answers to the most common beginner questions — contact support if you need more help', he: 'תשובות לשאלות הנפוצות ביותר של מתחילים — פנו לתמיכה אם אתם זקוקים לעזרה נוספת' },
  faqFoot: { en: 'If you have any other questions, please contact Flylink platform customer service, which is available 7x24 hours a day.', he: 'אם יש לכם שאלות נוספות, אנא פנו לשירות הלקוחות של פלטפורמת Flylink, הזמין 24 שעות ביממה, 7 ימים בשבוע.' },
  ctaTitle: { en: 'Start Earning Your First Commission Now', he: 'התחל להרוויח את העמלה הראשונה שלך כבר עכשיו' },
  ctaDesc: { en: 'No guessing what to do next. Choose a store to join, contact the seller, and share your affiliate link—it’s that simple to earn your first commission.', he: 'אין צורך לנחש מה לעשות עכשיו. בחר חנות להצטרף אליה, צור קשר עם המוכר ושתף את קישור השותפים שלך — כך פשוט להרוויח את העמלה הראשונה שלך.' },
  seeProcess: { en: 'See the Process', he: 'ראו את התהליך' },
  footerCopy1: { en: 'Affiliate Platform · Auto commission settlement, safe & reliable', he: 'פלטפורמת שותפים · סילוק עמלות אוטומטי, בטוח ואמין' },
  footerCopy2: { en: 'After joining, contact the seller right away to get your product promo link', he: 'לאחר ההרשמה, צור קשר עם המוכר מיד כדי לקבל את קישור המבצע של המוצר שלך' },
  footerBottom: { en: `© ${dayjs().year()} FlyLink. All rights reserved.`, he: `© ${dayjs().year()} FlyLink. כל הזכויות שמורות.` },
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

      <!-- ====================== Top-Rated Stores ====================== -->
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

      <!-- ====================== Recommended Scripts ====================== -->
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
              <div class="script-detail__content gap16">
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

  /* Recommended Scripts */
  .scripts { margin-top: 3rem; }
  .script-tabs { display: flex; gap: 2rem; border-bottom: 1px solid var(--gray-200); margin-bottom: 1.25rem; }
  .script-tab { flex: none; padding: .75rem 0; font-size: .9375rem; font-weight: 500; color: var(--gray-500); border-bottom: 2px solid transparent; margin-bottom: -1px; cursor: pointer; white-space: nowrap; transition: color .2s var(--ease), border-color .2s var(--ease); }
  .script-tab:hover { color: var(--brand); }
  .script-tab.is-active { color: var(--brand); border-bottom-color: var(--brand); font-weight: 600; }
  .script-detail { border: 1px solid var(--gray-100); border-radius: var(--r-xl); background: var(--white); padding: 1.5rem; box-shadow: var(--shadow-sm); }
  .script-detail__head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .script-detail__title { font-size: 1.25rem; font-weight: 700; }
  .script-detail__content { display: flex; align-items: end; }
  .script-detail__quote { margin-top: 20px; border-radius: var(--r-md); background: var(--whatsapp-soft); padding: 1.25rem; flex: 1; }
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
