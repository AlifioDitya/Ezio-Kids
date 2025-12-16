"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

// Fix for default marker icon in Leaflet with Next.js/React
const iconFix = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

// Component to update map view when center changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  popupText?: string;
}

const LeafletMap = ({
  center,
  zoom = 15,
  popupText = "Our Location",
}: LeafletMapProps) => {
  useEffect(() => {
    iconFix();
  }, []);

  return (
    <div className="h-full w-full z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full rounded-sm z-0"
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>{popupText}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
