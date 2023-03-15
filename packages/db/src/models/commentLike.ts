import { prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

// 评论点赞表
export class CommentLike {

  @prop({ref: 'Comment' })
  public commentId!: mongoose.Types.ObjectId; // 被点赞的评论

  @prop({ref: 'User'}) 
  public userId!: mongoose.Types.ObjectId; // 点赞人
}