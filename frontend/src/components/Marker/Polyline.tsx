import { usePolyline } from '@/hooks/usePolyline';

type PolylineProps = {
  points: google.maps.LatLngLiteral[];
};

const Polyline = ({ points }: PolylineProps) => {
  const polyline = usePolyline(points);
  return <></>;
};

export default Polyline;
