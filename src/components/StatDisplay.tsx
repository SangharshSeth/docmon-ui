
import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatDisplayProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
  iconClassName?: string;
}

const StatDisplay: React.FC<StatDisplayProps> = ({
  icon: Icon,
  label,
  value,
  unit,
  className,
  iconClassName
}) => {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex items-center mb-2">
        <Icon className={cn("w-4 h-4 mr-2 text-muted-foreground", iconClassName)} />
        <span className="text-xs font-medium uppercase text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold mr-1">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
};

export default StatDisplay;
