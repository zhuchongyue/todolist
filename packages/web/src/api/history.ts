import request from "./request";

export async function fetchTaskActionHistory(taskId: string) {
  return request.get(`/histories/${taskId}`)
}