import { IUser } from "@/store/user/userSlice";
import request from "./request";
import { ITask } from "./task";

export enum CommentContentType {
  TEXT = 1,
  MENTION = 2,
  IMG = 3,
  FILE = 4
}

export interface ICreateCommentContent {
  type: CommentContentType;
  content: string;
  mentionId?: string;
}

export interface ICreateComment {
  task: string;
  user: string;
  contents: Array<ICreateCommentContent>;
}

export interface ICreatedComment {
  id: string;
  task: string;
  user: IUser;
  contents: Array<ICreateCommentContent>;
}

export async function createComment(data: ICreateComment) {
  return request.post<{ id: string }>('/comment', data)
}

export async function delComment(id: string) {
  return request.delete(`/comment/${id}`)
}

export async function fetchCommentsByTaskId(task: string) {
  return request.get<Array<ICreatedComment>>(`/comments/${task}`).then(res => res.data)
}