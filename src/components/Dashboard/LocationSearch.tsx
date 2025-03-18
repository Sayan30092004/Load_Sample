import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface LocationSearchProps {
  onSearch?: (query: string) => void;
  onLocationSelect?: (location: LocationSuggestion) => void;
  className?: string;
}

interface LocationSuggestion {
  id: string;
  name: string;
  country: string;
}

const LocationSearch = ({
  onSearch = () => {},
  onLocationSelect = () => {},
  className = "",
}: LocationSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([
    { id: "1", name: "New York", country: "United States" },
    { id: "2", name: "London", country: "United Kingdom" },
    { id: "3", name: "Tokyo", country: "Japan" },
    { id: "4", name: "Paris", country: "France" },
    { id: "5", name: "Sydney", country: "Australia" },
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery);
    setShowSuggestions(true);
    // In a real implementation, this would fetch suggestions from an API
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSearchQuery(location.name);
    onLocationSelect(location);
    setShowSuggestions(false);
  };

  return (
    <div className={`relative w-full max-w-sm bg-white ${className}`}>
      <div className="flex items-center w-full">
        <Input
          type="text"
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          className="w-full rounded-r-none"
        />
        <Button type="button" onClick={handleSearch} className="rounded-l-none">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto shadow-lg">
          <ul className="py-1">
            {suggestions.map((location) => (
              <li
                key={location.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleLocationSelect(location)}
              >
                <div className="font-medium">{location.name}</div>
                <div className="text-sm text-gray-500">{location.country}</div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default LocationSearch;
