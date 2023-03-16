import { listTask, login, userList } from '@/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { ITask, ICreateTask, IUpdateTask } from '@/api';
import { IFilter } from '@/components/HomeFilter/HomeFilter';

export interface ITaskState {
  curTask: IUpdateTask | null;
  tasks: IUpdateTask[];
  loadingTasks: boolean;
}
const initialState: ITaskState = {
  curTask: null,
  tasks: [],
  loadingTasks: false
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
    changeCurTask: (state, action: PayloadAction<IUpdateTask>) => {
      state.curTask = action.payload
      const index = state.tasks.findIndex(task => task.id === action.payload.id)
      if (index > -1) {
        state.tasks[index] = action.payload
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
    },
    newTask: (state, action: PayloadAction<IUpdateTask>) => {
      state.tasks.unshift(action.payload)
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loadingTasks = true
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loadingTasks = false
        state.tasks = action.payload
      })
      // .addCase(fetchUserList.fulfilled, (state, action) => {
        
      // })
  }
})

export const { setCurTask, delOneTask, changeCurTask, changeOneTask, changeTasks, newTask } = taskSlice.actions

export const fetchTasks = createAsyncThunk('task/fetchTasks', async(filter: IFilter) => {
  const { sort, ...filters} = filter
  return await listTask({ filters, sort })
})

export const curTaskSelector = (state: RootState) => state.task.curTask
export const tasksSelector = (state: RootState) => state.task.tasks
export const loadingTasksSelector = (state: RootState) => state.task.loadingTasks

export default taskSlice.reducer