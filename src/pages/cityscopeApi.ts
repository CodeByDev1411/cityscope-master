export type InfraType = 'pothole' | 'waste' | 'electrical';

export type InfrastructureSignal = {
  id: string;
  type: InfraType;
  label: string;
  ward: string;
  lat: number;
  lng: number;
  imageUrl: string;
  timestamp: string;
};

export type SafetySegment = {
  id: string;
  ward: string;
  score: number;
  path: [number, number][];
};

export type SentimentZone = {
  id: string;
  ward: string;
  sentiment: 'positive' | 'negative';
  intensity: number;
  top: string;
  left: string;
};

// --- Real Data Fetching (Overpass API) ---

const BBOX = '28.50,77.10,28.70,77.35'; // Central/South Delhi bounding box
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

// Helper to delay between requests if needed
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function fetchInfrastructureDelhi(): Promise<InfrastructureSignal[]> {
  // Query for traffic signals, power poles, and waste baskets to represent infra anomalies
  const query = `
    [out:json][timeout:15];
    (
      node["highway"="traffic_signals"](${BBOX});
      node["power"="pole"](${BBOX});
      node["amenity"="waste_basket"](${BBOX});
    );
    out body 50;
  `;

  try {
    const res = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: query,
    });
    const data = await res.json();

    return data.elements.map((el: any, i: number) => {
      let type: InfraType = 'electrical';
      let label = 'Electrical Outage / Issue';
      if (el.tags?.highway === 'traffic_signals') {
        type = 'pothole'; // Reusing pothole for generic road issue
        label = 'Traffic Signal Anomaly';
      } else if (el.tags?.amenity === 'waste_basket') {
        type = 'waste';
        label = 'Reported Waste Accumulation';
      }

      return {
        id: `infra_${el.id}_${i}`,
        type,
        label,
        ward: el.tags?.name ? `Near ${el.tags.name}` : 'Delhi Sector',
        lat: el.lat,
        lng: el.lon,
        imageUrl: `https://picsum.photos/seed/${el.id}/280/180`, // Dynamic placeholder
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
    });
  } catch (error) {
    console.warn('Overpass API failed, falling back', error);
    return [];
  }
}

export async function fetchSafetyDelhi(): Promise<SafetySegment[]> {
  // Query for primary and secondary roads to represent safety paths
  const query = `
      [out:json][timeout: 15];
      way["highway"~"primary|secondary"](${BBOX});
    out geom 10;
    `;

  try {
    const res = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: query,
    });
    const data = await res.json();

    return data.elements.filter((el: any) => el.geometry).map((el: any, i: number) => {
      // Create a pseudo-random score based on ID for consistency
      const pseudoRandom = (el.id % 100) / 100;
      return {
        id: `safe_${el.id}_${i}`,
        ward: el.tags?.name || 'Major Corridor',
        score: pseudoRandom,
        path: el.geometry.map((g: any) => [g.lat, g.lon]),
      };
    });
  } catch (error) {
    console.warn('Overpass API failed, falling back', error);
    return [];
  }
}

export async function fetchSentimentDelhi(): Promise<SentimentZone[]> {
  // Query for cafes and parks to represent high sentiment/pulse areas
  const query = `
    [out:json][timeout: 15];
    (
      node["amenity" = "cafe"](${BBOX});
      node["leisure" = "park"](${BBOX});
    );
    out body 20;
    `;

  try {
    const res = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: query,
    });
    const data = await res.json();

    // The map is bounded by the screen, we need to convert lat/lng to approximate CSS percentages
    // This is a rough estimation based on the bounding box for the glowing UI elements
    const latMin = 28.50;
    const latMax = 28.70;
    const lonMin = 77.10;
    const lonMax = 77.35;

    return data.elements.map((el: any, i: number) => {
      // Map lat to CSS top (invert because higher lat is North/up)
      const topPerc = 100 - ((el.lat - latMin) / (latMax - latMin)) * 100;
      // Map lon to CSS left
      const leftPerc = ((el.lon - lonMin) / (lonMax - lonMin)) * 100;

      const isPark = el.tags?.leisure === 'park';

      return {
        id: `sent_${el.id}_${i}`,
        ward: el.tags?.name || (isPark ? 'Green Zone' : 'Commercial Hub'),
        sentiment: isPark ? 'positive' : (i % 3 === 0 ? 'negative' : 'positive'), // Some negative friction points
        intensity: 0.5 + ((el.id % 50) / 100), // 0.5 to 1.0 glow
        top: `${Math.max(10, Math.min(90, topPerc))}%`,
        left: `${Math.max(10, Math.min(90, leftPerc))}%`,
      };
    });
  } catch (error) {
    console.warn('Overpass API failed, falling back', error);
    return [];
  }
}

