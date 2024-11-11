const BaseWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute left-0 top-0 h-full w-[400px] rounded-lg bg-white shadow-md">
    {children}
  </div>
);

export default BaseWrapper;
