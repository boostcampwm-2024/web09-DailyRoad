import { useParams } from 'react-router-dom';

import MapDetailBoard from '@/components/Map/MapDetailBoard';
import { useMapQuery } from '@/hooks/api/useMapQuery';

const MapDetailPage = () => {
  const { id } = useParams();
  const mapData = useMapQuery(Number(id));

  return <MapDetailBoard mapData={mapData} />;
};

export default MapDetailPage;
