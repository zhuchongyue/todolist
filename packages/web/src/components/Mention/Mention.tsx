import React, { useState } from 'react'
import { Tooltip, List, Avatar, Popover } from 'antd'
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

  const handleOpenChange = (newOpen: boolean) => {
    console.log('newOpen: ', newOpen)
    // setOpen(newOpen);
    props.openChange && props.openChange(props.open)
  };

  return (
    <>
      <Popover trigger='contextMenu' open={props.open} content={<List
        size='small'
        // itemLayout="horizontal"
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

{/* <Tooltip placement='topLeft' open={props.open} arrow title={ * */}
        // <Box sx={{ width: '100%', maxWidth: 360 }}>


        // <List>
        //   {
        //     props.members?.filter(mem => mem.username.includes(props.filter || '')).map((info, index) => {
        //       return <ListItemButton key={info._id} onClick={() => props.onSelectedMember && props.onSelectedMember(info)}
        //       >
        //         {/* <ListItemAvatar> */}
        //           <Avatar src={info.avatar}></Avatar>
        //         {/* </ListItemAvatar> */}
        //         <ListItemText primary={info.username} secondary={
        //           <span>
        //             {info.bio}
        //           </span>
        //         } />
        //       </ListItemButton>
        //     })
        //   }
        // </List>
        // </Box>
      // }>
        // {props.children}
      // </Tooltip>