type BoxProps = {
  children: React.ReactNode;
  className?: string;
  role?: string;
};

const Box = ({ children, className = '', role = 'region' }: BoxProps) => {
  return (
    <div
      role={role}
      className={`w-full bg-white p-4 shadow-xl ${className} flex flex-col gap-2`}
    >
      {children}
    </div>
  );
};

export default Box;
