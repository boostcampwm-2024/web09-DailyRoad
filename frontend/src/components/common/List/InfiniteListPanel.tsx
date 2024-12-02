import React from 'react';

interface InfiniteListPanelProps<T> {
  data: T[] | undefined;
  ref: React.Ref<HTMLDivElement>;
  renderItem: (item: T) => React.ReactNode;
  className?: string;
}

const InfiniteListPanel = <T, >({
                                  data,
                                  ref,
                                  renderItem,
                                  className,
                                }: InfiniteListPanelProps<T>) => {
  return (
    <div
      ref={ref}
      className={`relative
      mt-2
      overflow-y-auto scrollbar-thin 
      scrollbar-thumb-rounded-lg 
      scrollbar-track-transparent 
      scrollbar-thumb-gray-200 
      hover:scrollbar-track-gray-400 
      hover:scrollbar-thumb-gray-400 
      ${className}`}>
      <div className="mt-1 grid h-full w-full grid-cols-5 gap-8">
        {data?.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default InfiniteListPanel;
