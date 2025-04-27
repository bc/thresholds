import { Card, CardContent } from "@/components/ui/card";

interface ThresholdInsightsProps {
  threshold: number;
  belowThresholdCount: number;
  belowThresholdPercentage: number;
  belowThresholdCorrectCount: number;
  totalCount: number;
  accuracy: number;
  selectedMethodId: string;
}

export function ThresholdInsights({
  threshold,
  belowThresholdCount,
  belowThresholdPercentage,
  belowThresholdCorrectCount,
  totalCount,
  accuracy,
  selectedMethodId
}: ThresholdInsightsProps) {
  // Calculate additional information for Hide Low Confidence method
  const belowThresholdIncorrectCount = belowThresholdCount - belowThresholdCorrectCount;
  const isHideLowConfidenceMethod = selectedMethodId === 'hide-low-confidence';
  
  return (
    <Card>
      <CardContent className="p-3">
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          With a confidence threshold of <span className="font-semibold text-blue-700">{threshold ? threshold.toFixed(2) : '0.50'}</span>, your model achieves <span className="font-semibold text-primary">{accuracy ? accuracy.toFixed(1) : '0.0'}%</span> accuracy. 
          <span className="text-amber-600 font-medium"> {belowThresholdCount} samples ({belowThresholdPercentage ? belowThresholdPercentage.toFixed(1) : '0.0'}%)</span> fall below this threshold
          and would be filtered out or handled differently. This includes <span className="text-green-600 font-medium">{belowThresholdCorrectCount} correct predictions</span> that
          would have been right but are excluded due to low confidence.
        </p>
        
        {isHideLowConfidenceMethod && (
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-2">
            Using <span className="font-medium">Hide Low Confidence</span> mode, which counts <span className="text-green-600 font-medium">{belowThresholdIncorrectCount} incorrect predictions</span> below 
            the threshold as correct (since hiding them prevents wrong outputs). This balances the trade-off between 
            showing answers with high confidence versus hiding potentially incorrect answers.
          </p>
        )}
      </CardContent>
    </Card>
  );
}