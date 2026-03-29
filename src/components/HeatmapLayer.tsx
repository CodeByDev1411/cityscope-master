import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

type HeatmapPoint = {
  lat: number;
  lng: number;
  weight: number;
};

type HeatmapLayerProps = {
  points: HeatmapPoint[];
};

export function HeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const layer = L.heatLayer(
      points.map((point) => [point.lat, point.lng, point.weight] as [number, number, number]),
      {
        radius: 35,
        blur: 25,
        maxZoom: 16,
        max: 1,
        minOpacity: 0.35,
        gradient: {
          0.15: '#22c55e',
          0.4: '#eab308',
          0.65: '#f97316',
          1.0: '#ef4444',
        },
      }
    );

    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, points]);

  return null;
}
