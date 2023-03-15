import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App';
import { router } from '@/routes/route'
import { RouterProvider } from 'react-router-dom';
import { store } from '@/store'
import { Provider } from 'react-redux';
// import reportWebVitals from './reportWebVitals';
import { ConfigProvider, DatePicker, message } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import './index.css';

dayjs.locale('zh-cn');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <CssBaseline /> */}
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <RouterProvider router={router}></RouterProvider>
      </Provider>
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
