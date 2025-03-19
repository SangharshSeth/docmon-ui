
import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "running" | "exited" | "paused" | "restarting" | "created";
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusConfig = {
    running: {
      label: "Running",
      className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900",
      animation: "animate-pulse-opacity"
    },
    exited: {
      label: "Stopped",
      className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900",
      animation: ""
    },
    paused: {
      label: "Paused",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900",
      animation: ""
    },
    restarting: {
      label: "Restarting",
      className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
      animation: "animate-pulse-opacity"
    },
    created: {
      label: "Created",
      className: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800",
      animation: ""
    }
  };

  const config = statusConfig[status];

  return (
    <div 
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        config.className,
        config.animation,
        className
      )}
    >
      {config.label}
    </div>
  );
};

export default StatusBadge;
