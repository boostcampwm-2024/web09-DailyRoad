import { usePoyline } from '@/hooks/usePolyline';

type PolylineProps = {
  points: google.maps.LatLngLiteral[];
};

const Polyline = ({ points }: PolylineProps) => {
  const polyline = usePoyline(points);
  return <></>;
};

export default Polyline;
