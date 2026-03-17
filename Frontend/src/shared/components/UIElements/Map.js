import React, {useRef, useEffect} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import './Map.css';

const redPointerIcon = L.divIcon({
  className: 'place-pointer',
  html: '<span class="place-pointer__pin"></span>',
  iconSize: [26, 36],
  iconAnchor: [13, 34]
});

const Map = props => {
  const mapRef = useRef();

  const {center, zoom} = props;

  useEffect(() => {
    if (mapRef.current) {
    const map = L.map(mapRef.current, {
      center: center,
      zoom: zoom
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([props.center.lat, props.center.lng], { icon: redPointerIcon }).addTo(map);
  }
  }, [center, zoom]);

  

  return (
    <div 
      ref={mapRef} 
      className={`map ${props.className}`} 
      style={props.style}
    ></div>
  );
};

export default Map;