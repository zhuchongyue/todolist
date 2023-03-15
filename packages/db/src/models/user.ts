import { DocumentType, getModelForClass, pre, prop, buildSchema, ReturnModelType, modelOptions } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import bcrypt from 'bcryptjs';
// import { swaggerClass, swaggerProperty } from 'koa-swagger-decorator'
@pre<User>('save', async function(next) {
  if (this.isNew) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)
    this.salt = salt
    this.password = hash
    next()
  } else {
    next()
  }
})
@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true},
    toObject: { virtuals: true }
  }
})
export class User {
  @prop()
  public sex?: number; // 1 男 2 女 暂时没有用到

  @prop({ required: true })
  public username!: string; // 用户名

  @prop({ select: false})
  public salt?: string; // 密码salt值

  @prop({ required: true })
  public password!: string; // 密码（加密）

  @prop()
  public avatar?: string; // 头像 url

  @prop()
  public bio?: string; // 个人介绍

  @prop()
  public position?: string; // 职位 真实应用这里应该是一个关联职位表的字段

  public validPass(this: DocumentType<User>, pass: string) {
    console.log('in: ', pass, this.password)
    return bcrypt.compareSync(pass, this.password )
  }

  public static async findAll(this: ReturnModelType<typeof User>, limit?: number ) {
    return limit
      ? this.find({}, '-id -salt -password').limit(limit)
      : this.find({}, '-id -salt -password')
  }

  public get id() {
    // @ts-ignore
    return this._id;
  }
}

const UserModel = getModelForClass(User)

export const UserSchema = buildSchema(User);

export default UserModel