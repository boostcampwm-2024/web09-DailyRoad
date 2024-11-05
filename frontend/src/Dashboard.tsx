import { useEffect, useRef, useState } from 'react';
import { useGoogleMapStore } from './store/googleMapState';
import { createMarkerInstance } from './marker';
import NewPlaceSearchBar from './NewPlaceSearchBar';

const Dashboard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const googleMap = useGoogleMapStore((state) => state.googleMap);
  const initializeMap = useGoogleMapStore((state) => state.initializeMap);

  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    if (ref.current && !googleMap) {
      initializeMap(ref.current);
    }
  }, [googleMap, initializeMap]);

  useEffect(() => {
    if (googleMap) {
      const updateMapInfo = () => {
        const newCenter = googleMap.getCenter();
        if (newCenter) {
          setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
        }
        setZoom(googleMap.getZoom() || 0);
      };

      updateMapInfo();

      const centerListener = googleMap.addListener(
        'center_changed',
        updateMapInfo,
      );
      const zoomListener = googleMap.addListener('zoom_changed', updateMapInfo);

      return () => {
        google.maps.event.removeListener(centerListener);
        google.maps.event.removeListener(zoomListener);
      };
    }
  }, [googleMap]);

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lat = parseFloat(e.target.value);
    setCenter((prev) => ({ ...prev, lat }));
    if (googleMap) {
      googleMap.setCenter({ lat, lng: center.lng });
      createMarkerInstance(lat, center.lng);
    }
  };

  const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lng = parseFloat(e.target.value);
    setCenter((prev) => ({ ...prev, lng }));
    if (googleMap) {
      googleMap.setCenter({ lat: center.lat, lng });
      createMarkerInstance(center.lat, lng);
    }
  };

  return (
    <div className="absolute left-0 top-0 h-72 w-36 bg-white">
      <NewPlaceSearchBar />
      <div>
        <label>
          Latitude:
          <input
            type="number"
            value={center.lat}
            onChange={handleLatChange}
            step="0.01"
          />
        </label>
      </div>
      <div>
        <label>
          Longitude:
          <input
            type="number"
            value={center.lng}
            onChange={handleLngChange}
            step="0.01"
          />
        </label>
      </div>
      <div>Zoom: {zoom}</div>
    </div>
  );
};

export default Dashboard;
