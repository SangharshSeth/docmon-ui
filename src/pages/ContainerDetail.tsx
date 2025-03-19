
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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

const ContainerDetail = () => {
  const { id } = useParams();
  const [container, setContainer] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    const fetchContainer = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const containers = await dockerService.getContainers();
        const foundContainer = containers.find(c => c.id === id);
        if (foundContainer) {
          setContainer(foundContainer);
        } else {
          setError(new Error("Container not found"));
        }
      } catch (err) {
        console.error("Failed to fetch container:", err);
        setError(err);
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

  const handleStart = async () => {
    if (!id) return;
    try {
      setIsActionLoading(true);
      await dockerService.startContainer(id);
      toast.success(`Container started`);
      
      // Refresh container data
      const containers = await dockerService.getContainers();
      const updatedContainer = containers.find(c => c.id === id);
      if (updatedContainer) {
        setContainer(updatedContainer);
      }
    } catch (error) {
      toast.error(`Failed to start container`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleStop = async () => {
    if (!id) return;
    try {
      setIsActionLoading(true);
      await dockerService.stopContainer(id);
      toast.success(`Container stopped`);
      
      // Refresh container data
      const containers = await dockerService.getContainers();
      const updatedContainer = containers.find(c => c.id === id);
      if (updatedContainer) {
        setContainer(updatedContainer);
      }
    } catch (error) {
      toast.error(`Failed to stop container`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRestart = async () => {
    if (!id) return;
    try {
      setIsActionLoading(true);
      await dockerService.restartContainer(id);
      toast.success(`Container restarted`);
      
      // Refresh container data
      const containers = await dockerService.getContainers();
      const updatedContainer = containers.find(c => c.id === id);
      if (updatedContainer) {
        setContainer(updatedContainer);
      }
    } catch (error) {
      toast.error(`Failed to restart container`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatLogTime = (isoTime) => {
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
      <div className="border border-red-300 bg-red-50 text-red-700 rounded-md p-4 dark:bg-red-950 dark:text-red-400 dark:border-red-900">
        <p>Failed to load container details</p>
        <Link to="/containers" className="flex items-center mt-4 text-sm">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to containers
        </Link>
      </div>
    );
  }

  // Format container info
  const name = container.names[0].replace(/^\//, "");
  const createdTime = formatDistance(
    new Date(container.created),
    new Date(),
    { addSuffix: true }
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to="/containers" className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to containers
        </Link>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center">
            <Server className="w-5 h-5 mr-2 text-muted-foreground" />
            {name}
            <StatusBadge status={container.state} className="ml-3" />
          </h2>
          <div className="flex items-center space-x-2">
            {container.state !== "running" && (
              <button
                onClick={handleStart}
                disabled={isActionLoading}
                className="p-1.5 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                title="Start"
              >
                <Play className="w-4 h-4" />
              </button>
            )}
            {container.state === "running" && (
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
              disabled={isActionLoading || container.state !== "running"}
              className={`p-1.5 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors ${
                (isActionLoading || container.state !== "running") && "opacity-50 cursor-not-allowed"
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
              <p className="font-mono">{container.id}</p>
            </div>
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                <p>{createdTime}</p>
              </div>
            </div>
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">Image</p>
              <p className="font-mono truncate">{container.image}</p>
            </div>
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">Command</p>
              <p className="font-mono truncate">{container.command}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-1">Ports</p>
            {container.ports.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {container.ports.map((port, idx) => (
                  <div key={idx} className="text-sm border border-border rounded-sm p-1 font-mono">
                    {port.PublicPort || ''}:{port.PrivatePort}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm">None</p>
            )}
          </div>
          
          {container.labels && Object.keys(container.labels).length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-1">Labels</p>
              <div className="grid grid-cols-1 gap-1">
                {Object.entries(container.labels).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="font-medium">{key}:</span> {value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="border border-border rounded-md p-4">
          <h3 className="text-sm font-bold mb-4 flex items-center">
            <Cpu className="w-4 h-4 mr-2 text-muted-foreground" />
            Resource Usage
          </h3>
          
          {container.stats ? (
            <div className="space-y-4">
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
                    Memory Usage
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
                    R: {Math.round(container.stats.block_read / 1024)} KB
                    <br />
                    W: {Math.round(container.stats.block_write / 1024)} KB
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center">
                    <Network className="w-3 h-3 mr-1" />
                    Network
                  </p>
                  <p>
                    RX: {Math.round(container.stats.network_rx / 1024)} KB
                    <br />
                    TX: {Math.round(container.stats.network_tx / 1024)} KB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No resource statistics available</p>
          )}
        </div>
      </div>
      
      {container.mounts && container.mounts.length > 0 && (
        <div className="border border-border rounded-md p-4 mb-6">
          <h3 className="text-sm font-bold mb-4">Mounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {container.mounts.map((mount, idx) => (
              <div key={idx} className="border border-border rounded-md p-3 text-sm">
                <p className="text-xs text-muted-foreground mb-1">Type: {mount.Type}</p>
                <p className="font-mono text-xs truncate">Source: {mount.Source}</p>
                <p className="font-mono text-xs truncate">Target: {mount.Destination}</p>
                <p className="text-xs">{mount.RW ? "Read/Write" : "Read Only"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {container.networkSettings && container.networkSettings.networks && (
        <div className="border border-border rounded-md p-4 mb-6">
          <h3 className="text-sm font-bold mb-4">Network</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(container.networkSettings.networks).map(([networkName, network]) => (
              <div key={networkName} className="border border-border rounded-md p-3 text-sm">
                <p className="font-medium mb-1">{networkName}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <p>IP Address: {network.IPAddress}</p>
                  <p>Gateway: {network.Gateway}</p>
                  <p>Network ID: {network.NetworkID}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
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
