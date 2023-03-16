// import UserModel from "./models/user";
import * as mongoose from 'mongoose';
import config from '@todolist/config'

export { default as UserModel, User, UserSchema } from './models/user';
export { default as TaskModel, Task } from './models/task';
export { default as CommentModel, Comment } from './models/comment';
export { default as HistoryModel, History } from './models/history'

export async function init() {
  await mongoose.connect(process.env.DB_URL || config!.DB_URL, {
    dbName: config.DB_NAME,
    user: config.DB_USER,
    pass: config.DB_PASS
  })
}
// init()