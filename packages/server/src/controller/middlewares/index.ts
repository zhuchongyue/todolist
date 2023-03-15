import { Context } from "koa";
import HistoryModel from "packages/db/src/models/history";

export enum ActionType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

export function recodeAction(type: ActionType, doc: string = 'Task') {
  return async (ctx: Context, next: () => Promise<any>) => {
    console.log('recodeAction')
    await next()
    const userId = ctx.state?.user?.id
    console.log(ctx.body)
    console.log(ctx.state)

    if (type === ActionType.CREATE) {
      // @ts-ignore
      const taskId = ctx.body.id;
      HistoryModel.create({
        operator: userId,
        targetDoc: doc,
        action: type,
        target: taskId
      })
    }

    if (type === ActionType.DELETE) {
      const taskId = ctx.params.id;
      HistoryModel.create({
        operator: userId,
        targetDoc: doc,
        action: type,
        target: taskId
      })
    }
  }
}