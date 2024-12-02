import React, { useState, useRef } from 'react';
import CourseListPanel from '@/components/common/List/Course/CourseListPanel';
import MapListPanel from '@/components/common/List/Map/MapListPanel';
import ListToggleButtons from '@/components/common/List/ListToggleButtons';
import { CreateMapType } from '@/types';

const MainListPanel = () => {
  const [listTab, setListTab] = useState<CreateMapType>('MAP');
  const panelRef = useRef<HTMLDivElement>(null);

  const handleTabSelect = (value: CreateMapType) => {
    setListTab(value);
    if (panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex w-[1200px] flex-col items-center">
      <ListToggleButtons
        options={[
          { value: 'MAP', label: '지도' },
          { value: 'COURSE', label: '코스' },
        ]}
        selected={listTab}
        onSelect={(value) => handleTabSelect(value as CreateMapType)}
      />

      <div ref={panelRef} className="mt-1 w-[1200px]">
        {listTab === 'MAP' ? <MapListPanel /> : <CourseListPanel />}
      </div>
    </div>
  );
};

export default MainListPanel;
