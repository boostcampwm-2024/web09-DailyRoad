const BaseWrapper = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative flex h-full w-full max-w-[400px] flex-col gap-0.5 rounded-lg bg-gray-200 shadow-md ${className}`}
  >
    {children}
  </div>
);

export default BaseWrapper;
