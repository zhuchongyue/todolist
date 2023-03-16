import React, { useEffect, useState } from "react";
import { fetchTaskActionHistory, IHistory } from "@/api/history";
import { useAppSelector } from "@/store/hooks";
import { curTaskSelector } from "@/store/task/taskSlice";
import { formatTime } from "@/utils";
import { red } from "@mui/material/colors";
import { Timeline, type TimelineItemProps, Typography } from "antd";
import { fieldMap, actionMap } from './keyMap'
import { usersSelector } from "@/store/user/userSlice";
const { Text } = Typography

export default function History(props: {
  histoies: Array<{time: string; text: string}>
}) {

  const curTask = useAppSelector(curTaskSelector);
  const [histories, setHistories] = useState<IHistory[]>([]);
  const users = useAppSelector(usersSelector)

  useEffect(() => {
    if (!curTask?.id) return
    fetchTaskActionHistory(curTask.id).then(res => {
      setHistories(res.data)
    })
  }, [curTask?.id]);

  const getReadableValue = (field: string, value: string | number, history?: IHistory, isNew?: boolean) => {
    if (['deadTime', 'finishTime'].includes(field)) {
      return <Text strong> {formatTime(value, 'MM月DD日 HH:mm')} </Text>
    }

    if (['operator', 'owner'].includes(field)) {
      return <em style={{ color: 'blue',fontStyle: 'normal' }}>
        {users?.find(user => user.id === value)?.username}
        </em>
    }

    if ('status' === field) {
      return value === 1 ? <Text strong>未完成</Text> :  <Text strong>已完成</Text>
    }

    return  isNew && !!history?.oldValue 
      ? <>为<Text strong> {value}</Text></>
      : <Text strong>{ value} </Text>
  }


  const items = histories.map(history => {
    return {
      children: <div>
        <div style={{color: '#999', fontSize: 14}}>{formatTime(history.createdAt, 'MM月DD日 HH:mm')}</div>
        <div>
            <em style={{ color: 'blue',fontStyle: 'normal' }}>{history.operator.username} </em>
            {actionMap[history.action]}
            {
              // @ts-ignore
              fieldMap[history.field]
            } 
            {
              history.oldValue &&
              <Text delete>
                {getReadableValue(history.field, history.oldValue)}
              </Text>
            }
            {
              history.newValue &&
              <Text>
                {getReadableValue(history.field, history.newValue, history, true)}
              </Text>
            }
            
        </div> 
      </div>
    }
  })
  return (
    <>
      <Timeline mode='left' items={items}></Timeline>
    </>
  )
}