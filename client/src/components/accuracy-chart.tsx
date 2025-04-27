import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef } from "react";
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

interface AccuracyChartProps {
  data: AccuracyByThreshold[];
  currentThreshold: number;
}

export function AccuracyChart({ data, currentThreshold }: AccuracyChartProps) {
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
          <p>Accuracy: {dataPoint.accuracy.toFixed(2)}%</p>
          <p>
            Samples: {dataPoint.count} ({((dataPoint.count / dataPoint.totalCount) * 100).toFixed(1)}
            % of total)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent className="p-3">
        <h2 className="text-sm sm:text-base font-semibold mb-2">Accuracy vs. Threshold</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
              <XAxis 
                dataKey="threshold" 
                label={{ value: 'Threshold', position: 'insideBottom', offset: -5, fontSize: 10 }} 
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft', fontSize: 10 }}
                domain={[0, 100]} 
                tick={{ fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#4F46E5"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 2 }}
                name="Accuracy (%)"
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
          <p>Shows accuracy at different confidence thresholds. Red line indicates current threshold.</p>
        </div>
      </CardContent>
    </Card>
  );
}
