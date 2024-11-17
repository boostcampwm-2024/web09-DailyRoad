import SideContainer from '@/components/common/SideContainer';
import EditMapForm from '@/components/Form/EditMapForm';

import { useMapQuery } from '@/hooks/api/useMapQuery';

import { useParams } from 'react-router-dom';

const MapEditPage = () => {
  const { id } = useParams();
  const mapData = useMapQuery(Number(id));
  return (
    <SideContainer>
      <EditMapForm mapData={mapData} />
    </SideContainer>
  );
};

export default MapEditPage;
