import { useState, useEffect } from 'react';

type ImageWithSkeletonProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const ImageWithSkeleton = ({
  src,
  alt,
  width,
  height,
}: ImageWithSkeletonProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setLoaded(true);
    };

    img.onerror = () => {
      setError(true);
    };
  }, [src]);

  if (error) {
    return (
      <img
        className="h-20 w-20 object-cover"
        src={
          'https://kr.object.ncloudstorage.com/ogil-public/uploads/default_thumbnail/noImage.webp'
        }
        alt={'이미지 없음'}
      />
    );
  }

  return (
    <div className="h-20 w-20 flex-shrink-0">
      {!loaded && (
        <div className="h-full w-full animate-pulse rounded bg-c_button_gray"></div>
      )}
      {loaded && (
        <img
          className="h-full w-full rounded object-cover"
          src={src}
          alt={alt}
        />
      )}
    </div>
  );
};

export default ImageWithSkeleton;
