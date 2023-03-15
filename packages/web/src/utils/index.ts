
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


export function formatTime(time?: string) {

  if (!time) return ''

  const timetamp = new Date(time).getTime()
  const now = Date.now()

  const HOUR_GAP = 24 * 60 * 60 * 1000; // 大于一天
  
  const gap = now - timetamp 
  
  return gap > HOUR_GAP ? moment(timetamp).format('MM月DD日 HH:mm') : moment(timetamp).format('HH:mm') 
}
