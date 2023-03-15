import { getModelForClass, modelOptions, pre, prop } from '@typegoose/typegoose'
import mongoose from "mongoose";


@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true},
    toObject: { virtuals: true },
    timestamps: { // 获得 createdAt（创建时间） 和 updatedAt（更新时间） 两字段【number】
      createdAt: true, 
      updatedAt: true,
      currentTime: () => Date.now()
    }
  }
  
})
@pre<Task>('save', async function() {
  if(this.isNew) { // 这里是保证order每次自增+1，若使用mysql之类的则直接autoincrement 解决
    const orderRes = await TaskModel.findOne({}).sort('-order');
    orderRes ? this.order = orderRes!.order + 1 : this.order = 1;
  }
})
export class Task {

  @prop()
  public createdAt?: number;
  
  @prop()
  public updatedAt?: number;

  @prop({ required: true })
  public title!: string; // 任务标题

  @prop()
  public desc?: string; // 任务描述

  @prop()
  public deadTime?: Date; // 截止时间

  @prop()
  public finishTime?: Date; // 完成时间

  @prop()
  public followers?: mongoose.Types.ObjectId; // 任务关注人

  @prop({ ref: 'User' }) // 关联User表
  public creator?: mongoose.Types.ObjectId; // 创建人

  @prop({ ref: 'User' }) // 关联User表
  public owner?: mongoose.Types.ObjectId; // 任务负责人

  @prop({ default: 1 })
  public status?: number; // 1 未完成 2 已完成 【可扩展，目前根据飞书任务需要来看，只需要两个状态】

  // @prop({ ref: 'Task' })  // 关联自身表
  // public subTasks?: mongoose.Types.ObjectId[];  // 子任务

  @prop({ ref: 'Task' })
  public parent?: mongoose.Types.ObjectId;  // 父任务，当前是子任务时，该字段有值
  
  @prop()
  public attachments?: string[]; // 附件的url地址，已提前存入oss

  /**
    拖拽排序使用，使用规则： 
    取拖拽之后前后两条记录的order，然后取一个平均值（小数），更新order，达到只更新一条记录的作用
  */
  @prop()
  public order!: number; 

  public get id() {
    // @ts-ignore
    return this._id; // virtual 别名，符合业务命名规范
  }
  
}

const TaskModel = getModelForClass(Task)
export default TaskModel