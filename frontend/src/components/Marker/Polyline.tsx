import { usePoyline } from '@/hooks/usePolyline';

type PolylineProps = {
  points: google.maps.LatLngLiteral[];
  color: string;
};

const Polyline = ({ points, color }: PolylineProps) => {
  const polyline = usePoyline(points, color);
  return <></>;
};

export default Polyline;
