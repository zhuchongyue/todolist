
import moment from "moment"

export const downloadFile = (params: { url: string, filename: string, target?: boolean }) => {
  const {url, filename, target} = params
  const downloadElement = document.createElement('a')
  downloadElement.style.display = 'none'
  downloadElement.href = url
  if (target) {
    downloadElement.target = '_blank'
  }
  downloadElement.rel = 'noopener noreferrer'
  if (filename) {
    downloadElement.download = filename
  }
  document.body.appendChild(downloadElement)
  downloadElement.click()
  document.body.removeChild(downloadElement)
}


export function formatTime(time?: number | string, formatString?: string) {

  if (!time) return '-'

  const timetamp = typeof time === 'number' ? time : new Date(time).getTime()
  const now = Date.now()

  const HOUR_GAP = 24 * 60 * 60 * 1000; // 大于一天
  
  const gap = timetamp  - now;
  const format = formatString
    ? formatString
    : gap > HOUR_GAP
      ? 'MM月DD日 HH:mm'
      : 'HH:mm'

  return moment(timetamp).format(format)
}
