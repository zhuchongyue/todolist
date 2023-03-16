
import { SwaggerRouter } from "koa-swagger-decorator";
import { User, Task, Comment } from "../controller";
import path from 'path'

const protectedRouter = new SwaggerRouter({
    prefix: '/api'
});


// USER ROUTES
protectedRouter.get("/users", User.getUsers);

// TASK ROUTES
// protectedRouter.post('/task', Task.createTask)
// protectedRouter.put('/task/:id', Task.updateTask)

// COMMENT ROUTES
protectedRouter.post('/comment', Comment.createComment)
protectedRouter.delete('/comment/:id', Comment.delComment)
protectedRouter.get('/comments/:task', Comment.fetchCommentsByTaskId)

// Swagger endpoint
protectedRouter.swagger({
    title: "todolist api",
    description: `todolist is an node + typescript + koa + minio + mongodb project.\n
        说明：\n
        1. 所以涉及到id的字段，均指代mongodb objectId ，前端表现为string类型
        2. 所有时间全部为unix timestampe ms 【number类型】
    `,
    version: "0.0.1"
});

protectedRouter.mapDir(path.resolve(__dirname, '../controller'))

export { protectedRouter as authRouter };
