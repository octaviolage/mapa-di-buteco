import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useButecosStore } from "@/store/butecos-store";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Buteco } from "@/types/buteco";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
const defaultIcon = L.divIcon({
  className: "custom-marker",
  html: `<div class="w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const highlightedIcon = L.divIcon({
  className: "custom-marker-highlighted",
  html: `<div class="w-10 h-10 bg-amber-500 rounded-full border-3 border-white shadow-xl flex items-center justify-center animate-bounce">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const selectedIcon = L.divIcon({
  className: "custom-marker-selected",
  html: `<div class="w-12 h-12 bg-primary rounded-full border-4 border-amber-400 shadow-2xl flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>
  </div>`,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
});

function MapController() {
  const map = useMap();
  const { selectedButeco, selectionSource, filteredButecos } =
    useButecosStore();
  const butecos = filteredButecos();

  const { viewMode } = useButecosStore();

  // Ref para saber se o mapa já foi exibido/renderizado
  const mapReadyRef = useRef(false);

  // Corrige o mapa ao trocar para o modo mapa
  useEffect(() => {
    if (viewMode === 'map') {
      setTimeout(() => {
        map.invalidateSize();
        mapReadyRef.current = true;
      }, 200);
    }
  }, [viewMode, map]);
  useEffect(() => {
    // Close all popups first
    map.closePopup();

    // Só executa flyTo se o mapa está visível, pronto e as coordenadas são válidas
    if (
      viewMode === 'map' &&
      mapReadyRef.current &&
      selectedButeco &&
      typeof selectedButeco.lat === 'number' &&
      typeof selectedButeco.lon === 'number' &&
      !isNaN(selectedButeco.lat) &&
      !isNaN(selectedButeco.lon)
    ) {
      if (selectionSource === "list") {
        map.flyTo([selectedButeco.lat, selectedButeco.lon], 15, {
          duration: 0.8,
        });
      }
    }
  }, [selectedButeco, selectionSource, map, viewMode]);

  // Fit bounds to all visible markers when filters change
  useEffect(() => {
    const validButecos = butecos.filter((b) => b.lat && b.lon);
    if (validButecos.length > 0) {
      const bounds = L.latLngBounds(
        validButecos.map((b) => [b.lat!, b.lon!] as [number, number]),
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [butecos, map]);

  return null;
}

interface ButecoMarkerProps {
  buteco: Buteco;
}

function ButecoMarker({ buteco }: ButecoMarkerProps) {
  const {
    selectedButeco,
    selectionSource,
    highlightedButeco,
    setSelectedButeco,
    setHighlightedButeco,
  } = useButecosStore();
  const markerRef = useRef<L.Marker>(null);

  const isSelected = selectedButeco?.name === buteco.name;
  const isHighlighted = highlightedButeco?.name === buteco.name;

  // Open popup when this buteco is selected from the list
  useEffect(() => {
    if (isSelected && selectionSource === "list" && markerRef.current) {
      // Small delay to ensure the map has flown to the location
      const timer = setTimeout(() => {
        markerRef.current?.openPopup();
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [isSelected, selectionSource]);

  // Handle mobile touch events manually
  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const element = marker.getElement();
    if (!element) return;

    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartTime = Date.now();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndTime = Date.now();
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      // Check if it's a tap (short duration and minimal movement)
      const duration = touchEndTime - touchStartTime;
      const moveX = Math.abs(touchEndX - touchStartX);
      const moveY = Math.abs(touchEndY - touchStartY);

      if (duration < 300 && moveX < 10 && moveY < 10) {
        e.preventDefault();
        e.stopPropagation();
        setSelectedButeco(buteco, "map");
        marker.openPopup();
      }
    };

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [buteco, setSelectedButeco]);

  if (!buteco.lat || !buteco.lon) return null;

  const icon = isSelected
    ? selectedIcon
    : isHighlighted
      ? highlightedIcon
      : defaultIcon;

  return (
    <Marker
      ref={markerRef}
      position={[buteco.lat, buteco.lon]}
      icon={icon}
      eventHandlers={{
        click: (e) => {
          setSelectedButeco(buteco, "map");
          markerRef.current?.openPopup();
        },
        mouseover: () => setHighlightedButeco(buteco),
        mouseout: () => setHighlightedButeco(null),
      }}
    >
      <Popup>
        <div className="min-w-55 max-w-70">
          {buteco.photo && (
            <div className="w-full h-32 mb-2 rounded overflow-hidden">
              <img
                src={buteco.photo}
                alt={buteco.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-row items-center justify-between">
          <h3 className="font-semibold text-sm mb-1 text-foreground">
            {buteco.name}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              window.open(buteco.details_url, "_blank");
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{buteco.address}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {buteco.suburb && (
              <span className="inline-block bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded">
                {buteco.suburb}
              </span>
            )}
            {buteco.district && (
              <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">
                {buteco.district}
              </span>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

interface ButecoMapProps {
  allButecos: any[];
}

export function ButecoMap({ allButecos }: ButecoMapProps) {
  // Exibe todos os pins no mapa, independente do filtro da lista
  const validButecos = allButecos.filter((b) => b.lat && b.lon);
  const center: [number, number] =
    validButecos.length > 0
      ? [
          validButecos.reduce((sum, b) => sum + b.lat!, 0) /
            validButecos.length,
          validButecos.reduce((sum, b) => sum + b.lon!, 0) /
            validButecos.length,
        ]
      : [-19.9167, -43.9345]; // Belo Horizonte default

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-inner">
      <MapContainer
        center={center}
        zoom={12}
        className="w-full h-full"
        scrollWheelZoom={true}
        touchZoom={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController />
        {allButecos.map((buteco, index) => (
          <ButecoMarker key={`${buteco.name}-${index}`} buteco={buteco} />
        ))}
      </MapContainer>
    </div>
  );
}
