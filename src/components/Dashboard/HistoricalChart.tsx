import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface HistoricalChartProps {
  locationName?: string;
  data?: Array<{
    timestamp: string;
    demand: number;
    supply: number;
  }>;
}

const defaultData = [
  { timestamp: "00:00", demand: 120, supply: 130 },
  { timestamp: "04:00", demand: 100, supply: 120 },
  { timestamp: "08:00", demand: 180, supply: 170 },
  { timestamp: "12:00", demand: 220, supply: 200 },
  { timestamp: "16:00", demand: 240, supply: 230 },
  { timestamp: "20:00", demand: 190, supply: 180 },
  { timestamp: "24:00", demand: 140, supply: 150 },
];

const weekData = [
  { timestamp: "Mon", demand: 150, supply: 160 },
  { timestamp: "Tue", demand: 170, supply: 165 },
  { timestamp: "Wed", demand: 190, supply: 180 },
  { timestamp: "Thu", demand: 210, supply: 200 },
  { timestamp: "Fri", demand: 230, supply: 220 },
  { timestamp: "Sat", demand: 180, supply: 190 },
  { timestamp: "Sun", demand: 160, supply: 170 },
];

const monthData = [
  { timestamp: "Week 1", demand: 170, supply: 180 },
  { timestamp: "Week 2", demand: 190, supply: 185 },
  { timestamp: "Week 3", demand: 210, supply: 200 },
  { timestamp: "Week 4", demand: 230, supply: 220 },
];

const HistoricalChart: React.FC<HistoricalChartProps> = ({
  locationName = "New York City",
  data = defaultData,
}) => {
  const [timeRange, setTimeRange] = useState("day");
  const [chartData, setChartData] = useState(data);

  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    switch (value) {
      case "day":
        setChartData(defaultData);
        break;
      case "week":
        setChartData(weekData);
        break;
      case "month":
        setChartData(monthData);
        break;
      default:
        setChartData(defaultData);
    }
  };

  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          Historical Demand vs Supply
        </CardTitle>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Time Range:</span>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500 mb-4">
          {locationName} -{" "}
          {timeRange === "day"
            ? "Today"
            : timeRange === "week"
              ? "This Week"
              : "This Month"}
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="timestamp" />
              <YAxis
                label={{
                  value: "Load (MW)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
                formatter={(value) => [`${value} MW`, undefined]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Demand Load"
              />
              <Line
                type="monotone"
                dataKey="supply"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Supplied Load"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-4 text-sm text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Demand Load</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>Supplied Load</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs italic">
              Gap indicates potential supply deficit
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalChart;
