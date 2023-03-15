import { IUser } from "@/store/user/userSlice";
import request from "./request";

export interface ITask {
  desc?: string;
  isSub?: boolean;
  attachments?: string[];
  deadTime?: string;
  finishTime?: string;
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
  createdAt: string;
  updatedAt: string
}

// 创建task post
export async function createTask(task: ICreateTask) {
  return request.post<{id: string}>('/task', task)
}

// 更新 task put
// export async function updateTask(task: IUpdateTask) {
//   return request.put<{updated: boolean}>(`/task/${task.id}`, task)
// }
export async function updateTask(task: Partial<IUpdateTask>, oldTask: Partial<IUpdateTask>) {
  console.log('updateTask: ', {task, oldTask})
  return request.put<{updated: boolean}>(`/task/${task.id}`, {task, oldTask})
}

// 删除 task delete
export async function deleteTask(taskId?: string) {
  return request.delete<{deleted: boolean}>(`/task/${taskId}`)
}

// 获取task list
export async function listTask(params?: {
  pageNum?: number;
  pageSize?: number;
  withChild?: boolean;
  filters?: {
    status?: 1 | 2;
    owners?: string[];
    creators?: string[];
    deadTimeRange?: [string, string];
    finishTimeRange?: [string, string];
    sort: any
  }
}) {
  return request.get<IUpdateTask[]>('/tasks', { params }).then(res => res.data)
}

// 拖拽排序
export async function dargDropOrder(data: {
  prev?: string;
  next?: string;
  active: string;
}) {
  return request.post<{updated: boolean}>('/tasks/dragdroporder', data)
}