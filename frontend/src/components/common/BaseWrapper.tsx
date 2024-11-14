const BaseWrapper = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`absolute left-0 top-0 flex h-full w-1/4 flex-col gap-0.5 bg-gray-200 p-2 shadow-md ${className}`}
  >
    {children}
  </div>
);

export default BaseWrapper;
