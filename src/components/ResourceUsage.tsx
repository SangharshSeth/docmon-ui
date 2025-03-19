
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
  // Set color based on percentage
  let barColor = "bg-primary";
  if (percentage > 80) {
    barColor = "bg-red-500";
  } else if (percentage > 60) {
    barColor = "bg-yellow-500";
  }

  // Format percentage for display
  const formattedPercentage = Math.round(percentage * 10) / 10;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        {showValue && (
          <span className="text-xs font-medium">{formattedPercentage}%</span>
        )}
      </div>
      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ResourceUsage;
