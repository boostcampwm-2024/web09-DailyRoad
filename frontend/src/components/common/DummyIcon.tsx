type ArrowIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

const ArrowIcon = ({ className, width = 24, height = 24 }: ArrowIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 27 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M25.5 9.99984H1.5M25.5 9.99984L17.82 1.83984M25.5 9.99984L17.82 18.1598"
        stroke="#00A3FF"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default ArrowIcon;
