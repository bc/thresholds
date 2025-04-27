import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ConfusionMatrixProps {
  matrix: {
    truePositives: number;
    falsePositives: number;
    trueNegatives: number;
    falseNegatives: number;
  };
}

export function ConfusionMatrix({ matrix }: ConfusionMatrixProps) {
  const { truePositives, falsePositives, trueNegatives, falseNegatives } = matrix;

  // Calculate total for percentage
  const total = truePositives + falsePositives + trueNegatives + falseNegatives;
  
  // Function to get percentage
  const getPercentage = (value: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) + "%" : "0%";
  };

  // Table header labels
  const predictedLabel = "Predicted";
  const actualLabel = "Actual";

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">Confusion Matrix</h2>
        <div className="relative h-80 flex items-center justify-center">
          {/* Column Labels (Predicted) */}
          <div className="absolute left-0 right-0 top-0 flex justify-center items-center gap-1 px-4">
            <div className="text-center font-medium text-sm text-gray-700">{predictedLabel}</div>
          </div>
          
          {/* Column subheaders */}
          <div className="absolute left-0 right-0 top-6 flex justify-center items-center gap-1 px-4">
            <div className="flex-1 text-center text-xs text-gray-600 max-w-[50%]">Negative</div>
            <div className="flex-1 text-center text-xs text-gray-600 max-w-[50%]">Positive</div>
          </div>
          
          {/* Row Label (Actual) - vertical */}
          <div className="absolute top-0 bottom-0 left-2 flex flex-col justify-center items-center">
            <div className="transform -rotate-90 text-sm font-medium text-gray-700 whitespace-nowrap">
              {actualLabel}
            </div>
          </div>
          
          {/* Row subheaders */}
          <div className="absolute top-0 bottom-0 left-10 flex flex-col justify-center items-center gap-1">
            <div className="flex-1 flex items-center text-xs text-gray-600">Negative</div>
            <div className="flex-1 flex items-center text-xs text-gray-600">Positive</div>
          </div>
          
          {/* Matrix Grid */}
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full max-w-md mx-auto gap-1 mt-10 ml-12">
            {/* True Negatives (Top Left) */}
            <div className="flex items-center justify-center bg-blue-500 bg-opacity-70 rounded p-2 text-white font-semibold">
              <div className="text-center">
                <div className="text-lg">{trueNegatives}</div>
                <div className="text-xs">{getPercentage(trueNegatives)}</div>
                <div className="mt-2 text-sm">True Negatives</div>
              </div>
            </div>
            
            {/* False Positives (Top Right) */}
            <div className="flex items-center justify-center bg-red-500 bg-opacity-70 rounded p-2 text-white font-semibold">
              <div className="text-center">
                <div className="text-lg">{falsePositives}</div>
                <div className="text-xs">{getPercentage(falsePositives)}</div>
                <div className="mt-2 text-sm">False Positives</div>
              </div>
            </div>
            
            {/* False Negatives (Bottom Left) */}
            <div className="flex items-center justify-center bg-yellow-500 bg-opacity-70 rounded p-2 text-white font-semibold">
              <div className="text-center">
                <div className="text-lg">{falseNegatives}</div>
                <div className="text-xs">{getPercentage(falseNegatives)}</div>
                <div className="mt-2 text-sm">False Negatives</div>
              </div>
            </div>
            
            {/* True Positives (Bottom Right) */}
            <div className="flex items-center justify-center bg-green-500 bg-opacity-70 rounded p-2 text-white font-semibold">
              <div className="text-center">
                <div className="text-lg">{truePositives}</div>
                <div className="text-xs">{getPercentage(truePositives)}</div>
                <div className="mt-2 text-sm">True Positives</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 bg-opacity-70 mr-2 rounded"></div>
            <span>True Negatives</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 bg-opacity-70 mr-2 rounded"></div>
            <span>True Positives</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 bg-opacity-70 mr-2 rounded"></div>
            <span>False Negatives</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 bg-opacity-70 mr-2 rounded"></div>
            <span>False Positives</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
