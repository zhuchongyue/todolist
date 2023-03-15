import { DocumentType, getModelForClass, pre, prop, buildSchema } from '@typegoose/typegoose';
import mongoose from 'mongoose';

// 评论内容表
export class CommentContent {

  // @prop({ required: true, ref: 'Comment' })
  // public commentId!: mongoose.Types.ObjectId; // 评论id

  @prop({ required: true, enum: [1, 2, 3, 4], default: 1})
  public type!: number;   // 评论内容类型 1.text 2 mention(@) 3. image 4.file

  @prop({ required: true,})
  public content!: string;  // 评论内容 type 1纯text 2 存username 3、4 存对应的url

  @prop()
  public mentionId?: string; // 被提醒人的id, 类型为2的时候，该字段有值，对应user id. 用于事件提醒之类的行为

}

const CommentContentModel = getModelForClass(Comment)

export default CommentContentModel

