
/* user start */
export const singupUserSchema = {
  // id: { type: "number", required: true, example: 1 },
  name: { type: "string", required: true, example: "Tom",  description: '用户名'  },
  password: { type: 'string', required: true, example: 'abc123' },
  avatar: { type: 'string', required: true, example: 'http://some.com/path/abc.jpg' },
  bio: { type: 'string',  example: 'A senior engineer' },
  position: { type: 'string', example: 'engineer' },
}
/* user end */

export const createTaskSchema = {
  title: { type: "string", required: true, example: "Task name", description: '任务名称' },
  desc: { type: 'string',  example: 'Task desc' },
  cretor: { type: 'string',  example: '640991b41d6cdc47c331aff1', description: '创建人id' },
  owner: { type: 'string', example: '640991b41d6cdc47c331aff1', description: '负责人id'},
  attachments: { type: 'Array<string>', example: ['http://some.com/path/img1.jpeg', 'http://some.com/path/img2.png'], desc: '上传到ossd的图片url'},
}

export const updateTaskSchema = {
  task: {
    title: { type: "string", example: "Task name", description: '任务名称' },
    desc: { type: 'string',  example: 'Task desc' },
  },
  oldTask: {
    title: { type: "string", example: "Task name", description: '任务名称' },
    desc: { type: 'string',  example: 'Task desc' },
  }
}

export const createCommentSchema = {
  contents: [
    {
      type: { type: 'number', required: true, description: '评论内容类型 1.text 2 mention(@) 3. image 4.file' },
      content: { type: 'string', required: true, example: '评论内容 type 1纯text 2 存username 3、4 存对应的url', description: '评论类型'},
      mentionId: { type: 'string', description: '类型为2的时候，该字段有值，对应user id'}
    }
  ],
  author: { type: 'string', required: true, example: '640991b41d6cdc47c331aff1', }
}