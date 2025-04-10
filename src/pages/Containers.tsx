import React, { useState, useEffect } from "react";
import { dockerService } from "@/services/dockerService";
import { Link } from "react-router-dom";
import { RefreshCw, Container, Clock, Play, Square, RefreshCcw, HardDrive } from "lucide-react";
import { DockerContainerInfo } from "@/types/docker";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";

export default function Containers() {
  const [containers, setContainers] = useState<DockerContainerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchContainers = async () => {
    try {
      setIsLoading(true);
      const data = await dockerService.getContainersSnapshot();
      setContainers(data);
    } catch (err) {
      console.error("Failed to fetch containers:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch containers'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  const handleContainerAction = async (id: string, action: 'start' | 'stop' | 'restart') => {
    try {
      setIsActionLoading(true);
      await dockerService[`${action}Container`](id);
      toast.success(`Container ${action}ed successfully`);
      await fetchContainers();
    } catch (error) {
      console.error(`Failed to ${action} container:`, error);
      toast.error(`Failed to ${action} container`);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold">Containers</h2>
          <p className="text-sm text-muted-foreground">
            View and manage Docker containers
          </p>
        </div>
        <button
          onClick={fetchContainers}
          className="p-2 hover:bg-accent rounded-md transition-colors"
          title="Refresh containers"
        >
          <RefreshCw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div 
              key={index} 
              className="border border-border rounded-md h-12 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="border border-border bg-card text-destructive rounded-md p-4">
          <p>Failed to load containers</p>
        </div>
      ) : containers.length > 0 ? (
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Container className="w-4 h-4" />
                    Name
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    Status
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    Image
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Created
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {containers.map((container) => (
                <tr key={container.ID} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3 text-sm">
                    <Link 
                      to={`/containers/${container.ID}`}
                      className="hover:text-blue-500 transition-colors"
                    >
                      {container.Name[0].replace(/^\//, '')}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge 
                      status={container.State as "running" | "exited" | "paused" | "restarting" | "created"} 
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {container.Image}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {container.CreatedAt}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {container.State !== "running" ? (
                        <button
                          onClick={() => handleContainerAction(container.ID, 'start')}
                          disabled={isActionLoading}
                          className="p-1.5 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                          title="Start"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleContainerAction(container.ID, 'stop')}
                          disabled={isActionLoading}
                          className="p-1.5 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                          title="Stop"
                        >
                          <Square className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleContainerAction(container.ID, 'restart')}
                        disabled={isActionLoading || container.State !== "running"}
                        className={`p-1.5 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors ${
                          (isActionLoading || container.State !== "running") && "opacity-50 cursor-not-allowed"
                        }`}
                        title="Restart"
                      >
                        <RefreshCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-border rounded-md p-8 text-center">
          <p className="text-muted-foreground">No containers found</p>
        </div>
      )}
    </div>
  );
}
