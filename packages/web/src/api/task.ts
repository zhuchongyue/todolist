import { IFilter } from "@/components/HomeFilter/HomeFilter";
import { IUser } from "@/store/user/userSlice";
import { RangePickerProps } from "antd/es/date-picker";
import request from "./request";

export interface ITask {
  desc?: string;
  isSub?: boolean;
  attachments?: string[];
  deadTime?: number;
  finishTime?: number;
  status?: 1 | 2; // 1 未完成 2 已完成
}
export interface ICreateTask extends ITask {
  parent?: string;
  creator?: string;
  title: string; // 创建的时候 title是必须
  owner?: string;
  followers?: string[];
}
export interface IUpdateTask extends ITask {
  id: string; // 更新的时候 id是必须
  title?: string;
  creator: IUser,
  owner: IUser | null,
  followers: IUser[],
  createdAt: number;
  updatedAt: number
}

// 创建task post
export async function createTask(task: ICreateTask) {
  return request.post<IUpdateTask>('/task', task)
}

// 更新 task put
// export async function updateTask(task: IUpdateTask) {
//   return request.put<{updated: boolean}>(`/task/${task.id}`, task)
// }
// export async function updateTask(task: Partial<IUpdateTask>, oldTask: Partial<IUpdateTask>) {
//   return request.put<{ updated: boolean }>(`/task/${task.id}`, { task, oldTask })
// }

export enum ActionType {
  DELETE = 'delete',
  ADD = 'add',
  CREATE = 'create',
  UPDATE = 'update'
}
export interface IUpateMeta {
  action: ActionType;
  field: string; // 操作的字段
  newValue?: string | number;
  oldValue?: string | number;
}
export async function updateTask(task: Partial<IUpdateTask>, meta?: IUpateMeta) {
  return request.put<{ updated: boolean }>(`/task/${task.id}`, { task, meta })
}

// 删除 task delete
export async function deleteTask(taskId?: string) {
  return request.delete<{ deleted: boolean }>(`/task/${taskId}`)
}

type IFilterParams = Omit<IFilter, 'sort'>
type IFilterKey = keyof IFilterParams

// 获取task list
export async function listTask(data?: {
  pageNum?: number;
  pageSize?: number;
  withChild?: boolean;
  sort?: string;
  filters?: IFilterParams;
}) {
  const filters = data?.filters;
  if (filters) {
    // @ts-ignore
    data.filters = Object.keys(filters).reduce((prev: any, key: IFilterKey) => {
      if (!filters[key]) {
        return prev
      }
      // @ts-ignore
      if (Array.isArray(filters[key]) && filters[key].length === 0) {
        return prev
      }

      if (['deadTime', 'finishTime'].includes(key)) {
        // @ts-ignore
        const values = filters[key].map(t => t.valueOf());
        return Object.assign(prev, { [key]: values })
      }

      return Object.assign(prev, { [key]: filters[key] })
    }, {})
  }

  console.log('listTask: ', data)

  return request.post<IUpdateTask[]>('/tasks', data).then(res => res.data)
}

// 拖拽排序
export async function dargDropOrder(data: {
  prev?: string;
  next?: string;
  active: string;
}) {
  return request.post<{ updated: boolean }>('/tasks/dragdroporder', data)
}