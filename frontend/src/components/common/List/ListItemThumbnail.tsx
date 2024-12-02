type ListItemThumbnailProps = {
  className?: string;
  thumbnailUrl?: string;
};

const ListItemThumbnail = ({
                             thumbnailUrl = `https://kr.object.ncloudstorage.com/ogil-public/uploads/default_thumbnail/default_3.webp`,
                             className,
                           }: ListItemThumbnailProps) => {
  return (
    <div className={className}>
      <img src={thumbnailUrl} alt="썸네일" />
    </div>
  );
};

export default ListItemThumbnail;
