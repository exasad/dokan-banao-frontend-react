import { message } from 'antd';

export const getFileExtension = (filename) => {
  const nameArray = filename.split('.').reverse();

  return filename ? nameArray[0] : '';
};

export const downloadFile = (fileUrl) => {
  const url = fileUrl;
  const e = document.createElement('a');
  e.href = url;
  e.target = '_blank';
  e.download = url.substr(url.lastIndexOf('/') + 1);
  document.body.appendChild(e);
  e.click();
  document.body.removeChild(e);
};

export const showFileValidation = (file) => {
  if (file) return true;
  message.warning('Please select a valid File.');
};
