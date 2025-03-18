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
    price?: number;
  }>;
}

const defaultData = [
  { timestamp: "00:00", demand: 120, supply: 130, price: 58 },
  { timestamp: "04:00", demand: 100, supply: 120, price: 55 },
  { timestamp: "08:00", demand: 180, supply: 170, price: 62 },
  { timestamp: "12:00", demand: 220, supply: 200, price: 68 },
  { timestamp: "16:00", demand: 240, supply: 230, price: 72 },
  { timestamp: "20:00", demand: 190, supply: 180, price: 65 },
  { timestamp: "24:00", demand: 140, supply: 150, price: 60 },
];

const weekData = [
  { timestamp: "Mon", demand: 150, supply: 160, price: 60 },
  { timestamp: "Tue", demand: 170, supply: 165, price: 63 },
  { timestamp: "Wed", demand: 190, supply: 180, price: 66 },
  { timestamp: "Thu", demand: 210, supply: 200, price: 69 },
  { timestamp: "Fri", demand: 230, supply: 220, price: 72 },
  { timestamp: "Sat", demand: 180, supply: 190, price: 64 },
  { timestamp: "Sun", demand: 160, supply: 170, price: 61 },
];

const monthData = [
  { timestamp: "Jan", demand: 170, supply: 180, price: 62 },
  { timestamp: "Feb", demand: 190, supply: 185, price: 64 },
  { timestamp: "Mar", demand: 210, supply: 200, price: 66 },
  { timestamp: "Apr", demand: 230, supply: 220, price: 68 },
  { timestamp: "May", demand: 250, supply: 240, price: 70 },
  { timestamp: "Jun", demand: 270, supply: 260, price: 72 },
  { timestamp: "Jul", demand: 290, supply: 280, price: 74 },
  { timestamp: "Aug", demand: 280, supply: 270, price: 73 },
  { timestamp: "Sep", demand: 260, supply: 250, price: 71 },
  { timestamp: "Oct", demand: 240, supply: 230, price: 69 },
  { timestamp: "Nov", demand: 220, supply: 210, price: 67 },
  { timestamp: "Dec", demand: 200, supply: 190, price: 65 },
];

const HistoricalChart: React.FC<HistoricalChartProps> = ({
  locationName = "New York City",
  data = defaultData,
}) => {
  const [timeRange, setTimeRange] = useState("month");
  const [chartType, setChartType] = useState("demand");
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
          {chartType === "demand" ? "Load Demand vs Month" : "Price vs Month"}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">View:</span>
          <Select
            value={chartType}
            onValueChange={(value) => setChartType(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="demand">Load Demand</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500 ml-2">Time Range:</span>
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
                  value: chartType === "demand" ? "Load (MW)" : "Price ($/MWh)",
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
                formatter={(value, name) => {
                  if (name === "Price") return [`${value} $/MWh`, name];
                  return [`${value} MW`, name];
                }}
              />
              <Legend />
              {chartType === "demand" ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="demand"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Load Demand"
                  />
                  <Line
                    type="monotone"
                    dataKey="supply"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Installed Capacity"
                  />
                </>
              ) : (
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Price"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {chartType === "demand" ? (
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>Load Demand</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Installed Capacity</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs italic">
                Gap indicates potential supply deficit
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Price ($/MWh)</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs italic">
                Price fluctuations over time
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricalChart;
