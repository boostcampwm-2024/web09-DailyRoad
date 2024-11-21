import React from 'react';

type BoxProps = {
  children: React.ReactNode;
  className?: string;
  role?: string;
};

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ children, className = '', role = 'region', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={role}
        {...props}
        className={`w-full bg-white p-4 shadow-xl ${className} flex flex-col gap-2`}
      >
        {children}
      </div>
    );
  },
);

Box.displayName = 'Box';

export default Box;
