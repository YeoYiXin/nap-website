import React, { useEffect, useRef } from 'react';

interface Props {
  latitude: number;
  longitude: number;
}

export const Location = ({ latitude, longitude }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  let map: google.maps.Map;
  let marker: google.maps.Marker;

  useEffect(() => {
    // Initialize map
    if (mapRef.current) {
      map = new google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 15,
      });

      // Add marker
      marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
      });
    }
  }, [latitude, longitude]);

  return <div ref={mapRef} style={{ width: '80%', height: '300px' }} />;
};

