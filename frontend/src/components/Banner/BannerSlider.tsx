import React, { useEffect, useState, useRef } from 'react';
import { getBanners, Banner } from '@/api/banner';
import styles from './BannerSlider.module.css';
import BannerButton from './BannerButton';

interface BannerSliderProps {
  className?: string;
  interval?: number;
}

const BannerSlider: React.FC<BannerSliderProps> = ({
  className,
  interval = 5000,
}) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);
  const autoSlideInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      const data = await getBanners();
      const lastBanner = data[data.length - 1];
      const firstBanner = data[0];
      setBanners([lastBanner, ...data, firstBanner]);
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 0 && sliderRef.current) {
      sliderRef.current.style.transition = 'none';
      sliderRef.current.style.transform = `translateX(-100%)`;
    }
  }, [banners]);

  useEffect(() => {
    if (!sliderRef.current) return;

    if (!isTransitioning.current) {
      sliderRef.current.style.transition = 'transform 0.5s ease-in-out';
    }
    sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;

    isTransitioning.current = true;
  }, [currentIndex]);

  const isToLastBanner = currentIndex === 0;
  const isToFirstBanner = currentIndex === banners.length - 1;

  const handleTransitionEnd = () => {
    if (!sliderRef.current || banners.length === 0) return;

    if (isToLastBanner) setCurrentIndex(banners.length - 2);
    if (isToFirstBanner) setCurrentIndex(1);

    isTransitioning.current = false;
  };

  const handleNext = () => {
    if (isTransitioning.current) return;
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrev = () => {
    if (isTransitioning.current) return;
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const startAutoSlide = () => {
    if (autoSlideInterval.current) return;
    autoSlideInterval.current = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, interval);
  };

  const stopAutoSlide = () => {
    if (autoSlideInterval.current) {
      clearInterval(autoSlideInterval.current);
      autoSlideInterval.current = null;
    }
  };

  useEffect(() => {
    if (banners.length > 0) {
      startAutoSlide();
    }
    return () => stopAutoSlide();
  }, [banners]);

  if (banners.length === 0) {
    return (
      <div className={`${styles.bannerWrap} ${className}`}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.bannerWrap} ${className}`}
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      <div
        className={styles.rollingList}
        ref={sliderRef}
        onTransitionEnd={handleTransitionEnd}
        style={{ width: `${banners.length * 100}%` }}
      >
        {banners.map((banner, index) => (
          <div className={styles.bannerItem} key={index}>
            <img
              src={banner.imageUrl}
              alt={`Banner ${index}`}
              className={styles.bannerImage}
              onClick={() => window.open(banner.redirectUrl, '_blank')}
            />
          </div>
        ))}
      </div>
      <BannerButton direction="left" onClick={handlePrev} />
      <BannerButton direction="right" onClick={handleNext} />
    </div>
  );
};

export default BannerSlider;
