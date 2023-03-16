import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserList } from '@/store/user/userSlice';
import NewTaskForm from '@/components/NewTaskForm/NewTaskForm';

import { BookOutlined, HistoryOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons'
import { Button, Table, Drawer, Tooltip, Space, Modal, Card, Typography, Checkbox, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { changeTasks, curTaskSelector, delOneTask, fetchTasks, loadingTasksSelector, setCurTask, tasksSelector } from '@/store/task/taskSlice';
import { dargDropOrder, deleteTask, IUpdateTask } from '@/api';
import History from '@/components/History/History';
import Comment from '@/components/Comment/Comment';
import UpdateTaskForm from '@/components/UpdateTaskFrom/UpdateTaskForm';
import { formatTime } from '@/utils';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Filter, { IFilter } from '@/components/HomeFilter/HomeFilter';
import './Home.scss'
const { Text } = Typography;
interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const DndRow = ({ children, ...props }: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === 'sort') {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: 'none', cursor: 'move' }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

function HomePage() {

  const dispatch = useAppDispatch();

  const tasks = useAppSelector(tasksSelector)
  const curTask = useAppSelector(curTaskSelector)
  const loadingTasks = useAppSelector(loadingTasksSelector)

  const [filter, setFilter] = useState<IFilter>({
    status: undefined,
    owner: [],
    creator: [],
    sort: '-createdAt',
    finishTime: undefined,
    deadTime: undefined
  })

  useEffect(() => {
    dispatch(fetchUserList())
  }, []);

  useEffect(() => {
    setOpenDarg(filter.sort === 'order')
    dispatch(fetchTasks(filter))
  }, [filter])

  

  const [openDrag, setOpenDarg] = useState(false);

  const handleRowClick = (task: IUpdateTask) => {
    dispatch(setCurTask(task))
    setOpenDrawer(true)
  }

  const handleDeleteTask = async () => {
    const delRes = await deleteTask(curTask!.id)
    if (delRes.data.deleted) {
      setOpenDrawer(false);
      dispatch(delOneTask(curTask!))
    }
  }

  const [openDrawer, setOpenDrawer] = useState(false)
  const [historyDrawer, setHistoryDrawer] = useState(false)

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [columns, setColumns] = useState<ColumnsType<IUpdateTask>>([
    // {
    //   key: 'sort',
    //   width: 60,
    //   title: '拖拽'
    // },
    {
      title: '任务标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      fixed: 'left',
      render: (_, { title, status }) => (<>
        <Space>
          <Tooltip title={status === 1 ? '点击完成任务' : '点击重启任务'}>
            <Checkbox></Checkbox>
          </Tooltip>
          <Text>{title}</Text>
        </Space>
      </>)
    },
    {
      title: '负责人',
      dataIndex: ['owner', 'username'],
      key: 'id',
    },
    {
      title: '截止时间',
      dataIndex: 'deadTime',
      key: 'deadTime',
      render: (_, { deadTime }) => (<>{formatTime(deadTime)}</>)
    },
    // {
    //   title: '子任务进度',
    //   dataIndex: 'owner',
    //   key: 'owner',
    // },
    {
      title: '创建人',
      dataIndex: ['creator', 'username'],
      key: 'id',
    },
    // {
    //   title: '分配人',
    //   dataIndex: 'assigner',
    //   key: 'assigner',
    // },
    // {
    //   title: '关注人',
    //   dataIndex: 'followers',
    //   key: 'followers'
    // },
    {
      title: '完成时间',
      dataIndex: 'finishTime',
      key: 'finishTime',
      render: (_, { finishTime }) => (<>{formatTime(finishTime)}</>)
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, { createdAt }) => (<>{formatTime(createdAt)}</>)
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_, { updatedAt }) => (<>{formatTime(updatedAt)}</>)
    },
    {
      title: '任务Id',
      dataIndex: 'id',
      key: 'id'
    }
  ]);

  useEffect(() => {
    if (openDrag) {
      if (columns[0].key !== 'sort') {
        setColumns([
          {
            fixed: 'left',
            key: 'sort',
            width: 60,
            title: '拖拽'
          }, ...columns
        ])
      }
    } else {
      if (columns[0].key === 'sort') {
        setColumns(columns.slice(1))
      }
    }
  }, [openDrag])

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return; // 容错
    if (active.id !== over?.id) {

      const overIndex: number = over?.data.current!.sortable.index;
      let prevId: string | undefined = undefined
      let nextId: string | undefined = undefined
      if (overIndex > 0 && overIndex < tasks.length - 1) { 
        const overPrevIndex: number = overIndex - 1;
        prevId = tasks[overPrevIndex].id;
        nextId = tasks[overIndex].id;
      }

      if (overIndex === 0) { // 代表没有prev
        nextId = tasks[0].id;
      }

      if (overIndex === tasks.length - 1) { // 代表没有next
        prevId = tasks[overIndex].id
      }

      dargDropOrder({
        prev: prevId,
        active: active.id as string,
        next: nextId
      }).then(res => {
        if(res.data.updated) {
          const sort = ((tasks: IUpdateTask[]) => {
            const activeIndex = tasks.findIndex((i) => i.id === active.id);
            const overIndex = tasks.findIndex((i) => i.id === over?.id);
            return arrayMove(tasks, activeIndex, overIndex);
          });
          dispatch(changeTasks(sort(tasks)))
        }
      })
    }
  };
  return (
    <Card title="TODOLIST" className="home"
      style={{margin: '10px 20px'}}
      extra={<Button type={'primary'} onClick={() => setOpenAddDialog(true)}>新建</Button>}
    >
      <Filter filter={filter} filterChange={(filter) => setFilter(filter)}/>
        
      <Spin spinning={loadingTasks}>
      <DndContext onDragEnd={onDragEnd}>
        <SortableContext
          items={tasks.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            components={{
              body: {
                row: DndRow
              }
            }}
            rowKey="id"
            columns={columns}
            // rowSelection={{ ...rowSelection }}
            dataSource={tasks}
            scroll={{ x: 1300 }}
            onRow={
              (record) => {
                return {
                  onClick: () => handleRowClick(record)
                }
              }
            }
          />
        </SortableContext>
      </DndContext>
      </Spin>

      <Drawer
        // zIndex={999999}
        width={600}
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
          dispatch(setCurTask(null))
        }}
        title={`ID: ${curTask?.id || ''}`}
        extra={
          <Space size={'large'}>
            <Tooltip title="关注">
              <BookOutlined />
            </Tooltip>
            <Tooltip title="查看历史">
              <HistoryOutlined onClick={() => setHistoryDrawer(true)} />
            </Tooltip>
            <Tooltip title="删除">
              <DeleteOutlined onClick={handleDeleteTask} style={{ color: '#f00' }} />
            </Tooltip>
          </Space>
        }
        mask={false}
        bodyStyle={{padding: 0, background: '#eee'}}
      >
        <div className='home-task'>
          <div className='home-task-form'>
            <UpdateTaskForm />
          </div>
          <div className='home-task-comment'>
            <Comment />
          </div>
        </div>

        <Drawer
          title="操作历史"
          width={500}
          closable={false}
          onClose={() => setHistoryDrawer(false)}
          open={historyDrawer}
          destroyOnClose
          // zIndex={9999999}
        >
          <History histoies={[
            {
              time: '21:04',
              text: '朱崇跃 添加了备注：ppppppppp'
            },
            {
              time: '21:03',
              text: '朱崇跃 更新任务标题为 手法电风扇杠上朱崇跃 更新任务标题为 手法电风扇杠上朱崇跃 更新任务标题为 手法电风扇杠上朱崇跃 更新任务标题为 手法电风扇杠上朱崇跃 更新任务标题为 手法电风扇杠上'
            },
            {
              time: '21:03',
              text: '朱崇跃 更新任务标题为 手法电风扇杠上朱崇跃 更新任务标题为 手法电风扇杠上朱崇跃 更新任务标题为 手法电风扇杠上朱崇跃 更新任务标题为 手法电风扇杠上朱崇跃 更新任务标题为 手法电风扇杠上'
            }
          ]} />
        </Drawer>
      </Drawer>
      <Modal width={600} 
        // zIndex={999999} 
        destroyOnClose  maskClosable={false} title="新建任务" 
        open={openAddDialog} onCancel={() => setOpenAddDialog(false)}
        footer={null}
        >
        <NewTaskForm onCancel={() => setOpenAddDialog(false)} />
      </Modal>
    </Card>
  );
}

export default HomePage;
