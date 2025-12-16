"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
      Loading Map...
    </div>
  ),
});

interface MapProps {
  location?: {
    lat: number;
    lng: number;
  };
  googleMapsEmbedSrc?: string;
  fallbackImage?: React.ReactNode;
}

export default function Map({
  location,
  googleMapsEmbedSrc,
  fallbackImage,
}: MapProps) {
  const hasCoordinates =
    location &&
    typeof location.lat === "number" &&
    typeof location.lng === "number";

  // Priority 1: Google Maps Embed (if provided) - explicit override
  if (googleMapsEmbedSrc) {
    return (
      <div className="w-full h-full rounded-sm overflow-hidden bg-gray-100 relative">
        <iframe
          src={googleMapsEmbedSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />
      </div>
    );
  }

  // Priority 2: Leaflet Map (if coordinates provided)
  if (hasCoordinates) {
    return (
      <div className="w-full h-full rounded-sm overflow-hidden bg-gray-100 relative z-0">
        <LeafletMap center={[location.lat, location.lng]} />
      </div>
    );
  }

  // Priority 3: Fallback Image (original image)
  if (fallbackImage) {
    return <>{fallbackImage}</>;
  }

  // Fallback: Empty state
  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 rounded-sm">
      No map data available
    </div>
  );
}
