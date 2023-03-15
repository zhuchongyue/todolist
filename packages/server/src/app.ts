
import Koa from 'koa';
import jwt from 'koa-jwt';
import cors from '@koa/cors'
import { koaBody } from 'koa-body';
import winston from 'winston'
import { logger } from './middlewares/logger';
import config from '@todolist/config'
import { authRouter } from './routes/authRoutes';
import noAuthRouter from './routes/noAuthRoutes'
import "reflect-metadata";
import { init as initDb } from '@todolist/db';

initDb()
const app = new Koa();

app.use(cors());
app.use(logger(winston));
app.use(koaBody({
  multipart: true
}));
app.use(noAuthRouter.routes()).use(noAuthRouter.allowedMethods())
app.use(jwt({ secret: config.SERVER_JWT_SECRET }).unless({ path: [/^\/api\/swagger-/] }));
app.use(authRouter.routes()).use(authRouter.allowedMethods());

app.listen(config!.SERVER_PROT, () => {
  console.log(`Server running on port ${config!.SERVER_PROT}`)
})