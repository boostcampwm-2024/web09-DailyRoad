import { useParams } from 'react-router-dom';

import Authorize from '@/components/Authorize';
import SideContainer from '@/components/common/SideContainer';
import EditMapForm from '@/components/Form/EditMapForm';

import { useMapQuery } from '@/hooks/api/useMapQuery';

const MapEditPage = () => {
  const { id } = useParams();
  const mapData = useMapQuery(Number(id));
  return (
    <Authorize id={mapData.user.id}>
      <SideContainer>
        <EditMapForm mapData={mapData} />
      </SideContainer>
    </Authorize>
  );
};

export default MapEditPage;
