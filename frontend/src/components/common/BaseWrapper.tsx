const BaseWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute left-0 top-0 flex h-full w-[400px] flex-col gap-0.5 rounded-lg bg-gray-200 shadow-md">
    {children}
  </div>
);

export default BaseWrapper;
