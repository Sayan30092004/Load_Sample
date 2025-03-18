import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Zap, Battery, AlertTriangle } from "lucide-react";

interface KeyMetricsProps {
  demandLoad?: {
    value: number;
    unit: string;
    trend: "up" | "down" | "neutral";
    percentage: number;
  };
  suppliedLoad?: {
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
  demandLoad = {
    value: 1250,
    unit: "MW",
    trend: "up",
    percentage: 8.5,
  },
  suppliedLoad = {
    value: 1180,
    unit: "MW",
    trend: "up",
    percentage: 5.2,
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full bg-white p-4 rounded-lg">
      {/* Demand Load Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Zap className="h-4 w-4 mr-2 text-amber-500" />
            Demand Load
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-1">
            <div className="text-2xl font-bold">
              {demandLoad.value}{" "}
              <span className="text-sm font-normal">{demandLoad.unit}</span>
            </div>
            <div className="flex items-center">
              {demandLoad.trend === "up" ? (
                <ArrowUp className="h-4 w-4 text-red-500 mr-1" />
              ) : demandLoad.trend === "down" ? (
                <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
              ) : null}
              <span
                className={`text-xs ${demandLoad.trend === "up" ? "text-red-500" : "text-green-500"}`}
              >
                {demandLoad.percentage}% from last period
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplied Load Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Battery className="h-4 w-4 mr-2 text-blue-500" />
            Supplied Load
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-1">
            <div className="text-2xl font-bold">
              {suppliedLoad.value}{" "}
              <span className="text-sm font-normal">{suppliedLoad.unit}</span>
            </div>
            <div className="flex items-center">
              {suppliedLoad.trend === "up" ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : suppliedLoad.trend === "down" ? (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              ) : null}
              <span
                className={`text-xs ${suppliedLoad.trend === "up" ? "text-green-500" : "text-red-500"}`}
              >
                {suppliedLoad.percentage}% from last period
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
