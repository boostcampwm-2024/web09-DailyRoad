type MapThumbnailProps = {
  className?: string;
  thumbnailUrl?: string;
};

const MapThumbnail = ({
  thumbnailUrl = `https://kr.object.ncloudstorage.com/ogil-public/uploads/default_thumbnail/default_3.webp`,
  className,
}: MapThumbnailProps) => {
  return (
    <div className={className}>
      <img src={thumbnailUrl} alt="지도 썸네일" />
    </div>
  );
};

export default MapThumbnail;
