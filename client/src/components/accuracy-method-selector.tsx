import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { accuracyMethods, AccuracyMethod } from "@/lib/accuracy-calculation-methods";

interface AccuracyMethodSelectorProps {
  selectedMethodId: string;
  onMethodChange: (methodId: string) => void;
}

export function AccuracyMethodSelector({ 
  selectedMethodId, 
  onMethodChange 
}: AccuracyMethodSelectorProps) {
  const handleChange = (value: string) => {
    onMethodChange(value);
  };

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-start gap-1">
          <h2 className="text-sm sm:text-base font-semibold">Accuracy Calculation Method</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="text-xs">
                  Different methods for calculating accuracy based on the confidence threshold.
                  Each method handles low-confidence predictions differently.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <RadioGroup 
          className="mt-2 space-y-1.5"
          value={selectedMethodId}
          onValueChange={handleChange}
        >
          {accuracyMethods.map((method) => (
            <div key={method.id} className="flex items-start space-x-2">
              <RadioGroupItem value={method.id} id={method.id} className="mt-0.5" />
              <div className="grid gap-0.5">
                <Label 
                  htmlFor={method.id} 
                  className="text-xs sm:text-sm font-medium cursor-pointer"
                >
                  {method.name}
                </Label>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  {method.description}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}