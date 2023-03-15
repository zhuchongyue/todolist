// 基于antd upload的封装

import React from 'react'
import { download } from '@/api';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';
import { Button as AntButton, message, Upload } from 'antd';
import { useAppSelector } from '@/store/hooks';
import { userSelector } from '@/store/user/userSlice';
import './Upload.css'

export default function UploadCom(props: {
  readonly?: boolean;
  children?: React.ReactNode;
  fileList: UploadFile[];
  onChange?: (attachments: UploadFile[], file: UploadFile) => void;
  onRemove?: (file: UploadFile) => void;
  listType?: UploadProps['listType']
}) {

  const token = useAppSelector(userSelector).token;

  const handleChange: UploadProps['onChange'] = (info) => {
    let newFileList = [...info.fileList];

    // 2. Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    props.onChange && props.onChange(newFileList, info.file)

  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: process.env.REACT_APP_UPLOAD_URL,
    headers: {
      Authorization: token!,
    },
    onRemove: (file) => {
      props.onRemove && props.onRemove(file)
    },
    onChange: handleChange,
    onDownload(file) {
      download(file.response?.url, file.name)
    },
    showUploadList: {
      showDownloadIcon: true,
      downloadIcon: <DownloadOutlined />,
      showRemoveIcon: props.readonly ? false : true,
      // removeIcon: <DeleteOutlineOutlinedIcon />,
    },
  };

  return (
    <Upload fileList={props.fileList} listType="picture" className="upload-list-inline" {...uploadProps}>
      {props.children}
    </Upload>
  )
}