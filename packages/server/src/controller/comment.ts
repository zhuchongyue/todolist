import { Context } from 'koa'
import { request, summary, path, body, responsesAll, tagsAll } from "koa-swagger-decorator";
import { CommentModel, Comment } from '@todolist/db';
import { createCommentSchema } from './swaggerSchemas';
import { wrapObjectId } from '../utils';

@tagsAll(['评论'])
export default class CommentController {

  @request('post', '/comment')
  @summary('新建评论')
  @body(createCommentSchema)
  public static async createComment(ctx: Context) {

    const {task, user, contents } = <Comment>ctx.request.body

    const comment = await CommentModel.create({
      task,
      user,
      contents
    })

    ctx.status = 200
    ctx.body = {
      id: comment.id
    }

    // const c = new Comment()
    // c.contents = [{
    //   type: 'dfd'
    // }]

    // CommentModel.create({
    //   contents: [{
    //     type: 'sdsd'
    //   }]
    // })
    // CommentModel.create({})
  }

  @request('delete', '/comment/{id}')
  @summary('删除评论')
  @path({ id: { type: 'string', required: true, description: '评论id'} })
  public static async delComment(ctx: Context) {
    const id = ctx.params.id;
    try {
      await CommentModel.deleteOne({ _id: wrapObjectId(id) })
      ctx.status = 200;
      ctx.body = { deleted: true };
    } catch(e) {
      ctx.throw(500)
    }
  }

  @request('get', '/comments/{task}')
  @path({
    taskId: { type: 'string', required: true, description: '任务id'}
  })
  public static async fetchCommentsByTaskId(ctx: Context) {
    const task = ctx.params.task;
    try {
      const comments = await CommentModel.find({ task: wrapObjectId(task) })
        .populate('user', '-password -salt')
      ctx.status = 200;
      ctx.body = comments
    } catch(e) {
      ctx.status = 500
      ctx.throw(500)
    }
  }
}