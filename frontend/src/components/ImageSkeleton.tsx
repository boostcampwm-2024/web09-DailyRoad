import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

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
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setShowSkeleton(false);
      setTimeout(() => {
        setLoaded(true);
      }, 3000);
    };

    img.onerror = () => {
      setError(true);
      setShowSkeleton(false);
    };
  }, [src]);

  if (error) {
    return (
      <img
        className="h-20 w-20 object-cover"
        src={
          'https://kr.object.ncloudstorage.com/ogil-public/uploads/default_thumbnail/no_Image.webp'
        }
        alt={'이미지 없음'}
      />
    );
  }

  return (
    <div className="h-20 w-20 flex-shrink-0">
      {!loaded && <div className="h-full w-full animate-pulse bg-slate-400" />}
      {loaded && (
        <img className="h-full w-full object-cover" src={src} alt={alt} />
      )}
    </div>
  );
};

export default ImageWithSkeleton;
