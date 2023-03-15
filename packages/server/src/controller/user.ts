
import { Context } from "koa";
import { getManager, Repository, Not, Equal, Like } from "typeorm";
import { validate, ValidationError } from "class-validator";
import { request, summary, path, body, responsesAll, tagsAll } from "koa-swagger-decorator";
import { User, userSchema } from "../entity/user";
import { UserModel } from "@todolist/db";
import { singupUserSchema } from './swaggerSchemas'

@responsesAll({ 200: { description: "success" }, 400: { description: "bad request" }, 401: { description: "unauthorized, missing/wrong jwt token" } })
@tagsAll(["用户"])
export default class UserController {

    @request("get", "/users")
    @summary("获取用户列表")
    public static async getUsers(ctx: Context): Promise<void> {

        const users = await UserModel.findAll();
        // return OK status code and loaded users array
        ctx.status = 200;
        ctx.body = users;
    }

    @request("get", "/users/{id}")
    @summary("Find user by id")
    @path({
        id: { type: "number", required: true, description: "id of user" }
    })
    public static async getUser(ctx: Context): Promise<void> {

        // get a user repository to perform operations with user
        const userRepository: Repository<User> = getManager().getRepository(User);

        // @ts-ignore load user by id
        const user: User | undefined = await userRepository.findOne(+ctx.params.id || 0);

        if (user) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = user;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The user you are trying to retrieve doesn't exist in the db";
        }

    }

    

    @request("put", "/users/{id}")
    @summary("Update a user")
    @path({
        id: { type: "number", required: true, description: "id of user" }
    })
    @body(singupUserSchema)
    public static async updateUser(ctx: Context): Promise<void> {

    }

    @request("delete", "/users/{id}")
    @summary("Delete user by id")
    @path({
        id: { type: "number", required: true, description: "id of user" }
    })
    public static async deleteUser(ctx: Context): Promise<void> {

        

    }

    @request("delete", "/testusers")
    @summary("Delete users generated by integration and load tests")
    public static async deleteTestUsers(ctx: Context): Promise<void> {
       
    }

}
