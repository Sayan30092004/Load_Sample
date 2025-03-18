import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  BarChart3Icon,
  ZapIcon,
} from "lucide-react";

interface DetailsSectionProps {
  peakDemand?: number;
  averageSupply?: number;
  supplyDeficit?: number;
  forecastAccuracy?: number;
  location?: string;
}

const DetailsSection = ({
  peakDemand = 1250,
  averageSupply = 1100,
  supplyDeficit = 150,
  forecastAccuracy = 92,
  location = "New York City",
}: DetailsSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-4">
        Detailed Statistics for {location}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Peak Demand Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <ZapIcon className="mr-2 h-4 w-4 text-yellow-500" />
              Peak Demand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{peakDemand} MW</p>
              <div className="flex items-center text-green-600">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">+5.2%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Highest in last 24 hours
            </p>
          </CardContent>
        </Card>

        {/* Average Supply Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <BarChart3Icon className="mr-2 h-4 w-4 text-blue-500" />
              Average Supply
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{averageSupply} MW</p>
              <div className="flex items-center text-red-600">
                <ArrowDownIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">-2.1%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average over last 24 hours
            </p>
          </CardContent>
        </Card>

        {/* Supply Deficit Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <ZapIcon className="mr-2 h-4 w-4 text-red-500" />
              Supply Deficit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{supplyDeficit} MW</p>
              <div className="flex items-center text-red-600">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">+8.3%</span>
              </div>
            </div>
            <div className="mt-2">
              <Progress
                value={(supplyDeficit / peakDemand) * 100}
                className="h-2 bg-gray-200"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((supplyDeficit / peakDemand) * 100).toFixed(1)}% of peak demand
            </p>
          </CardContent>
        </Card>

        {/* Forecast Accuracy Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <BarChart3Icon className="mr-2 h-4 w-4 text-green-500" />
              Forecast Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">{forecastAccuracy}%</p>
              <div className="flex items-center text-green-600">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">+1.5%</span>
              </div>
            </div>
            <div className="mt-2">
              <Progress value={forecastAccuracy} className="h-2 bg-gray-200" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on last 7 days of predictions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Note:</span> The supply deficit
          indicates potential risk areas. Current deficit is{" "}
          {((supplyDeficit / peakDemand) * 100).toFixed(1)}% of peak demand,
          which is{" "}
          {(supplyDeficit / peakDemand) * 100 > 10 ? "above" : "within"}{" "}
          acceptable limits.
        </p>
      </div>
    </div>
  );
};

export default DetailsSection;
