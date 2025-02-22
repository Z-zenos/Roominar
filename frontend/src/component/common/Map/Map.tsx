'use client';

/**
 * You checked "Using the latest stable version of React and ReactDOM v19" but that error says Next.js 14.2.8, which uses react 18 (feel free to correct me if this is wrong).

react-leaflet 5.0.0 is only compatible with react 19. If you are usin react 18, you should probably downgrade react-leaflet to 4.x.x or upgrade your Next.js project to 15.x.x and react 19.x.x
 *
 */

// IMPORTANT: the order matters!
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

interface MapProps {
  className?: string;
  zoom?: number;
}

export default function Map({ className, zoom = 4 }: MapProps) {
  const hanoiCoordinate = [21.028511, 105.804817];

  useEffect(() => {
    return () => {
      const m = L.DomUtil.get('map') as
        | (HTMLElement & { _leaflet_id: number | null })
        | null;
      if (m) {
        m._leaflet_id = null;
      }
    };
  }, []);

  return (
    <MapContainer
      center={hanoiCoordinate}
      zoom={4}
      className={className}
      // IMPORTANT: the map container needs a defined size, otherwise nothing will be visible
      style={{ height: '400px', width: '700px' }}
    >
      <ChangeView
        center={hanoiCoordinate}
        zoom={zoom}
      />
      <TileLayer
        url={url}
        attribution={attribution}
      />
      <Marker position={hanoiCoordinate}>
        <Popup>
          This Marker icon is displayed correctly with{' '}
          <i>leaflet-defaulticon-compatibility</i>.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
