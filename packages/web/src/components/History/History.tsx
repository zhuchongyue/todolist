import { Timeline, type TimelineItemProps } from "antd"

export default function History(props: {
  histoies: Array<{time: string; text: string}>
}) {

  const items = props.histoies.map(history => {
    return {
      // label: history.time,
      children: <div>
        <div style={{color: '#999', fontSize: 14}}>{history.time}</div>
        <div>{history.text}</div>
      </div>
    }
  })
  return (
    <>
      <Timeline mode='left' items={items}></Timeline>
    </>
  )
}