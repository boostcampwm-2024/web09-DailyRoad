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
  interval = 3000,
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
    autoplay: true,
    autoplaySpeed: interval,
  };

  return (
    <div className={className}>
      <Slider {...settings} className={'h-full w-full'}>
        {banners.map((banner, index) => (
          <div key={index} className={'cursor-pointer'}>
            <img
              className={
                'box-sizing:border-box h-full w-full rounded-md border-[1.5px] border-c_border_gray'
              }
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
