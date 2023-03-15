import { listTask, login, userList } from '@/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { ITask, ICreateTask, IUpdateTask } from '@/api';
import { IFilter } from '@/components/HomeFilter/HomeFilter';

export interface ITaskState {
  curTask: IUpdateTask | null;
  tasks: IUpdateTask[];
}
const initialState: ITaskState = {
  curTask: null,
  tasks: []
}

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setCurTask: (state, action: PayloadAction<IUpdateTask | null>) => {
      state.curTask = action.payload
    },
    delOneTask: (state, action: PayloadAction<IUpdateTask>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index > -1) {
        state.tasks.splice(index, 1)
      }
    },
    // 前端改动的task 修改成功后同步store，减少重新后端请求
    changeOneTask: (state, action: PayloadAction<IUpdateTask>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id)
      if (index > -1) {
        state.tasks[index] = action.payload
      }
    },
    // 拖拽排序后回调用替换
    changeTasks: (state, action: PayloadAction<IUpdateTask[]>) => {
      state.tasks = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload
      })
      // .addCase(fetchUserList.fulfilled, (state, action) => {
        
      // })
  }
})

export const { setCurTask, delOneTask, changeOneTask, changeTasks } = taskSlice.actions

export const fetchTasks = createAsyncThunk('task/fetchTasks', async(filter: IFilter) => {
  return await listTask({ filters: filter })
})

export const curTaskSelector = (state: RootState) => state.task.curTask
export const tasksSelector = (state: RootState) => state.task.tasks

export default taskSlice.reducer