import React, { useState, useEffect } from "react";
import { dockerService } from "@/services/dockerService";
import { Container } from "@/components/Container";
import { RefreshCw } from "lucide-react";
import { DockerContainerInfo } from "@/types/docker";

export default function Containers() {
  const [containers, setContainers] = useState<DockerContainerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContainers = async () => {
    try {
      setIsLoading(true);
      const data = await dockerService.getContainers();
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
              className="border border-border rounded-md h-24 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="border border-red-300 bg-red-50 text-red-700 rounded-md p-4">
          <p>Failed to load containers</p>
        </div>
      ) : containers.length > 0 ? (
        <div className="space-y-4">
          {containers.map((container) => (
            <Container 
              key={container.id} 
              container={container} 
            />
          ))}
        </div>
      ) : (
        <div className="border border-border rounded-md p-8 text-center">
          <p className="text-muted-foreground">No containers found</p>
        </div>
      )}
    </div>
  );
}
