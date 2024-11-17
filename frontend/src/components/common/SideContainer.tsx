const SideContainer = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`absolute left-0 top-0 flex h-full w-[600px] gap-0.5 ${className}`}
  >
    {children}
  </div>
);

export default SideContainer;
