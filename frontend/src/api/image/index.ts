import { axiosInstance } from '../axiosInstance';
import { PreSignedURLResponse } from '../../types';
import { END_POINTS } from '@/constants/api';

const generatePreSignedUrl = async (dirName: string, extension: string) => {
  const { data } = await axiosInstance.get<PreSignedURLResponse>(
    END_POINTS.PRE_SIGNED_URL(dirName, extension),
  );
  return data;
};

export const uploadImage = async (
  file: File,
  dirName: string,
  extension: string,
) => {
  const preSignedURL = await generatePreSignedUrl(dirName, extension);
  const formData = new FormData();
  Object.entries(preSignedURL.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append('file', file);
  return fetch(preSignedURL.url, {
    method: 'POST',
    body: formData,
  })
    .then(() => {
      return preSignedURL.uploadedUrl;
    })
    .catch((err) => {
      throw new Error(err);
    });
};
