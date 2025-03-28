import React, { useState, useEffect } from "react";
import { dockerService } from "@/services/dockerService";
import StatDisplay from "./StatDisplay";
import {
  Server,
  Container,
  Play,
  Pause,
  Square,
  Cpu,
  Database,
  Clock,
} from "lucide-react";

const SystemInfo: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        setIsLoading(true);
        const data = await dockerService.getSystemInfo();
        const systemInfo = {
          ...data,
        };
        setSystemInfo(systemInfo);
      } catch (error) {
        console.error("Failed to fetch system info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse pb-6 border-b border-border mb-6">
        <h2 className="text-lg font-bold mb-4">Loading system info...</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-20 bg-secondary rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!systemInfo) {
    return (
      <div className="pb-6 border-b border-border mb-6">
        <h2 className="text-lg font-bold mb-4">System Info</h2>
        <p className="text-muted-foreground">
          Unable to load system information
        </p>
      </div>
    );
  }

  // Format memory for display
  const memTotal = Math.round(systemInfo.memTotal / 1024 / 1024 / 1024);
  const memFree = Math.round(systemInfo.memFree / 1024 / 1024 / 1024);
  const memUsed = memTotal - memFree;
  const memPercentage = Math.round((memUsed / memTotal) * 100);

  return (
    <div className="pb-6 border-b border-border mb-6 animate-fade-in">
      <h2 className="text-lg font-bold mb-4">System Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatDisplay
          icon={Container}
          label="Containers"
          value={systemInfo.containers}
        />
        <StatDisplay
          icon={Play}
          label="Running"
          value={systemInfo.containersRunning}
        />
        <StatDisplay
          icon={Pause}
          label="Paused"
          value={systemInfo.containersPaused}
        />
        <StatDisplay
          icon={Square}
          label="Stopped"
          value={systemInfo.containersStopped}
        />
      </div>
    </div>
  );
};

export default SystemInfo;
