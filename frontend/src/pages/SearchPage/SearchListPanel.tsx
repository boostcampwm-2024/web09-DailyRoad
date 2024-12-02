import React, { useState } from 'react';
import CourseListPanel from '@/components/common/List/Course/CourseListPanel';
import MapListPanel from '@/components/common/List/Map/MapListPanel';
import ListToggleButtons from '@/components/common/List/ListToggleButtons';
import { CreateMapType } from '@/types';

interface SearchListPanelProps {
  query?: string;
}

const SearchListPanel: React.FC<SearchListPanelProps> = ({ query }) => {
  const [listTab, setListTab] = useState<CreateMapType>('MAP');

  return (
    <div className="flex w-[1200px] flex-col items-center">
      <ListToggleButtons
        options={[
          { value: 'MAP', label: '지도' },
          { value: 'COURSE', label: '코스' },
        ]}
        selected={listTab}
        onSelect={(value) => setListTab(value as CreateMapType)}
      />

      <div className="mt-1 w-[1200px]">
        {listTab === 'MAP' ? (
          <MapListPanel query={query} />
        ) : (
          <CourseListPanel query={query} />
        )}
      </div>
    </div>
  );
};

export default SearchListPanel;
