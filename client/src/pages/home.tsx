import { FileUpload } from "@/components/file-upload";
import { ThresholdControl } from "@/components/threshold-control";
import { ThresholdInsights } from "@/components/threshold-insights";
import { MetricsOverview } from "@/components/metrics-overview";
import { AccuracyChart } from "@/components/accuracy-chart";
import { SamplesHiddenChart } from "@/components/samples-hidden-chart";
import { CombinedMetricsChart } from "@/components/combined-metrics-chart";
import { ResultsTable } from "@/components/results-table";
import { SimplifiedSankeyDiagram } from "@/components/simplified-sankey-diagram";
import { ThresholdSankeyDiagram } from "@/components/threshold-sankey-diagram";
import { useClassificationData } from "@/hooks/use-classification-data";
import { useState } from "react";
import { CSVRow } from "@shared/schema";

export default function Home() {
  const [threshold, setThreshold] = useState(0.5);
  const {
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
  } = useClassificationData(threshold);

  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-full mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">Model Evaluation Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-600">Upload your classification results and analyze performance metrics</p>
        </div>
      </header>

      {/* Sticky Threshold Control - only shown when data is loaded */}
      {isDataLoaded && (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm py-2">
          <div className="max-w-full mx-auto px-2 sm:px-4">
            <ThresholdControl
              threshold={threshold}
              setThreshold={setThreshold}
            />
          </div>
        </div>
      )}

      <main className="max-w-full mx-auto px-2 sm:px-4 py-3 sm:py-4">
        {/* File Upload */}
        <div className="mb-3 sm:mb-4">
          <FileUpload onFileUpload={handleFileUpload} onLoadTestData={loadTestData} />
        </div>

        {/* Show components only when data is loaded */}
        {isDataLoaded && (
          <>
            
            {/* Threshold Insights */}
            <div className="mb-3 sm:mb-4">
              <ThresholdInsights
                threshold={threshold}
                belowThresholdCount={data.filter(row => row.confidence < threshold).length}
                belowThresholdPercentage={(data.filter(row => row.confidence < threshold).length / data.length) * 100}
                belowThresholdCorrectCount={data.filter(row => row.confidence < threshold && row.was_correct).length}
                totalCount={data.length}
                accuracy={metrics.accuracy}
                selectedMethodId={selectedMethodId}
              />
            </div>

            {/* Metrics Overview */}
            <div className="mb-3 sm:mb-4">
              <MetricsOverview
                metrics={metrics}
                maxAccuracy={maxAccuracy}
              />
            </div>

            {/* Visualizations */}
            <div className="mb-3 sm:mb-4">
              {/* Accuracy Chart */}
              <AccuracyChart
                data={accuracyByThreshold}
                currentThreshold={threshold}
              />
            </div>

            {/* Samples Hidden Chart */}
            <div className="mb-3 sm:mb-4">
              <SamplesHiddenChart
                data={accuracyByThreshold}
                currentThreshold={threshold}
              />
            </div>
            
            {/* Combined Metrics Chart (Accuracy and Hidden %) */}
            <div className="mb-3 sm:mb-4">
              <CombinedMetricsChart
                data={accuracyByThreshold}
                currentThreshold={threshold}
              />
            </div>

            {/* Threshold Sankey Diagram */}
            <div className="mb-3 sm:mb-4">
              <ThresholdSankeyDiagram 
                data={data} 
                threshold={threshold} 
              />
            </div>

            {/* Results Table */}
            <ResultsTable data={filteredData} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-3 sm:mt-6">
        <div className="max-w-full mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <p className="text-center text-gray-500 text-[10px] sm:text-xs">
            Model Evaluation Dashboard • Made for data scientists and ML engineers
          </p>
        </div>
      </footer>
    </div>
  );
}
