# todolist
> a todolist project

## 技术栈

 
- **后端**: 
  - **OSS**: minio
  - **数据库**: mongodb
  - **ODM**: mongoose、Typegoose(ts定义schema)
  - **Server**: koa2、koa-router、swagger-router(基于@koa/router, 用于生成接口文档) 

- **前端**: 
  - **MVVM**: react、redux(@reduxjs/toolkit)、react-router
  - **HTTP Client**: axios
  - **UI Library**: antd、mui(material ui)

- **Monorepo**
  - yarn2 workspaces

- **启动/部署**
  - docker-compose (目前仅开发方案)


## 开发

### 容器方案

```shell
docker-compose up
```

### 本地yarn启动
```shell
  # 1. 配置mongo, 并启动
  # 2. 配置minio, 并启动
  # 3. 安装配置yarn2
  
  yarn plugin import workspace-tools

  yarn install

  yarn dev

  # 接口文档：http://localhost:3000/api/swagger-html

```

## TODO
- [x] 拖拽排序
- [x] 评论（支持@、图片、附件）
- [x] 操作历史
- [x] 任务状态
- [ ] 子任务管理
- [ ] server token 过期
- [ ] 接口文档参数返回值补齐
- [ ] 关注人逻辑
- [ ] 消息通知

