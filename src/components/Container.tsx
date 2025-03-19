
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { dockerService } from "@/services/dockerService";
import type { DockerContainer } from "@/types/docker";
import { formatDistance } from "date-fns";
import StatusBadge from "./StatusBadge";
import ResourceUsage from "./ResourceUsage";
import { toast } from "sonner";
import { 
  Play, 
  Square, 
  RefreshCw, 
  Terminal, 
  ChevronDown, 
  ChevronUp,
  Server,
  Cpu,
  Database,
  HardDrive,
  Network,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  container: DockerContainer;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ container, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Format container info
  const name = container.names[0].replace(/^\//, "");
  const createdTime = formatDistance(
    new Date(container.created),
    new Date(),
    { addSuffix: true }
  );

  // Fetch container logs
  const fetchLogs = async () => {
    try {
      setLogsLoading(true);
      const logsData = await dockerService.getContainerLogs(container.id);
      setLogs(logsData);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLogsLoading(false);
    }
  };

  // Container actions
  const handleStart = async () => {
    try {
      setIsActionLoading(true);
      await dockerService.startContainer(container.id);
      toast.success(`Container ${name} started`);
      // In a real app, we would fetch the updated container state here
    } catch (error) {
      toast.error(`Failed to start container ${name}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      setIsActionLoading(true);
      await dockerService.stopContainer(container.id);
      toast.success(`Container ${name} stopped`);
      // In a real app, we would fetch the updated container state here
    } catch (error) {
      toast.error(`Failed to stop container ${name}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRestart = async () => {
    try {
      setIsActionLoading(true);
      await dockerService.restartContainer(container.id);
      toast.success(`Container ${name} restarted`);
      // In a real app, we would fetch the updated container state here
    } catch (error) {
      toast.error(`Failed to restart container ${name}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    // Close logs when collapsing
    if (isExpanded) {
      setShowLogs(false);
    }
  };

  const toggleLogs = () => {
    const newShowLogs = !showLogs;
    setShowLogs(newShowLogs);
    
    // Expand container when showing logs and fetch logs
    if (newShowLogs) {
      if (!isExpanded) {
        setIsExpanded(true);
      }
      fetchLogs();
    }
  };

  // Format log timestamp
  const formatLogTime = (isoTime) => {
    const date = new Date(isoTime);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("container-card mb-4", className)}>
      <div className="container-header">
        <div className="flex items-center">
          <Server className="w-4 h-4 mr-2 text-muted-foreground" />
          <Link to={`/containers/${container.id}`} className="font-bold hover:underline">
            {name}
          </Link>
          <StatusBadge status={container.state} className="ml-3" />
        </div>
        <div className="flex items-center">
          {/* Container actions */}
          {container.state !== "running" && (
            <button
              onClick={handleStart}
              disabled={isActionLoading}
              className="p-1.5 mr-1 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Start"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          {container.state === "running" && (
            <button
              onClick={handleStop}
              disabled={isActionLoading}
              className="p-1.5 mr-1 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title="Stop"
            >
              <Square className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleRestart}
            disabled={isActionLoading || container.state !== "running"}
            className={cn(
              "p-1.5 mr-1 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors",
              (isActionLoading || container.state !== "running") && "opacity-50 cursor-not-allowed"
            )}
            title="Restart"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleLogs}
            className={cn(
              "p-1.5 mr-1 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors",
              showLogs && "bg-accent text-foreground"
            )}
            title="Logs"
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button
            onClick={toggleExpand}
            className="p-1.5 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Container details */}
      {isExpanded && (
        <div className="p-4 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">Image</p>
              <p className="font-mono truncate">{container.image}</p>
            </div>
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                <p>{createdTime}</p>
              </div>
            </div>
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">ID</p>
              <p className="font-mono">{container.id.substring(0, 12)}</p>
            </div>
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">Ports</p>
              <p>
                {container.ports.length > 0
                  ? container.ports.map(port => `${port.PublicPort || ''}:${port.PrivatePort}`).join(", ")
                  : "None"}
              </p>
            </div>
          </div>

          {/* Resource usage */}
          {container.stats && (
            <div className="space-y-4 mb-4">
              <div className="flex items-center mb-1">
                <Cpu className="w-4 h-4 mr-1.5 text-muted-foreground" />
                <p className="text-xs uppercase font-medium text-muted-foreground">Resource Usage</p>
              </div>
              <ResourceUsage
                percentage={container.stats.cpu_percentage}
                label="CPU"
                className="mb-3"
              />
              <ResourceUsage
                percentage={container.stats.memory_percentage}
                label="Memory"
                className="mb-3"
              />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-sm">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center">
                    <Database className="w-3 h-3 mr-1" />
                    Memory
                  </p>
                  <p>
                    {Math.round(container.stats.memory_usage / 1024 / 1024)} MB /
                    {Math.round(container.stats.memory_limit / 1024 / 1024)} MB
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center">
                    <HardDrive className="w-3 h-3 mr-1" />
                    Disk I/O
                  </p>
                  <p>
                    R: {Math.round(container.stats.block_read / 1024)} KB, W: {Math.round(container.stats.block_write / 1024)} KB
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center">
                    <Network className="w-3 h-3 mr-1" />
                    Network
                  </p>
                  <p>
                    RX: {Math.round(container.stats.network_rx / 1024)} KB, TX: {Math.round(container.stats.network_tx / 1024)} KB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Container logs */}
          {showLogs && (
            <div className="mt-4 animate-slide-up">
              <div className="flex items-center mb-2">
                <Terminal className="w-4 h-4 mr-1.5 text-muted-foreground" />
                <p className="text-xs uppercase font-medium text-muted-foreground">Container Logs</p>
              </div>
              <div className="relative">
                <div className="code-scrollbar bg-card border border-border rounded-md p-3 font-mono text-xs h-48 overflow-y-auto">
                  {logsLoading ? (
                    <p className="text-muted-foreground">Loading logs...</p>
                  ) : logs && logs.length > 0 ? (
                    logs.map((log, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "mb-1 pl-14 relative",
                          log.stream === "stderr" ? "text-red-500 dark:text-red-400" : ""
                        )}
                      >
                        <span className="absolute left-0 text-muted-foreground">{formatLogTime(log.timestamp)}</span>
                        <span>{log.message}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No logs available</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Container;
