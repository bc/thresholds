import { CSVRow } from "@shared/schema";

export type AccuracyMethod = {
  id: string;
  name: string;
  description: string;
  calculate: (data: CSVRow[], threshold: number) => {
    accuracy: number;
    totalSamples: number;
    samplesAboveThreshold: number;
    correctPredictions: number;
    confusionMatrix: {
      truePositives: number;
      falsePositives: number;
      trueNegatives: number;
      falseNegatives: number;
    };
  };
};

/**
 * The Hide Low Confidence approach:
 * - Correct predictions below threshold are counted as wrong (filtering them out hurts accuracy)
 * - Incorrect predictions below threshold are counted as correct (hiding wrong answers helps accuracy)
 * This assumes hiding low confidence predictions helps by preventing false outputs
 */
export const hideLowConfidenceMethod: AccuracyMethod = {
  id: "hide-low-confidence",
  name: "Hide Low Confidence",
  description: "Low confidence predictions are hidden. Correct predictions below threshold count against accuracy, incorrect ones below threshold count as correct.",
  calculate: (data: CSVRow[], threshold: number) => {
    // Categorize samples by threshold and correctness
    const aboveThreshold = data.filter((row) => row.confidence >= threshold);
    const belowThreshold = data.filter((row) => row.confidence < threshold);
    
    // Calculate metrics - above threshold normal accuracy
    const correctAboveThreshold = aboveThreshold.filter((row) => row.was_correct).length;
    
    // Below threshold we invert correctness when calculating accuracy:
    // - Incorrect below threshold are now correct (hiding wrong answers helps)
    // - Correct below threshold are now wrong (hiding right answers hurts)
    const incorrectBelowThreshold = belowThreshold.filter((row) => !row.was_correct).length;
    
    // Total "correct" predictions from our inverse logic
    const totalAdjustedCorrect = correctAboveThreshold + incorrectBelowThreshold;
    const totalSamples = data.length;
    
    // Calculate accuracy with our adjusted logic
    const accuracy = totalSamples > 0
      ? (totalAdjustedCorrect / totalSamples) * 100
      : 0;
    
    // Calculate confusion matrix for visualizations (only for above threshold samples)
    const truePositives = aboveThreshold.filter(
      (row) => row.was_correct && row.predicted_class === "positive"
    ).length;
    
    const trueNegatives = aboveThreshold.filter(
      (row) => row.was_correct && row.predicted_class === "negative"
    ).length;
    
    const falsePositives = aboveThreshold.filter(
      (row) => !row.was_correct && row.predicted_class === "positive"
    ).length;
    
    const falseNegatives = aboveThreshold.filter(
      (row) => !row.was_correct && row.predicted_class === "negative"
    ).length;

    return {
      accuracy,
      totalSamples,
      samplesAboveThreshold: aboveThreshold.length,
      correctPredictions: correctAboveThreshold,
      confusionMatrix: {
        truePositives,
        falsePositives,
        trueNegatives,
        falseNegatives,
      },
    };
  },
};

// Export a single method only
export const accuracyMethods: AccuracyMethod[] = [
  hideLowConfidenceMethod
];