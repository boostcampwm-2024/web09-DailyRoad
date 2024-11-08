import { useState, useEffect } from 'react';

interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & EventTarget;
}

const ImageUploader = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: FileChangeEvent): void => {
    const file = event.target.files?.[0];
    const maxSize = 2 * 1024 * 1024;

    if (file) {
      if (file.size > maxSize) {
        setError('파일 크기는 2MB를 초과할 수 없습니다.');
        setPreviewUrl(null);
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 200;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedUrl = URL.createObjectURL(blob);
                setPreviewUrl(optimizedUrl);
                URL.revokeObjectURL(objectUrl);
                setError('');
              }
            },
            'image/jpeg',
            0.7,
          );
        }
      };

      img.onerror = () => {
        setError('이미지 로딩 중 오류가 발생했습니다.');
        URL.revokeObjectURL(objectUrl);
      };

      img.src = objectUrl;
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {previewUrl && (
        <img
          src={previewUrl}
          alt="미리보기"
          style={{ width: '200px', height: 'auto' }}
        />
      )}
    </div>
  );
};

export default ImageUploader;
