import { useState, useEffect, useRef } from 'react';
import ImageIcon from '@/components/Form/ImageIcon';
import { uploadImage } from '@/api/image/index';
import { BaseMap } from '@/types';

interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & EventTarget;
}

type ImageUploaderProps = {
  onUpload: <K extends keyof BaseMap>(field: K, value: BaseMap[K]) => void;
  thumbnailUrl?: string;
};

const ImageUploader = ({ onUpload, thumbnailUrl }: ImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    thumbnailUrl ?? null,
  );
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = async (event: FileChangeEvent): Promise<void> => {
    const file = event.target.files?.[0];
    const maxSize = 3 * 1024 * 1024;

    if (file) {
      if (file.size > maxSize) {
        setError('파일 크기는 3MB를 초과할 수 없습니다.');
        setPreviewUrl(null);
        return;
      }

      setUploading(true);
      setError('');

      try {
        let uploadedUrl = await uploadImage(file, 'profile');
        if (
          uploadedUrl.startsWith('https:/') &&
          !uploadedUrl.startsWith('https://')
        ) {
          uploadedUrl = uploadedUrl.replace('https:/', 'https://');
        }
        setPreviewUrl(uploadedUrl);
        console.log(uploadedUrl);
        onUpload('thumbnailUrl', uploadedUrl);
      } catch (err) {
        setError(
          `이미지 업로드 중 오류가 발생했습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`,
        );
        setPreviewUrl(null);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        onClick={handleButtonClick}
        className="flex h-[128px] w-[168px] cursor-pointer items-center justify-center rounded-md bg-c_button_gray transition duration-300 hover:brightness-50"
      >
        {uploading ? (
          <p>업로드 중...</p>
        ) : previewUrl ? (
          <img
            src={previewUrl}
            alt="미리보기"
            className="h-full w-full rounded-md object-contain"
          />
        ) : (
          <ImageIcon />
        )}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ImageUploader;
