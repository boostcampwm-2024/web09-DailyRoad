type MapThumbnailProps = {
  className?: string;
};

const MapThumbnail = ({ className }: MapThumbnailProps) => {
  return (
    <div className={className}>
      <img src="src/assets/Map.jpg" alt="Map Thumbnail" />
    </div>
  );
};

export default MapThumbnail;
