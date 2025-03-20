import React, { useState } from "react";
import { Link } from "react-router-dom";
import { dockerService } from "@/services/dockerService";
import type { DockerContainerInfo } from "@/types/docker";
import { formatDistance } from "date-fns";
import StatusBadge from "./StatusBadge";
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
  Clock
} from "lucide-react";
import clsx from "clsx";

interface ContainerProps {
  container: DockerContainerInfo;
}

export function Container({ container }: ContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  // Sample container stats (since they're not in DockerContainerInfo)
  const containerStats = {
    memory_usage: 128 * 1024 * 1024, // 128MB
    memory_limit: 512 * 1024 * 1024  // 512MB
  };

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-border">
        <div className="flex items-center">
          <Server className="w-4 h-4 mr-2 text-muted-foreground" />
          <Link to={`/containers/${container.ID}`} className="font-bold hover:underline">
            {container.Name[0]}
          </Link>
          <StatusBadge status={container.State as "running" | "exited" | "paused" | "restarting" | "created"} className="ml-3" />
        </div>

        <div className="flex items-center">
          {container.State !== "running" && (
            <button className="p-1.5 mr-1 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
              <Play className="w-4 h-4" />
            </button>
          )}
          {container.State === "running" && (
            <button className="p-1.5 mr-1 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
              <Square className="w-4 h-4" />
            </button>
          )}
          <button className="p-1.5 mr-1 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className={clsx(
              "p-1.5 mr-1 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors",
              showLogs && "bg-accent text-foreground"
            )}
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">Image</p>
              <p className="font-mono truncate">{container.Image}</p>
            </div>
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                <p>{container.CreatedAt}</p>
              </div>
            </div>
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">ID</p>
              <p className="font-mono">{container.ID}</p>
            </div>
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">Ports</p>
              <p>
                {container.Ports.length > 0
                  ? container.Ports.map(port => `${port.PublicPort || ''}:${port.PrivatePort}`).join(", ")
                  : "None"}
              </p>
            </div>
          </div>

          {/* Resource Usage */}
          <div className="space-y-4 mb-4">
            <div className="flex items-center mb-1">
              <Cpu className="w-4 h-4 mr-1.5 text-muted-foreground" />
              <p className="text-xs uppercase font-medium text-muted-foreground">Resource Usage</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm">
                <p className="text-xs text-muted-foreground mb-1 flex items-center">
                  <Database className="w-3 h-3 mr-1" />
                  Memory
                </p>
                <p>
                  {Math.round(containerStats.memory_usage / 1024 / 1024)} MB /
                  {Math.round(containerStats.memory_limit / 1024 / 1024)} MB
                </p>
              </div>
            </div>
          </div>

          {showLogs && (
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <Terminal className="w-4 h-4 mr-1.5 text-muted-foreground" />
                <p className="text-xs uppercase font-medium text-muted-foreground">Container Logs</p>
              </div>
              <div className="bg-card border border-border rounded-md p-3 font-mono text-xs h-48 overflow-y-auto">
                <p className="text-muted-foreground">No logs available</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Container;
