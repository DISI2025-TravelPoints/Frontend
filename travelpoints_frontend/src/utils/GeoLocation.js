import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Geohash from 'ngeohash';
import L from 'leaflet';
import axios from 'axios';
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

const attractionIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
    });

const queryDBForNearbyLocations = async (geohash) => {
    try{
        const res = await axios.get(`http://localhost/api/attraction/nearby/${geohash}`);
        console.log(res.data);
        return res.data;
    }catch(e){
        console.error("Error querying the database for nearby locations: ", e);
    }
}

const GeoLocation=({setUserGeohash}) => {
    const [initialLocationSet, setInitialLocationSet] = useState(false);
    const [location, setLocation] = useState(null);
    const [geohash, setGeohash] = useState(null);
    const [nearbyAttractions, setNearbyAttractions] = useState([]);

    useEffect(() => {
        if (geohash) {
            const fetchData = async () => {
              try {
                const data = await queryDBForNearbyLocations(geohash);
                console.log("Nearby attractions:", data);
                if (data) {
                  setNearbyAttractions(data);
                }
              } catch (error) {
                console.error("Error fetching nearby attractions:", error);
                setNearbyAttractions([]);
              }
            };
            
            fetchData();
          }
    },[geohash]);

    function LocationMarker() {
        const map = useMapEvents({
        click(e) {
            if(!initialLocationSet) {
                map.locate();
            }
        },
        locationfound(e) {
            map.flyTo(e.latlng, map.getZoom());
            setLocation(e.latlng);
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            const geohash = Geohash.encode(lat, lng);
            setGeohash(geohash);
            setUserGeohash(geohash);
            L.marker(e.latlng, { icon: greenIcon }).addTo(map)
                .bindPopup(`You are here!<br>Geohash: ${geohash}`)
                .openPopup();
            setInitialLocationSet(true);
        },
    });
 
  }
 
  const defaultCenter = { lat: 51.505, lng: -0.09 };
  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
      {nearbyAttractions && nearbyAttractions.length > 0 && 
      nearbyAttractions.map((attraction, index) => (
        <Marker
          key={attraction.id || index}
          position={[attraction.latitude, attraction.longitude]}
          icon={attractionIcon} 
        >
          <Popup>
            <b>{attraction.name}</b><br />
            {attraction.description}
          </Popup>
        </Marker>
      ))
    }
    </MapContainer>
  );
};

export default GeoLocation;