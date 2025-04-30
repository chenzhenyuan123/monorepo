export const useIsMobile = () => {
  const UA = process.client ? navigator.userAgent : useRequestHeader('user-agent')
  return /(Android|webOS|iPhone|iPod|tablet|BlackBerry|Mobile|iemobile|opera mini)/i.test(UA)
}
