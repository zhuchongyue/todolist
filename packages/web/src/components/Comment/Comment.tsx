import React, { useEffect, useState } from "react"
import { useAppSelector } from "@/store/hooks"
import { usersSelector } from "@/store/user/userSlice"
import { Typography } from "antd"
import CommentList from "./CommentList"
import './Comment.css'
import CommentInput from "./CommentInput"
import { fetchCommentsByTaskId, ICreateComment, ICreatedComment } from "@/api"
import { curTaskSelector } from "@/store/task/taskSlice"
import { formatTime } from "@/utils"
const { Title, Paragraph, Text, Link } = Typography;

export default function Comment() {

  const users =  useAppSelector(usersSelector);
  const curTask = useAppSelector(curTaskSelector);
  const [comments, setComments] = useState<Array<ICreatedComment>>([]);
  useEffect(() => {
    if (curTask?.id) {
      fetchCommentsByTaskId(curTask.id).then(res => {
        setComments(res)
      })
    }
   
  }, [curTask?.id])
  

  return (
    <div className="comment">
      <Title level={4}>评论</Title>
      <ul>
        <li>
          <Link>{curTask?.creator?.username}</Link>创建了任务
          <Text type="secondary">{formatTime(curTask?.createdAt)}</Text>
          </li>
      </ul>
      <CommentList data={comments} />
      <CommentInput onSentComment={(comment) => {
        setComments([...comments, comment])
      }} />
    </div>
  )
}