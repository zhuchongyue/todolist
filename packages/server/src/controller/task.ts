

import { Context } from 'koa';
import { Task, TaskModel } from '@todolist/db';
import { request, summary, path, body, responsesAll, tagsAll, middlewares, middlewaresAll } from "koa-swagger-decorator";
import { createTaskSchema, updateTaskSchema } from './swaggerSchemas';
import { recodeAction, ActionType } from './middlewares';

const logTime = () => async (ctx: Context, next: () => Promise<any>) => {
  console.log(`start: ${new Date()}`);
  await next();
  console.log(`end: ${new Date()}`);
};


interface IListBody {
  sort: string;
  filter: Partial<Task>;
}

@responsesAll({ 200: { description: "success" }, 400: { description: "bad request" }, 401: { description: "unauthorized, missing/wrong jwt token" } })
@tagsAll(["任务"])
export default class TaskController {
 
  @request('post', '/task')
  @summary('创建任务')
  @body(createTaskSchema)
  @middlewares([recodeAction(ActionType.CREATE)])
  static async createTask(ctx: Context): Promise<void> {
    const {
      title, desc, owner, attachments, creator,
      deadTime, finishTime, followers, status
    } = <Task>ctx.request.body;

    const task = await TaskModel.create({
      creator,
      title,
      desc,
      owner,
      attachments,
      followers
    })

    ctx.status = 200
    ctx.body = {
      id: task.id
    }
  }
  
  @request('put', '/task/{id}')
  @summary('更新任务')
  @body(updateTaskSchema)
  @path({
    id: { type: 'string', required: true, description: '任务id'}
  })
  // @middlewares([recodeAction(ActionType.UPDATE)])
  public static async updateTask(ctx: Context) {
    const id: string = ctx.params.id;
    const { task, oldTask } = ctx.request.body
    try {
      await TaskModel.updateOne({ _id: id }, { ...task });
      ctx.status = 200;
      ctx.body = true;
    } catch(e) {
      ctx.status = 500;
      // ctx.body = e.toString()
    }
  }

  @request('delete', '/task/{id}')
  @summary('删除任务')
  @path({
    id: { type: 'string', required: true, description: '任务id'}
  })
  @middlewares([recodeAction(ActionType.DELETE)])
  public static async deleteTask(ctx: Context) {
    const id: string = ctx.params.id;
    try {
      await TaskModel.deleteOne({_id: id})
      ctx.status = 200;
      ctx.body = { deleted: true };
    } catch(e) {
      ctx.throw(500)
    }
  }

  
  

  @request('post', '/tasks') // 这里没有使用get请求，过滤参数较多
  @summary('获取任务列表')
  public static async fetchTasks(ctx: Context): Promise<void> {
    const { filter, sort } = <IListBody>ctx.request.body;
    const timeFilterKeys = ['deadTime', 'finishTime', 'createdAt', 'updatedAt'];

    const formatFilter = Object.keys(filter).map(key => {
      if (timeFilterKeys.includes(key)) {
        // @ts-ignore
        if (filter[key] && Array.isArray(filter[key]) && filter[key].length === 2) {
          return {[key]: 'asf' }
        // @ts-ignore
        } else if(Array.isArray(filter[key])) {
          // @ts-ignore
          return {[key]: {$in: filter[key]}}
        } 
        // @ts-ignore
        return ({[key]: filter[key]})
      }
    })
    try {
      const tasks = await TaskModel.find(filter)
        .sort(sort)
        .populate('creator', '-password -slat -id')
        .populate('owner', '-password -slat -id')
      ctx.status = 200
      ctx.body = tasks
    } catch(e) {
      ctx.status = 500
      ctx.throw(500)
    }
  }

  // 拖拽排序
  @request('post', '/tasks/dragdroporder')
  @body({
    prev: { type: "string", example: "640991b41d6cdc47c331aff1", description: '拖拽后排在前一位的id' },
    next: { type: "string", example: "640991b41d6cdc47c331aff1", description: '拖拽后排在后一位的id' },
    active: { type: "string", example: "640991b41d6cdc47c331aff1", description: '被拖拽的task的id' },
  })
  public static async taskDragDropOrder(ctx: Context) {
    const { prev, next, active } = ctx.request.body;
    /**
     * 实现思路：
     * 1. 默认task 在新增的时候，递增插入一个order【这个时候全是整数】，作为默认的拖拽顺序
     * 2. 前端拖拽的完成之后，把拖拽之后，前一个元素，后一个元素的id，上传，被拖拽的元素order，取2者均值【这个时候可能插入小数了】
     * 3. 后续拖拽顺序，就是order的大小顺序
     * 
     * 边界情况：
     *  1. 没有prev, 说明被拖到了最开头。解决方案： 用next order 减去一个随机正值
     *  2. 没有next, 说明被拖到了最后。解决方案： 用prev order 加上一个随机正值
     */
    try {

      // @ts-ignore
      let nextTask, prevTask;
      if (!prev && next) {
        nextTask = await TaskModel.findById(next);
        await TaskModel.updateOne({_id: active }, { order: nextTask!.order - parseFloat(Math.random().toFixed(2)) });
      }

      if (prev && !next) {
        prevTask = await TaskModel.findById(prev)
        await TaskModel.updateOne({_id: active }, { order: prevTask!.order + parseFloat(Math.random().toFixed(2)) });
      }

      if (prev && next) {
        nextTask = await TaskModel.findById(next);
        prevTask = await TaskModel.findById(prev)
        await TaskModel.updateOne({_id: active }, { order: (prevTask!.order + nextTask!.order) / 2 });
      }
     
      ctx.status = 200;
      ctx.body = { updated: true }

    } catch(e) {
      // ctx.status = 500;
      ctx.throw('服务端排序错误: ' + e, 500)
    }
  }
}