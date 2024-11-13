type PrevIconProps = {
  className?: string;
};

const PrevIcon = ({ className }: PrevIconProps) => {
  return (
    <svg
      width="24"
      height="24"
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
