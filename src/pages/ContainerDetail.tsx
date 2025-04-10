import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { dockerService } from "@/services/dockerService";
import StatusBadge from "@/components/StatusBadge";
import ResourceUsage from "@/components/ResourceUsage";
import { formatDistance } from "date-fns";
import { toast } from "sonner";
import { 
  ArrowLeft,
  Play, 
  Square, 
  RefreshCw, 
  Terminal, 
  Server,
  Cpu,
  Database,
  HardDrive,
  Network,
  Clock,
  Info
} from "lucide-react";
import { DockerContainerInfo, DockerNetwork, DockerLog, ContainerStats } from "@/types/docker";

const ContainerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [container, setContainer] = useState<DockerContainerInfo | null>(null);
  const [stats, setStats] = useState<ContainerStats | null>(null);
  const [logs, setLogs] = useState<DockerLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    const fetchContainer = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const containers = await dockerService.getContainersSnapshot();
        const foundContainer = containers.find(c => c.ID === id);
        if (foundContainer) {
          setContainer(foundContainer);
          // Fetch container stats
          const statsData = await dockerService.getContainerStats(id);
          setStats(statsData as ContainerStats);
        } else {
          setError(new Error("Container not found"));
        }
      } catch (err) {
        console.error("Failed to fetch container:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchContainer();
  }, [id]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!id || !showLogs) return;
      try {
        const logsData = await dockerService.getContainerLogs(id);
        setLogs(logsData);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      }
    };

    fetchLogs();
  }, [id, showLogs]);

  /**
   * Refreshes container data by fetching the latest state
   */
  const refreshContainerData = async () => {
    if (!id) return;
    const containers = await dockerService.getContainersSnapshot();
    const updatedContainer = containers.find(c => c.ID === id);
    if (updatedContainer) {
      setContainer(updatedContainer);
    }
  };

  /**
   * Handles container actions (start, stop, restart)
   * @param action - The action to perform ('start', 'stop', or 'restart')
   */
  const handleContainerAction = async (action: 'start' | 'stop' | 'restart') => {
    if (!id) return;
    try {
      setIsActionLoading(true);
      await dockerService[`${action}Container`](id);
      toast.success(`Container ${action}ed successfully`);
      await refreshContainerData();
    } catch (error) {
      console.error(`Failed to ${action} container:`, error);
      toast.error(`Failed to ${action} container`);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Replace individual action handlers with consolidated handler
  const handleStart = () => handleContainerAction('start');
  const handleStop = () => handleContainerAction('stop');
  const handleRestart = () => handleContainerAction('restart');

  const formatLogTime = (isoTime: string) => {
    const date = new Date(isoTime);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-secondary rounded-md w-1/4"></div>
        <div className="h-32 bg-secondary rounded-md"></div>
        <div className="h-64 bg-secondary rounded-md"></div>
      </div>
    );
  }

  if (error || !container) {
    return (
      <div className="border border-border bg-card text-destructive rounded-md p-4">
        <p>Failed to load container details</p>
        <Link to="/containers" className="flex items-center mt-4 text-sm">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to containers
        </Link>
      </div>
    );
  }

  // Format container info

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center">
            <Server className="w-5 h-5 mr-2 text-muted-foreground" />
            {container.Name[0]}
            <StatusBadge status={container.State as "running" | "exited" | "paused" | "restarting" | "created"} className="ml-3" />
          </h2>
          <div className="flex items-center space-x-2">
            {container.State !== "running" && (
              <button
                onClick={handleStart}
                disabled={isActionLoading}
                className="p-1.5 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                title="Start"
              >
                <Play className="w-4 h-4" />
              </button>
            )}
            {container.State === "running" && (
              <button
                onClick={handleStop}
                disabled={isActionLoading}
                className="p-1.5 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                title="Stop"
              >
                <Square className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleRestart}
              disabled={isActionLoading || container.State !== "running"}
              className={`p-1.5 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors ${
                (isActionLoading || container.State !== "running") && "opacity-50 cursor-not-allowed"
              }`}
              title="Restart"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowLogs(!showLogs)}
              className={`p-1.5 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors ${
                showLogs && "bg-accent text-foreground"
              }`}
              title="Logs"
            >
              <Terminal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border border-border rounded-md p-4">
          <h3 className="text-sm font-bold mb-4 flex items-center">
            <Info className="w-4 h-4 mr-2 text-muted-foreground" />
            Container Information
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">ID</p>
              <p className="font-mono">{container.ID}</p>
            </div>
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                <p>{container.CreatedAt}</p>
              </div>
            </div>
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">Image</p>
              <p className="font-mono truncate">{container.Image}</p>
            </div>
            {container.Command && (
              <div className="text-sm">
                <p className="text-xs text-muted-foreground mb-1">Command</p>
                <p className="font-mono truncate">{container.Command}</p>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-1">Ports</p>
            {container.Ports && container.Ports.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {container.Ports.map((port, idx) => (
                  <div key={idx} className="text-sm border border-border rounded-sm p-1 font-mono">
                    {port.PublicPort || ''}:{port.PrivatePort}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm">None</p>
            )}
          </div>
          
        </div>
        
        <div className="border border-border rounded-md p-4">
          <h3 className="text-sm font-bold mb-4 flex items-center">
            <Cpu className="w-4 h-4 mr-2 text-muted-foreground" />
            Resource Usage
          </h3>
          
          {stats ? (
            <div className="space-y-4">
              <ResourceUsage
                percentage={stats.cpu_percentage}
                label="CPU"
                className="mb-3"
              />
              <ResourceUsage
                percentage={stats.memory_percentage}
                label="Memory"
                className="mb-3"
              />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-sm">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center">
                    <Database className="w-3 h-3 mr-1" />
                    Memory Usage
                  </p>
                  <p>
                    {Math.round(stats.memory_usage / 1024 / 1024)} MB /
                    {Math.round(stats.memory_limit / 1024 / 1024)} MB
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center">
                    <HardDrive className="w-3 h-3 mr-1" />
                    Disk I/O
                  </p>
                  <p>
                    R: {Math.round(stats.block_read / 1024)} KB
                    <br />
                    W: {Math.round(stats.block_write / 1024)} KB
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center">
                    <Network className="w-3 h-3 mr-1" />
                    Network
                  </p>
                  <p>
                    RX: {Math.round(stats.network_rx / 1024)} KB
                    <br />
                    TX: {Math.round(stats.network_tx / 1024)} KB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No resource statistics available</p>
          )}
        </div>
      </div>


      
      {/* Container logs */}
      {showLogs && (
        <div className="border border-border rounded-md p-4 animate-slide-up">
          <div className="flex items-center mb-2">
            <Terminal className="w-4 h-4 mr-1.5 text-muted-foreground" />
            <p className="text-xs uppercase font-medium text-muted-foreground">Container Logs</p>
          </div>
          <div className="relative">
            <div className="code-scrollbar bg-card border border-border rounded-md p-3 font-mono text-xs h-64 overflow-y-auto">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div 
                    key={index}
                    className={`mb-1 pl-14 relative ${
                      log.stream === "stderr" ? "text-red-500 dark:text-red-400" : ""
                    }`}
                  >
                    <span className="absolute left-0 text-muted-foreground">{formatLogTime(log.timestamp)}</span>
                    <span>{log.message}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Loading logs...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainerDetail;
