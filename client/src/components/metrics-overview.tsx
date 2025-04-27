import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, BarChart2, CheckCheck, TrendingUp } from "lucide-react";

interface MetricsOverviewProps {
  metrics: {
    accuracy: number;
    totalSamples: number;
    samplesAboveThreshold: number;
    correctPredictions: number;
  };
  maxAccuracy: {
    value: number;
    threshold: number;
    samplesHiddenCount?: number;
    samplesHiddenPercent?: number;
  };
}

export function MetricsOverview({ metrics, maxAccuracy }: MetricsOverviewProps) {
  const { accuracy, totalSamples, samplesAboveThreshold, correctPredictions } = metrics;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      {/* Accuracy Card */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center">
            <div className="rounded-md bg-blue-100 p-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="ml-2 sm:ml-3">
              <h3 className="text-xs font-medium text-gray-500">Accuracy</h3>
              <div className="flex items-baseline">
                <span className="text-base sm:text-lg font-semibold">{accuracy.toFixed(2)}</span>
                <span className="text-[10px] sm:text-xs text-gray-500 ml-1">%</span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-[10px] sm:text-xs text-gray-500">
              Correct predictions above threshold
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Samples Above Threshold Card */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center">
            <div className="rounded-md bg-green-100 p-2">
              <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <div className="ml-2 sm:ml-3">
              <h3 className="text-xs font-medium text-gray-500">Samples Above Thresh.</h3>
              <div className="flex items-baseline">
                <span className="text-base sm:text-lg font-semibold">{samplesAboveThreshold}</span>
                <span className="text-[10px] sm:text-xs text-gray-500 ml-1">
                  ({((samplesAboveThreshold / totalSamples) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-[10px] sm:text-xs text-gray-500">
              Predictions with confidence ≥ threshold
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Correct Predictions Card */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center">
            <div className="rounded-md bg-indigo-100 p-2">
              <CheckCheck className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
            </div>
            <div className="ml-2 sm:ml-3">
              <h3 className="text-xs font-medium text-gray-500">Correct Pred.</h3>
              <div className="flex items-baseline">
                <span className="text-base sm:text-lg font-semibold">{correctPredictions}</span>
                <span className="text-[10px] sm:text-xs text-gray-500 ml-1">
                  above thresh.
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-[10px] sm:text-xs text-gray-500">
              Matching ground truth above threshold
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Max Accuracy Card */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center">
            <div className="rounded-md bg-amber-100 p-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
            </div>
            <div className="ml-2 sm:ml-3">
              <h3 className="text-xs font-medium text-gray-500">Max Accuracy</h3>
              <div className="flex items-baseline">
                <span className="text-base sm:text-lg font-semibold">{maxAccuracy.value.toFixed(2)}%</span>
                <span className="text-[10px] sm:text-xs text-gray-500 ml-1">
                  at {maxAccuracy.threshold}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-[10px] sm:text-xs text-gray-500">
              Highest accuracy and its threshold
            </div>
            {maxAccuracy.samplesHiddenCount !== undefined && maxAccuracy.samplesHiddenPercent !== undefined && (
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1">
                Hides {maxAccuracy.samplesHiddenCount} samples ({maxAccuracy.samplesHiddenPercent.toFixed(1)}%)
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
