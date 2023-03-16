import { ActionType } from "@/api"

export const fieldMap = {
  title: '任务标题',
  desc: '任务描述',
  deadTime: '截止时间',
  owner: '负责人',
  status: '任务状态'
}

export const actionMap = {
  [ActionType.CREATE]: '创建了任务',
  [ActionType.UPDATE]: '更新了',
  [ActionType.ADD]: '添加了',
  [ActionType.DELETE]: '删除了',
}