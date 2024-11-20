import SearchPanel from '@/components/Place/SearchPanel';
import { useMapQuery } from '@/hooks/api/useMapQuery';
import { useParams } from 'react-router-dom';

const MapCreateMapPage = () => {
  const { id } = useParams();
  const mapData = useMapQuery(Number(id));

  return <SearchPanel mapData={mapData} />;
};

export default MapCreateMapPage;
