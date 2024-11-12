import { axiosInstance } from '../axiosInstance';
import { PreSignedURLResponse } from '../../types';
import { END_POINTS, IMAGE_EXTENSIONS } from '@/constants/api';
import { THREE_MB } from '../../constants/api';

export const generatePreSignedPost = async (
  dirName: string,
  extension: string,
) => {
  const { data } = await axiosInstance.post<PreSignedURLResponse>(
    END_POINTS.PRE_SIGNED_POST,
    {
      dirName: dirName,
      extension: extension,
    },
  );
  return data;
};

export const getExtensionByFile = (file: File) => {
  const extension = file.name.split('.').pop();
  return extension ? extension.toLowerCase() : null;
};

export const validateFile = (file: File, extension: string | null) => {
  return !(
    !extension ||
    !IMAGE_EXTENSIONS.has(extension) ||
    file.size > THREE_MB
  );
};

export const uploadImage = async (file: File, dirName: string) => {
  const extension = getExtensionByFile(file);
  if (!validateFile(file, extension)) {
    throw new Error(
      '지원되지 않는 파일 형식이거나 파일 크기가 3MB를 초과합니다.',
    );
  }
  const preSignedPost = await generatePreSignedPost(dirName, extension!);
  const formData = new FormData();
  Object.entries(preSignedPost.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append('file', file);
  return fetch(preSignedPost.url, {
    method: 'POST',
    body: formData,
  })
    .then(() => {
      return preSignedPost.uploadedUrl;
    })
    .catch((err) => {
      throw new Error(err);
    });
};
