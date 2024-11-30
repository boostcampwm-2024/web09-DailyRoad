import React from 'react';
import styles from './BannerSlider.module.css';

interface BannerButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

const BannerButton: React.FC<BannerButtonProps> = ({ direction, onClick }) => {
  return (
    <button
      className={`${styles.bannerButton} ${
        direction === 'left' ? styles.prevBtn : styles.nextBtn
      }`}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={styles.bannerSvg}
      >
        {direction === 'left' ? (
          <path d="M15.41 7.41L10.83 12l4.58 4.59L14 18l-6-6 6-6z" />
        ) : (
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
        )}
      </svg>
    </button>
  );
};

export default BannerButton;
