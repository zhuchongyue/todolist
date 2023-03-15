import Router from "@koa/router";
import { General, User } from "../controller";

const noAuthRouter = new Router({
  prefix: '/api'
});

noAuthRouter.get("/", General.helloWorld);
noAuthRouter.post('/login', General.login);
noAuthRouter.post('/upload', General.upload);
noAuthRouter.post('/signup', General.createUser);


export default noAuthRouter;