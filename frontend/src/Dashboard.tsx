import { useEffect, useRef, useState } from 'react';
import { getGoogleMapStore, useGoogleMapStore } from './store/googleMapState';
import { createMarkerInstance } from './marker';
import NewPlaceSearchBar from './NewPlaceSearchBar';

const Dashboard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const setGoogleMap = useGoogleMapStore((state) => state.setGoogleMap);
  const googleMap = useGoogleMapStore((state) => state.googleMap);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    if (ref.current && !googleMap) {
      const initialMap = getGoogleMapStore();
      setGoogleMap(initialMap);
      ref.current.appendChild(initialMap.getDiv());
    }
  }, []);
  useEffect(() => {
    if (googleMap) {
      const updateMapInfo = () => {
        const center = googleMap.getCenter();
        if (center) {
          setCenter({ lat: center.lat(), lng: center.lng() });
        }
        setZoom(googleMap.getZoom() || 0);
      };

      updateMapInfo();

      googleMap.addListener('center_changed', updateMapInfo);

      googleMap.addListener('zoom_changed', updateMapInfo);

      return () => {
        google.maps.event.clearListeners(googleMap, 'center_changed');
        google.maps.event.clearListeners(googleMap, 'zoom_changed');
      };
    }
  }, [googleMap]);

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lat = parseFloat(e.target.value);
    setCenter((prev) => ({ ...prev, lat }));
    if (googleMap) {
      googleMap.setCenter({ lat, lng: center.lng });
    }
    const marker = createMarkerInstance(lat, center.lng);
  };

  const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lng = parseFloat(e.target.value);
    setCenter((prev) => ({ ...prev, lng }));
    if (googleMap) {
      googleMap.setCenter({ lat: center.lat, lng });
    }
  };

  return (
    <div className={'absolute left-0 top-0 h-72 w-36 bg-white'}>
      <NewPlaceSearchBar />
      <div>
        <label>
          Latitude:
          <input
            type="number"
            value={center.lat}
            onChange={handleLatChange}
            step={'0.01'}
          />
        </label>
      </div>
      <div>
        <label>
          Longitude:
          <input value={center.lng} onChange={handleLngChange} />
        </label>
      </div>
      <div>Zoom: {zoom}</div>
    </div>
  );
};

export default Dashboard;
