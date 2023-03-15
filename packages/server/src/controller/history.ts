import { Context } from 'koa'
import { request, summary, path, body, responsesAll, tagsAll } from "koa-swagger-decorator";
import { HistoryModel, Comment } from '@todolist/db';
import { createCommentSchema } from './swaggerSchemas';
import { wrapObjectId } from '../utils';

@tagsAll(['操作历史'])
export default class HistroyController {

  @request('get', '/histories/{targetDoc}/{target}')
  
  @path({
    targetDoc: { type: 'string', required: true, description: '目标对象名称（表名）'},
    target: { type: 'string', required: true, description: '任务id'}
  })
  public static async historiesByTargetId(ctx: Context) {
    const { targetDoc, target } = ctx.params;

    const histories = await HistoryModel.find({
      targetDoc, target
    });

    ctx.status = 200;
    ctx.body = histories;
  }
}