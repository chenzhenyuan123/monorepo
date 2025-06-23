// 联系方式
import { isIos } from "./index.js";

export function encodeURIFn(str) {
  if (window) return window.encodeURIComponent(str)
  return str
}

export function getHrefForWhatsApp({ contactWhatsapp, orderLinkurl }) {
  const content = encodeURIFn(`Hi! I hope you're doing well. I came across your listing for the following goods and I'm quite interested! \r\n\r\n${orderLinkurl}`)
  return `https://wa.me/${contactWhatsapp}?text=${content}`
}

export function getHrefForInstagram({ contactInstagram }) {
  const USERNAME = (contactInstagram || '').replace(/\s+/g, '.').replace(/^@/g, '')
  return `https://ig.me/m/${USERNAME}`
}

export function getHrefForFacebook({ contactFacebook }) {
  return `https://facebook.com/${contactFacebook}`
}

export function getHrefForEmail({ contactEmail, orderLinkurl, goodsNo, businessName }) {
  const isIOS = isIos() || false
  const title = encodeURIFn(`Inquiry about ${goodsNo} on FlyLink`)
  const content = encodeURIFn(`Hello ${businessName},${isIOS ? '' : '<br>'}
  I hope this email finds you well. I recently came across your listing for the following goods on FlyLink (Link: ${orderLinkurl}), and I'm quite interested in learning more about it.`)
  return `mailto:${contactEmail}?subject=${title}&body=${content}`
}

export function getHrefForMobile({ contactMobile }) {
  return `tel://${contactMobile}`
}

export function getHrefForSkype({ contactSkype }) {
  return `skype:${contactSkype}?chat`
}

export function getHrefForTelegram({ contactTelegram }) {
  return `https://t.me/${contactTelegram}`
}

export function getHrefForSnapchat({ contactSnapchat }) {
  return `https://www.snapchat.com/add/${contactSnapchat}`
}

export function getHrefForDiscord({ contactDiscord }) {
  return `https://discord.gg/${contactDiscord}`
}

export function getHrefForLine({ contactLine }) {
  return `https://line.me/ti/p/${contactLine}`
}

export function getHrefForViber({ contactViber }) {
  return `https://invite.viber.com/?g2=${contactViber}`
}
