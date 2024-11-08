const BaseWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute left-0 top-0 h-full w-72 rounded-lg bg-white p-4 shadow-md">
    {children}
  </div>
);

export default BaseWrapper;
