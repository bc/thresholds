import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { CSVRow } from "@shared/schema";

interface SimplifiedSankeyDiagramProps {
  data: CSVRow[];
  threshold: number;
}

export function SimplifiedSankeyDiagram({
  data,
  threshold,
}: SimplifiedSankeyDiagramProps) {
  // Calculate diagram data
  const totalCount = data.length;
  
  // Split by correctness
  const correctCount = data.filter(row => row.was_correct).length;
  const incorrectCount = data.filter(row => !row.was_correct).length;
  
  // Split by threshold
  const correctAboveThreshold = data.filter(
    row => row.was_correct && row.confidence >= threshold
  ).length;
  
  const correctBelowThreshold = data.filter(
    row => row.was_correct && row.confidence < threshold
  ).length;
  
  const incorrectAboveThreshold = data.filter(
    row => !row.was_correct && row.confidence >= threshold
  ).length;
  
  const incorrectBelowThreshold = data.filter(
    row => !row.was_correct && row.confidence < threshold
  ).length;
  
  // Calculate accuracy percentages
  const aboveThresholdTotal = correctAboveThreshold + incorrectAboveThreshold;
  const belowThresholdTotal = correctBelowThreshold + incorrectBelowThreshold;
  
  const aboveThresholdAccuracy = aboveThresholdTotal > 0
    ? (correctAboveThreshold / aboveThresholdTotal) * 100
    : 0;
  
  const belowThresholdAccuracy = belowThresholdTotal > 0
    ? (correctBelowThreshold / belowThresholdTotal) * 100
    : 0;

  return (
    <Card>
      <CardContent className="p-3">
        <h2 className="text-sm sm:text-base font-semibold mb-2">Prediction Flow by Threshold</h2>
        <p className="text-[10px] sm:text-xs text-gray-600 mb-2">
          This diagram shows how predictions flow from total samples to correct/incorrect categories,
          and then to above/below threshold groups with associated accuracy.
        </p>
        
        <div className="relative overflow-hidden w-full pt-6 pb-4">
          {/* First column - Total samples */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gray-400 rounded opacity-80 px-6 py-3 text-white text-center w-36">
              <div className="text-sm font-medium">All Samples</div>
              <div className="text-sm">{totalCount}</div>
            </div>
          </div>
          
          {/* Arrows from total to correct/incorrect */}
          <div className="flex justify-center mb-2">
            <div className="w-1/2 border-b border-r border-gray-300 h-6 transform -translate-x-1"></div>
            <div className="w-1/2 border-b border-l border-gray-300 h-6 transform translate-x-1"></div>
          </div>
          
          {/* Second column - Correct/Incorrect */}
          <div className="flex justify-between mb-4 mx-6">
            <div className="bg-green-500 rounded opacity-80 px-4 py-2 text-white text-center w-24">
              <div className="text-sm font-medium">Correct</div>
              <div className="text-sm">{correctCount}</div>
            </div>
            <div className="bg-red-500 rounded opacity-80 px-4 py-2 text-white text-center w-24">
              <div className="text-sm font-medium">Incorrect</div>
              <div className="text-sm">{incorrectCount}</div>
            </div>
          </div>
          
          {/* Arrows from correct/incorrect to threshold categories */}
          <div className="flex justify-between mb-2 mx-4">
            <div className="flex w-1/2">
              <div className="w-1/2 border-b border-r border-gray-300 h-6 transform -translate-x-1"></div>
              <div className="w-1/2 border-b border-l border-gray-300 h-6 transform translate-x-1"></div>
            </div>
            <div className="flex w-1/2">
              <div className="w-1/2 border-b border-r border-gray-300 h-6 transform -translate-x-1"></div>
              <div className="w-1/2 border-b border-l border-gray-300 h-6 transform translate-x-1"></div>
            </div>
          </div>
          
          {/* Third column - Above/Below threshold */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mx-2">
            <div className="bg-green-500 rounded opacity-80 px-3 py-2 text-white text-center w-32">
              <div className="text-xs font-medium">Correct</div>
              <div className="text-xs font-medium">Above Threshold</div>
              <div className="text-sm">{correctAboveThreshold}</div>
            </div>
            <div className="bg-red-500 rounded opacity-80 px-3 py-2 text-white text-center w-32">
              <div className="text-xs font-medium">Incorrect</div>
              <div className="text-xs font-medium">Above Threshold</div>
              <div className="text-sm">{incorrectAboveThreshold}</div>
            </div>
            <div className="bg-green-400 rounded opacity-80 px-3 py-2 text-white text-center w-32">
              <div className="text-xs font-medium">Correct</div>
              <div className="text-xs font-medium">Below Threshold</div>
              <div className="text-sm">{correctBelowThreshold}</div>
            </div>
            <div className="bg-red-400 rounded opacity-80 px-3 py-2 text-white text-center w-32">
              <div className="text-xs font-medium">Incorrect</div>
              <div className="text-xs font-medium">Below Threshold</div>
              <div className="text-sm">{incorrectBelowThreshold}</div>
            </div>
          </div>
          
          {/* Threshold sections */}
          <div className="grid grid-cols-2 gap-4 mt-6 mx-4">
            <div>
              <h3 className="text-sm font-medium text-center mb-2">Above Threshold</h3>
              <div className="border border-gray-200 rounded p-2 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Accuracy:</span>
                  <span className="text-xs font-medium">{aboveThresholdAccuracy.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Samples:</span>
                  <span className="text-xs">{aboveThresholdTotal} ({((aboveThresholdTotal / totalCount) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-center mb-2">Below Threshold</h3>
              <div className="border border-gray-200 rounded p-2 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Accuracy:</span>
                  <span className="text-xs font-medium">{belowThresholdAccuracy.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Samples:</span>
                  <span className="text-xs">{belowThresholdTotal} ({((belowThresholdTotal / totalCount) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}