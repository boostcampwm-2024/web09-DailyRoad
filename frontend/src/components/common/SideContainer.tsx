const SideContainer = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`pointer-events-none absolute left-0 top-0 flex h-full w-[700px] ${className}`}
  >
    {children}
  </div>
);

export default SideContainer;
