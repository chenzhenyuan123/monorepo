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