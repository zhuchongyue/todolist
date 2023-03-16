import { IUser } from "@/store/user/userSlice";
import request from "./request";
import { ActionType } from "./task";

export interface IHistory {
  action: ActionType;
  createdAt: number;
  id: string;
  operator: IUser;
  newValue?: string | number;
  field: string;
  oldValue?: string | number;
}
export async function fetchTaskActionHistory(taskId: string, targetDoc: string = 'Task') {
  return request.get<IHistory[]>(`/histories/${targetDoc}/${taskId}`)
}