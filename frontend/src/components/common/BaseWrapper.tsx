type BaseWrapperProps = {
  children: React.ReactNode;
  position?: string;
  left?: string;
  top?: string;
  className?: string;
};

const BaseWrapper = ({
  children,
  position = 'absolute',
  left = 'left-0',
  top = 'top-0',
  className = '',
}: BaseWrapperProps) => (
  <div
    className={`${position} ${left} ${top} flex h-full w-1/4 flex-col gap-0.5 bg-gray-200 shadow-md ${className}`}
  >
    {children}
  </div>
);

export default BaseWrapper;
