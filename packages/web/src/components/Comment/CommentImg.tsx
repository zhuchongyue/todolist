import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import './CommentImg.scss';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const CommentImg = React.forwardRef((props: {
  imgList: UploadFile[];
  onChange: (imgList: UploadFile[]) => void;
}, ref: React.LegacyRef<HTMLDivElement>) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  // const [fileList, setFileList] = useState<UploadFile[]>([
    
  // ]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => props.onChange(newFileList)

  const uploadButton = (
    <div ref={ref} style={{height: 1, width: 1, overflow: 'hidden'}}>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <>
      <Upload
        className='upload'
        action={process.env.REACT_APP_UPLOAD_URL}
        listType="picture-card"
        fileList={props.imgList}
        onPreview={handlePreview}
        onChange={handleChange}
        accept='image/*'
      >
        {props.imgList.length >= 12 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
});

export default CommentImg;