import React, { useState } from 'react'
// import Upload from '@/components/Upload/Upload'
import { Avatar, Button, Checkbox, Col, DatePicker, Input, Progress, Row, Space, Tag, Tooltip, Typography } from 'antd';
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { IUser, userSelector } from '@/store/user/userSlice';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import type { UploadFile as UploadFileType, } from 'antd';
import { createTask, ICreateTask } from '@/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { AlignLeftOutlined, CalendarOutlined, LinkOutlined, NodeExpandOutlined, RightOutlined, UserAddOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons';
import UploadFile from '@/components/Upload/Upload';
import PopUserList from '@/components/PopUserList/PopUserList';
import { newTask } from '@/store/task/taskSlice';

const { Text } = Typography

const sizeStyle = {
  fontSize: 20,
  color: 'rgba(0, 0, 0, 0.45)',
  cursor: 'pointer'
}

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().startOf('day');
};

function NewTaskForm(props: {
  onCancel: () => void;
}) {

  const creator = useAppSelector(userSelector).id;
  const dispatch = useAppDispatch()

  const [title, setTitle] = useState('');
  const [ownerUser, setOwnerUser] = useState<IUser | undefined>(undefined)
  const [owner, setOwner] = useState<string | undefined>(undefined);
  const [desc, setDesc] = useState('');
  const [deadTime, setDeadTime] = useState<Dayjs | undefined>(undefined)
  const [followers, setFollowers] = useState<string[]>([]);
  const [subTasks, setSubTasks] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<UploadFileType[]>([]);

  const onDeadTimeChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    setDeadTime(value as Dayjs)
  };

  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    setDeadTime(value as Dayjs)
  };

  const selectOwner = (user: IUser) => {
    setOwnerUser(user)
    setOwner(user.id)
  }

  const handleDelOwner = () => {
    setOwnerUser(undefined)
    setOwner('')
  };

  const handleCreateTask = () => {
    if (!title) return;

    const ats = attachments.map(file => file.url!)
    createTask({
      deadTime: deadTime?.valueOf(),
      title,
      desc,
      owner,
      creator,
      attachments: ats,
      isSub: false,
      status: 1
    }).then(res => {
      debugger
      if (res.data.id) {
        dispatch(newTask(res.data))
        props.onCancel(); //关闭
      }
    })
  }

  const [newSubTask, setNewSubTask] = useState<ICreateTask>({
    title: '',
    owner: '',
    deadTime: undefined,
    parent: ''
  })
  // 创建子任务
  const handleSubTaskCreate = () => {
    createTask(newSubTask)
  }

  return (
    <>
        {/* <TextField value={title} onChange={(e) => setTitle(e.target.value)} fullWidth placeholder='输入任务内容，回车即可添加任务' /> */}
      <Space direction={'vertical'} size='middle' style={{ 'width': '100%' }}>
        <Input.TextArea 
          size='large' autoSize bordered={false} value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder='输入任务内容，回车即可添加任务'
          onPressEnter={() => handleCreateTask()}
           />
        <div>
          <Space size={'middle'} align={'center'}>
            <Tooltip title="添加任务描述">
              <AlignLeftOutlined style={sizeStyle} />
            </Tooltip>
            <Input.TextArea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              autoSize size='middle' bordered={false} placeholder='添加任务描述' />
          </Space>
        </div>
        <div>
          <Space size={'middle'} align={'center'}>
            <Tooltip title="负责人">
              <UserOutlined style={sizeStyle} />
            </Tooltip>
            {
              owner
              ? 
              <Tag icon={<Avatar src={ownerUser?.avatar} style={{marginRight: 5}}/>} closable onClose={(e) => {
                handleDelOwner()
              }}>
                {ownerUser?.username}
              </Tag>
              :
              <PopUserList onSelectedMember={(user) => selectOwner(user)}>
                <Button type='text'>添加负责人</Button>
              </PopUserList>
            }
          </Space>
        </div>
        <div>
          <Space size={'middle'} align={'center'}>
            <Tooltip title="截止时间">
              <CalendarOutlined style={sizeStyle} />
            </Tooltip>
            <DatePicker
              value={deadTime}
              disabledDate={disabledDate}
              showToday
              locale={locale}
              popupStyle={{ zIndex: 999999999 }}
              showTime={{ minuteStep: 30, defaultValue: dayjs('18:00', 'HH:mm'), format: 'HH:mm' }}
              onChange={onDeadTimeChange}
              onOk={onOk}
            />
          </Space>
        </div>
        <div>
          <Space align='baseline' size={'middle'} style={{ 'width': '100%' }}>
            <Tooltip title="子任务">
              <NodeExpandOutlined style={sizeStyle} />
            </Tooltip>
            {/* <Button type="text">新增子任务</Button> */}
            <div style={{ width: 500 }}>
              <Row align={'middle'} style={{ width: 300 }}>
                <Col span={3}><Text>1 / 2</Text></Col>
                <Col span={12}><Progress percent={30} showInfo={false} style={{ marginBottom: 0 }} /></Col>
              </Row>

              <Input
                value={newSubTask.title}
                onChange={e => setNewSubTask({ ...newSubTask, title: e.target.value })}
                className="ut-sub"
                bordered={false}
                placeholder="输入内容，回车即可创建子任务"
                onPressEnter={() => handleSubTaskCreate()}
                prefix={
                  // <UserOutlined className="site-form-item-icon" />
                  <Checkbox />
                }
                suffix={
                  <Space onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}>
                    <DatePicker
                      size='small'
                      placeholder='请选择截止时间'
                      value={deadTime}
                      disabledDate={disabledDate}
                      showToday
                      locale={locale}
                      popupStyle={{ zIndex: 999999999 }}
                      showTime={{ minuteStep: 30, defaultValue: dayjs('18:00', 'HH:mm'), format: 'HH:mm' }}
                      onChange={onDeadTimeChange}
                      onOk={onOk}
                    />
                    <Tooltip title="添加负责人">
                      <UserAddOutlined style={{ cursor: 'pointer' }} />
                    </Tooltip>

                    <Tooltip title="查看详情">
                      <RightOutlined style={{ cursor: 'pointer' }} />
                    </Tooltip>
                  </Space>
                }
              />
            </div>
          </Space>
        </div>
        <div>
          <Space align={'baseline'} size={'middle'}>
            <Tooltip title="附件">
              <LinkOutlined style={sizeStyle} />
            </Tooltip>
            <UploadFile fileList={attachments} onChange={(fileList) => setAttachments(fileList)}>
              <Button type="text">添加附件</Button>
            </UploadFile>
          </Space>

        </div>
        <div>
          <Space size={'middle'}>
            <Tooltip title="关注人">
              <UsergroupAddOutlined style={sizeStyle} />
            </Tooltip>

            <PopUserList onSelectedMember={(user) => {

            }}>
              <Button type="text">添加关注人</Button>
            </PopUserList>
          </Space>
        </div>
      </Space>
      <div style={{ textAlign: 'right' }}>
        <Space>
          <Button onClick={() => props.onCancel()} type="default">取消</Button>
          <Button disabled={title.trim().length === 0} onClick={() => handleCreateTask()} type="primary">创建</Button>
        </Space>
      </div>
    </>
  )
}

export default NewTaskForm
