import SearchPanel from '@/components/Place/SearchPanel';
import { useCourseQuery } from '@/hooks/api/useCourseQuery';
import { useParams } from 'react-router-dom';

const MapCreateCoursePage = () => {
  const { id } = useParams();
  const mapData = useCourseQuery(Number(id));

  return <SearchPanel mapData={mapData} />;
};

export default MapCreateCoursePage;
