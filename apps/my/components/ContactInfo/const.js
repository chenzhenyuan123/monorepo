import { getHrefForWhatsApp, getHrefForInstagram, getHrefForFacebook, getHrefForEmail, getHrefForMobile, getHrefForSkype, getHrefForTelegram, getHrefForSnapchat, getHrefForDiscord, getHrefForLine, getHrefForViber } from '@/util/contact.js'
// 联系方式-对应icon
export const contactData = [
  { value: 'contactEmail', label: '客服邮箱', geturl: getHrefForEmail, icon: 'email', goIcon: 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1709541804548_mail-line.svg' },
  { value: 'contactMobile', label: '客服电话', geturl: getHrefForMobile, icon: 'mobile', goIcon: 'https://kamelnet-prod-oss-public.oss-cn-beijing.aliyuncs.com/ttwallet/1712656516197_vector.svg' },
  { value: 'contactWhatsapp', label: 'WhatsApp', geturl: getHrefForWhatsApp, icon: 'whatsapp' },
  { value: 'contactFacebook', label: 'FaceBook', geturl: getHrefForFacebook, icon: 'facebook' },
  { value: 'contactSkype', label: 'Skype', geturl: getHrefForSkype, icon: 'skype' },
  { value: 'contactInstagram', label: 'Instagram', geturl: getHrefForInstagram, icon: 'instagram' },
  { value: 'contactTelegram', label: 'Telegram', geturl: getHrefForTelegram, icon: 'telegram' },
  { value: 'contactSnapchat', label: 'Snapchat', geturl: getHrefForSnapchat, icon: 'snapchat' },
  { value: 'contactDiscord', label: 'Discord', geturl: getHrefForDiscord, icon: 'discord' },
  { value: 'contactLine', label: 'Line', geturl: getHrefForLine, icon: 'line' },
  { value: 'contactViber', label: 'Viber', geturl: getHrefForViber, icon: 'viber' }
]