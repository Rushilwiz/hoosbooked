"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapExplorerProps {
  buildingCounts: Record<number, number>;
  buildingCoordinates: {
    building_id: number;
    latitude: number;
    longitude: number;
  }[];
  buildings: any[];
}

export default function MapExplorer({
  buildingCounts,
  buildingCoordinates,
  buildings,
}: MapExplorerProps) {
  const searchParams = useSearchParams();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [-78.5034, 38.0356],
      zoom: 16,
      pitch: 45,
      bearing: -17,
    });

    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    console.log(
      "Updating markers with counts:",
      buildings,
      buildingCounts,
      buildingCoordinates,
    );
    if (!map.current) return;

    markers.current.forEach((m) => m.remove());
    markers.current = [];

    const queryString = searchParams.toString();

    buildings.forEach((b) => {
      const count = buildingCounts[b.id] || 0;
      if (count === 0) return;

      const coordinates = buildingCoordinates.find(
        (c) => c.building_id === b.id,
      );
      if (!coordinates) return;

      const el = document.createElement("div");
      el.className = "custom-marker";
      el.innerHTML = `
        <div class="flex flex-col items-center group cursor-pointer">
          <div class="bg-[#E57200] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white transform transition group-hover:scale-110">
            ${count}
          </div>
          <div class="w-0.5 h-2 bg-white shadow-sm"></div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(
            `<div class="flex flex-col gap-2 p-1">
                <span class="text-sm"><b>${b.name}</b><br>${count} rooms available</span>
                <a 
                  href="/buildings/${b.id}?${queryString}" 
                  class="w-full text-center p-1.5 border border-[#232D4B] text-[#232D4B] text-xs font-semibold rounded hover:bg-[#232D4B] hover:text-white transition"
                >
                  Book Now
                </a>
             </div>`,
          ),
        )
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [buildingCounts, buildings, buildingCoordinates]);

  return <div ref={mapContainer} className="absolute inset-0 h-full w-full" />;
}
