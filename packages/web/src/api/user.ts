
import { IUser } from "@/store/user/userSlice";
import request from "./request";
export async function login(username: string, password: string) {
  return request.post<IUser>('/login', {username, password}).then(res => res.data)
}

export async function signup(user: {
  username: string;
  password: string;
  bio: string;
  position: string;
  avatar: string;
}) {
  return request.post<{id: string; username: string}>('/signup', user)
}

export async function userList() {
  return request.get<IUser[]>('/users').then(res => res.data)
}