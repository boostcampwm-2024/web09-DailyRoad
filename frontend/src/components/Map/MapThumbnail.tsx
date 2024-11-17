import image from '../../assets/Map.jpg';

type MapThumbnailProps = {
  className?: string;
};

const MapThumbnail = ({ className }: MapThumbnailProps) => {
  return (
    <div className={className}>
      <img src={image} alt="지도 썸네일" />
    </div>
  );
};

export default MapThumbnail;
