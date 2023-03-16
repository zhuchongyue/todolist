
import * as dotenv from 'dotenv'
import type { DotenvConfigOutput, DotenvParseOutput } from 'dotenv'
import path from "path"
import workspacesRoot from "find-yarn-workspace-root";

// export interface IConfig extends DotenvParseOutput {
//   SERVER_PROT: string;
//   SERVER_JWT_SECRET: string;
//   SERVER_LOG_LEVEL: 'info' | 'debug';
//   DB_URL: string;
// }

const defaultConfig = {
  SERVER_PROT: '8088',
  SERVER_JWT_SECRET: 'todolist',
  SERVER_TOKEN_EXPIRES_TIME: 7 * 24 * 60 * 60,  // 默认7天  token过期时间 number 单位为秒
  SERVER_LOG_LEVEL: 'info',
  DB_URL: '',
  DB_USER: '',
  DB_PASS: '',
  DB_NAME: '',
  OSS_HOST: 'localhost',
  OSS_API_PORT: 9000,
  OSS_CONSOLE_PROT: 9090,
  OSS_USER: 'admin',
  OSS_PASSWORD: 'admin123',
  OSS_BUCKET_NAME: 'resource'
}

// interface SelfDotenvConfigOutput extends DotenvConfigOutput {
//   parsed?: IConfig
// }

const rootDirectory = workspacesRoot();

const result = dotenv.config({
  path: path.resolve(rootDirectory!, '.env')
})

const config = Object.assign({}, defaultConfig, result.parsed || {})

export default config