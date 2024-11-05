import { useEffect, useRef } from 'react';
import { useGoogleMapStore } from './store/googleMapState';

function NewPlaceSearchBar() {
  const inputRef = useRef(null);
  const googleMap = useGoogleMapStore.getState().googleMap;
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null,
  );

  useEffect(() => {
    if (!googleMap || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ['place_id', 'geometry', 'name'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        alert('장소의 위치 정보를 가져올 수 없습니다.');
        return;
      }

      googleMap.setCenter(place.geometry.location);
      googleMap.setZoom(15);

      if (markerRef.current) {
        markerRef.current.map = null;
      }
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        position: place.geometry.location,
        map: googleMap,
      });
    });
  }, [googleMap]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="검색할 장소를 입력하세요"
      style={{ width: '300px', padding: '8px' }}
    />
  );
}

export default NewPlaceSearchBar;
