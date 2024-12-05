import React, { useEffect, useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getBanners, Banner } from '@/api/banner';

interface BannerSliderProps {
  className?: string;
  interval?: number;
}

const BannerSlider: React.FC<BannerSliderProps> = ({
  className,
  interval = 3000,
}) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const startPosition = useRef<{ x: number; y: number } | null>(null);
  const isDragged = useRef(false);

  useEffect(() => {
    const fetchBanners = async () => {
      const data = await getBanners();
      setBanners([...data]);
    };

    fetchBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: interval / 10,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: interval,
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    startPosition.current = { x: event.clientX, y: event.clientY };
    isDragged.current = false;
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    if (startPosition.current) {
      const deltaX = Math.abs(event.clientX - startPosition.current.x);
      const deltaY = Math.abs(event.clientY - startPosition.current.y);

      if (deltaX > 5 || deltaY > 5) {
        isDragged.current = true;
      }
    }
    startPosition.current = null;
  };

  const handleClick = (redirectUrl: string) => {
    if (!isDragged.current) {
      window.open(redirectUrl, '_blank');
    }
  };

  return (
    <div className={className}>
      <Slider {...settings} className="h-full w-full">
        {banners.map((banner, index) => (
          <div key={index} className="cursor-pointer">
            <img
              className="box-sizing:border-box h-full w-full rounded-md border-[1.5px] border-c_border_gray"
              src={banner.imageUrl}
              alt={`Banner ${index}`}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onClick={() => handleClick(banner.redirectUrl)}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
