type PrevIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

const PrevIcon = ({ width = 24, height = 24, className }: PrevIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 52 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M46 6L6 46L46 86"
        stroke="black"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PrevIcon;
