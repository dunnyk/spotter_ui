import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RouteMap = ({ routeData }) => {
  if (!routeData || !routeData.route) return null;

  // Calculate map bounds to fit entire route
  const routeBounds = L.latLngBounds(
    routeData.route.geometry.map(coord => [coord[0], coord[1]])
  );

  return (
    <div style={{ height: '600px', width: '100%', margin: '20px 0' }}>
      <MapContainer
        bounds={routeBounds}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Main Route Line */}
        <Polyline
          positions={routeData.route.geometry}
          color="#3182ce"
          weight={4}
          opacity={0.8}
        />

        {/* Waypoints */}
        {routeData.route.waypoints.map((waypoint, index) => (
          <Marker key={`waypoint-${index}`} position={waypoint.coordinates}>
            <Popup>
              <strong>{waypoint.type.toUpperCase()}</strong><br />
              {waypoint.coordinates.join(', ')}
            </Popup>
          </Marker>
        ))}

        {/* Fuel Stops */}
        {routeData.route.stops.fuel.map((stop, index) => (
          <Marker key={`fuel-${index}`} position={stop.coordinates}>
            <Popup>
              ⛽ Fuel Stop #{index + 1}<br />
              {stop.distance_from_start} miles
            </Popup>
          </Marker>
        ))}

        {/* Rest Stops */}
        {routeData.route.stops.rest.map((stop, index) => (
          <Marker key={`rest-${index}`} position={stop.coordinates}>
            <Popup>
              🛌 Rest Day {stop.day}<br />
              {stop.distance_from_start} miles
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RouteMap;