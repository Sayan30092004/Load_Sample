import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MapPin, Info } from "lucide-react";

interface Location {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number]; // [latitude, longitude]
  demandLoad: number;
  suppliedLoad: number;
  blackoutProbability: number;
}

interface WorldMapProps {
  onLocationSelect?: (location: Location) => void;
  selectedLocationId?: string;
}

const WorldMap = ({ onLocationSelect, selectedLocationId }: WorldMapProps) => {
  // Mock data for locations
  const [locations, setLocations] = useState<Location[]>([
    {
      id: "1",
      name: "New York",
      country: "USA",
      coordinates: [40.7128, -74.006],
      demandLoad: 12500,
      suppliedLoad: 11800,
      blackoutProbability: 0.15,
    },
    {
      id: "2",
      name: "London",
      country: "UK",
      coordinates: [51.5074, -0.1278],
      demandLoad: 9800,
      suppliedLoad: 9600,
      blackoutProbability: 0.05,
    },
    {
      id: "3",
      name: "Tokyo",
      country: "Japan",
      coordinates: [35.6762, 139.6503],
      demandLoad: 15200,
      suppliedLoad: 14500,
      blackoutProbability: 0.12,
    },
    {
      id: "4",
      name: "Sydney",
      country: "Australia",
      coordinates: [-33.8688, 151.2093],
      demandLoad: 7500,
      suppliedLoad: 7300,
      blackoutProbability: 0.08,
    },
    {
      id: "5",
      name: "Mumbai",
      country: "India",
      coordinates: [19.076, 72.8777],
      demandLoad: 18200,
      suppliedLoad: 16800,
      blackoutProbability: 0.25,
    },
  ]);

  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  const [mapDimensions, setMapDimensions] = useState({
    width: 900,
    height: 500,
  });

  // Function to convert geographic coordinates to x,y positions on the map
  const coordsToPosition = (
    coords: [number, number],
  ): { x: number; y: number } => {
    const [lat, lng] = coords;
    // Simple conversion for demonstration purposes
    // In a real implementation, you would use proper map projection formulas
    const x = (lng + 180) * (mapDimensions.width / 360);
    const y = (90 - lat) * (mapDimensions.height / 180);
    return { x, y };
  };

  const handleLocationClick = (location: Location) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  // Determine pin color based on blackout probability
  const getPinColor = (probability: number): string => {
    if (probability < 0.1) return "text-green-500";
    if (probability < 0.2) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="w-full h-full bg-white shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Global Power Grid Map</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-500 hover:text-gray-700">
                  <Info size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click on a location to view detailed metrics</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div
          className="relative w-full"
          style={{
            height: `${mapDimensions.height}px`,
            backgroundColor: "#f0f8ff",
          }}
        >
          {/* World map background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1589519160732-57fc6ea83bc8?w=900&q=80)",
            }}
          >
            {/* Map overlay with grid lines */}
            <div className="absolute inset-0 bg-blue-50 bg-opacity-30">
              {/* Grid lines could be added here */}
            </div>
          </div>

          {/* Location pins */}
          {locations.map((location) => {
            const position = coordsToPosition(location.coordinates);
            const isSelected = location.id === selectedLocationId;
            const pinColor = getPinColor(location.blackoutProbability);

            return (
              <TooltipProvider key={location.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${isSelected ? "scale-150 z-10" : "hover:scale-125"}`}
                      style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                      }}
                      onClick={() => handleLocationClick(location)}
                      onMouseEnter={() => setHoveredLocation(location)}
                      onMouseLeave={() => setHoveredLocation(null)}
                    >
                      <MapPin
                        className={`${pinColor} ${isSelected ? "fill-current" : ""}`}
                        size={isSelected ? 24 : 20}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="p-1">
                      <p className="font-semibold">
                        {location.name}, {location.country}
                      </p>
                      <p className="text-sm">
                        Demand: {location.demandLoad.toLocaleString()} MW
                      </p>
                      <p className="text-sm">
                        Supply: {location.suppliedLoad.toLocaleString()} MW
                      </p>
                      <p className="text-sm">
                        Blackout Risk:{" "}
                        {(location.blackoutProbability * 100).toFixed(1)}%
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white bg-opacity-80 p-2 rounded-md shadow-sm">
            <div className="text-sm font-medium mb-1">Blackout Risk</div>
            <div className="flex items-center gap-2">
              <MapPin className="text-green-500" size={16} />
              <span className="text-xs">Low (&lt;10%)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-yellow-500" size={16} />
              <span className="text-xs">Medium (10-20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-red-500" size={16} />
              <span className="text-xs">High (&gt;20%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorldMap;
