import { useState, useCallback, useMemo, useEffect } from "react";
import { CSVRow, csvRowSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { roundToNearest } from "@/lib/utils";
import Papa from "papaparse";
import { AccuracyByThreshold, MetricsData, ConfusionMatrixData, MaxAccuracy } from "@/lib/types";
import { testData } from "@/data/test-data";
import { 
  AccuracyMethod, 
  hideLowConfidenceMethod,
  accuracyMethods 
} from "@/lib/accuracy-calculation-methods";

export function useClassificationData(threshold: number) {
  const [data, setData] = useState<CSVRow[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { toast } = useToast();

  // We only have one accuracy calculation method now
  const selectedMethod = hideLowConfidenceMethod;
  const selectedMethodId = hideLowConfidenceMethod.id;
  
  // Auto-load test data when component mounts
  useEffect(() => {
    if (data.length === 0 && !isDataLoaded) {
      setData(testData);
      setIsDataLoaded(true);
      console.log("Auto-loaded test data with", testData.length, "records");
    }
  }, [data.length, isDataLoaded]);

  // Load test data
  const loadTestData = useCallback(() => {
    setData(testData);
    setIsDataLoaded(true);
    toast({
      title: "Test Data Loaded",
      description: `Loaded ${testData.length} sample classification records.`,
    });
  }, [toast]);

  // Handle file upload
  const handleFileUpload = useCallback((file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        try {
          const parsedData = results.data.map((row: any) => {
            // Parse the CSV row using zod schema
            return csvRowSchema.parse(row);
          });

          // Set the data
          setData(parsedData);
          setIsDataLoaded(true);
          
          toast({
            title: "Data Loaded Successfully",
            description: `Loaded ${parsedData.length} records from CSV.`,
          });
        } catch (error) {
          console.error("Error parsing CSV:", error);
          toast({
            title: "Error Parsing CSV",
            description: "Please ensure your CSV has the required columns: query, ground_truth_class, predicted_class, was_correct, confidence",
            variant: "destructive",
          });
        }
      },
      error: (error: Error) => {
        console.error("Error parsing CSV:", error);
        toast({
          title: "Error Reading File",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  }, [toast]);

  // Calculate accuracy for all thresholds from 0 to 1 in steps of 0.05 using the selected method
  // Then filter duplicates but keep first and last occurrence
  const accuracyByThreshold = useMemo(() => {
    const results: AccuracyByThreshold[] = [];
    
    if (data.length === 0) return results;
    
    // Generate data with 0.05 step size
    const rawResults: AccuracyByThreshold[] = [];
    for (let t = 0; t <= 1; t += 0.05) {
      const thresholdValue = roundToNearest(t, 0.05);
      const result = selectedMethod.calculate(data, thresholdValue);
      
      rawResults.push({
        threshold: thresholdValue,
        accuracy: result.accuracy,
        count: result.samplesAboveThreshold,
        totalCount: data.length
      });
    }
    
    // Group by unique accuracy/hidden combo
    const groups = new Map<string, AccuracyByThreshold[]>();
    
    // Group data points by accuracy and hidden count
    for (const item of rawResults) {
      const hiddenCount = item.totalCount - item.count;
      const key = `${item.accuracy.toFixed(2)}_${hiddenCount}`;
      
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      
      groups.get(key)?.push(item);
    }
    
    // For each group, keep only first and last occurrence
    groups.forEach((group) => {
      if (group.length === 1) {
        // Only one item, just add it
        results.push(group[0]);
      } else if (group.length > 1) {
        // Add first occurrence
        results.push(group[0]);
        
        // If first and last are different thresholds, add the last as well
        if (group[0].threshold !== group[group.length - 1].threshold) {
          results.push(group[group.length - 1]);
        }
      }
    });
    
    // Sort by threshold
    return results.sort((a, b) => a.threshold - b.threshold);
  }, [data, selectedMethod]);

  // Get max accuracy and its corresponding threshold
  const maxAccuracy = useMemo<MaxAccuracy>(() => {
    if (accuracyByThreshold.length === 0) {
      return { 
        value: 0, 
        threshold: 0,
        samplesHiddenCount: 0,
        samplesHiddenPercent: 0 
      };
    }
    
    const maxAccData = accuracyByThreshold.reduce(
      (max, current) => current.accuracy > max.value 
        ? {
            value: current.accuracy, 
            threshold: current.threshold,
            count: current.count,
            totalCount: current.totalCount
          } 
        : max,
      { value: 0, threshold: 0, count: 0, totalCount: 0 }
    );
    
    // Calculate hidden samples
    const samplesHiddenCount = maxAccData.totalCount - maxAccData.count;
    const samplesHiddenPercent = (samplesHiddenCount / Math.max(1, maxAccData.totalCount)) * 100;
    
    return {
      value: maxAccData.value,
      threshold: maxAccData.threshold,
      samplesHiddenCount,
      samplesHiddenPercent
    };
  }, [accuracyByThreshold]);

  // Filter data by threshold
  const filteredData = useMemo(() => {
    return data
      .filter(row => row.confidence >= threshold)
      .sort((a, b) => b.confidence - a.confidence);
  }, [data, threshold]);

  // Calculate metrics and confusion matrix for the current threshold using selected method
  const calculatedResults = useMemo(() => {
    if (data.length === 0) {
      return {
        metrics: {
          accuracy: 0,
          totalSamples: 0,
          samplesAboveThreshold: 0,
          correctPredictions: 0,
        },
        confusionMatrix: {
          truePositives: 0,
          falsePositives: 0,
          trueNegatives: 0,
          falseNegatives: 0,
        }
      };
    }
    
    const result = selectedMethod.calculate(data, threshold);
    
    return {
      metrics: {
        accuracy: result.accuracy,
        totalSamples: result.totalSamples,
        samplesAboveThreshold: result.samplesAboveThreshold,
        correctPredictions: result.correctPredictions,
      },
      confusionMatrix: result.confusionMatrix
    };
  }, [data, threshold, selectedMethod]);

  // Extract metrics from calculation results
  const metrics = useMemo<MetricsData>(() => calculatedResults.metrics, [calculatedResults]);

  // Extract confusion matrix from calculation results
  const confusionMatrix = useMemo<ConfusionMatrixData>(() => calculatedResults.confusionMatrix, [calculatedResults]);

  return {
    data,
    isDataLoaded,
    filteredData,
    accuracyByThreshold,
    maxAccuracy,
    metrics,
    confusionMatrix,
    handleFileUpload,
    loadTestData,
    selectedMethodId
  };
}