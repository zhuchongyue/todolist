import { BaseContext, Context } from 'koa';
import { description, request, summary, tagsAll, body } from 'koa-swagger-decorator';
import minioClient from '@todolist/oss';
import fs from 'fs'
import { User, UserModel } from '@todolist/db';
import jwt from 'jsonwebtoken';
import config from '@todolist/config';

const loginUserSchema = {
    username: { type: 'string', required: true, example: 'Tom' },
    password: { type: 'string', required: true, example: 'abc123' },
}
const singupUserSchema = {
    // id: { type: 'number', required: true, example: 1 },
    // name: { type: 'string', required: true, example: 'Tom' },
    // password: { type: 'string', required: true, example: 'abc123' },
    ...loginUserSchema,
    avatar: { type: 'string', required: true, example: 'http://some.com/path/abc.jpg' },
    bio: { type: 'string', required: true, example: 'A senior engineer' },
    position: { type: 'string', required: true, example: 'engineer' },
}

function genToken(username: string, id: string) {
    return jwt.sign(
        { username, id },
        config.SERVER_JWT_SECRET,
        { expiresIn: config.SERVER_TOKEN_EXPIRES_TIME }
    )
}

@tagsAll(['基础接口 - 不需要token'])
export default class GeneralController {

    @request('get', '/')
    @summary('Welcome page')
    @description('A simple welcome message to verify the service is up and running.')
    public static async helloWorld(ctx: BaseContext): Promise<void> {
        ctx.body = 'Hello World!';
    }

    @request('post', '/upload')
    @summary('通用单文件上传')
    public static async upload(ctx: Context) {
        let file = ctx.request.files!['file'];
        if (Array.isArray(file)) file = file[0]
        try {
            const fileName = `${Date.now()}_${file.originalFilename}`;
            const url = await minioClient.putObject({
                // @ts-ignore
                file: fs.createReadStream(file.filepath),
                fileName,
                size: file.size,
                metaData: {
                    'Content-Type': file.mimetype || 'application/octet-stream'
                }
            })
            ctx.body = {
                status: 200,
                url
            }
        } catch (e) {
            ctx.body = {
                status: 500,
                msg: '服务器错误: ' + e
            }
        }
    }

    @request('post', '/signup')
    @summary('注册用户')
    @body(singupUserSchema)
    public static async createUser(ctx: Context): Promise<void> {
        // get a user repository to perform operations with user
        // ctx.request.body
        const { username, bio, password, position, avatar } = ctx.request.body;

        const existUser = await UserModel.findOne({ username })

        if (existUser) {
            ctx.throw('用户名已存在')
            // throw new AssertionError({ message: '用户名已存在' })
        }
        const user = await UserModel.create({
            username,
            password,
            bio,
            position,
            avatar
        })
        ctx.status = 200;
        ctx.body = {
            id: user._id, username: user.username, avatar: user.avatar
        };
    }

    @request('post', '/login')
    @summary('用户登录')
    // @body(loginUserSchema)
    public static async login(ctx: Context) {
        const { username, password } = ctx.request.body
        const user = await UserModel.findOne({ username })
        if (!user) {
            ctx.throw({ message: '用户不存在!' })
        }
        const isRightPass = user.validPass(password)
        if (!isRightPass) {
            ctx.throw({ message: '密码错误!' })
        }
        const token = genToken(user.username, user.id)
        ctx.status = 200
        ctx.body = {
            id: user.id,
            username: user.username,
            token: `Bearer ${token}`,
            avatar: user.avatar
        }
    }
}

