import SearchPanel from '@/components/Place/SearchPanel';
import { useMapQuery } from '@/hooks/api/useMapQuery';
import { useStore } from '@/store/useStore';
import { Place } from '@/types';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MapCreateMapPage = () => {
  const { id } = useParams();
  const mapData = useMapQuery(Number(id));
  const setPlace = useStore((state) => state.setPlace);

  useEffect(() => {
    setPlace({} as Place);
  }, []);

  return <SearchPanel mapData={mapData} />;
};

export default MapCreateMapPage;
