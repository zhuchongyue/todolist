
import { Context } from "koa";
import { request, summary, responsesAll, tagsAll, responses } from "koa-swagger-decorator";
import { UserModel } from "@todolist/db";
import { singupUserSchema } from './swaggerSchemas'

@responsesAll({ 200: { description: "success" }, 400: { description: "bad request" }, 401: { description: "unauthorized, missing/wrong jwt token" } })
@tagsAll(["用户"])
export default class UserController {

    @request("get", "/users")
    @summary("获取用户列表")
    @responses(singupUserSchema)
    public static async getUsers(ctx: Context): Promise<void> {

        const users = await UserModel.findAll();
        // return OK status code and loaded users array
        ctx.status = 200;
        ctx.body = users;
    }
}
