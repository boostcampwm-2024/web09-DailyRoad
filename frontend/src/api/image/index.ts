import { axiosInstance } from '../axiosInstance';
import { PreSignedURLResponse } from '../../types';
import { END_POINTS, IMAGE_EXTENSIONS } from '@/constants/api';
import { IMAGE_HEIGHT, IMAGE_WIDTH, THREE_MB } from '../../constants/api';

const generatePreSignedPost = async (dirName: string, extension: string) => {
  const { data } = await axiosInstance.post<PreSignedURLResponse>(
    END_POINTS.PRE_SIGNED_POST,
    {
      dirName: dirName,
      extension: extension,
    },
  );
  return data;
};

const getExtensionByFile = (file: File) => {
  const extension = file.name.split('.').pop();
  return extension ? extension.toLowerCase() : null;
};

const validateFile = (file: File, extension: string | null) => {
  return !(
    !extension ||
    !IMAGE_EXTENSIONS.has(extension) ||
    file.size > THREE_MB
  );
};

const resizeImage = async (
  file: File,
  width: number,
  height: number,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas Context Get Error'));
        return;
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Blob Conversion Error'));
          }
        },
        file.type,
        0.9,
      );
    };
    img.onerror = (error) => reject(error);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const uploadImage = async (file: File, dirName: string) => {
  const extension = getExtensionByFile(file);
  if (!validateFile(file, extension)) {
    throw new Error(
      '지원되지 않는 파일 형식이거나 파일 크기가 3MB를 초과합니다.',
    );
  }
  const preSignedPost = await generatePreSignedPost(dirName, extension!);
  let resizedImage: File;
  try {
    resizedImage = await resizeImage(file, IMAGE_WIDTH, IMAGE_HEIGHT);
  } catch (err) {
    throw new Error(`이미지 리사이즈 중 에러가 발생했습니다 : ${err}`);
  }
  const formData = new FormData();
  Object.entries(preSignedPost.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append('file', resizedImage);
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
