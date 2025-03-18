import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  Zap,
  Battery,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

interface KeyMetricsProps {
  loadDemand?: {
    value: number;
    unit: string;
    trend: "up" | "down" | "neutral";
    percentage: number;
  };
  installedCapacity?: {
    value: number;
    unit: string;
    trend: "up" | "down" | "neutral";
    percentage: number;
  };
  price?: {
    value: number;
    unit: string;
    trend: "up" | "down" | "neutral";
    percentage: number;
  };
  blackoutProbability?: {
    value: number;
    trend: "up" | "down" | "neutral";
    percentage: number;
    riskLevel: "low" | "medium" | "high";
  };
}

const KeyMetrics: React.FC<KeyMetricsProps> = ({
  loadDemand = {
    value: 1250,
    unit: "MW",
    trend: "up",
    percentage: 8.5,
  },
  installedCapacity = {
    value: 1180,
    unit: "MW",
    trend: "up",
    percentage: 5.2,
  },
  price = {
    value: 65.8,
    unit: "$/MWh",
    trend: "up",
    percentage: 3.7,
  },
  blackoutProbability = {
    value: 12,
    trend: "down",
    percentage: 3.1,
    riskLevel: "low",
  },
}) => {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-amber-500";
      case "high":
        return "text-red-500";
      default:
        return "text-green-500";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full bg-white p-4 rounded-lg">
      {/* Load Demand Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Zap className="h-4 w-4 mr-2 text-amber-500" />
            Load Demand
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-1">
            <div className="text-2xl font-bold">
              {loadDemand.value}{" "}
              <span className="text-sm font-normal">{loadDemand.unit}</span>
            </div>
            <div className="flex items-center">
              {loadDemand.trend === "up" ? (
                <ArrowUp className="h-4 w-4 text-red-500 mr-1" />
              ) : loadDemand.trend === "down" ? (
                <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
              ) : null}
              <span
                className={`text-xs ${loadDemand.trend === "up" ? "text-red-500" : "text-green-500"}`}
              >
                {loadDemand.percentage}% from last period
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installed Capacity Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Battery className="h-4 w-4 mr-2 text-blue-500" />
            Installed Capacity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-1">
            <div className="text-2xl font-bold">
              {installedCapacity.value}{" "}
              <span className="text-sm font-normal">
                {installedCapacity.unit}
              </span>
            </div>
            <div className="flex items-center">
              {installedCapacity.trend === "up" ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : installedCapacity.trend === "down" ? (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              ) : null}
              <span
                className={`text-xs ${installedCapacity.trend === "up" ? "text-green-500" : "text-red-500"}`}
              >
                {installedCapacity.percentage}% from last period
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-green-500" />
            Price
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-1">
            <div className="text-2xl font-bold">
              {price.value}{" "}
              <span className="text-sm font-normal">{price.unit}</span>
            </div>
            <div className="flex items-center">
              {price.trend === "up" ? (
                <ArrowUp className="h-4 w-4 text-red-500 mr-1" />
              ) : price.trend === "down" ? (
                <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
              ) : null}
              <span
                className={`text-xs ${price.trend === "up" ? "text-red-500" : "text-green-500"}`}
              >
                {price.percentage}% from last period
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blackout Probability Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
            Blackout Probability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-1">
            <div
              className={`text-2xl font-bold ${getRiskColor(blackoutProbability.riskLevel)}`}
            >
              {blackoutProbability.value}%
            </div>
            <div className="flex items-center">
              {blackoutProbability.trend === "up" ? (
                <ArrowUp className="h-4 w-4 text-red-500 mr-1" />
              ) : blackoutProbability.trend === "down" ? (
                <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
              ) : null}
              <span
                className={`text-xs ${blackoutProbability.trend === "up" ? "text-red-500" : "text-green-500"}`}
              >
                {blackoutProbability.percentage}% from last period
              </span>
            </div>
            <div className="mt-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full bg-opacity-20 ${getRiskColor(blackoutProbability.riskLevel)} bg-${blackoutProbability.riskLevel === "low" ? "green" : blackoutProbability.riskLevel === "medium" ? "amber" : "red"}-100`}
              >
                {blackoutProbability.riskLevel.charAt(0).toUpperCase() +
                  blackoutProbability.riskLevel.slice(1)}{" "}
                Risk
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyMetrics;
