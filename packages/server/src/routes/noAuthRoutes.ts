import Router from "@koa/router";
import { General } from "../controller";

const noAuthRouter = new Router({
  prefix: '/api'
});

noAuthRouter.post('/login', General.login);
noAuthRouter.post('/upload', General.upload);
noAuthRouter.post('/signup', General.createUser);


export default noAuthRouter;