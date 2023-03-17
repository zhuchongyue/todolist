import { DocumentType, getModelForClass, pre, prop, buildSchema, modelOptions } from '@typegoose/typegoose';
import mongoose from 'mongoose';

// @modelOptions({
//   schemaOptions: {
//     toJSON: { virtuals: true},
//     toObject: { virtuals: true },
//     timestamps: {
//       createdAt: false, 
//       updatedAt: false,
//       currentTime: () => Date.now()
//     }
//   }
// })
class CommentContent {
  @prop({ required: true, enum: [1, 2, 3, 4], default: 1})
  public type!: number;   // 评论内容类型 1.text 2 mention(@) 3. image 4.file

  @prop({ required: true,})
  public content!: string;  // 评论内容 type 1纯text 2 存username 3、4 存对应的url

  @prop()
  public mentionId?: string; // 被提醒人的id, 类型为2的时候，该字段有值，对应user id. 用于事件提醒之类的行为

}

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true},
    toObject: { virtuals: true },
    timestamps: {
      createdAt: true, 
      updatedAt: false,
      currentTime: () => Date.now()
    }
  }
})
export class Comment {

  @prop({ required: true, ref: 'Task' })
  public task!: mongoose.Types.ObjectId;

  @prop({ required: true,  })
  public contents: CommentContent[]; // 评论内容

  @prop({ required: true, ref: 'User' })
  public user!: mongoose.Types.ObjectId; // 评论作者

  public get id() {
    // @ts-ignore
    return this._id;
  }
}

const CommentModel = getModelForClass(Comment)
export default CommentModel