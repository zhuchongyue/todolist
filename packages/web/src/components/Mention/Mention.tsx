import React from 'react'
import { List, Avatar, Popover } from 'antd'
import { IUser } from '@/store/user/userSlice';
import './Mention.scss'

export default function ChatMention(props: {
  members?: Array<IUser>;
  filter?: string;
  open: boolean;
  children: any;
  onSelectedMember: (member: IUser) => void;
  openChange?:(open: boolean) => void
}) {

  return (
    <>
      <Popover trigger='contextMenu' open={props.open} content={<List
        size='small'
        split={false}
        dataSource={props.members?.filter(mem => mem.username.includes(props.filter || ''))}
        style={{width: 150}}
        renderItem={(item, index) => (
          <List.Item className="men-list-item" onClick={ () => props.onSelectedMember && props.onSelectedMember(item)}>
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={item.username}
              description={item.bio}
            />
          </List.Item>
        )}
      />}>
        {props.children}
      </Popover>
    </>
  )
}
