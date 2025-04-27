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

interface SamplesHiddenChartProps {
  data: AccuracyByThreshold[];
  currentThreshold: number;
}

export function SamplesHiddenChart({ data, currentThreshold }: SamplesHiddenChartProps) {
  // Calculate percentage of samples hidden for each threshold
  const chartData = data.map(d => ({
    threshold: d.threshold,
    percentHidden: parseFloat(((1 - d.count / d.totalCount) * 100).toFixed(1)),
    count: d.totalCount - d.count,
    totalCount: d.totalCount
  }));

  // Format for tooltips
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
          <p>Hidden: {dataPoint.percentHidden.toFixed(1)}%</p>
          <p>
            {dataPoint.count} of {dataPoint.totalCount} samples
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent className="p-3">
        <h2 className="text-sm sm:text-base font-semibold mb-2">% Samples Hidden vs. Threshold</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
              <XAxis 
                dataKey="threshold" 
                label={{ value: 'Threshold', position: 'insideBottom', offset: -5, fontSize: 10 }} 
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                label={{ value: '% Samples Hidden', angle: -90, position: 'insideLeft', fontSize: 10 }}
                domain={[0, 100]} 
                tick={{ fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="percentHidden"
                stroke="#22C55E"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 2 }}
                name="% Samples Hidden"
              />
              <ReferenceLine
                x={currentThreshold}
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
          <p>Shows percentage of samples that would be hidden at different confidence thresholds.</p>
        </div>
      </CardContent>
    </Card>
  );
}