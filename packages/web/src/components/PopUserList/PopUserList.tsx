import React, { useState } from 'react'
import { Image as ImageIcon, Work as WorkIcon, BeachAccess as BeachAccessIcon } from '@mui/icons-material'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { Button, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Badge, Box, ListItemButton, TextField, Paper, Popper, Fade, Popover } from '@mui/material';
import { IUser, usersSelector } from '@/store/user/userSlice';
import { useAppSelector } from '@/store/hooks';

export default function PopUserList(props: {
  // members?: Array<IUser>;
  filter?: string;
  open?: boolean;
  children: any;
  onSelectedMember?: (member: IUser) => void;
}) {

  const members = useAppSelector(usersSelector)

  const [filter, setFilter] = useState('')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleChildClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;

  // const handleChildrenClick = () => {
  //   setOpen(!open)
  // }

  return (
    <>
      {/* <Tooltip open={open} arrow title={ */}
      <Popover
        style={{zIndex: 999999}}
        id={id} open={open} anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }} 
        onClose={handleClose}
        >
        <Paper sx={{ p: '15px' }}>
          <TextField placeholder='添加负责人' value={filter} onChange={(e) => setFilter(e.target.value)} size='small' />
          <List>
            {
              members?.filter(mem => mem.username.includes(filter || '')).map((info, index) => {
                return <ListItemButton sx={{p: 0, m: 0}} key={info.id} onClick={() => props.onSelectedMember && props.onSelectedMember(info)}
                >
                  <ListItemAvatar>
                    <Avatar src={info.avatar}></Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={info.username} secondary={
                    <span>
                      {info.position}
                    </span>
                  } />
                </ListItemButton>
              })
            }
          </List>
        </Paper>
      </Popover>
      {React.cloneElement(props.children, { onClick: handleChildClick })}
    </>
  )
}