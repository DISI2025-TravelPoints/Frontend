import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';

const { Dragger } = Upload;

const AudioFileUploader = ({ uploadFile }) => {
  const props = {
    name: 'file',
    multiple: false,
    accept: 'audio/*',
    beforeUpload: (file) => {
    uploadFile(file);
      message.success(`${file.name} file selected successfully`);
      // if we don't return false, the file will be uploaded automatically
      // and we don't want that
      return false;
    },
    onDrop: (e) => {
      const file = e.dataTransfer.files[0];
      if (file) {
        uploadFile(file);
        message.success(`${file.name} file uploaded successfully`);
      }
    }
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">
        Support for single audio file upload.
      </p>
    </Dragger>
  );
};

export default AudioFileUploader;