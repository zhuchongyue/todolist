import { Context } from "koa";
import HistoryModel from "packages/db/src/models/history";

export enum ActionType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

export function recodeAction(type: ActionType, doc: string = 'Task') {
  return async (ctx: Context, next: () => Promise<any>) => {
    
    await next()
    const userId = ctx.state?.user?.id
    // @ts-ignore
    const taskId = ctx.params.id || ctx.body.id;
    console.log('recodeAction--------------------', taskId)
    console.log(ctx.body)
    console.log(ctx.state)
    if (type === ActionType.CREATE) {
      HistoryModel.create({
        operator: userId,
        targetDoc: doc,
        action: type,
        target: taskId
      })
    }

    if (type === ActionType.DELETE) {
      
      HistoryModel.create({
        operator: userId,
        targetDoc: doc,
        action: type,
        target: taskId
      })
    }

    if (type === ActionType.UPDATE) {
      console.log('recodeAction update....')
      const meta = ctx.request.body.meta
      HistoryModel.create({
        operator: userId,
        targetDoc: doc,
        action: meta.action || type,
        target: taskId,
        field: meta.field,
        oldValue: meta.oldValue,
        newValue: meta.newValue
      })
    }
  }
}
