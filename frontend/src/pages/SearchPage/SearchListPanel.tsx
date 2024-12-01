import React, { useState } from 'react';
import CourseListPanel from '@/components/Map/CourseListPanel';
import MapListPanel from '@/components/Map/MapListPanel';
import ListToggleButtons from '@/components/common/ListToggleButtons';
import { CreateMapType } from '@/types';

interface SearchListPanelProps {
  query?: string;
}

const SearchListPanel: React.FC<SearchListPanelProps> = ({ query }) => {
  const [listTab, setListTab] = useState<CreateMapType>('MAP');

  return (
    <div className="flex w-full flex-col items-center">
      <ListToggleButtons
        options={[
          { value: 'MAP', label: '지도' },
          { value: 'COURSE', label: '코스' },
        ]}
        selected={listTab}
        onSelect={(value) => setListTab(value as CreateMapType)}
      />

      <div className="mt-4">
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
