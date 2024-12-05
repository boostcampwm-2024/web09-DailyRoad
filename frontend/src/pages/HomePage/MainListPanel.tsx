import { useState } from 'react';

import CourseListPanel from '@/components/common/List/Course/CourseListPanel';
import MapListPanel from '@/components/common/List/Map/MapListPanel';
import ListToggleButtons from '@/components/common/List/ListToggleButtons';
import SearchBar from '@/components/common/SearchBar';

import { CreateMapType } from '@/types';

type Range = 'ALL' | 'MY';

const MainListPanel = () => {
  const [listTab, setListTab] = useState<CreateMapType>('MAP');
  const [range, setRange] = useState<'ALL' | 'MY'>('ALL');
  const [query, setQuery] = useState('');

  const panelProps = { Range: range, ...(query && { query }) };
  const mapLabel = listTab === 'MAP' ? '지도' : '코스';
  return (
    <div className="relative flex w-3/4 flex-col items-center">
      <ListToggleButtons
        options={[
          { value: 'ALL', label: `모든 ${mapLabel} 보기` },
          { value: 'MY', label: `내가 만든 ${mapLabel} 보기` },
        ]}
        selected={range}
        onSelect={(value) => setRange(value as Range)}
      />
      {range === 'ALL' ? (
        <SearchBar onSearch={(query) => setQuery(query)}></SearchBar>
      ) : (
        <div></div>
      )}
      <div className="absolute left-[-100px] top-40 flex flex-col gap-1">
        <div
          className={`${listTab === 'MAP' ? 'text-c_bg_blue' : 'text-c_strong_black'} cursor-pointer text-lg font-semibold transition-all duration-200 hover:text-c_bg_blue`}
          onClick={() => setListTab('MAP')}
        >
          지도
        </div>
        <div
          className={`${listTab === 'COURSE' ? 'text-c_bg_blue' : 'text-c_strong_black'} cursor-pointer text-lg font-semibold transition-all duration-200 hover:text-c_bg_blue`}
          onClick={() => setListTab('COURSE')}
        >
          코스
        </div>
      </div>
      <div className="mt-1 w-full">
        {listTab === 'MAP' ? (
          <MapListPanel {...panelProps} />
        ) : (
          <CourseListPanel {...panelProps} />
        )}
      </div>
    </div>
  );
};

export default MainListPanel;
