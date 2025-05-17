import React from "react";
import clsx from "clsx";

interface StatusBadgeProps {
  status: "running" | "exited" | "paused" | "restarting" | "created";
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <div
        className={clsx(
          "w-2 h-2 rounded-full animate-pulse",
          {
            "bg-green-500": status === "running",
            "bg-red-500": status === "exited",
            "bg-yellow-500": status === "paused",
            "bg-blue-500": status === "restarting",
            "bg-gray-500": status === "created",
          }
        )}
      />
      <span className="text-sm text-muted-foreground capitalize">
        {status}
      </span>
    </div>
  );
};

export default StatusBadge;
