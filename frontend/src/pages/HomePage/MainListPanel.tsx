import CourseListPanel from '@/components/Map/CourseListPanel';
import MapListPanel from '@/components/Map/MapListPanel';
import { CreateMapType } from '@/types';
import { useState } from 'react';

const MainListPanel = () => {
  const [listTab, setListTab] = useState<CreateMapType>('MAP');
  return (
    <>
      <div className="flex w-full justify-center gap-4">
        <button
          className={`${listTab === 'MAP' ? 'bg-c_bg_blue' : ''}`}
          onClick={() => setListTab('MAP')}
        >
          지도
        </button>
        <button
          className={`${listTab === 'COURSE' ? 'bg-c_bg_blue' : ''}`}
          onClick={() => setListTab('COURSE')}
        >
          코스
        </button>
      </div>
      {listTab === 'MAP' ? <MapListPanel /> : <CourseListPanel />}
    </>
  );
};

export default MainListPanel;
