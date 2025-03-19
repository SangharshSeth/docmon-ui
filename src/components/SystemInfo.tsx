import React from "react";
import { useQuery } from "@tanstack/react-query";
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
  Clock
} from "lucide-react";

const SystemInfo: React.FC = () => {
  const { data: systemInfo, isLoading } = useQuery({
    queryKey: ["system-info"],
    queryFn: () => dockerService.getSystemInfo(),
  });

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
        <p className="text-muted-foreground">Unable to load system information</p>
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
      
      <h3 className="text-sm font-bold mt-6 mb-4">Host Resources</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatDisplay 
          icon={Cpu}
          label="CPUs"
          value={systemInfo.cpus}
          unit="cores"
        />
        <StatDisplay 
          icon={Database}
          label="Memory Usage"
          value={`${memUsed}/${memTotal}`}
          unit="GB"
        />
        <StatDisplay 
          icon={Server}
          label="Engine Version"
          value={systemInfo.engineVersion}
        />
      </div>
    </div>
  );
};

export default SystemInfo;
