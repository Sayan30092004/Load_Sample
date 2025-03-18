import React, { useState } from "react";
import WorldMap from "./WorldMap";
import KeyMetrics from "./KeyMetrics";
import HistoricalChart from "./HistoricalChart";
import DetailsSection from "./DetailsSection";
import LocationSearch from "./LocationSearch";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Download, RefreshCw } from "lucide-react";

interface Location {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number];
  loadDemand: number;
  installedCapacity: number;
  price: number;
  blackoutProbability: number;
}

interface DashboardLayoutProps {
  onBackToLanding?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onBackToLanding = () => {},
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location>({
    id: "1",
    name: "New York",
    country: "USA",
    coordinates: [40.7128, -74.006],
    loadDemand: 12500,
    installedCapacity: 11800,
    price: 65.8,
    blackoutProbability: 0.15,
  });

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleLocationSearch = (location: any) => {
    // In a real implementation, this would fetch the location data
    // and update the selected location
    if (location && location.id) {
      setSelectedLocation({
        ...selectedLocation,
        id: location.id,
        name: location.name,
        country: location.country,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackToLanding}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Load Forecasting Dashboard</h1>
          </div>

          <div className="flex items-center space-x-2">
            <LocationSearch
              onLocationSelect={handleLocationSearch}
              className="mr-4"
            />

            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {selectedLocation.name}, {selectedLocation.country}
          </h2>
          <p className="text-gray-500">
            Real-time electricity demand and supply monitoring
          </p>
        </div>

        {/* Key Metrics Section */}
        <section className="mb-6">
          <KeyMetrics
            loadDemand={{
              value: selectedLocation.loadDemand,
              unit: "MW",
              trend: "up",
              percentage: 8.5,
            }}
            installedCapacity={{
              value: selectedLocation.installedCapacity,
              unit: "MW",
              trend: "up",
              percentage: 5.2,
            }}
            price={{
              value: selectedLocation.price,
              unit: "$/MWh",
              trend: "up",
              percentage: 3.7,
            }}
            blackoutProbability={{
              value: Math.round(selectedLocation.blackoutProbability * 100),
              trend: "down",
              percentage: 3.1,
              riskLevel:
                selectedLocation.blackoutProbability < 0.1
                  ? "low"
                  : selectedLocation.blackoutProbability < 0.2
                    ? "medium"
                    : "high",
            }}
          />
        </section>

        {/* Map and Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* World Map - Takes up 2/3 of the width on large screens */}
          <div className="lg:col-span-2 h-[500px]">
            <WorldMap
              onLocationSelect={handleLocationSelect}
              selectedLocationId={selectedLocation.id}
            />
          </div>

          {/* Historical Chart - Takes up 1/3 of the width on large screens */}
          <div className="h-[500px]">
            <HistoricalChart
              locationName={selectedLocation.name}
              data={[
                {
                  timestamp: "00:00",
                  demand: Math.round(selectedLocation.loadDemand * 0.7),
                  supply: Math.round(selectedLocation.installedCapacity * 0.75),
                  price: Math.round(selectedLocation.price * 0.9),
                },
                {
                  timestamp: "04:00",
                  demand: Math.round(selectedLocation.loadDemand * 0.5),
                  supply: Math.round(selectedLocation.installedCapacity * 0.6),
                  price: Math.round(selectedLocation.price * 0.85),
                },
                {
                  timestamp: "08:00",
                  demand: Math.round(selectedLocation.loadDemand * 0.9),
                  supply: Math.round(selectedLocation.installedCapacity * 0.85),
                  price: Math.round(selectedLocation.price * 0.95),
                },
                {
                  timestamp: "12:00",
                  demand: Math.round(selectedLocation.loadDemand),
                  supply: Math.round(selectedLocation.installedCapacity * 0.95),
                  price: Math.round(selectedLocation.price),
                },
                {
                  timestamp: "16:00",
                  demand: Math.round(selectedLocation.loadDemand * 1.1),
                  supply: Math.round(selectedLocation.installedCapacity * 1.05),
                  price: Math.round(selectedLocation.price * 1.1),
                },
                {
                  timestamp: "20:00",
                  demand: Math.round(selectedLocation.loadDemand * 0.95),
                  supply: Math.round(selectedLocation.installedCapacity * 0.9),
                  price: Math.round(selectedLocation.price * 1.05),
                },
                {
                  timestamp: "24:00",
                  demand: Math.round(selectedLocation.loadDemand * 0.8),
                  supply: Math.round(selectedLocation.installedCapacity * 0.85),
                  price: Math.round(selectedLocation.price * 0.95),
                },
              ]}
            />
          </div>
        </div>

        {/* Details Section */}
        <section>
          <DetailsSection
            location={selectedLocation.name}
            peakDemand={Math.round(selectedLocation.loadDemand * 1.1)}
            averageSupply={Math.round(selectedLocation.installedCapacity)}
            supplyDeficit={Math.round(
              selectedLocation.loadDemand * 1.1 -
                selectedLocation.installedCapacity,
            )}
            forecastAccuracy={92}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>
            © 2023 Load Forecasting Dashboard. All data is simulated for
            demonstration purposes.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
