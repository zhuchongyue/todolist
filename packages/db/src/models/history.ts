import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true},
    toObject: { virtuals: true },
    timestamps: { // 获得 createdAt（创建时间） 和 updatedAt（更新时间） 两字段【number】
      createdAt: true, 
      updatedAt: false,
      currentTime: () => Date.now()
    }
  }
})
export class History {
  
  @prop({ ref: 'User' })
  public operator!: mongoose.Types.ObjectId; // 操作人

  @prop({ required: true, default: 'Task' })
  public targetDoc!: string; // 操作的目标表（目前都是Task) 

  @prop({ required: true, refPath: 'targetDoc' })
  public target!: mongoose.Types.ObjectId; // 操作的目标项（目前就是具体的某一个任务id)

  @prop({ required: true })
  public action!: string; // 操作的行为 eg: 增、删、查（应该没有）、改

  @prop()
  public field?: string; // 操作的字段

  @prop()
  public oldValue?: string | number; // 操作前 field的值

  @prop() 
  public newValue?: string | number; // 操作后的field的值

}

const HistoryModel = getModelForClass(History)
export default HistoryModel
