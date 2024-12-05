import React from 'react';
import emptyImage from '@/assets/empty.svg';

interface InfiniteListPanelProps<T> {
  data: T[] | undefined;
  renderItem: (item: T) => React.ReactNode;
  className?: string;
}

const InfiniteListPanel = React.forwardRef<
  HTMLDivElement,
  InfiniteListPanelProps<any>
>(({ data, renderItem, className }, ref) => {
  return (
    <div
      className={`scrollbar-thumb-rounded-lg relative mt-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 hover:scrollbar-track-gray-400 hover:scrollbar-thumb-gray-400 ${className}`}
    >
      {data && data.length > 0 ? (
        <>
          <div className="mt-1 grid h-full w-full grid-cols-5 gap-8">
            {data.map((item, index) => (
              <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
            ))}
          </div>
          <div ref={ref} className="h-1"></div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={emptyImage}
            alt="리스트가 텅 비었습니다!"
            className="w-100 object-contain py-10"
          />
        </div>
      )}
    </div>
  );
});

export default InfiniteListPanel;
