import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ThresholdControlProps {
  threshold: number;
  setThreshold: (threshold: number) => void;
}

export function ThresholdControl({ threshold, setThreshold }: ThresholdControlProps) {
  const handleSliderChange = (value: number[]) => {
    setThreshold(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) value = 0.5;
    value = Math.max(0, Math.min(1, value));
    value = Math.round(value * 20) / 20; // Round to nearest 0.05
    setThreshold(value);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
      <h2 className="text-xs font-medium text-gray-500 whitespace-nowrap">Confidence Threshold:</h2>
      <div className="flex items-center gap-2 w-full">
        <div className="flex-grow">
          <Slider
            value={[threshold]}
            min={0}
            max={1}
            step={0.05}
            onValueChange={handleSliderChange}
            className="w-full h-4"
          />
          <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
            <span>0.0</span>
            <span>0.5</span>
            <span>1.0</span>
          </div>
        </div>
        <div className="flex items-center">
          <Label htmlFor="threshold-input" className="mr-1 text-[10px] font-medium">
            Value:
          </Label>
          <Input
            id="threshold-input"
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={threshold}
            onChange={handleInputChange}
            className="w-16 h-6 text-[10px] px-1"
          />
        </div>
      </div>
    </div>
  );
}
