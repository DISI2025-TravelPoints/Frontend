import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// custom green marker icon to go along the design of the app
const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

//FIXME : this component takes a lot of time to load the map, maybe we can use a loading spinner or something like that
const MapPicker = ({ onLocationSelected, position }) => {
    const [initialLocationSet, setInitialLocationSet] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    function LocationMarker() {
        const map = useMapEvents({
        click(e) {
            if(!initialLocationSet) {
                map.locate();
            }
            else{
                const {lat, lng} = e.latlng;
                setSelectedLocation([lat, lng]);
                onLocationSelected([lat, lng])
            }
        },
        locationfound(e) {
            map.flyTo(e.latlng, map.getZoom());
            setInitialLocationSet(true);
        },
    });
 
    return selectedLocation === null ? null : (
      <Marker position={selectedLocation} icon={greenIcon}>
        <Popup>{selectedLocation[0]}, {selectedLocation[1]}</Popup>
      </Marker>
    );
  }
 
  const defaultCenter = { lat: 51.505, lng: -0.09 };
  const center = position ? 
    { lat: position[0], lng: position[1] } : 
    defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "600px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position && <Marker position={position} icon={greenIcon}>
        <Popup>{position[0]}, {position[1]}</Popup>
      </Marker>}
      <LocationMarker />
    </MapContainer>
  );
};

export default MapPicker;