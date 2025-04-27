import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface AccuracyByThreshold {
  threshold: number;
  accuracy: number;
  count: number;
  totalCount: number;
}

interface CombinedMetricsChartProps {
  data: AccuracyByThreshold[];
  currentThreshold: number;
}

export function CombinedMetricsChart({ data, currentThreshold }: CombinedMetricsChartProps) {
  // Process data to include both metrics
  const chartData = data.map(d => ({
    threshold: d.threshold,
    accuracy: d.accuracy,
    percentHidden: parseFloat(((1 - d.count / d.totalCount) * 100).toFixed(1)),
    count: d.count,
    totalCount: d.totalCount
  }));

  // Custom tooltip to show both metrics
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-semibold">Threshold: {dataPoint.threshold}</p>
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></div>
              <p>Accuracy: {dataPoint.accuracy.toFixed(1)}%</p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <p>Hidden: {dataPoint.percentHidden.toFixed(1)}%</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Showing {dataPoint.count} of {dataPoint.totalCount} samples
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent className="p-2">
        <h2 className="text-sm sm:text-base font-semibold mb-1">Accuracy vs. Hidden Samples</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
              <XAxis 
                dataKey="threshold" 
                label={{ value: 'Threshold', position: 'insideBottom', offset: -5, fontSize: 10 }} 
                tick={{ fontSize: 10 }}
              />
              {/* Left Y-axis for Accuracy - Colored blue */}
              <YAxis 
                yAxisId="left"
                label={{ 
                  value: 'Accuracy (%)', 
                  angle: -90, 
                  position: 'insideLeft', 
                  fontSize: 10,
                  fill: "#4F46E5", // Blue color matching the line
                  dx: -10 // Move the label closer to the axis
                }}
                domain={[0, 100]} 
                tick={{ fontSize: 10, fill: "#4F46E5" }}
                width={25} // Reduce axis width
                tickMargin={2} // Reduce margin between ticks and axis
              />
              {/* Right Y-axis for % Hidden - Colored green */}
              <YAxis 
                yAxisId="right"
                orientation="right"
                label={{ 
                  value: '% Samples Hidden', 
                  angle: 90, 
                  position: 'insideRight', 
                  fontSize: 10,
                  fill: "#22C55E", // Green color matching the line
                  dx: 10 // Move the label closer to the axis
                }}
                domain={[0, 100]} 
                tick={{ fontSize: 10, fill: "#22C55E" }}
                width={25} // Reduce axis width
                tickMargin={2} // Reduce margin between ticks and axis
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Accuracy Line */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="accuracy"
                stroke="#4F46E5"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 2 }}
                name="Accuracy (%)"
              />
              
              {/* % Hidden Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="percentHidden"
                stroke="#22C55E"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 2 }}
                name="% Samples Hidden"
              />
              
              {/* Current Threshold Reference Line */}
              <ReferenceLine
                x={currentThreshold}
                yAxisId="left"
                stroke="#DC2626"
                strokeDasharray="3 3"
                label={{
                  value: "Current",
                  position: "top",
                  fill: "#DC2626",
                  fontSize: 10,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-2 text-[10px] sm:text-xs text-gray-600">
          <p>Shows both accuracy (blue) and percentage of hidden samples (green) at different confidence thresholds.</p>
        </div>
      </CardContent>
    </Card>
  );
}