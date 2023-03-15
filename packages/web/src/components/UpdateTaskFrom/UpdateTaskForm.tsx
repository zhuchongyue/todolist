import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Input, Progress, Row, Space, Tag, Tooltip, Typography, UploadFile as UploadFileType } from 'antd';
import { AlignLeftOutlined, CalendarOutlined, InfoCircleOutlined, LinkOutlined, NodeExpandOutlined, PlusCircleOutlined, RightOutlined, UserAddOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import DatePicker, { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { changeOneTask, curTaskSelector, setCurTask, tasksSelector } from '@/store/task/taskSlice';
import { createTask, ICreateTask, IUpdateTask, updateTask } from '@/api';
import PopUserList from '../PopUserList/PopUserList';
import UploadFile from '@/components/Upload/Upload';
import "./UpdateTaskForm.scss"
import { userSelector } from '@/store/user/userSlice';
const { Text } = Typography


const sizeStyle = {
  fontSize: 20,
  color: 'rgba(0, 0, 0, 0.45)',
  cursor: 'pointer'
}
export default function UpdateTaskForm(props: {

}) {

  const dispatch = useAppDispatch()
  const curTask = useAppSelector(curTaskSelector);
  const user = useAppSelector(userSelector);
  const [initTask, setInitTask] = useState<IUpdateTask | null>(JSON.parse(JSON.stringify(curTask)));
  const [task, setTask] = useState<IUpdateTask | null>(JSON.parse(JSON.stringify(curTask)));
  useEffect(() => {
    if (curTask && task && (task?.id !== curTask?.id)) {
      dispatch(changeOneTask(task))
    }
    setInitTask(JSON.parse(JSON.stringify(curTask)))
    setTask(JSON.parse(JSON.stringify(curTask)))
  }, [curTask])

  // const file = {
  //   status: 'done',
  //   name: name!,
  //   uid: name!,
  //   url: citem.content,
  //   thumbUrl: citem.content
  // };
  const [attaches, setAttaches] = useState<UploadFileType[]>([]);

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().startOf('day');
  };

  const [deadTime, setDeadTime] = useState<Dayjs | undefined>(undefined)

  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    setDeadTime(value as Dayjs)
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };

  const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    setDeadTime(value as Dayjs)
  };

  const changeLocalTask = (props: Partial<IUpdateTask>) => {
    console.log('changeLocalTask: ', props, { ...task, ...props })
    // @ts-ignore
    setTask({ ...task, ...props });
    console.log('task: ', task)
  }

  const changeBackTask = (key: keyof IUpdateTask, options?: {
    value: any
  }) => {

    if (options) {
      if (options.value === initTask![key]) {
        return
      }
    } else {
      if (task![key] === initTask![key]) {
        return
      }
    }

    const newTask = { [key]: options ? options.value : task![key], id: task?.id }
    const oldTask = { [key]: initTask![key] }

    console.log('newTask: ', newTask)

    updateTask(newTask, oldTask).then(res => {
      // dispatch(setCurTask(task))
    })
  }

  const [newSubTask, setNewSubTask] = useState<ICreateTask>({
    title: '',
    owner: user.id,
    deadTime: undefined,
    parent: curTask?.id
  })
  // 创建子任务
  const handleSubTaskCreate = () => {
    createTask(newSubTask)
  }

  return (
    <Space direction={'vertical'} size='middle' style={{ 'width': '100%' }}>
      <div>
        <Space size={'middle'} align={'center'}>
          <Tooltip title="点击完成任务">
            <Checkbox />
          </Tooltip>
          <br />
          <Input.TextArea value={task?.title}
            onBlur={(e) => {
              changeBackTask('title')
            }}
            onChange={(e) => { changeLocalTask({ title: e.target.value }) }}
            autoSize
            size='large'
            bordered={false}
            autoFocus
            placeholder='添加任务' />
        </Space>
      </div>
      <div>
        <Space size={'middle'} align={'center'}>
          <Tooltip title="添加任务描述">
            <AlignLeftOutlined style={sizeStyle} />
          </Tooltip>
          <Input.TextArea onBlur={() => changeBackTask('desc')} value={task?.desc} onChange={(e) => { changeLocalTask({ desc: e.target.value }) }} autoSize size='middle' bordered={false} placeholder='添加任务描述' />
        </Space>
      </div>
      <div>
        <Space size={'middle'} align={'center'}>
          <Tooltip title="负责人">
            <UserOutlined style={sizeStyle} />
          </Tooltip>
          {
            task?.owner ?
              <Tag closable onClose={(e) => {
                // e.preventDefault()
                changeLocalTask({
                  owner: null
                })
                changeBackTask('owner', { value: null })
              }}>
                {task?.owner.username}
              </Tag>
              :
              <PopUserList onSelectedMember={(user) => {
                changeLocalTask({
                  owner: user
                });
                changeBackTask('owner', { value: user.id });
              }}>
                <Button type='text'>添加负责人</Button>
              </PopUserList>
          }

          {/* <PlusCircleOutlined /> */}
        </Space>
      </div>
      <div>
        <Space size={'middle'} align={'center'}>
          <Tooltip title="截止时间">
            <CalendarOutlined style={sizeStyle} />
          </Tooltip>
          <DatePicker
            placeholder='请选择截止时间'
            value={deadTime}
            disabledDate={disabledDate}
            showToday
            locale={locale}
            popupStyle={{ zIndex: 999999999 }}
            showTime={{ minuteStep: 30, defaultValue: dayjs('18:00', 'HH:mm'), format: 'HH:mm' }}
            onChange={onChange}
            onOk={onOk}
          />
        </Space>
      </div>
      <div>
        <Space size={'middle'} style={{ 'width': '100%' }}>
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
                    onChange={onChange}
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
          <UploadFile fileList={attaches} onChange={(fileList) => setAttaches(fileList)}>
            <Button type="text">添加附件</Button>
          </UploadFile>
        </Space>

      </div>
      <div>
        <Space size={'middle'}>
          <Tooltip title="关注人">
            <UsergroupAddOutlined style={sizeStyle} />
          </Tooltip>
          {
            (task?.followers && task?.followers.length > 0)
              ?
              <>
                {
                  task.followers.map(user => {
                    <Tag closable onClose={(e) => {
                      // e.preventDefault()
                      changeLocalTask({
                        owner: null
                      })
                      changeBackTask('owner', { value: null })
                    }}>
                      {user.username}
                    </Tag>
                  })
                }
              </>
              :
              <PopUserList onSelectedMember={(user) => {
                changeLocalTask({
                  owner: user
                });
                changeBackTask('owner', { value: user.id });
              }}>
                <Button type="text">添加关注人</Button>
              </PopUserList>
          }

        </Space>
      </div>
    </Space>
  )
}