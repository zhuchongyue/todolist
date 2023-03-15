import React, { useState } from 'react';
// import logo from './logo.svg';
// import './App.css';

import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, IconButton, List, ListItem, ListItemIcon, Tab, Tabs, TextareaAutosize, TextField, Tooltip, Typography } from '@mui/material';
import { FormatIndentDecrease as FormatIndentDecreaseIcon, PlaylistAddCheck as PlaylistAddCheckIcon, FilterAltOutlined as FilterAltOutlinedIcon, SwapVert as SwapVertIcon } from '@mui/icons-material';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SendIcon from '@mui/icons-material/Send';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function App() {

  const [tabIndex, setTabIndex] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const [openDrawer, setOpenDrawer] = useState(false)

  const Filter = () => {
    return (
      <>
        <PlaylistAddCheckIcon />
        <SwapVertIcon />
        <FilterAltOutlinedIcon color='inherit' />
        <FormatIndentDecreaseIcon />
        <EventOutlinedIcon />
        <RuleOutlinedIcon />

        <PermIdentityOutlinedIcon />
        <AttachFileOutlinedIcon />
        <ImageOutlinedIcon />
        <SendIcon />
        <MoreHorizOutlinedIcon />

        <CloseOutlinedIcon />
        <HistoryOutlinedIcon />
        <DeleteOutlineOutlinedIcon />

        <ArrowBackIosNewOutlinedIcon />
        <NotificationsActiveOutlinedIcon />
        <AccountTreeOutlinedIcon />
      </>
    )
  }

  const [openAddDialog, setOpenAddDialog] = useState(false)

  return (
    <div className="App">
      <Button variant='contained' onClick={() => setOpenAddDialog(true)}>新建</Button>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="列表" />
          <Tab label="看板" />
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={0}>
        <Filter />
        <div onClick={() => setOpenDrawer(true)}>Item One </div>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        Item Three
      </TabPanel>

      <Drawer
        anchor={'right'}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        content
      </Drawer>

      <Dialog open={openAddDialog} fullWidth maxWidth={'sm'}>
        <IconButton
          aria-label="close"
          onClick={() => setOpenAddDialog(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseOutlinedIcon />
        </IconButton>

        <DialogTitle>新建任务</DialogTitle>

        <DialogContent>
          <TextField fullWidth placeholder='输入任务内容，回车即可添加任务' />
          <List>
            <div>
              {/* <ListItemIcon> */}
              <Tooltip title="任务备注" placement='top' arrow>
                <PlaylistAddCheckIcon color="disabled" fontSize='small' />
              </Tooltip>

              {/* </ListItemIcon> */}
              <TextareaAutosize placeholder='添加描述' />
            </div>

            <div>
              <Tooltip title="负责人" placement='top' arrow>
                <PermIdentityOutlinedIcon color="disabled"  fontSize='small'/>
              </Tooltip>
              <Button size='small' color='inherit'>添加负责人</Button>
            </div>
            <div>
              <Tooltip title="截止时间" placement='top' arrow>
                <EventOutlinedIcon color="disabled" fontSize='small' />
              </Tooltip>
            </div>
            <div>
              <Tooltip title="子任务" placement='top' arrow>
                <AccountTreeOutlinedIcon color="disabled" fontSize="small" />
              </Tooltip>
             <Button size='small' color='inherit'>新增子任务</Button>
            </div>
            <div>
              <Tooltip title="附件" placement='top' arrow>
                <AttachFileOutlinedIcon color="disabled" fontSize='small'  style={{ transform: 'rotate(45deg)' }} />
              </Tooltip>
            </div>

          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>取消</Button>
          <Button variant='contained' disabled onClick={() => setOpenAddDialog(false)}>创建</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
