import React from "react";
import { cn } from "@/lib/utils";

interface ResourceUsageProps {
  percentage: number;
  label: string;
  className?: string;
  showValue?: boolean;
}

const ResourceUsage: React.FC<ResourceUsageProps> = ({
  percentage,
  label,
  className,
  showValue = true
}) => {
  // Set color based on percentage using our new color scheme
  let barColor = "bg-chart-3"; // Default color (blue)
  if (percentage > 80) {
    barColor = "bg-destructive"; // Red for high usage
  } else if (percentage > 60) {
    barColor = "bg-chart-2"; // Orange/coral for medium usage
  }

  // Format percentage for display
  const formattedPercentage = Math.round(percentage * 10) / 10;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        {showValue && (
          <span className="text-xs font-medium text-foreground">{formattedPercentage}%</span>
        )}
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ResourceUsage;
