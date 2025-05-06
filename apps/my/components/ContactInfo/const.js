import { getHrefForWhatsApp, getHrefForInstagram, getHrefForFacebook, getHrefForEmail, getHrefForMobile, getHrefForSkype, getHrefForTelegram, getHrefForSnapchat, getHrefForDiscord, getHrefForLine, getHrefForViber } from '@/util/contact.js'

// 联系方式-对应icon
export const contactData = [
  { value: 'contactEmail', label: '客服邮箱', geturl: getHrefForEmail, icon: 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1709541804548_mail-line.svg', goIcon: 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1709541804548_mail-line.svg' },
  { value: 'contactMobile', label: '客服电话', geturl: getHrefForMobile, icon: 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1709541906590_mobile.svg', goIcon: 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1712656516197_vector.svg' },
  { value: 'contactWhatsApp', label: 'WhatsApp', geturl: getHrefForWhatsApp, icon: 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1709542044082_whatsapp.svg' },
  { value: 'contactFaceBook', label: 'FaceBook', geturl: getHrefForFacebook, icon: 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1709542101013_fb.svg' },
  { value: 'contactSkype', label: 'Skype', geturl: getHrefForSkype, icon: 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1713927383392_skype.svg' },
  { value: 'contactInstagram', label: 'Instagram', geturl: getHrefForInstagram, icon: 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1713927567733_instgram.svg' },
  { value: 'contactTelegram', label: 'Telegram', geturl: getHrefForTelegram, icon: 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1741770614913_Artboard.svg' },
  { value: 'contactSnapchat', label: 'Snapchat', geturl: getHrefForSnapchat, icon: 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1741770673207_Snapchat.svg' },
  { value: 'contactDiscord', label: 'Discord', geturl: getHrefForDiscord, icon: 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1741770648195_Discord.svg' },
  { value: 'contactLine', label: 'Line', geturl: getHrefForLine, icon: 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1741770657236_Line.svg' },
  { value: 'contactViber', label: 'Viber', geturl: getHrefForViber, icon: 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1741770684948_Viber.svg' }
]

export const orderInfo = {
  "order": {
    "id": "FLY25042889672463",
    "createTime": 1745849662000,
    "paymentStatus": "00",
    "orderStatus": "INIT",
    "applyStatus": 1,
    "applyCountdownDays": null,
    "shippingStatus": 0,
    "paymentAmount": null,
    "paymentCurrency": "USD",
    "serviceProviderName": null,
    "paymentOrderId": null,
    "serviceCommissionRate": null,
    "commissionType": 0,
    "serviceCommissionRateString": "0%",
    "recycleStatus": 1,
    "remark": null,
    "refundStatus": 0,
    "chargebackStatus": 0,
    "shippingFeeAmount": null
  },
  "goodsList": [
    {
      "id": "OG20250428000000000029",
      "mainPicture": "flylink/1736326779647_d67f74add9f9c6de7e9d2a74cc19661b.jpg",
      "goodsTitle": "fff",
      "goodsNo": "6COLWZZSYO",
      "skuCode": "20250108000000000032",
      "skuDesc": "",
      "sellerSkuCode": null,
      "currency": "USD",
      "unitPrice": 1.00,
      "paymentCurrency": "USD",
      "paymentAmount": 1.00,
      "quantity": 1
    }
  ],
  "shipping": {
    "receiverName": null,
    "receiverEmail": "chenzhenyuan@inflyway.com",
    "receiverPhone": null,
    "country": null,
    "state": null,
    "city": null,
    "addressLine": null,
    "zipcode": null,
    "logistics": []
  },
  contactData: {
    contactEmail: '11@112.com',
    contactMobile: '135220077899',
    contactLine: 'Line',
    contactViber: 'Viber',
    contactWhatsApp: 'WhatsApp',
    orderUrl: 'https://www.google.com/',
    goodsNo: '1',
    businessName: '店铺名称'
  }
}