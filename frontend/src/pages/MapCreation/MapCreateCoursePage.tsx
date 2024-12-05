import { useParams } from 'react-router-dom';

import Authorize from '@/components/Authorize';
import SearchPanel from '@/components/Place/SearchPanel';

import { useCourseQuery } from '@/hooks/api/useCourseQuery';

const MapCreateCoursePage = () => {
  const { id } = useParams();
  const mapData = useCourseQuery(Number(id));

  return (
    <Authorize id={mapData.user.id}>
      <SearchPanel mapData={mapData} />
    </Authorize>
  );
};

export default MapCreateCoursePage;
