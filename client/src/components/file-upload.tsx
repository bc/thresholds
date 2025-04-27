import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Upload, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  onLoadTestData?: () => void;
}

export function FileUpload({ onFileUpload, onLoadTestData }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      handleFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    onFileUpload(file);
    toast({
      title: "File Uploaded",
      description: `Successfully uploaded ${file.name}`,
      variant: "default",
    });
  };

  return (
    <Card>
      <CardContent className="pt-3 p-3">
        <h2 className="text-sm sm:text-base font-semibold mb-2">Upload Classification Results</h2>
        
        {/* Test Data Button */}
        {onLoadTestData && (
          <div className="mb-2 flex items-start gap-2">
            <Button 
              onClick={onLoadTestData}
              className="h-8 px-2 flex items-center justify-center gap-1"
              variant="outline"
              size="sm"
            >
              <Database className="h-3 w-3" />
              <span className="text-xs">Load Test Data</span>
            </Button>
            <p className="text-[10px] sm:text-xs text-gray-500 flex-1">
              No CSV file? Click to load sample classification data
            </p>
          </div>
        )}
        
        {/* Upload Area */}
        <div className="mt-2">
          <div
            className={`border-2 border-dashed rounded-lg p-3 sm:p-4 text-center transition-colors cursor-pointer ${
              isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 mx-auto text-gray-400" />
            <p className="mt-1 text-xs sm:text-sm text-gray-600">Drag and drop CSV file here, or click to browse</p>
            <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500">
              Requires: query, ground_truth_class, predicted_class, was_correct, confidence
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>
        </div>
        
        {/* Filename display */}
        {fileName && (
          <div className="mt-2">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="ml-1 text-xs text-green-600 font-medium">{fileName}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
