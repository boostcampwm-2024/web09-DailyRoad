type CheckIconProps = {
  width?: number;
  height?: number;
  className?: string;
};

const CheckIcon = ({
  width = 24,
  height = 24,
  className = '',
}: CheckIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 84 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="체크 아이콘"
    >
      <path
        d="M6 32.3529L30.48 62L78 6"
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckIcon;
