import React, { useEffect, useState } from 'react';
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
  interval = 5000,
}) => {
  const [banners, setBanners] = useState<Banner[]>([]);

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
    autoplaySpeed: interval,
  };

  return (
    <div className={className}>
      <Slider {...settings} className={'h-full w-full'}>
        {banners.map((banner, index) => (
          <div key={index}>
            <img
              src={banner.imageUrl}
              alt={`Banner ${index}`}
              onClick={() => window.open(banner.redirectUrl, '_blank')}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
