export interface AccuracyByThreshold {
  threshold: number;
  accuracy: number;
  count: number;
  totalCount: number;
}

export interface MetricsData {
  accuracy: number;
  totalSamples: number;
  samplesAboveThreshold: number;
  correctPredictions: number;
}

export interface ConfusionMatrixData {
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
}

export interface MaxAccuracy {
  value: number;
  threshold: number;
  samplesHiddenCount?: number;
  samplesHiddenPercent?: number;
}
