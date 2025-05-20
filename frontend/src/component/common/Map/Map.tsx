'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

function ClickHandler({
  onClick,
}: {
  onClick: (latlng: [number, number]) => void;
}) {
  useMapEvent('click', (e) => {
    onClick([e.latlng.lat, e.latlng.lng]);
  });
  return null;
}

interface MapProps {
  className?: string;
  zoom?: number;
  onMarkerChange?: (latlng: [number, number]) => void;
  defaultCoordinate?: [number, number];
}

export default function Map({
  className,
  zoom = 12,
  onMarkerChange,
  defaultCoordinate,
}: MapProps) {
  const coordinate: [number, number] = defaultCoordinate ?? [
    21.028511, 105.804817,
  ];
  const [markerPosition, setMarkerPosition] =
    useState<[number, number]>(coordinate);

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

  const handleMapClick = (latlng: [number, number]) => {
    setMarkerPosition(latlng);
    if (onMarkerChange) {
      onMarkerChange(latlng); // 👈 gọi callback
    }
  };

  return (
    <MapContainer
      center={markerPosition}
      zoom={zoom}
      className={clsx('h-[400px] w-[700px] z-10', className)}
    >
      <ChangeView center={markerPosition} />
      <ClickHandler onClick={handleMapClick} />
      <TileLayer
        url={url}
        attribution={attribution}
      />
      <Marker position={markerPosition}>
        <Popup>
          Marker is at: <br />
          Lat: {markerPosition[0].toFixed(5)}, Lng:{' '}
          {markerPosition[1].toFixed(5)}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
